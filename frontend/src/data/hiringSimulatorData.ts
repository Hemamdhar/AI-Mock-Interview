export interface RoleCompany {
  name: string;
  ticker?: string;
}

export interface TestSection {
  id: string;
  name: string;
  questionsCount: number;
  durationMins: number;
  questions: Array<{
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    type: "mcq" | "code";
    starterCode?: string;
    solutionCode?: string;
    testCases?: Array<{
      name?: string;
      input: string;
      expected_output: string;
      harness?: string;
    }>;
  }>;
}

export interface InterviewRound {
  id: string;
  name: string;
  durationMins: number;
  description: string;
  firstQuestion: string;
  questions: string[];
}

export interface HiringRole {
  id: string;
  title: string;
  description: string;
  category: "ai" | "mobile" | "backend" | "qa" | "cloud" | "blockchain" | "analytics" | "general";
  categoryLabel: string;
  companies: RoleCompany[];
  skills: string[];
  moreSkillsCount: number;
  attempted?: boolean;
  lastAttempted?: string;
  hiringProcessSteps: Array<{
    step: number;
    title: string;
    type: "test" | "interview";
  }>;
  technicalTest: {
    sectionsCount: number;
    totalQuestions: number;
    durationLabel: string;
    totalMinutes: number;
    totalMarks: number;
    sections: TestSection[];
  };
  interview: {
    rounds: InterviewRound[];
  };
}

export const HIRING_ROLES: HiringRole[] = [
  {
    id: "ai-engineer",
    title: "AI Engineer",
    description: "Builds and deploys machine learning models, Transformer architectures, and AI-powered systems.",
    category: "ai",
    categoryLabel: "Artificial Intelligence",
    companies: [
      { name: "Microsoft" },
      { name: "Perplexity AI" },
      { name: "Optum" },
      { name: "OpenAI" },
    ],
    skills: ["Artificial Intelligence (AI)", "Machine Learning Concepts", "PyTorch", "Transformers", "LLM Inference"],
    moreSkillsCount: 11,
    attempted: true,
    lastAttempted: "15 minutes ago",
    hiringProcessSteps: [
      { step: 1, title: "Aptitude, Reasoning & Verbal", type: "test" },
      { step: 2, title: "ML Concepts & DSA MCQ", type: "test" },
      { step: 3, title: "Coding & ML Round", type: "test" },
      { step: 4, title: "Technical Interview", type: "interview" },
      { step: 5, title: "HR Interview", type: "interview" },
    ],
    technicalTest: {
      sectionsCount: 3,
      totalQuestions: 47,
      durationLabel: "1 hr 30 mins",
      totalMinutes: 90,
      totalMarks: 2665,
      sections: [
        {
          id: "sec-1",
          name: "Aptitude, Reasoning & Verbal",
          questionsCount: 15,
          durationMins: 15,
          questions: [
            {
              id: "q-1-1",
              question: "If a GPU cluster processes 120 matrix multiplications in 15 milliseconds, how many multiplications will 3 identical clusters process in 45 milliseconds?",
              options: [
                "360 multiplications",
                "1080 multiplications",
                "720 multiplications",
                "540 multiplications"
              ],
              correctIndex: 1,
              explanation: "1 cluster = 120 per 15 ms = 8 per ms. 3 clusters = 24 per ms. In 45 ms: 24 * 45 = 1080 multiplications.",
              type: "mcq",
            },
            {
              id: "q-1-2",
              question: "Select the word that best completes the analogy: Gradient is to Optimization as Loss is to ______",
              options: [
                "Accuracy",
                "Objective Function",
                "Regularization",
                "Backpropagation"
              ],
              correctIndex: 1,
              explanation: "A gradient guides the optimization process, while loss quantifies the objective function to be minimized.",
              type: "mcq",
            },
            {
              id: "q-1-3",
              question: "An anomaly detector identifies adversarial attacks with 99% sensitivity and a 5% false positive rate. If 1% of incoming production traffic is genuinely adversarial, what is the approximate probability that a flagged request is truly adversarial?",
              options: [
                "16.7%",
                "50.0%",
                "95.0%",
                "99.0%"
              ],
              correctIndex: 0,
              explanation: "By Bayes theorem: P(A|Pos) = (0.99 * 0.01) / [(0.99 * 0.01) + (0.05 * 0.99)] = 0.0099 / (0.0099 + 0.0495) = 0.0099 / 0.0594 \u2248 16.67%.",
              type: "mcq",
            },
            {
              id: "q-1-4",
              question: "What is the next number in this tensor memory bandwidth progression: 320 GB/s, 640 GB/s, 1280 GB/s, 2560 GB/s, ______?",
              options: [
                "3840 GB/s",
                "4800 GB/s",
                "5120 GB/s",
                "6400 GB/s"
              ],
              correctIndex: 2,
              explanation: "Each term in the sequence doubles the previous term (geometric sequence with common ratio r = 2). 2560 * 2 = 5120 GB/s.",
              type: "mcq",
            },
            {
              id: "q-1-5",
              question: "Premise 1: All continuous differentiable functions possess gradients. Premise 2: Some optimization surfaces in deep learning are non-convex. Which conclusion follows logically?",
              options: [
                "All non-convex surfaces are continuous differentiable functions",
                "Some non-convex optimization surfaces possess gradients if they are continuous differentiable",
                "No non-convex surface can be optimized with gradient descent",
                "Continuous functions are always strictly convex"
              ],
              correctIndex: 1,
              explanation: "Differentiability guarantees gradient existence, which holds for the subset of continuous differentiable non-convex surfaces.",
              type: "mcq",
            },
            {
              id: "q-1-6",
              question: "Pipeline Alpha ingests 600,000 embedding vectors per second. Pipeline Beta ingests 900,000 vectors per second. Running concurrently, how many seconds will both pipelines take to ingest 90,000,000 vectors?",
              options: [
                "45 seconds",
                "60 seconds",
                "75 seconds",
                "90 seconds"
              ],
              correctIndex: 1,
              explanation: "Combined ingestion throughput = 600,000 + 900,000 = 1,500,000 vectors/sec. Time = 90,000,000 / 1,500,000 = 60 seconds.",
              type: "mcq",
            },
            {
              id: "q-1-7",
              question: "Choose the term that best fills the blank: When an artificial neural network fits training noise rather than true structural signal, its out-of-sample error increases primarily due to high ______.",
              options: [
                "bias",
                "variance",
                "entropy",
                "sparsity"
              ],
              correctIndex: 1,
              explanation: "Overfitting corresponds to high variance in the bias-variance decomposition, where the model overreacts to fluctuations in the training partition.",
              type: "mcq",
            },
            {
              id: "q-1-8",
              question: "A dataset of 2,400,000 records is partitioned into training, validation, and testing sets in the ratio 8:1:1. How many records are allocated to the test set?",
              options: [
                "120,000",
                "240,000",
                "300,000",
                "480,000"
              ],
              correctIndex: 1,
              explanation: "Total ratio units = 8 + 1 + 1 = 10 units. Test set share = 1 / 10 of 2,400,000 = 240,000 records.",
              type: "mcq",
            },
            {
              id: "q-1-9",
              question: "An autonomous agent initialized at coordinate (0, 0) travels 12 km North, turns East for 9 km, then turns South for 4 km. What is the straight-line displacement from origin?",
              options: [
                "12.04 km",
                "15.00 km",
                "17.25 km",
                "25.00 km"
              ],
              correctIndex: 0,
              explanation: "Net vertical displacement = 12 - 4 = 8 km North. Net horizontal displacement = 9 km East. Euclidean distance = sqrt(8^2 + 9^2) = sqrt(64 + 81) = sqrt(145) \u2248 12.04 km.",
              type: "mcq",
            },
            {
              id: "q-1-10",
              question: "A 70-Billion parameter LLM undergoes 30% structured pruning. The remaining weights are quantized to INT4 (0.5 bytes per parameter). What is the resulting model weight size in Gigabytes?",
              options: [
                "17.5 GB",
                "24.5 GB",
                "35.0 GB",
                "49.0 GB"
              ],
              correctIndex: 1,
              explanation: "Remaining parameters = 70B * (1 - 0.30) = 49 Billion parameters. At 4 bits (0.5 bytes) per parameter: 49B * 0.5 bytes = 24.5 GB.",
              type: "mcq",
            },
            {
              id: "q-1-11",
              question: "Which of the following statements represents an unstated underlying assumption of Retrieval-Augmented Generation (RAG)?",
              options: [
                "Dense vector embeddings always achieve 100% cosine similarity on all documents",
                "External retrieved context contains verified factual ground truth that mitigates parametric hallucinations",
                "Token generation speed is unconstrained by context window lengths",
                "Transformer attention heads ignore retrieved prompt context"
              ],
              correctIndex: 1,
              explanation: "RAG operates on the foundational assumption that grounding generation in relevant, retrieved external passages prevents factual hallucinations in the parametric memory.",
              type: "mcq",
            },
            {
              id: "q-1-12",
              question: "A hyperparameter grid search tests 4 learning rates, 3 weight decay coefficients, and 3 batch sizes. If 2 specific configurations crash due to VRAM OOM, how many successful runs complete?",
              options: [
                "32",
                "34",
                "36",
                "38"
              ],
              correctIndex: 1,
              explanation: "Total combinatorial grid points = 4 * 3 * 3 = 36 configurations. Completed runs = 36 - 2 = 34 configurations.",
              type: "mcq",
            },
            {
              id: "q-1-13",
              question: "A 4-stage neural pipeline has stage latencies of 15ms, 25ms, 20ms, and 10ms. In steady-state streaming execution, what is the maximum request throughput per second?",
              options: [
                "14.2 req/sec",
                "25.0 req/sec",
                "40.0 req/sec",
                "70.0 req/sec"
              ],
              correctIndex: 2,
              explanation: "In a pipelined architecture, steady-state throughput is governed by the bottleneck stage. Bottleneck = 25ms. Throughput = 1000ms / 25ms = 40 requests/sec.",
              type: "mcq",
            },
            {
              id: "q-1-14",
              question: "What is the most accurate antonym for the term 'Stochastic' in computational modeling?",
              options: [
                "Probabilistic",
                "Heuristic",
                "Deterministic",
                "Empirical"
              ],
              correctIndex: 2,
              explanation: "Stochastic systems involve randomness and probabilistic uncertainty. Its direct antonym is Deterministic, where outputs are uniquely determined by inputs.",
              type: "mcq",
            },
            {
              id: "q-1-15",
              question: "To determine whether Ordinary Least Squares (OLS) closed-form solution (X^T X)^(-1) X^T y exists uniquely, which statement is sufficient?\nStatement 1: The design matrix X has full column rank.\nStatement 2: The sample size N exceeds feature dimension D.",
              options: [
                "Statement 1 alone is sufficient, but Statement 2 alone is not",
                "Statement 2 alone is sufficient, but Statement 1 alone is not",
                "Both statements together are needed",
                "Neither statement is sufficient"
              ],
              correctIndex: 0,
              explanation: "If matrix X has full column rank, the Gram matrix X^T X is strictly positive definite and invertible, making Statement 1 alone sufficient.",
              type: "mcq",
            },
            {
              id: "q-1-16",
              question: "In language modeling, if a model achieves a test set Cross-Entropy loss of 2.3026 nats per token, what is its corresponding perplexity?",
              options: ["10.0", "5.0", "2.3", "100.0"],
              correctIndex: 0,
              explanation: "Perplexity is defined as exp(Cross-Entropy Loss in nats). Since exp(2.3026) = 10.0, the perplexity equals 10.",
              type: "mcq",
            },
            {
              id: "q-1-17",
              question: "An NVIDIA H100 GPU features 3.35 TB/s of High Bandwidth Memory (HBM3) and communicates with the host over PCIe Gen5 x16 (64 GB/s full duplex). What is the ratio of internal GPU memory bandwidth to external host bus transfer bandwidth?",
              options: ["Approximately 52:1", "Approximately 10:1", "Approximately 128:1", "Approximately 4:1"],
              correctIndex: 0,
              explanation: "3350 GB/s / 64 GB/s = 52.34, showing the GPU internal memory bus is over 52 times faster than host-to-device PCIe transfer.",
              type: "mcq",
            },
            {
              id: "q-1-18",
              question: "When quantizing model weights from FP16 (16-bit) to INT4 (4-bit), by what theoretical factor is the parameter storage footprint and memory transfer reduced?",
              options: ["4x reduction (75% savings)", "2x reduction (50% savings)", "8x reduction (87.5% savings)", "16x reduction (93.75% savings)"],
              correctIndex: 0,
              explanation: "Reducing precision from 16 bits per weight to 4 bits per weight represents a 16 / 4 = 4x reduction in memory capacity and bandwidth transfer.",
              type: "mcq",
            },
            {
              id: "q-1-19",
              question: "In Speculative Decoding, a small draft model generates gamma = 4 tokens per step. If the target model accepts each draft token with an independent acceptance rate alpha = 0.8, what is the expected number of tokens accepted per speculative step?",
              options: ["3.36 tokens", "1.0 token", "2.0 tokens", "4.0 tokens"],
              correctIndex: 0,
              explanation: "In speculative decoding, the expected accepted tokens is sum_{i=1}^gamma alpha^i + 1 (the final verification token) = (0.8 + 0.64 + 0.512 + 0.4096) + 1 = 3.36 tokens.",
              type: "mcq",
            },
            {
              id: "q-1-20",
              question: "Premise 1: All hallucination-free generation requires verifiable ground truth in the retrieval context.\nPremise 2: Some enterprise search outputs lack verifiable ground truth.\nConclusion: Which deduction must be valid?",
              options: [
                "Some enterprise search outputs cannot guarantee hallucination-free generation",
                "All enterprise search outputs produce hallucinations",
                "Hallucination-free generation is impossible in production",
                "Verifiable ground truth always prevents all hallucinations"
              ],
              correctIndex: 0,
              explanation: "Since hallucination-free generation strictly requires verifiable ground truth, outputs lacking this ground truth cannot guarantee hallucination-free generation.",
              type: "mcq",
            },
            {
              id: "q-1-21",
              question: "During hyperparameter tuning, if each trial has a 10% probability of finding an optimal learning rate, how many independent trials must be run to have at least 95% probability of finding at least one optimal configuration?",
              options: ["At least 29 trials", "At least 10 trials", "At least 15 trials", "At least 50 trials"],
              correctIndex: 0,
              explanation: "P(at least one success) = 1 - (1 - 0.10)^N >= 0.95 => 0.90^N <= 0.05 => N >= ln(0.05) / ln(0.90) = -2.9957 / -0.10536 = 28.43, so at least 29 trials are required.",
              type: "mcq",
            },
            {
              id: "q-1-22",
              question: "If a standard Transformer doubles its input sequence length from 4,096 tokens to 8,192 tokens without sparse attention, by what factor does the self-attention score matrix (Q @ K^T) memory footprint grow?",
              options: ["4x (Quadratically)", "2x (Linearly)", "8x (Cubically)", "1.414x (Square root)"],
              correctIndex: 0,
              explanation: "Self-attention scales as O(N^2). Doubling sequence length N from 4k to 8k increases the attention matrix elements from N^2 to (2N)^2 = 4 N^2, representing a 4x increase.",
              type: "mcq",
            },
            {
              id: "q-1-23",
              question: "In Distributed Data Parallel (DDP) training with Ring All-Reduce across P workers and model size M bytes, what is the total volume of data transmitted by each worker in the All-Reduce phase?",
              options: ["2 * ((P - 1) / P) * M", "P * M", "M / P", "2 * P * M"],
              correctIndex: 0,
              explanation: "Ring All-Reduce performs a reduce-scatter step transmitting ((P-1)/P)*M bytes followed by an all-gather step transmitting ((P-1)/P)*M bytes, yielding exactly 2 * ((P-1)/P) * M bytes per worker.",
              type: "mcq",
            },
            {
              id: "q-1-24",
              question: "Consider the semantic analogy: DETERMINISTIC : STOCHASTIC :: MONOLITHIC : ?",
              options: ["Distributed", "Sequential", "Homogeneous", "Static"],
              correctIndex: 0,
              explanation: "Deterministic and Stochastic are technical antonyms representing predictable vs probabilistic architectures. The antonym of Monolithic in systems engineering is Distributed.",
              type: "mcq",
            },
            {
              id: "q-1-25",
              question: "A transformer hidden dimension is d_model = 4096. If Multi-Head Attention employs h = 32 attention heads, what is the dimension d_k of each individual head?",
              options: ["128", "256", "64", "512"],
              correctIndex: 0,
              explanation: "In standard Multi-Head Attention, head dimension d_k = d_model / h = 4096 / 32 = 128.",
              type: "mcq",
            },
            {
              id: "q-1-26",
              question: "A classification model has a decision threshold of 0.5. If the engineering team increases the threshold to 0.85, what is the expected effect on Precision and Recall?",
              options: [
                "Precision generally increases, while Recall decreases",
                "Precision decreases, while Recall increases",
                "Both Precision and Recall increase",
                "Both Precision and Recall decrease"
              ],
              correctIndex: 0,
              explanation: "Raising the decision threshold makes the model more conservative: fewer instances are predicted positive (lowering false positives, which raises Precision), but more actual positives are missed (lowering Recall).",
              type: "mcq",
            },
            {
              id: "q-1-27",
              question: "A streaming audio pipeline ingests PCM samples at 48 kHz with 16-bit depth (mono). What is the uncompressed bit rate generated by the stream?",
              options: ["768 kbps", "96 kbps", "1536 kbps", "384 kbps"],
              correctIndex: 0,
              explanation: "Bit rate = Sample Rate * Bit Depth = 48,000 samples/sec * 16 bits = 768,000 bits/sec = 768 kbps.",
              type: "mcq",
            },
            {
              id: "q-1-28",
              question: "Which of the following conditions is necessary and sufficient for an embedding space distance metric d(x, y) to satisfy the Triangle Inequality?",
              options: [
                "d(x, z) <= d(x, y) + d(y, z) for all vectors x, y, z",
                "d(x, y) = d(y, x) for all x, y",
                "d(x, x) = 0 for all x",
                "d(x, y) >= 0 for all x, y"
              ],
              correctIndex: 0,
              explanation: "The Triangle Inequality strictly dictates that the direct distance between any two elements x and z cannot exceed the indirect route passing through intermediate element y: d(x, z) <= d(x, y) + d(y, z).",
              type: "mcq",
            },
            {
              id: "q-1-29",
              question: "In a pipeline of 4 sequential microservices, individual service success rates are 99%, 98%, 97%, and 99%. Assuming independence, what is the overall end-to-end transaction success rate?",
              options: ["Approximately 93.2%", "Approximately 98.2%", "Approximately 97.0%", "Approximately 89.5%"],
              correctIndex: 0,
              explanation: "Total reliability = 0.99 * 0.98 * 0.97 * 0.99 = 0.9317, or approximately 93.2%.",
              type: "mcq",
            },
            {
              id: "q-1-30",
              question: "Statement 1: Model A has lower training loss than Model B.\nStatement 2: Model A has higher test loss than Model B.\nWhat can be deduced regarding the generalization performance of Model A?",
              options: [
                "Model A is suffering from overfitting relative to Model B",
                "Model A is suffering from underfitting relative to Model B",
                "Model A strictly generalizes better than Model B",
                "Model B has higher model capacity than Model A"
              ],
              correctIndex: 0,
              explanation: "Lower training error coupled with higher test error is the hallmark signature of high variance (overfitting).",
              type: "mcq",
            }
          ],
        },
        {
          id: "sec-2",
          name: "ML Concepts & DSA MCQ",
          questionsCount: 30,
          durationMins: 30,
          questions: [
            {
              id: "q-2-1",
              question: "In standard Transformer Multi-Head Self-Attention, what is the computational and memory complexity with respect to input sequence length N?",
              options: [
                "O(N log N)",
                "O(N^2)",
                "O(N * d_model)",
                "O(N^3)"
              ],
              correctIndex: 1,
              explanation: "Computing the pairwise dot-product attention score matrix (Q * K^T) requires an N x N matrix, producing quadratic O(N^2) time and memory complexity.",
              type: "mcq",
            },
            {
              id: "q-2-2",
              question: "Which structural architectural technique in Deep Residual Networks (ResNets) mitigates the vanishing gradient problem in backpropagation?",
              options: [
                "Skip / Identity connections",
                "L1 Weight Regularization",
                "Softmax normalizers",
                "High dropout probabilities"
              ],
              correctIndex: 0,
              explanation: "Skip / Identity shortcuts allow gradient signals to backpropagate directly across layers without exponential decay via the additive formulation H(x) = F(x) + x.",
              type: "mcq",
            },
            {
              id: "q-2-3",
              question: "Why are SwiGLU or GELU activation functions preferred over standard ReLU in state-of-the-art Large Language Models?",
              options: [
                "They strictly guarantee zero gradients for negative inputs",
                "They provide a smooth, continuous non-monotonic non-zero gradient for small negative inputs",
                "They eliminate the need for matrix multiplications",
                "They reduce parameter count by 50%"
              ],
              correctIndex: 1,
              explanation: "GELU and SwiGLU provide curvature with non-zero gradients for slight negative inputs, avoiding dead neuron saturation that affects standard thresholded ReLU.",
              type: "mcq",
            },
            {
              id: "q-2-4",
              question: "For a multi-class classification problem where ground truth targets are one-hot encoded, minimizing Cross-Entropy Loss is mathematically equivalent to minimizing:",
              options: [
                "Mean Absolute Percentage Error",
                "Kullback-Leibler (KL) Divergence from true distribution to predicted distribution",
                "Wasserstein Earth Mover Distance",
                "Cosine dissimilarity of weights"
              ],
              correctIndex: 1,
              explanation: "Cross-entropy H(p, q) = H(p) + D_KL(p || q). Since true label distribution p has constant zero entropy H(p), minimizing cross-entropy directly minimizes KL divergence.",
              type: "mcq",
            },
            {
              id: "q-2-5",
              question: "What is the primary architectural difference between Adam with L2 regularization and AdamW (Decoupled Weight Decay)?",
              options: [
                "AdamW applies weight decay directly to weights rather than adding it to the gradient prior to computing adaptive momentum moments",
                "AdamW removes the second moment moving average completely",
                "AdamW replaces moving averages with stochastic gradient descent",
                "AdamW only updates biases while freezing weights"
              ],
              correctIndex: 0,
              explanation: "In standard Adam, L2 regularization is added to the gradient, causing weights with large historical gradients to be decayed less. AdamW decouples weight decay directly from gradient moments.",
              type: "mcq",
            },
            {
              id: "q-2-6",
              question: "Why is Layer Normalization (LayerNorm) predominantly used over Batch Normalization (BatchNorm) in Transformer language models?",
              options: [
                "LayerNorm computes statistics across features independently for each sequence token, without dependence on batch size or variable sequence padding",
                "LayerNorm requires calculating running means across global distributed clusters",
                "LayerNorm is only compatible with convolutional layers",
                "LayerNorm eliminates all trainable gamma and beta parameters"
              ],
              correctIndex: 0,
              explanation: "LayerNorm normalizes across the hidden dimension of each token independently, making it invariant to batch size variations and variable sequence lengths.",
              type: "mcq",
            },
            {
              id: "q-2-7",
              question: "What does Key-Value (KV) Caching optimize during autoregressive LLM decoding?",
              options: [
                "It eliminates the need to load model weights into GPU memory",
                "It stores previously computed Key and Value projection vectors in GPU VRAM to avoid recomputing past tokens at each new step",
                "It trains the model on new data during inference",
                "It replaces matrix multiplication with lookup tables"
              ],
              correctIndex: 1,
              explanation: "In autoregressive token generation, past tokens are unchanging. KV caching caches their key and value activations, reducing per-token computation from O(N^2) to O(N).",
              type: "mcq",
            },
            {
              id: "q-2-8",
              question: "In LLM quantization, what distinguishes Post-Training Quantization (PTQ) from Quantization-Aware Training (QAT)?",
              options: [
                "PTQ quantizes an already-trained model using calibration data without retraining, while QAT simulates quantization errors during fine-tuning with fake-quantization nodes",
                "PTQ only works on FP32, while QAT only works on FP64",
                "PTQ requires full backpropagation for 10 epochs",
                "QAT cannot produce INT8 models"
              ],
              correctIndex: 0,
              explanation: "PTQ converts weights and activations using a calibration dataset post hoc. QAT models quantization noise in the forward pass during training to recover lost accuracy.",
              type: "mcq",
            },
            {
              id: "q-2-9",
              question: "What algorithmic breakthrough enables FlashAttention to achieve 2x-4x speedups and linear memory scaling in Transformer attention?",
              options: [
                "Replacing softmax with sigmoid",
                "Tiling input blocks to fit in GPU high-speed on-chip SRAM and computing softmax incrementally without materializing the N x N attention matrix in HBM",
                "Pruning 90% of the attention heads permanently",
                "Computing attention entirely on the CPU host"
              ],
              correctIndex: 1,
              explanation: "FlashAttention uses tiling and online softmax rescaling to compute attention in fast GPU SRAM, avoiding slow High Bandwidth Memory (HBM) read/writes for the intermediate N x N matrix.",
              type: "mcq",
            },
            {
              id: "q-2-10",
              question: "How does Rotary Position Embedding (RoPE) inject positional information into query and key representations?",
              options: [
                "By adding absolute learned embedding vectors to input embeddings",
                "By rotating 2D coordinate pairs of query and key vectors by an angle proportional to their sequence position",
                "By masking future attention tokens with negative infinity",
                "By hashing token strings into integer IDs"
              ],
              correctIndex: 1,
              explanation: "RoPE partitions representations into 2D orthogonal subspaces and rotates vector pairs using complex rotation matrices, naturally encoding relative distance into inner products.",
              type: "mcq",
            },
            {
              id: "q-2-11",
              question: "In Low-Rank Adaptation (LoRA), if a dense weight matrix has dimension d x k, what is the dimension of the low-rank decomposition matrices B and A with rank r?",
              options: [
                "B is (d x r) and A is (r x k) where r << min(d, k)",
                "B is (d x d) and A is (k x k)",
                "B is (r x r) and A is (d x k)",
                "B is (d/2 x k/2) and A is (d/2 x k/2)"
              ],
              correctIndex: 0,
              explanation: "LoRA parameterizes the weight delta as Delta W = B * A, where B is (d x r) initialized to zero and A is (r x k) initialized with Gaussian noise, dramatically cutting trainable parameters.",
              type: "mcq",
            },
            {
              id: "q-2-12",
              question: "How does Gradient Norm Clipping prevent exploding gradients during deep network training?",
              options: [
                "By setting any negative gradient value to zero",
                "By scaling down the entire gradient vector proportionally whenever its L2 norm exceeds a predefined threshold c",
                "By skipping updates for layers with high learning rates",
                "By resetting model weights to their initial checkpoint"
              ],
              correctIndex: 1,
              explanation: "If ||g||_2 > c, the gradient vector is scaled to g * (c / ||g||_2), preserving the gradient direction while bounding its update magnitude.",
              type: "mcq",
            },
            {
              id: "q-2-13",
              question: "When evaluating an imbalanced multi-class dataset, why is Macro-F1 score often preferred over Micro-F1 score?",
              options: [
                "Macro-F1 computes metrics per class and averages them equally, preventing majority classes from dominating the evaluation",
                "Macro-F1 aggregates all true positives globally across classes",
                "Macro-F1 always yields higher numeric scores than Micro-F1",
                "Macro-F1 does not require ground truth labels"
              ],
              correctIndex: 0,
              explanation: "Macro-F1 computes the unweighted arithmetic mean of F1 scores across all classes, treating rare minority classes with equal weight to majority classes.",
              type: "mcq",
            },
            {
              id: "q-2-14",
              question: "In binary classification problems with extreme class imbalance (e.g. 0.05% positive fraud cases), which metric provides the most reliable evaluation of classifier discriminative power?",
              options: [
                "Raw Classification Accuracy",
                "Precision-Recall AUC (PR-AUC)",
                "Mean Squared Error",
                "Silhouette Score"
              ],
              correctIndex: 1,
              explanation: "In severe class imbalance, ROC-AUC can be deceptively optimistic due to the high volume of True Negatives. PR-AUC focuses strictly on positive class precision and recall without being diluted.",
              type: "mcq",
            },
            {
              id: "q-2-15",
              question: "During LLM sampling, what is the effect of setting the temperature parameter T to a low value (e.g., T = 0.1)?",
              options: [
                "It flattens the probability distribution toward uniform randomness",
                "It sharply peaks the probability distribution around the highest-logit token, yielding near-greedy, deterministic output",
                "It increases the context window size",
                "It increases inference latency by 10x"
              ],
              correctIndex: 1,
              explanation: "Dividing logits by a low temperature T < 1 exaggerates differences between logits, causing softmax probabilities to concentrate heavily on the argmax token.",
              type: "mcq",
            },
            {
              id: "q-2-16",
              question: "In DeepSpeed / FSDP ZeRO Stage 3 distributed training, which components are partitioned across all parallel GPU nodes?",
              options: [
                "Only optimizer states",
                "Optimizer states and gradients only",
                "Optimizer states, gradients, and model parameters (full sharding)",
                "Only dataset input batches"
              ],
              correctIndex: 2,
              explanation: "ZeRO-1 shards optimizer states, ZeRO-2 shards optimizer states and gradients, and ZeRO-3 (FSDP) shards all three: optimizer states, gradients, and model weights.",
              type: "mcq",
            },
            {
              id: "q-2-17",
              question: "In Megatron-LM Tensor Parallelism, how does ColumnParallelLinear divide a linear projection weight matrix W?",
              options: [
                "It splits W along its columns across GPUs, allowing inputs X to be broadcast to all GPUs and intermediate activations to proceed without communication until row parallel layers",
                "It sends different sequence tokens to different GPUs",
                "It splits the network layer by layer across machines",
                "It converts floating point weights to integers"
              ],
              correctIndex: 0,
              explanation: "ColumnParallelLinear splits W = [W1, W2]. Each GPU computes Y_i = X * W_i. In the subsequent RowParallelLinear layer, partial products are summed via an All-Reduce operation.",
              type: "mcq",
            },
            {
              id: "q-2-18",
              question: "What is the primary mechanism of Speculative Decoding in large language model inference?",
              options: [
                "A small, fast draft model generates candidate tokens, which are verified in parallel in a single forward pass by the large target model",
                "The model guesses future prompts before the user types them",
                "Tokens are sampled strictly uniformly from vocabulary",
                "Attention weights are replaced with random projections"
              ],
              correctIndex: 0,
              explanation: "Speculative decoding uses a lightweight draft model to generate K tokens, then runs the target model once on all K tokens in parallel to verify their acceptance according to target distribution.",
              type: "mcq",
            },
            {
              id: "q-2-19",
              question: "What is the defining advantage of Direct Preference Optimization (DPO) over classic PPO-based Reinforcement Learning from Human Feedback (RLHF)?",
              options: [
                "DPO trains 4 reward models concurrently",
                "DPO derives a closed-form substitution that optimizes the policy directly on preference pairs without needing an explicit reward model or actor-critic RL loop",
                "DPO requires no labeled preference datasets",
                "DPO only functions on vision models"
              ],
              correctIndex: 1,
              explanation: "DPO proves that the optimal policy under the Bradley-Terry reward model can be parameterized directly via binary cross-entropy on prompt-chosen-rejected tuples, bypassing RL instability.",
              type: "mcq",
            },
            {
              id: "q-2-20",
              question: "In a Sparse Mixture-of-Experts (MoE) architecture with 8 total expert networks and Top-2 routing, how many experts are activated per token?",
              options: [
                "1 expert",
                "2 experts",
                "4 experts",
                "8 experts"
              ],
              correctIndex: 1,
              explanation: "In a Top-2 MoE layer, the learned gating network routes each token representation to exactly the top 2 experts with highest router scores, computing only 2 expert forward passes per token.",
              type: "mcq",
            },
            {
              id: "q-2-21",
              question: "The Boyer-Moore Voting Algorithm identifies the majority element (appearing more than N/2 times) in an array with what time and space complexity?",
              options: [
                "O(N log N) time, O(N) space",
                "O(N) time, O(1) space",
                "O(N^2) time, O(1) space",
                "O(1) time, O(N) space"
              ],
              correctIndex: 1,
              explanation: "Boyer-Moore uses a single pass with a candidate and a counter, achieving optimal O(N) time complexity and strictly O(1) auxiliary space.",
              type: "mcq",
            },
            {
              id: "q-2-22",
              question: "What is the worst-case time complexity of Dijkstra's Single-Source Shortest Path algorithm on a graph with V vertices and E edges when implemented using a Min-Heap priority queue?",
              options: [
                "O(V^2)",
                "O((V + E) log V)",
                "O(V * E)",
                "O(V log E)"
              ],
              correctIndex: 1,
              explanation: "Each vertex extraction takes O(log V) across V vertices, and each edge relaxation takes O(log V) across E edges, totaling O((V + E) log V).",
              type: "mcq",
            },
            {
              id: "q-2-23",
              question: "Floyd's Cycle-Finding Algorithm (Tortoise and Hare) detects a cycle in a singly linked list using:",
              options: [
                "Two pointers where slow moves 1 step and fast moves 2 steps; they meet if and only if a cycle exists",
                "A hash set storing all visited node addresses in O(N) space",
                "Modifying node values to negative integers",
                "Recursion depth tracking"
              ],
              correctIndex: 0,
              explanation: "If a cycle exists, the fast pointer enters the cycle first and reduces the distance to the slow pointer by 1 in each iteration, meeting in O(N) time and O(1) space.",
              type: "mcq",
            },
            {
              id: "q-2-24",
              question: "What is the worst-case search, insertion, and deletion time complexity in a self-balancing binary search tree (such as an AVL or Red-Black Tree)?",
              options: [
                "O(1)",
                "O(log N)",
                "O(N)",
                "O(N log N)"
              ],
              correctIndex: 1,
              explanation: "Self-balancing binary search trees enforce height balancing invariant h <= c * log2(N), guaranteeing all search, insert, and delete operations execute in O(log N) worst-case time.",
              type: "mcq",
            },
            {
              id: "q-2-25",
              question: "To achieve both O(1) time get(key) and O(1) time put(key, value) in a Least Recently Used (LRU) Cache, which combination of data structures is required?",
              options: [
                "Hash Map + Doubly Linked List",
                "Array + Binary Search Tree",
                "Min-Heap + Stack",
                "Singly Linked List + Queue"
              ],
              correctIndex: 0,
              explanation: "A Hash Map provides O(1) key-to-node lookups, while a Doubly Linked List allows O(1) node deletion and relocation to the head/tail to track access recency.",
              type: "mcq",
            },
            {
              id: "q-2-26",
              question: "What is the fundamental condition required for a directed graph to admit a valid Topological Sort?",
              options: [
                "The graph must be a Directed Acyclic Graph (DAG) with zero cycles",
                "The graph must be strongly connected",
                "The graph must have an equal number of vertices and edges",
                "All edge weights must be strictly non-negative"
              ],
              correctIndex: 0,
              explanation: "Topological ordering requires that for every directed edge u -> v, u appears before v. If a cycle exists, no linear ordering can satisfy this condition.",
              type: "mcq",
            },
            {
              id: "q-2-27",
              question: "In the standard 0/1 Knapsack Dynamic Programming formulation, how can the 2D DP table dp[i][w] be optimized to 1D space dp[w]?",
              options: [
                "By iterating through the capacity w backwards from max capacity W down to weight[i]",
                "By sorting weights in descending order only",
                "By skipping item weights less than average",
                "By using bitwise XOR operations"
              ],
              correctIndex: 0,
              explanation: "Iterating backwards prevents using the same item multiple times in the current step, as dp[w - weight[i]] retains the value from the previous item iteration.",
              type: "mcq",
            },
            {
              id: "q-2-28",
              question: "What is the time complexity to search for a word of length L in a Trie (Prefix Tree) containing N total stored words?",
              options: [
                "O(L)",
                "O(N * L)",
                "O(log N)",
                "O(N)"
              ],
              correctIndex: 0,
              explanation: "Trie lookups traverse one character node per step for L steps, executing in O(L) time completely independent of the total number of words N stored in the Trie.",
              type: "mcq",
            },
            {
              id: "q-2-29",
              question: "Which data structure pattern allows computing the Next Greater Element for all elements in an array in overall O(N) linear time?",
              options: [
                "Monotonic Decreasing Stack",
                "Max-Heap Priority Queue",
                "Circular FIFO Queue",
                "Binary Indexed Tree"
              ],
              correctIndex: 0,
              explanation: "A monotonic decreasing stack processes each array index at most twice (one push, one pop), solving the next greater element problem in optimal O(N) time.",
              type: "mcq",
            },
            {
              id: "q-2-30",
              question: "What algorithmic pattern is optimal to find the maximum sum of any contiguous subarray of fixed size K in an array of size N in O(N) time?",
              options: [
                "Fixed-Size Sliding Window",
                "Depth-First Search",
                "Divide and Conquer with merge",
                "Binary Search on array values"
              ],
              correctIndex: 0,
              explanation: "A fixed-size sliding window updates the window sum in O(1) time per element by adding the incoming element and subtracting the outgoing element, completing in O(N) time.",
              type: "mcq",
            },
            {
              id: "q-2-31",
              question: "How does Root Mean Square Normalization (RMSNorm) differ computationally from Layer Normalization (LayerNorm)?",
              options: [
                "RMSNorm does not calculate or subtract the mean, scaling only by root-mean-square",
                "RMSNorm computes statistics across the batch dimension instead of feature dimension",
                "RMSNorm replaces learned affine parameters gamma and beta with static weights",
                "RMSNorm uses exponential moving average similar to BatchNorm"
              ],
              correctIndex: 0,
              explanation: "RMSNorm assumes the mean shift is negligible in deep transformers and scales inputs strictly by 1 / sqrt(mean(x^2) + eps), saving 7-15% compute per layer.",
              type: "mcq",
            },
            {
              id: "q-2-32",
              question: "In Grouped-Query Attention (GQA) with 32 query heads and 8 key-value heads, by what factor is the inference KV-cache reduced compared to Multi-Head Attention (MHA)?",
              options: ["4x reduction (75% savings)", "2x reduction (50% savings)", "8x reduction (87.5% savings)", "32x reduction"],
              correctIndex: 0,
              explanation: "In MHA, there are 32 K and 32 V heads. In GQA with 8 KV heads, KV cache stores 8 / 32 = 1/4 the tensors, achieving a 4x reduction.",
              type: "mcq",
            },
            {
              id: "q-2-33",
              question: "In QLoRA, what is the primary function of Double Quantization (DQ)?",
              options: [
                "Quantizing the quantization constants themselves, saving ~0.37 bits per parameter",
                "Applying INT4 quantization to both forward and backward activations",
                "Quantizing model weights into two separate 2-bit codebooks",
                "Running 8-bit optimizer states alongside 4-bit weights"
              ],
              correctIndex: 0,
              explanation: "Double Quantization quantizes the first-stage quantization constants (scaling factors) from FP32 to 8-bit FP, saving roughly 0.37 bits per parameter without accuracy degradation.",
              type: "mcq",
            },
            {
              id: "q-2-34",
              question: "What does the InfoNCE loss function optimize in self-supervised contrastive learning (e.g. CLIP)?",
              options: [
                "A lower bound on the mutual information between positive representation pairs",
                "The mean squared error between latent vector coordinates",
                "The adversarial Wasserstein distance between generators and discriminators",
                "The parameter sparsity of the vision encoder backbone"
              ],
              correctIndex: 0,
              explanation: "InfoNCE maximizes a lower bound on the mutual information I(X; Y) by pushing representations of positive pairs together while pulling negative pairs apart.",
              type: "mcq",
            },
            {
              id: "q-2-35",
              question: "In Direct Preference Optimization (DPO), how is the implicit reward function modeled relative to the reference policy pi_ref?",
              options: [
                "r(x, y) = beta * log(pi_theta(y|x) / pi_ref(y|x))",
                "r(x, y) = sigmoid(pi_theta(y|x) - pi_ref(y|x))",
                "r(x, y) = cross_entropy(pi_theta(y|x), pi_ref(y|x))",
                "r(x, y) = beta * (pi_theta(y|x) - pi_ref(y|x))^2"
              ],
              correctIndex: 0,
              explanation: "DPO proves that the optimal reward in RLHF can be parameterized directly via the log ratio of the trained policy to the reference policy scaled by temperature parameter beta.",
              type: "mcq",
            },
            {
              id: "q-2-36",
              question: "What key architectural improvement was introduced in FlashAttention-2 over FlashAttention-1?",
              options: [
                "Parallelizing outer loops over sequence length and reducing non-matmul FLOPs",
                "Quantizing attention matrices to INT8 precision in SRAM",
                "Replacing standard Softmax with linear kernel approximations",
                "Offloading KV matrices to host DRAM during backpropagation"
              ],
              correctIndex: 0,
              explanation: "FlashAttention-2 parallelizes across the sequence length dimension (not just batch and head) and reduces register-bound scaling operations, reaching up to 73% theoretical peak FLOPs on A100/H100.",
              type: "mcq",
            },
            {
              id: "q-2-37",
              question: "In Ring Attention, how is context scaling to million-token sequences achieved across multi-GPU nodes?",
              options: [
                "Passing Key and Value blocks in a ring topology overlapping communication with attention computation",
                "Storing all Key and Value states in a shared central Redis node",
                "Truncating tokens beyond the local GPU memory boundary",
                "Compressing intermediate attention scores with discrete cosine transform"
              ],
              correctIndex: 0,
              explanation: "Ring Attention divides input sequences into blocks and sends Key and Value blocks around a ring network of GPUs, computing local attention blocks while overlapping p2p network transfer.",
              type: "mcq",
            },
            {
              id: "q-2-38",
              question: "In Vector Databases (e.g., Milvus, Pinecone, FAISS), what is the average query time complexity of Hierarchical Navigable Small World (HNSW) graph search over N vectors?",
              options: ["O(log N)", "O(N)", "O(N^2)", "O(1)"],
              correctIndex: 0,
              explanation: "HNSW constructs a multi-layer skip-list graph of vectors, providing logarithmic O(log N) approximate nearest neighbor (ANN) search time complexity.",
              type: "mcq",
            },
            {
              id: "q-2-39",
              question: "For two L2-normalized embedding vectors u and v (where ||u|| = ||v|| = 1), what is the relationship between Cosine Similarity and Squared Euclidean Distance ||u - v||^2?",
              options: [
                "||u - v||^2 = 2 * (1 - cosine_similarity(u, v))",
                "||u - v||^2 = 1 - cosine_similarity(u, v)",
                "||u - v||^2 = 2 + cosine_similarity(u, v)",
                "Squared Euclidean distance is independent of cosine similarity"
              ],
              correctIndex: 0,
              explanation: "Expanding ||u - v||^2 = ||u||^2 + ||v||^2 - 2 (u . v) = 1 + 1 - 2 cos(theta) = 2 * (1 - cosine_similarity). Minimizing Euclidean distance on unit vectors is equivalent to maximizing cosine similarity.",
              type: "mcq",
            },
            {
              id: "q-2-40",
              question: "In Denoising Diffusion Probabilistic Models (DDPM), how is the forward diffusion process parameterized?",
              options: [
                "A fixed Markov chain that progressively adds Gaussian noise according to variance schedule beta_t",
                "A learned neural network that inverts images into frequency domains",
                "A generative adversarial network with a discriminator penalty",
                "A deterministic ODE solver using Euler integration"
              ],
              correctIndex: 0,
              explanation: "The forward process in DDPM is an unlearned, fixed Markov chain that gradually perturbs data x_0 into isotropic Gaussian noise via q(x_t | x_{t-1}) = N(x_t; sqrt(1 - beta_t) x_{t-1}, beta_t I).",
              type: "mcq",
            },
            {
              id: "q-2-41",
              question: "Why do Latent Diffusion Models (like Stable Diffusion) perform diffusion in the latent space of a VQ-VAE/Autoencoder rather than pixel space?",
              options: [
                "To reduce spatial dimensions (e.g. 8x downsampling), drastically lowering computational FLOPs",
                "Because diffusion equations cannot mathematically operate on RGB values",
                "To eliminate the need for cross-attention with text prompts",
                "To force the model to output vector graphics instead of raster bitmaps"
              ],
              correctIndex: 0,
              explanation: "High-resolution pixel space contains perceptual redundancy. Compressing 512x512 images into 64x64 latent representations allows diffusion models to train and infer significantly faster.",
              type: "mcq",
            },
            {
              id: "q-2-42",
              question: "In Knowledge Distillation, what is the role of setting a high temperature (T > 1) in the Softmax function of teacher and student logits?",
              options: [
                "Softening probability distributions to expose dark knowledge (inter-class relationships)",
                "Accelerating convergence by sharpening the argmax output to 1.0",
                "Preventing the student network from accessing the teacher parameters",
                "Ensuring gradients do not propagate through backpropagation"
              ],
              correctIndex: 0,
              explanation: "Higher temperature softens logit distributions, revealing subtle probabilities that the teacher assigns to non-target classes (e.g. distinguishing a dog from a cat vs a car).",
              type: "mcq",
            },
            {
              id: "q-2-43",
              question: "What is the nearly optimal time complexity of Disjoint Set Union (Union-Find) with both Path Compression and Union by Rank for M operations on N elements?",
              options: ["O(M * alpha(N))", "O(M * log N)", "O(M * N)", "O(M^2)"],
              correctIndex: 0,
              explanation: "With path compression and union by rank, any sequence of M operations runs in O(M * alpha(N)) time, where alpha is the extremely slow-growing Inverse Ackermann function (effectively <= 4 for all universe sizes).",
              type: "mcq",
            },
            {
              id: "q-2-44",
              question: "What is the time complexity to build a Segment Tree from an array of size N, and what is the time complexity to perform an arbitrary range query?",
              options: ["Build: O(N), Query: O(log N)", "Build: O(N log N), Query: O(1)", "Build: O(N^2), Query: O(N)", "Build: O(1), Query: O(log N)"],
              correctIndex: 0,
              explanation: "Building a segment tree takes linear O(N) time across 2N-1 nodes. Each range query traverses at most O(log N) tree nodes.",
              type: "mcq",
            },
            {
              id: "q-2-45",
              question: "Which graph algorithm detects negative-weight cycles and computes single-source shortest paths in O(V * E) time?",
              options: ["Bellman-Ford Algorithm", "Dijkstra Algorithm", "Prim Algorithm", "Kruskal Algorithm"],
              correctIndex: 0,
              explanation: "Bellman-Ford relaxes all edges V-1 times and detects negative cycles on the V-th iteration, operating in O(V * E) time.",
              type: "mcq",
            },
            {
              id: "q-2-46",
              question: "In the A* search algorithm, what property must a heuristic h(n) satisfy to guarantee that the search returns the strictly optimal shortest path on a graph?",
              options: ["Admissibility (h(n) never overestimates true cost) and Consistency", "Monotonicity with h(n) > actual cost", "Heuristic must equal zero for all non-goal nodes", "Heuristic must be calculated via Euclidean distance only"],
              correctIndex: 0,
              explanation: "An admissible heuristic never overestimates the true distance to the goal, and consistency (triangle inequality) ensures optimal paths are found without reopening visited nodes.",
              type: "mcq",
            },
            {
              id: "q-2-47",
              question: "What is the preprocessing and searching time complexity of the Knuth-Morris-Pratt (KMP) string matching algorithm for pattern P and text T?",
              options: ["Preprocessing: O(|P|), Search: O(|T|)", "Preprocessing: O(|P|^2), Search: O(|T|)", "Preprocessing: O(1), Search: O(|P| * |T|)", "Preprocessing: O(|P| log |P|), Search: O(|T| log |P|)"],
              correctIndex: 0,
              explanation: "KMP builds the prefix failure function in linear O(|P|) time and searches text T in linear O(|T|) time without backtracking.",
              type: "mcq",
            },
            {
              id: "q-2-48",
              question: "In Kadane algorithm for Maximum Subarray Sum, what is the dynamic programming recurrence relation for max_ending_here at index i?",
              options: ["max_ending_here[i] = max(nums[i], max_ending_here[i-1] + nums[i])", "max_ending_here[i] = max_ending_here[i-1] + nums[i]", "max_ending_here[i] = max(nums[i], max_so_far)", "max_ending_here[i] = nums[i] - min_so_far"],
              correctIndex: 0,
              explanation: "Kadane decides at each step whether to extend the previous contiguous subarray or start fresh from the current element nums[i].",
              type: "mcq",
            },
            {
              id: "q-2-49",
              question: "In BitNet b1.58 (1-bit LLMs), what values can model weights take, and how does this transform matrix multiplication?",
              options: [
                "Weights take {-1, 0, 1}, replacing floating-point multiply-accumulate (MAC) with integer addition and subtraction",
                "Weights take binary {0, 1}, requiring boolean XOR operations only",
                "Weights take 8-bit floats with custom mantissa bit-shifts",
                "Weights take complex numbers with unitary magnitude"
              ],
              correctIndex: 0,
              explanation: "BitNet b1.58 quantizes weights into ternary values {-1, 0, 1}. This eliminates expensive matrix multiplication hardware units, replacing them with simple addition/subtraction circuits.",
              type: "mcq",
            },
            {
              id: "q-2-50",
              question: "In Triton GPU kernel programming, why is memory access organized in blocks (tiles) rather than single threads as in raw CUDA?",
              options: [
                "Triton abstracts SIMD/warp thread synchronization, letting compilers optimize SRAM shared memory layout and coalesced DRAM loads",
                "Triton disables GPU L2 cache to prevent cache invalidation",
                "Triton can only execute on CPU host memories",
                "Triton requires block sizes to match CPU L1 cache lines"
              ],
              correctIndex: 0,
              explanation: "Triton operates on block-level tensors (e.g. 128x64 tiles), allowing the compiler to automatically schedule memory prefetching, bank-conflict-free shared memory allocation, and pipeline coalescing.",
              type: "mcq",
            },
            {
              id: "q-2-51",
              question: "What is the mathematical definition of Gradient Accumulation during model training?",
              options: [
                "Accumulating gradients across K micro-batches before performing a single optimizer step, simulating effective batch size K * B",
                "Computing second-order Hessian diagonals across training epochs",
                "Exponential moving average of model weights similar to Polyak averaging",
                "Clipping gradient norms whenever L2 norm exceeds threshold tau"
              ],
              correctIndex: 0,
              explanation: "Gradient accumulation computes forward and backward passes across K smaller micro-batches, summing their gradients without updating parameters until step K, avoiding Out-Of-Memory (OOM) errors.",
              type: "mcq",
            },
            {
              id: "q-2-52",
              question: "How does Rotary Position Embedding (RoPE) mathematically inject relative position into self-attention?",
              options: [
                "Rotating query and key vectors in complex 2D planes by an angle proportional to token position m * theta",
                "Adding a learned absolute 1D positional tensor to token embeddings",
                "Applying a linear bias slope matrix directly to attention logits (as in ALiBi)",
                "Masking keys that exceed a maximum distance window"
              ],
              correctIndex: 0,
              explanation: "RoPE rotates 2D chunks of Q and K vectors by angle m * theta. The inner product <R_m q, R_n k> depends strictly on the relative distance (m - n), encoding relative positional information naturally.",
              type: "mcq",
            },
            {
              id: "q-2-53",
              question: "In Longest Common Subsequence (LCS) between strings of length M and N, how can space complexity be optimized from O(M * N) down to O(min(M, N))?",
              options: [
                "By maintaining only two rows (current and previous) of the DP table",
                "By sorting both strings in lexicographical order prior to comparison",
                "By using a binary search tree to store character frequencies",
                "By hashing both strings with SHA-256"
              ],
              correctIndex: 0,
              explanation: "Since DP state dp[i][j] depends only on the current row and immediately preceding row, allocating two rows of size min(M, N) reduces space complexity to O(min(M, N)).",
              type: "mcq",
            },
            {
              id: "q-2-54",
              question: "In Mixture of Depths (MoD), how do Transformer layers dynamically allocate compute per token?",
              options: [
                "A router selects a top-k subset of tokens to participate in self-attention and MLP, while remaining tokens bypass via residual connection",
                "The network drops the final 50% of layers during inference for all tokens",
                "Tokens are dynamically split into byte-level substrings",
                "Attention heads are randomly pruned with Bernoulli dropout"
              ],
              correctIndex: 0,
              explanation: "Mixture of Depths routes only the top-k most informative tokens through the full compute blocks of a layer, letting non-critical tokens skip the computation via residual pathways.",
              type: "mcq",
            },
            {
              id: "q-2-55",
              question: "What is the primary difference between Hard Negative mining and Random Negative sampling in contrastive retrieval (bi-encoders)?",
              options: [
                "Hard negatives are false-positive candidates with high lexical or semantic similarity that the model currently misclassifies, providing large gradient updates",
                "Hard negatives are randomly drawn from unindexed documents",
                "Hard negatives require human labelers to annotate every training sample",
                "Hard negatives are only used during evaluation, never in training"
              ],
              correctIndex: 0,
              explanation: "Hard negatives (e.g. BM25 top results that are not relevant) share high surface overlap with the query. Training on them provides steep gradients that teach the model fine-grained discriminative nuance.",
              type: "mcq",
            },
            {
              id: "q-2-56",
              question: "In Graph Neural Networks (GNN), what problem occurs when stacking too many graph convolution layers (e.g. > 8 layers)?",
              options: [
                "Over-smoothing (node representations become indistinguishable from each other)",
                "Negative eigenvalue explosion in the graph Laplacian",
                "Graph sparsity collapse into dense matrices",
                "Immediate loss of node degree distributions"
              ],
              correctIndex: 0,
              explanation: "Over-smoothing occurs as repeated neighborhood message passing causes node embeddings across connected components to converge to stationary uniform vectors.",
              type: "mcq",
            },
            {
              id: "q-2-57",
              question: "Why is Cross-Entropy loss preferred over Mean Squared Error (MSE) for training classification neural networks with Softmax output?",
              options: [
                "Cross-entropy avoids gradient saturation when outputs are confident but wrong, maintaining steep linear error gradients (y_hat - y)",
                "MSE cannot be calculated on vector probabilities",
                "Cross-entropy is computationally faster to differentiate than MSE",
                "Softmax probabilities cannot be squared due to precision underflow"
              ],
              correctIndex: 0,
              explanation: "Softmax combined with Cross-Entropy yields the clean gradient dL/dz = y_hat - y. Combining MSE with Softmax introduces a derivative term y_hat * (1 - y_hat) that vanishes when predictions are completely wrong.",
              type: "mcq",
            },
            {
              id: "q-2-58",
              question: "What is the primary motivation for Sliding Window Attention (used in Mistral 7B)?",
              options: [
                "Restricting attention to a fixed local window W, reducing computation from O(N^2) to O(N * W) while preserving long-range receptive field through stacked layers",
                "Enabling bidirectional cross-attention in decoder-only architectures",
                "Eliminating the need for query and key projection matrices",
                "Preventing positional embedding decay over infinite sequences"
              ],
              correctIndex: 0,
              explanation: "With a window size W (e.g. 4096), each layer attends locally to W tokens. In a network of L layers, the effective receptive field reaches L * W tokens with linear O(N * W) compute.",
              type: "mcq",
            },
            {
              id: "q-2-59",
              question: "In binary tree Lowest Common Ancestor (LCA) queries using Binary Lifting, what is the preprocessing and query time complexity?",
              options: ["Preprocessing: O(N log N), Query: O(log N)", "Preprocessing: O(N), Query: O(N)", "Preprocessing: O(N^2), Query: O(1)", "Preprocessing: O(1), Query: O(log N)"],
              correctIndex: 0,
              explanation: "Binary lifting precomputes a 2^k ancestor jump table in O(N log N) time and space. Queries find the LCA in O(log N) time by jumping powers of two.",
              type: "mcq",
            },
            {
              id: "q-2-60",
              question: "In pipeline model parallelism (e.g., GPipe or 1F1B schedule), what does the term Pipeline Bubble refer to?",
              options: [
                "Idle GPU time during pipeline warm-up and cool-down when stages wait for activations or backward gradients",
                "Memory fragmentation caused by micro-batch allocation",
                "Deadlocks occurring during tensor communication",
                "Over-allocation of KV cache memory across pipeline stages"
              ],
              correctIndex: 0,
              explanation: "The pipeline bubble is the idle processor time at the beginning and end of each training step while intermediate pipeline stages wait for upstream activations or downstream gradients.",
              type: "mcq",
            }
          ],
        },
        {
          id: "sec-3",
          name: "Coding & ML Round",
          questionsCount: 2,
          durationMins: 45,
          questions: [
            {
              id: "q-3-1",
              question: "Implement numerically stable Softmax in Python for a 1D tensor without precision overflow.",
              options: [
                "Subtract max(x) before exponentiation",
                "Add epsilon directly to logits",
                "Apply sigmoid before sum",
                "Divide by L2 norm"
              ],
              correctIndex: 0,
              explanation: "Subtracting max(x) ensures the largest exponent is e^0 = 1, avoiding float overflow while preserving softmax invariance.",
              type: "code",
              starterCode: `import numpy as np

def stable_softmax(x: np.ndarray) -> np.ndarray:
    """
    TODO: Implement numerically stable softmax for input array x.
    Formula: softmax(x_i) = exp(x_i - max(x)) / sum(exp(x_j - max(x)))
    Subtract max(x) along the last axis to avoid floating point overflow.
    """
    # Write your implementation here
    pass

if __name__ == "__main__":
    logits = np.array([1000.0, 1001.0, 1002.0])
    print("Softmax Output:", stable_softmax(logits))
`,
              solutionCode: `import numpy as np

def stable_softmax(x: np.ndarray) -> np.ndarray:
    """
    Numerically Stable Softmax:
    softmax(x_i) = exp(x_i - max(x)) / sum(exp(x_j - max(x)))
    
    Subtracting max(x) ensures that the largest value fed into np.exp is 0 (exp(0) = 1.0),
    preventing 64-bit floating point overflow (np.exp(710+) overflows to inf in float64).
    """
    # Shift input by subtracting the maximum along the last axis
    shift_x = x - np.max(x, axis=-1, keepdims=True)
    # Exponentiate shifted values
    exps = np.exp(shift_x)
    # Normalize by the sum of exponentials
    return exps / np.sum(exps, axis=-1, keepdims=True)

# Verification Example:
# logits = np.array([1000.0, 1001.0, 1002.0])
# result = stable_softmax(logits)
# result -> [0.09003057, 0.24472847, 0.66524096]
# np.sum(result) -> 1.0
`,
              testCases: [
                {
                  name: "Numerical Stability (Large Inputs)",
                  input: "[1000.0, 1001.0, 1002.0]",
                  expected_output: "PASSED: Large inputs do not produce NaN or Inf, sum equals 1.0",
                  harness: `
import numpy as np
import sys

try:
    x = np.array([1000.0, 1001.0, 1002.0])
    out = stable_softmax(x)
    assert out is not None, "Function returned None (check if return statement is missing)"
    assert not np.isnan(out).any(), "NaN detected in output due to float overflow"
    assert not np.isinf(out).any(), "Inf detected in output"
    assert np.isclose(np.sum(out), 1.0), "Output probabilities must sum to 1.0"
    print("PASSED: Large inputs do not produce NaN or Inf, sum equals 1.0")
except Exception as e:
    print(f"FAILED: {e}")
    sys.exit(1)
`,
                },
                {
                  name: "Monotonicity Preservation",
                  input: "[1.0, 2.0, 3.0]",
                  expected_output: "PASSED: Monotonic probability distribution verified",
                  harness: `
import numpy as np
import sys

try:
    x = np.array([1.0, 2.0, 3.0])
    out = stable_softmax(x)
    assert out is not None, "Function returned None"
    assert np.isclose(np.sum(out), 1.0), "Output probabilities must sum to 1.0"
    assert out[2] > out[1] > out[0], "Probabilities must preserve monotonic ordering of logits"
    print("PASSED: Monotonic probability distribution verified")
except Exception as e:
    print(f"FAILED: {e}")
    sys.exit(1)
`,
                },
                {
                  name: "Uniform Distribution Invariance",
                  input: "[4.0, 4.0, 4.0, 4.0]",
                  expected_output: "PASSED: Uniform inputs yield equal 0.25 probability distribution",
                  harness: `
import numpy as np
import sys

try:
    x = np.array([4.0, 4.0, 4.0, 4.0])
    out = stable_softmax(x)
    assert out is not None, "Function returned None"
    assert np.allclose(out, [0.25, 0.25, 0.25, 0.25]), "Uniform inputs must yield equal probability"
    print("PASSED: Uniform inputs yield equal 0.25 probability distribution")
except Exception as e:
    print(f"FAILED: {e}")
    sys.exit(1)
`,
                },
              ],
            },
            {
              id: "q-3-2",
              question: "Given token embeddings of shape [batch, seq_len, dim], compute Scaled Dot-Product Attention weights with optional causal mask.",
              options: [
                "softmax((Q @ K.T) / sqrt(d_k) + mask)",
                "sigmoid(Q @ K)",
                "tanh(Q + K)",
                "(Q @ K) / d_k"
              ],
              correctIndex: 0,
              explanation: "Scaled dot-product attention scales logits by 1/sqrt(d_k) to prevent variance explosion, then applies softmax across key dimension.",
              type: "code",
              starterCode: `import torch
import math

def scaled_dot_product_attention(q, k, v, mask=None):
    """
    TODO: Compute Scaled Dot-Product Attention:
    Attention(Q, K, V) = softmax((Q @ K.T) / sqrt(d_k) + mask) @ V
    
    Args:
        q: [batch_size, seq_len_q, d_k]
        k: [batch_size, seq_len_k, d_k]
        v: [batch_size, seq_len_v, d_v]
        mask: optional mask tensor where 0 indicates masked positions
    Returns:
        output: [batch_size, seq_len_q, d_v]
        attn_weights: [batch_size, seq_len_q, seq_len_k]
    """
    # Write your implementation here
    pass

if __name__ == "__main__":
    q = torch.randn(1, 4, 32)
    k = torch.randn(1, 4, 32)
    v = torch.randn(1, 4, 32)
    out, weights = scaled_dot_product_attention(q, k, v)
    print("Attention output shape:", out.shape if out is not None else "None")
`,
              solutionCode: `import torch
import math

def scaled_dot_product_attention(q, k, v, mask=None):
    """
    Scaled Dot-Product Attention:
    Attention(Q, K, V) = softmax((Q @ K.T) / sqrt(d_k) + mask) @ V
    
    1. Scale dot-product: scores = (Q @ K^T) / sqrt(d_k)
    2. Apply causal/padding mask: if mask == 0, replace score with -1e9 before softmax
    3. Normalize scores: attn_weights = softmax(scores, dim=-1)
    4. Aggregate values: output = attn_weights @ V
    """
    d_k = q.size(-1)
    scores = torch.matmul(q, k.transpose(-2, -1)) / math.sqrt(d_k)
    if mask is not None:
        scores = scores.masked_fill(mask == 0, -1e9)
    attn_weights = torch.softmax(scores, dim=-1)
    output = torch.matmul(attn_weights, v)
    return output, attn_weights

# Verification Example:
# q = torch.randn(2, 4, 32); k = torch.randn(2, 4, 32); v = torch.randn(2, 4, 32)
# out, weights = scaled_dot_product_attention(q, k, v)
# out.shape -> torch.Size([2, 4, 32])
# weights.shape -> torch.Size([2, 4, 4])
`,
              testCases: [
                {
                  name: "Output Dimensions & Normalization",
                  input: "Q, K, V shape: [2, 4, 32]",
                  expected_output: "PASSED: Output shape (2, 4, 32) and weights summing to 1.0 verified",
                  harness: `
import torch
import math
import sys

try:
    q = torch.randn(2, 4, 32)
    k = torch.randn(2, 4, 32)
    v = torch.randn(2, 4, 32)
    out, weights = scaled_dot_product_attention(q, k, v)
    assert out is not None and weights is not None, "Function returned None (check return statement)"
    assert out.shape == (2, 4, 32), f"Expected out shape (2, 4, 32), got {out.shape}"
    assert weights.shape == (2, 4, 4), f"Expected weights shape (2, 4, 4), got {weights.shape}"
    assert torch.allclose(weights.sum(dim=-1), torch.ones(2, 4), atol=1e-4), "Weights along key dimension must sum to 1.0"
    print("PASSED: Output shape (2, 4, 32) and weights summing to 1.0 verified")
except Exception as e:
    print(f"FAILED: {e}")
    sys.exit(1)
`,
                },
                {
                  name: "Causal Mask Verification",
                  input: "Tril causal mask of size [4, 4]",
                  expected_output: "PASSED: Causal mask strictly zeroes out future token attention weights",
                  harness: `
import torch
import math
import sys

try:
    q = torch.randn(2, 4, 32)
    k = torch.randn(2, 4, 32)
    v = torch.randn(2, 4, 32)
    mask = torch.tril(torch.ones(4, 4)).unsqueeze(0).unsqueeze(0)
    out_masked, weights_masked = scaled_dot_product_attention(q, k, v, mask=mask)
    upper_tri = torch.triu(weights_masked[0, 0], diagonal=1)
    assert torch.allclose(upper_tri, torch.zeros_like(upper_tri), atol=1e-5), "Future token attention weights are not zeroed out"
    print("PASSED: Causal mask strictly zeroes out future token attention weights")
except Exception as e:
    print(f"FAILED: {e}")
    sys.exit(1)
`,
                },
              ],
            },
            {
              id: "q-3-3",
              question: "Implement Top-k Logit Filtering in Python for autoregressive LLM sampling.",
              options: [
                "Set logits below the k-th highest value to -infinity",
                "Take softmax then select top k elements",
                "Sort and discard elements with sigmoid below 0.5",
                "Clip logits between -k and +k"
              ],
              correctIndex: 0,
              explanation: "Top-k filtering sets all logits outside the top-k highest values to -inf, so that softmax assigns them zero probability, preventing low-confidence tokens from being sampled.",
              type: "code",
              starterCode: `import numpy as np

def top_k_logits(logits: np.ndarray, k: int) -> np.ndarray:
    """
    TODO: Filter 1D logits array to retain only the top-k highest values.
    All other values in the returned array must be set to -infinity (-np.inf).
    If k >= len(logits), return the original logits untouched.
    """
    # Write your implementation here
    pass

if __name__ == "__main__":
    logits = np.array([2.0, 5.0, 1.0, 8.0, 3.0])
    print("Filtered:", top_k_logits(logits, 2))
`,
              solutionCode: `import numpy as np

def top_k_logits(logits: np.ndarray, k: int) -> np.ndarray:
    """
    Accurate Reference Solution:
    Finds the k-th highest logit threshold using np.partition,
    and masks all smaller values with -np.inf.
    """
    if k >= len(logits):
        return logits.copy()
    
    filtered = logits.copy()
    cutoff = np.partition(logits, -k)[-k]
    filtered[filtered < cutoff] = -np.inf
    return filtered
`,
              testCases: [
                {
                  name: "Top-2 Selection Masking",
                  input: "logits: [2.0, 5.0, 1.0, 8.0, 3.0], k=2",
                  expected_output: "PASSED: Top-2 logits (8.0 and 5.0) preserved with remaining set to -inf",
                  harness: `
import numpy as np
import sys

try:
    arr = np.array([2.0, 5.0, 1.0, 8.0, 3.0])
    res = top_k_logits(arr, 2)
    assert res is not None, "Function returned None"
    assert res[3] == 8.0 and res[1] == 5.0, "Top 2 values (8.0, 5.0) must be preserved"
    assert np.isneginf(res[0]) and np.isneginf(res[2]) and np.isneginf(res[4]), "Non-top-k logits must be -inf"
    print("PASSED: Top-2 logits (8.0 and 5.0) preserved with remaining set to -inf")
except Exception as e:
    print(f"FAILED: {e}")
    sys.exit(1)
`,
                },
                {
                  name: "Boundary k >= length check",
                  input: "logits: [1.0, 2.0], k=5",
                  expected_output: "PASSED: k >= length preserves all logits",
                  harness: `
import numpy as np
import sys

try:
    arr = np.array([1.0, 2.0])
    res = top_k_logits(arr, 5)
    assert res is not None, "Function returned None"
    assert np.allclose(res, arr), "When k >= len(logits), all logits must remain unchanged"
    print("PASSED: k >= length preserves all logits")
except Exception as e:
    print(f"FAILED: {e}")
    sys.exit(1)
`,
                },
              ],
            },
            {
              id: "q-3-4",
              question: "Implement Layer Normalization in Python/NumPy for a 2D tensor [batch, hidden_dim].",
              options: [
                "(x - mean) / sqrt(var + eps) * gamma + beta across last dimension",
                "(x - mean) / std across batch dimension",
                "Divide by Frobenius norm and add beta",
                "Subtract global minimum and scale by range"
              ],
              correctIndex: 0,
              explanation: "LayerNorm normalizes each sample independently across its hidden features: y = ((x - E[x]) / sqrt(Var[x] + eps)) * gamma + beta.",
              type: "code",
              starterCode: `import numpy as np

def layer_norm(x: np.ndarray, gamma: np.ndarray, beta: np.ndarray, eps: float = 1e-5) -> np.ndarray:
    """
    TODO: Implement Layer Normalization for 2D array x of shape [batch, hidden_dim].
    Formula: y = ((x - mean) / sqrt(variance + eps)) * gamma + beta
    Normalizes along the last feature dimension (axis=-1).
    """
    # Write your implementation here
    pass

if __name__ == "__main__":
    x = np.array([[1.0, 2.0, 3.0], [4.0, 5.0, 6.0]])
    gamma = np.ones(3)
    beta = np.zeros(3)
    print("LayerNorm:", layer_norm(x, gamma, beta))
`,
              solutionCode: `import numpy as np

def layer_norm(x: np.ndarray, gamma: np.ndarray, beta: np.ndarray, eps: float = 1e-5) -> np.ndarray:
    """
    Accurate Reference Solution:
    Computes mean and variance across the last dimension, normalizes,
    and applies learnable affine parameters gamma and beta.
    """
    mean = np.mean(x, axis=-1, keepdims=True)
    var = np.var(x, axis=-1, keepdims=True)
    x_norm = (x - mean) / np.sqrt(var + eps)
    return gamma * x_norm + beta
`,
              testCases: [
                {
                  name: "Zero mean and unit variance check",
                  input: "2D input array with gamma=1, beta=0",
                  expected_output: "PASSED: Zero mean and unit variance achieved across features",
                  harness: `
import numpy as np
import sys

try:
    x = np.array([[10.0, 20.0, 30.0, 40.0, 50.0], [-5.0, 0.0, 5.0, 10.0, 15.0]])
    gamma = np.ones(5)
    beta = np.zeros(5)
    out = layer_norm(x, gamma, beta)
    assert out is not None, "Function returned None"
    assert out.shape == x.shape, f"Expected shape {x.shape}, got {out.shape}"
    for row in out:
        assert np.isclose(np.mean(row), 0.0, atol=1e-5), f"Row mean {np.mean(row)} != 0"
        assert np.isclose(np.var(row), 1.0, atol=1e-3), f"Row variance {np.var(row)} != 1"
    print("PASSED: Zero mean and unit variance achieved across features")
except Exception as e:
    print(f"FAILED: {e}")
    sys.exit(1)
`,
                },
                {
                  name: "Affine scale and shift application",
                  input: "gamma=2.0, beta=5.0",
                  expected_output: "PASSED: Affine parameters gamma and beta correctly applied",
                  harness: `
import numpy as np
import sys

try:
    x = np.array([[2.0, 4.0, 6.0]])
    gamma = np.array([2.0, 2.0, 2.0])
    beta = np.array([5.0, 5.0, 5.0])
    out = layer_norm(x, gamma, beta)
    assert out is not None, "Function returned None"
    assert np.isclose(np.mean(out), 5.0, atol=1e-5), "Mean after beta shift must equal 5.0"
    print("PASSED: Affine parameters gamma and beta correctly applied")
except Exception as e:
    print(f"FAILED: {e}")
    sys.exit(1)
`,
                },
              ],
            }
          ],
        },
      ],
    },
    interview: {
      rounds: [
        {
          id: "ai-tech",
          name: "Technical Interview",
          durationMins: 20,
          description: "In-depth architecture discussion on Transformer attention mechanisms, KV caching, and distributed training pipelines.",
          firstQuestion: "Welcome to your AI Engineer technical interview. Let's begin by discussing transformer inference at scale. How does KV caching optimize autoregressive token generation, and what memory trade-offs does it introduce?",
          questions: [
            "How does KV caching optimize autoregressive token generation, and what memory trade-offs does it introduce?",
            "When scaling model training across multiple GPUs, how do you decide between Data Parallelism, Tensor Parallelism, and Pipeline Parallelism?",
            "How would you address catastrophic forgetting when fine-tuning a Large Language Model with LoRA or QLoRA?",
            "Explain how flash attention redesigns the attention computation to be memory-bound rather than compute-bound.",
          ],
        },
        {
          id: "ai-hr",
          name: "HR Interview",
          durationMins: 10,
          description: "Evaluation of collaborative problem solving, technical communication, and handling production engineering incidents.",
          firstQuestion: "Tell me about a challenging machine learning project you built. What was an unexpected obstacle you encountered, and how did you resolve it?",
          questions: [
            "Tell me about a challenging machine learning project you built. What was an unexpected obstacle you encountered, and how did you resolve it?",
            "How do you prioritize between improving model evaluation accuracy versus optimizing latency and serving cost?",
            "Describe a time you had a technical disagreement with a teammate regarding system architecture. How did you align?",
          ],
        },
      ],
    },
  },
  {
    id: "backend-developer",
    title: "Backend Developer",
    description: "Designs scalable server-side systems, microservices, and distributed transaction engines.",
    category: "backend",
    categoryLabel: "Systems & Backend",
    companies: [
      { name: "Stripe" },
      { name: "Amazon AWS" },
      { name: "Uber" },
      { name: "Datadog" },
    ],
    skills: ["Distributed Systems", "PostgreSQL", "Go / Java", "Kafka", "Redis"],
    moreSkillsCount: 17,
    attempted: true,
    lastAttempted: "Yesterday",
    hiringProcessSteps: [
      { step: 1, title: "Aptitude & Logical Reasoning", type: "test" },
      { step: 2, title: "Core CS & DB Engines MCQ", type: "test" },
      { step: 3, title: "Distributed Systems Coding", type: "test" },
      { step: 4, title: "System Design & Architecture", type: "interview" },
      { step: 5, title: "Engineering Culture Loop", type: "interview" },
    ],
    technicalTest: {
      sectionsCount: 3,
      totalQuestions: 45,
      durationLabel: "1 hr 30 mins",
      totalMinutes: 90,
      totalMarks: 2500,
      sections: [
        {
          id: "be-sec-1",
          name: "Aptitude & Data Logic",
          questionsCount: 15,
          durationMins: 15,
          questions: [
            {
              id: "be-q-1",
              question: "A distributed queue receives 4,000 events/sec. Each worker thread processes 50 events/sec. If worker utilization target is 80%, how many workers are required?",
              options: ["80 workers", "100 workers", "120 workers", "150 workers"],
              correctIndex: 1,
              explanation: "At 80% utilization, each worker processes 40 events/sec. 4000 / 40 = 100 workers.",
              type: "mcq",
            },
          ],
        },
        {
          id: "be-sec-2",
          name: "DBMS & Operating Systems MCQ",
          questionsCount: 28,
          durationMins: 30,
          questions: [
            {
              id: "be-q-2",
              question: "Under PostgreSQL MVCC, what prevents a dirty read during concurrent transactions?",
              options: ["Snapshot isolation using transaction IDs (xmin/xmax)", "Global database table lock", "Two-phase commit lock", "Write-ahead log truncation"],
              correctIndex: 0,
              explanation: "PostgreSQL MVCC tracks tuple visibility using xmin (creating transaction ID) and xmax (deleting/updating transaction ID) against the transaction snapshot.",
              type: "mcq",
            },
          ],
        },
        {
          id: "be-sec-3",
          name: "High-Throughput Sandbox Coding",
          questionsCount: 2,
          durationMins: 45,
          questions: [
            {
              id: "be-q-3",
              question: "Implement an in-memory Rate Limiter using the Token Bucket algorithm.",
              options: ["Replenish tokens based on elapsed timestamp delta", "Increment Redis counter with 1s TTL", "Use fixed window sliding log", "Reject all requests over threshold"],
              correctIndex: 0,
              explanation: "Token bucket calculates tokensToAdd = (now - lastRefill) * refillRate, capping at max capacity for continuous burst tolerance.",
              type: "code",
              starterCode: `import time

class TokenBucketRateLimiter:
    def __init__(self, capacity: int, refill_rate_per_sec: float):
        """
        TODO: Initialize Token Bucket Rate Limiter
        capacity: Maximum tokens the bucket can hold
        refill_rate_per_sec: Number of tokens added per second
        """
        self.capacity = capacity
        self.refill_rate = refill_rate_per_sec
        # Write your state variables here
        pass

    def allow_request(self, tokens: int = 1) -> bool:
        """
        TODO: Refill tokens based on elapsed time delta, then deduct requested tokens.
        Return True if request is permitted, False otherwise.
        """
        pass
`,
              solutionCode: `import time

class TokenBucketRateLimiter:
    def __init__(self, capacity: int, refill_rate_per_sec: float):
        self.capacity = capacity
        self.refill_rate = refill_rate_per_sec
        self.tokens = float(capacity)
        self.last_refill = time.time()

    def allow_request(self, tokens: int = 1) -> bool:
        now = time.time()
        elapsed = now - self.last_refill
        # Add replenished tokens capped at max capacity
        self.tokens = min(float(self.capacity), self.tokens + elapsed * self.refill_rate)
        self.last_refill = now

        if self.tokens >= tokens:
            self.tokens -= tokens
            return True
        return False
`,
            },
          ],
        },
      ],
    },
    interview: {
      rounds: [
        {
          id: "be-tech",
          name: "Technical & Systems Interview",
          durationMins: 20,
          description: "Deep dive on distributed transactions, idempotency keys, and database indexing strategies.",
          firstQuestion: "Welcome to your Backend Engineering interview. Suppose you have an API endpoint that charges credit cards. How do you design it to ensure strict idempotency in the event of network timeouts?",
          questions: [
            "How do you design an API endpoint to ensure strict idempotency in the event of network timeouts?",
            "Explain the difference between Optimistic Concurrency Control and Pessimistic Locking in high-contention database workloads.",
            "How does Apache Kafka guarantee message ordering across partitions?",
          ],
        },
        {
          id: "be-hr",
          name: "HR Interview",
          durationMins: 10,
          description: "Evaluating prioritization, production ownership, and cross-team communication during Sev-1 outages.",
          firstQuestion: "Can you describe a major production incident you experienced, how you diagnosed the root cause, and how you communicated status to stakeholders?",
          questions: [
            "Can you describe a major production incident you experienced, how you diagnosed the root cause, and how you communicated status to stakeholders?",
            "How do you approach refactoring legacy technical debt when product managers are pushing for new features?",
          ],
        },
      ],
    },
  },
  {
    id: "android-developer",
    title: "Android App Developer",
    description: "Builds high-performance Android applications, coroutine architectures, and mobile experiences.",
    category: "mobile",
    categoryLabel: "Mobile Engineering",
    companies: [
      { name: "Uber" },
      { name: "Swiggy" },
      { name: "Meesho" },
      { name: "Google" },
    ],
    skills: ["Kotlin", "Jetpack Compose", "Coroutines", "MVVM", "Flow"],
    moreSkillsCount: 11,
    attempted: false,
    hiringProcessSteps: [
      { step: 1, title: "Mobile UI & Core Reasoning", type: "test" },
      { step: 2, title: "Android Framework & Kotlin MCQ", type: "test" },
      { step: 3, title: "Compose & Architecture Coding", type: "test" },
      { step: 4, title: "Android System Architecture", type: "interview" },
      { step: 5, title: "Behavioral Interview", type: "interview" },
    ],
    technicalTest: {
      sectionsCount: 3,
      totalQuestions: 42,
      durationLabel: "1 hr 30 mins",
      totalMinutes: 90,
      totalMarks: 2400,
      sections: [
        {
          id: "and-sec-1",
          name: "Logic & Mobile Performance",
          questionsCount: 12,
          durationMins: 15,
          questions: [
            {
              id: "and-q-1",
              question: "At 120Hz display refresh rate, what is the maximum frame budget to avoid dropped frames and UI jank?",
              options: ["16.6ms", "8.33ms", "10.0ms", "12.5ms"],
              correctIndex: 1,
              explanation: "1000ms / 120 = 8.33 milliseconds per frame.",
              type: "mcq",
            },
          ],
        },
        {
          id: "and-sec-2",
          name: "Kotlin & Android Internals MCQ",
          questionsCount: 28,
          durationMins: 30,
          questions: [
            {
              id: "and-q-2",
              question: "What is the primary difference between StateFlow and SharedFlow in Kotlin Coroutines?",
              options: [
                "StateFlow is a state-holder with a single replay value, while SharedFlow emits events to multiple subscribers",
                "StateFlow runs only on the Main dispatcher",
                "SharedFlow cannot be collected inside Compose",
                "StateFlow drops values if buffer overflows",
              ],
              correctIndex: 0,
              explanation: "StateFlow always holds an initial state value and replays the latest value to new collectors, while SharedFlow is a general hot stream for events.",
              type: "mcq",
            },
          ],
        },
        {
          id: "and-sec-3",
          name: "Coroutines & Compose Sandbox",
          questionsCount: 2,
          durationMins: 45,
          questions: [
            {
              id: "and-q-3",
              question: "Create a debounce operator using Kotlin Coroutines Flow for an autocomplete search input.",
              options: [
                "Use flow.debounce(300).distinctUntilChanged()",
                "Use Thread.sleep(300) inside launch",
                "Use repeatOnLifecycle with delay",
                "Use liveData with switchMap",
              ],
              correctIndex: 0,
              explanation: "debounce(300) filters out rapid emissions, and distinctUntilChanged ensures redundant queries are avoided.",
              type: "code",
              starterCode: `// TODO: Implement Kotlin Flow Debounce operator for search inputs
fun <T> Flow<T>.searchDebounce(waitMs: Long = 300L): Flow<T> {
    // Write your debounce and distinct operator chain here
    return this
}
`,
              solutionCode: `// Accurate Reference Solution:
fun <T> Flow<T>.searchDebounce(waitMs: Long = 300L): Flow<T> {
    return this
        .debounce(waitMs)
        .distinctUntilChanged()
}
`,
            },
          ],
        },
      ],
    },
    interview: {
      rounds: [
        {
          id: "and-tech",
          name: "Technical Interview",
          durationMins: 20,
          description: "Deep dive on Jetpack Compose recomposition lifecycles, memory leak prevention, and modular Android architecture.",
          firstQuestion: "Welcome to the Android Developer interview. Can you explain how Jetpack Compose decides when to skip recomposition for a Composable function, and what role the @Stable annotation plays?",
          questions: [
            "Can you explain how Jetpack Compose decides when to skip recomposition for a Composable function, and what role the @Stable annotation plays?",
            "How do you inspect and prevent memory leaks caused by ViewModel coroutine scopes holding Activity contexts?",
            "How do you handle offline synchronization and conflict resolution using Room Database and WorkManager?",
          ],
        },
        {
          id: "and-hr",
          name: "HR Interview",
          durationMins: 10,
          description: "Assessing app release management, collaborating with product designers, and cross-functional agility.",
          firstQuestion: "How do you coordinate with UI/UX designers when an animation or gesture is technically complex to implement at 60fps on low-end devices?",
          questions: [
            "How do you coordinate with UI/UX designers when an animation or gesture is technically complex to implement at 60fps on low-end devices?",
            "Describe your process for managing staged rollouts and monitoring crash-free rates on Google Play Console.",
          ],
        },
      ],
    },
  },
  {
    id: "associate-software-engineer",
    title: "Associate Software Engineer",
    description: "Develops and maintains core software applications while applying modern computer science practices.",
    category: "general",
    categoryLabel: "Software Engineering",
    companies: [
      { name: "Oracle" },
      { name: "Razorpay" },
      { name: "Meesho" },
      { name: "Amazon" },
    ],
    skills: ["HTTP Protocol", "JavaScript", "Java / Python", "Data Structures", "SQL"],
    moreSkillsCount: 13,
    attempted: false,
    hiringProcessSteps: [
      { step: 1, title: "General Aptitude & Problem Solving", type: "test" },
      { step: 2, title: "OOP & CS Fundamentals MCQ", type: "test" },
      { step: 3, title: "Data Structures & Algorithmic Coding", type: "test" },
      { step: 4, title: "Core Technical Interview", type: "interview" },
      { step: 5, title: "HR & Culture Alignment", type: "interview" },
    ],
    technicalTest: {
      sectionsCount: 3,
      totalQuestions: 40,
      durationLabel: "1 hr 30 mins",
      totalMinutes: 90,
      totalMarks: 2200,
      sections: [
        {
          id: "ase-sec-1",
          name: "Quantitative & Analytical Reasoning",
          questionsCount: 15,
          durationMins: 20,
          questions: [
            {
              id: "ase-q-1",
              question: "A binary search algorithm divides search space in half each step. In an array of 1,048,576 sorted elements, what is the maximum number of comparisons needed?",
              options: ["20 comparisons", "10 comparisons", "100 comparisons", "1024 comparisons"],
              correctIndex: 0,
              explanation: "log2(1,048,576) = 20 comparisons maximum.",
              type: "mcq",
            },
          ],
        },
        {
          id: "ase-sec-2",
          name: "Core CS & Algorithms MCQ",
          questionsCount: 23,
          durationMins: 30,
          questions: [
            {
              id: "ase-q-2",
              question: "Which of the following data structures offers O(1) average lookup and O(1) amortized insertion?",
              options: ["Hash Table", "Binary Search Tree", "Linked List", "Min-Heap"],
              correctIndex: 0,
              explanation: "Hash Table provides constant time O(1) average case for search, insert, and delete operations.",
              type: "mcq",
            },
          ],
        },
        {
          id: "ase-sec-3",
          name: "Live Algorithm Sandbox",
          questionsCount: 2,
          durationMins: 40,
          questions: [
            {
              id: "ase-q-3",
              question: "Given an array of integers, return indices of two numbers such that they add up to a specific target.",
              options: ["Use a Hash Map for O(N) lookup", "Use nested loops O(N^2)", "Sort array O(N log N)", "Use binary search on every item"],
              correctIndex: 0,
              explanation: "A hash map stores the complement (target - num) with index, finding the pair in a single O(N) pass.",
              type: "code",
              starterCode: `def two_sum(nums, target):
    """
    TODO: Given an array of integers nums and an integer target,
    return indices of the two numbers such that they add up to target.
    Time Complexity must be O(N).
    """
    # Write your solution here
    pass
`,
              solutionCode: `def two_sum(nums, target):
    # Hash Map for O(N) single-pass lookup
    lookup = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in lookup:
            return [lookup[diff], i]
        lookup[num] = i
    return []
`,
            },
          ],
        },
      ],
    },
    interview: {
      rounds: [
        {
          id: "ase-tech",
          name: "Technical Interview",
          durationMins: 20,
          description: "Evaluating algorithmic logic, clean code habits, object-oriented principles, and database query basics.",
          firstQuestion: "Welcome to your Associate Software Engineer interview. Let's start with basic data structures. Can you explain how an array differs from a linked list in terms of memory layout and cache locality?",
          questions: [
            "Can you explain how an array differs from a linked list in terms of memory layout and cache locality?",
            "What is the difference between a process and a thread in modern operating systems?",
            "Can you walk me through the steps that occur when you type a URL into a browser and press Enter?",
          ],
        },
        {
          id: "ase-hr",
          name: "HR Interview",
          durationMins: 10,
          description: "Focusing on learning speed, receiving feedback, and adapting to modern software engineering teams.",
          firstQuestion: "Why are you interested in this software engineering role, and what steps do you take when you encounter a technology or framework you have never used before?",
          questions: [
            "Why are you interested in this software engineering role, and what steps do you take when you encounter a technology or framework you have never used before?",
            "Tell me about a time you received constructive feedback on your code. How did you incorporate it?",
          ],
        },
      ],
    },
  },
  {
    id: "cloud-architect",
    title: "Cloud Architect",
    description: "Designs scalable, fault-tolerant, secure, and multi-region cloud-native architectures.",
    category: "cloud",
    categoryLabel: "Cloud & DevOps",
    companies: [
      { name: "Google Cloud" },
      { name: "AWS" },
      { name: "Microsoft Azure" },
      { name: "Cloudflare" },
    ],
    skills: ["Terraform", "Kubernetes", "Multi-Region Failover", "Networking VPC", "Security IAM"],
    moreSkillsCount: 15,
    attempted: false,
    hiringProcessSteps: [
      { step: 1, title: "Cloud Architecture Aptitude", type: "test" },
      { step: 2, title: "VPC, IAM & Kubernetes MCQ", type: "test" },
      { step: 3, title: "Infrastructure-as-Code Sandbox", type: "test" },
      { step: 4, title: "Multi-Region System Design", type: "interview" },
      { step: 5, title: "Executive Architecture Review", type: "interview" },
    ],
    technicalTest: {
      sectionsCount: 3,
      totalQuestions: 45,
      durationLabel: "1 hr 30 mins",
      totalMinutes: 90,
      totalMarks: 2600,
      sections: [
        {
          id: "cld-sec-1",
          name: "SRE & Latency Modeling",
          questionsCount: 12,
          durationMins: 15,
          questions: [
            {
              id: "cld-q-1",
              question: "If an SLA commits to 99.99% availability (four nines), what is the maximum permissible unplanned downtime per year?",
              options: ["52.6 minutes", "8.76 hours", "3.65 days", "5.26 minutes"],
              correctIndex: 0,
              explanation: "365 days * 24 hrs * 60 mins = 525,600 minutes. Downtime = 525,600 * 0.0001 = 52.56 minutes per year.",
              type: "mcq",
            },
          ],
        },
        {
          id: "cld-sec-2",
          name: "VPC, BGP & IAM MCQ",
          questionsCount: 30,
          durationMins: 30,
          questions: [
            {
              id: "cld-q-2",
              question: "In Kubernetes, what controller ensures that exactly one replica of a Pod runs on every matching cluster node?",
              options: ["DaemonSet", "StatefulSet", "Deployment", "ReplicaSet"],
              correctIndex: 0,
              explanation: "A DaemonSet ensures that all (or some) nodes run a copy of a Pod, ideal for log collectors and monitoring agents.",
              type: "mcq",
            },
          ],
        },
        {
          id: "cld-sec-3",
          name: "Terraform & Multi-Cloud HCL",
          questionsCount: 3,
          durationMins: 45,
          questions: [
            {
              id: "cld-q-3",
              question: "Configure an Auto Scaling Group policy that scales based on average CPU utilization target tracking.",
              options: ["Use aws_autoscaling_policy with TargetTrackingScaling", "Use cron schedule trigger", "Use simple step scaling", "Disable scale-in cooldown"],
              correctIndex: 0,
              explanation: "Target tracking scaling dynamically adjusts instance count to maintain target metric (e.g. 70% CPU) with minimal flapping.",
              type: "code",
              starterCode: `# TODO: Configure Terraform AWS Auto Scaling policy for TargetTrackingScaling
resource "aws_autoscaling_policy" "cpu_target" {
  name                   = "target-tracking-cpu-70"
  autoscaling_group_name = aws_autoscaling_group.web.name
  # Write your policy configuration here
}
`,
              solutionCode: `resource "aws_autoscaling_policy" "cpu_target" {
  name                   = "target-tracking-cpu-70"
  autoscaling_group_name = aws_autoscaling_group.web.name
  policy_type            = "TargetTrackingScaling"
  target_tracking_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ASGAverageCPUUtilization"
    }
    target_value = 70.0
  }
}
`,
            },
          ],
        },
      ],
    },
    interview: {
      rounds: [
        {
          id: "cld-tech",
          name: "Technical Architecture Interview",
          durationMins: 20,
          description: "Evaluating zero-trust security postures, disaster recovery, active-active multi-region replication, and Kubernetes mesh.",
          firstQuestion: "Welcome to your Cloud Architect interview. Let's design an active-active multi-region database setup between us-east-1 and eu-west-1. How do you handle write conflicts and replication latency?",
          questions: [
            "How do you handle write conflicts and replication latency in active-active multi-region databases?",
            "What is your approach to designing a zero-trust network topology using Service Meshes and Mutual TLS?",
            "How do you architect a Kubernetes cluster to handle sudden 10x traffic spikes without cascading pod eviction?",
          ],
        },
        {
          id: "cld-hr",
          name: "HR Interview",
          durationMins: 10,
          description: "Leadership evaluation, cloud cost optimization negotiation with finance, and architectural compliance.",
          firstQuestion: "How do you communicate complex architectural trade-offs to non-technical executive leaders, especially when proposing expensive resilience investments?",
          questions: [
            "How do you communicate complex architectural trade-offs to non-technical executive leaders, especially when proposing expensive resilience investments?",
            "Can you tell me about a time you optimized cloud infrastructure costs while preserving system reliability?",
          ],
        },
      ],
    },
  },
];

