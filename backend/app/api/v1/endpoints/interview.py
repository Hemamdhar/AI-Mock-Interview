import json
import time
import logging
import urllib.request
import urllib.error
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, status
from sqlalchemy.orm import Session

from app.core.database import get_db, SessionLocal
from app.core.config import settings
from app.models.interview import InterviewSession, InterviewTranscript, InterviewReport
from app.schemas.interview import (
    InterviewCreateRequest,
    InterviewSessionResponse,
    TranscriptCreateRequest,
    TranscriptResponse,
    InterviewReportCreateRequest,
    InterviewReportResponse,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/interview", tags=["Mock Interview Coordination"])


def call_groq_llm(messages: List[Dict[str, str]], temperature: float = 0.4) -> str:
    """
    Direct ultra-low latency Groq API caller using Python standard library.
    """
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {settings.GROQ_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": messages,
        "temperature": temperature,
        "max_tokens": 800,
    }

    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers=headers,
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data["choices"][0]["message"]["content"]
    except Exception as exc:
        logger.warning(f"Groq primary model failed ({exc}), falling back to llama-3.3-70b-versatile.")
        # Fallback model
        payload["model"] = "llama-3.3-70b-versatile"
        try:
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers=headers,
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                return data["choices"][0]["message"]["content"]
        except Exception as e2:
            logger.error(f"Groq API call error: {e2}")
            return "Thank you for sharing. Could you elaborate on the key architectural trade-offs you considered?"


@router.post("/session", response_model=InterviewSessionResponse)
def create_interview_session(
    req: InterviewCreateRequest,
    db: Session = Depends(get_db),
):
    """
    Create a persistent interview session record.
    """
    session = InterviewSession(
        title=req.title,
        role=req.role,
        company=req.company,
        experience_level=req.experience_level,
        guest_id=req.guest_id or "guest_default",
        status="active",
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.get("/session/{session_id}", response_model=InterviewSessionResponse)
def get_interview_session(
    session_id: str,
    db: Session = Depends(get_db),
):
    session = db.query(InterviewSession).filter(InterviewSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Interview session not found.")
    return session


@router.get("/session/{session_id}/transcripts", response_model=List[TranscriptResponse])
def get_session_transcripts(
    session_id: str,
    db: Session = Depends(get_db),
):
    return (
        db.query(InterviewTranscript)
        .filter(InterviewTranscript.session_id == session_id)
        .order_by(InterviewTranscript.created_at.asc())
        .all()
    )


@router.post("/transcript", response_model=TranscriptResponse)
def append_transcript(
    req: TranscriptCreateRequest,
    db: Session = Depends(get_db),
):
    transcript = InterviewTranscript(
        session_id=req.session_id,
        round_number=req.round_number,
        speaker=req.speaker,
        text=req.text,
    )
    db.add(transcript)
    db.commit()
    db.refresh(transcript)
    return transcript


@router.post("/report", response_model=InterviewReportResponse)
def save_interview_report(
    req: InterviewReportCreateRequest,
    db: Session = Depends(get_db),
):
    # Upsert or save report
    existing = db.query(InterviewReport).filter(InterviewReport.session_id == req.session_id).first()
    if existing:
        existing.overall_score = req.overall_score
        existing.verdict = req.verdict
        existing.executive_summary = req.executive_summary
        existing.competencies_json = json.dumps(req.competencies)
        db.commit()
        db.refresh(existing)
        return existing

    report = InterviewReport(
        session_id=req.session_id,
        overall_score=req.overall_score,
        verdict=req.verdict,
        executive_summary=req.executive_summary,
        competencies_json=json.dumps(req.competencies),
    )
    db.add(report)

    # Mark session as completed
    session = db.query(InterviewSession).filter(InterviewSession.id == req.session_id).first()
    if session:
        session.status = "completed"

    db.commit()
    db.refresh(report)
    return report


@router.websocket("/ws/{session_id}")
async def interview_realtime_websocket(websocket: WebSocket, session_id: str):
    """
    Real-Time WebSocket coordinator connecting the 3D Three.js Avatar,
    Speech Recognition (STT), Speech Synthesis (TTS), and Groq LLM brain.
    """
    await websocket.accept()
    logger.info(f"WebSocket client connected to interview session: {session_id}")

    db = SessionLocal()
    try:
        # Acknowledge connection
        await websocket.send_json({
            "type": "connection_ack",
            "session_id": session_id,
            "status": "connected",
            "interviewer_avatar": "Alex",
        })

        while True:
            data = await websocket.receive_text()
            event = json.loads(data)
            event_type = event.get("type")

            if event_type == "ping":
                await websocket.send_json({"type": "pong"})
                continue

            elif event_type == "candidate_speech_chunk":
                # Candidate spoke a phrase or interim transcript
                text = event.get("text", "")
                round_num = event.get("round", 1)
                is_final = event.get("is_final", False)

                # If final sentence, persist to transcript
                if is_final and text.strip():
                    db_transcript = InterviewTranscript(
                        session_id=session_id,
                        round_number=round_num,
                        speaker="candidate",
                        text=text.strip(),
                    )
                    db.add(db_transcript)
                    db.commit()

                # Echo speech recognition state back to UI
                await websocket.send_json({
                    "type": "avatar_state",
                    "expression": "listening",
                    "headNod": True,
                })

            elif event_type == "candidate_barge_in":
                # Instant interruption: candidate started speaking while interviewer was speaking
                logger.info(f"Barge-in signal received for session: {session_id}")
                await websocket.send_json({
                    "type": "avatar_state",
                    "expression": "listening",
                    "interrupted": True,
                })

            elif event_type == "candidate_finished_answering":
                turn_start_time = time.perf_counter()
                # Candidate concluded their turn. Groq LLM responds.
                user_answer = event.get("answer", "")
                current_question = event.get("current_question", "")
                round_name = event.get("round_name", "Round 1")
                context = event.get("context", "")

                # Notify client that interviewer is thinking
                await websocket.send_json({
                    "type": "avatar_state",
                    "expression": "thinking",
                    "speaking": False,
                })

                # Persist answer if not already recorded
                if user_answer.strip():
                    db.add(InterviewTranscript(
                        session_id=session_id,
                        round_number=event.get("round", 1),
                        speaker="candidate",
                        text=user_answer.strip(),
                    ))
                    db.commit()

                # Ask Groq for interviewer response and evaluation
                system_prompt = (
                    "You are Alex Vance, a Staff Systems Architect conducting a live technical interview. "
                    "Speak like an authentic, highly collaborative human engineer in a real video interview. "
                    "Keep your response concise (2 to 3 spoken sentences max). "
                    "Start with a natural human acknowledgement ('Got it, that makes sense', 'Fair point', 'Interesting approach', 'I see what you mean'). "
                    "Highlight one technical detail or trade-off from their answer, and ask a sharp, organic follow-up question. "
                    "Never output robotic bullets or cold exam phrases. Speak naturally as if across a desk. "
                    "ROUND GUIDELINES: "
                    "In Round 1 (Resume Deep Dive), probe strictly and only about the candidate themselves and resume projects targeted to the role. Never ask about hobbies or culture fit. "
                    "In Round 2 (Technical Fundamentals), probe deeply into core language mechanics, runtime behavior, and architecture scenarios. "
                    "In Round 3 (Live Coding), probe algorithm complexity, data structures, and edge cases."
                )
                user_prompt = (
                    f"Interview Stage: {round_name}\n"
                    f"Target Context: {context}\n"
                    f"Question Asked: {current_question}\n"
                    f"Candidate's Spoken Answer: {user_answer}\n"
                    f"Respond as the interviewer speaking to the candidate."
                )

                interviewer_response = call_groq_llm([
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ])

                latency_ms = int((time.perf_counter() - turn_start_time) * 1000)

                # Persist interviewer response to transcripts
                db.add(InterviewTranscript(
                    session_id=session_id,
                    round_number=event.get("round", 1),
                    speaker="interviewer",
                    text=interviewer_response.strip(),
                ))
                db.commit()

                # Send back to client with animation, lip-sync trigger and latency
                await websocket.send_json({
                    "type": "interviewer_speech",
                    "text": interviewer_response,
                    "expression": "speaking",
                    "nod": True,
                    "latency_ms": latency_ms,
                })

            elif event_type == "trigger_avatar_speech":
                # Manual trigger (e.g. asking initial question out loud)
                text = event.get("text", "")
                await websocket.send_json({
                    "type": "interviewer_speech",
                    "text": text,
                    "expression": "speaking",
                })

    except WebSocketDisconnect:
        logger.info(f"WebSocket client disconnected from session: {session_id}")
    except Exception as exc:
        logger.error(f"WebSocket error in interview session {session_id}: {exc}")
    finally:
        db.close()
