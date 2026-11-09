import { NextResponse } from "next/server";
import { execFile } from "child_process";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as zlib from "zlib";

function runPythonPdfExtractor(filePath: string): Promise<string> {
  return new Promise((resolve) => {
    const script = `
import sys
try:
    import pypdf
    reader = pypdf.PdfReader(sys.argv[1])
    texts = [page.extract_text() or '' for page in reader.pages]
    print('\\n'.join(texts))
except Exception as e:
    sys.exit(1)
`;
    execFile("python3", ["-c", script, filePath], { timeout: 10000 }, (err, stdout) => {
      if (!err && stdout && stdout.trim().length > 20) {
        resolve(stdout.trim());
      } else {
        resolve("");
      }
    });
  });
}

function extractTextFallback(buffer: Buffer): string {
  // Fallback string scanner for PDF content streams
  const str = buffer.toString("binary");
  const textBlocks: string[] = [];
  
  // Match text in parentheses before Tj or TJ
  const tjRegex = /\(([^)]+)\)\s*(?:Tj|'|")/g;
  let match;
  while ((match = tjRegex.exec(str)) !== null) {
    if (match[1] && match[1].trim().length > 1) {
      textBlocks.push(match[1]);
    }
  }

  if (textBlocks.length > 5) {
    return textBlocks.join(" ");
  }

  // Raw printable ASCII string extraction
  const clean = buffer
    .toString("utf-8", 0, Math.min(buffer.length, 500000))
    .replace(/[^\x20-\x7E\n\r\t]/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();

  return clean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB maximum upload ceiling (OWASP A04)
const ALLOWED_EXTENSIONS = [".pdf", ".txt", ".md"];

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    // 1. Strict File Size Validation (Mitigate DoS / memory exhaustion)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 5MB maximum upload limit. Please upload a smaller document." },
        { status: 413 }
      );
    }

    const fileName = (file.name || "").toLowerCase().trim();

    // 2. Strict File Extension Allowlist
    const isAllowedExt = ALLOWED_EXTENSIONS.some((ext) => fileName.endsWith(ext));
    if (!isAllowedExt) {
      return NextResponse.json(
        { error: "Unsupported file format. Only PDF (.pdf), Plain Text (.txt), and Markdown (.md) documents are accepted." },
        { status: 415 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = "";

    // 1. Plain text / Markdown
    if (fileName.endsWith(".txt") || fileName.endsWith(".md")) {
      extractedText = buffer.toString("utf-8");
    }
    // 2. PDF Document
    else if (fileName.endsWith(".pdf")) {
      const tempPath = path.join(os.tmpdir(), `resume_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.pdf`);
      try {
        fs.writeFileSync(tempPath, buffer);
        extractedText = await runPythonPdfExtractor(tempPath);
      } catch (err) {
        console.warn("Python PDF extraction error:", err);
      } finally {
        try {
          if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        } catch {
          // ignore cleanup error
        }
      }

      if (!extractedText || extractedText.trim().length < 30) {
        extractedText = extractTextFallback(buffer);
      }
    }
    // 3. Fallback for other formats
    else {
      extractedText = buffer.toString("utf-8");
    }

    // Clean up extracted text and enforce upper safety bound (40,000 chars)
    const cleanText = extractedText
      .replace(/\r\n/g, "\n")
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
      .replace(/[ \t]{2,}/g, " ")
      .slice(0, 40000)
      .trim();

    if (!cleanText || cleanText.length < 20) {
      return NextResponse.json(
        { error: "Could not extract readable text from the uploaded file. Please paste your resume text directly." },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      text: cleanText,
      fileName: file.name,
      fileSize: file.size,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to parse resume document." },
      { status: 500 }
    );
  }
}

