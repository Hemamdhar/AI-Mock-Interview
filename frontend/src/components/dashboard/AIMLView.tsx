"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Brain,
  Cpu,
  Sparkles,
  Layers,
  CheckCircle2,
  Circle,
  Play,
  ExternalLink,
  BookOpen,
  FileText,
  Search,
  Filter,
  ArrowRight,
  RotateCcw,
  Clock,
  Compass,
  X,
  Code2,
  Terminal,
  ChevronRight,
  Lightbulb,
} from "lucide-react";
import { recordProgressToggle, fetchBackendProgress } from "@/lib/progress";
import { useTheme } from "@/context/ThemeContext";

export type AIMLPathId = "ml_foundations" | "deep_learning" | "generative_ai";

export interface AIMLResource {
  title: string;
  type: "Article" | "Paper" | "Tool" | "Guide" | "Book";
  description: string;
  url: string;
}

export interface AIMLTopicLevel {
  id: string;
  pathId: AIMLPathId;
  levelNumber: number;
  title: string;
  shortTitle: string;
  tag: "FOUNDATION" | "CORE" | "ADVANCED" | "SPECIALIZED";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedMinutes: number;
  description: string;
  x: number; // 0..100 percentage
  y: number; // pixels on canvas
  youtubeVideoId: string;
  videoTitle: string;
  videoChannel: string;
  videoDuration: string;
  keyTakeaways: string[];
  resources: AIMLResource[];
  theoreticalFormulation: {
    mathNote: string;
    keyEquation?: string;
    codeSnippet?: string;
  };
}

export interface AIMLPathMeta {
  id: AIMLPathId;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  levels: AIMLTopicLevel[];
}

// -------------------------------------------------------------
// 1. ML Foundations Levels (10 Topics)
// -------------------------------------------------------------
const ML_FOUNDATIONS_LEVELS: AIMLTopicLevel[] = [
  {
    id: "ml_1",
    pathId: "ml_foundations",
    levelNumber: 1,
    title: "Linear Regression & Cost Functions",
    shortTitle: "Linear Regression",
    tag: "FOUNDATION",
    difficulty: "Beginner",
    estimatedMinutes: 45,
    description:
      "Ordinary Least Squares (OLS), Mean Squared Error (MSE), residual sum of squares, the closed-form Normal Equation, and convex loss surfaces.",
    x: 50,
    y: 80,
    youtubeVideoId: "zPG4NjIkCjc",
    videoTitle: "An Introduction to Linear Regression Analysis",
    videoChannel: "StatQuest with Josh Starmer",
    videoDuration: "26:30",
    keyTakeaways: [
      "Ordinary Least Squares: Fits a linear hypothesis line h_theta(x) by minimizing the sum of squared vertical residuals.",
      "MSE Loss Function: J(theta) = (1/2m) * sum((h_theta(x) - y)^2). Its quadratic form guarantees a global minimum without local optima.",
      "Normal Equation: theta = (X^T * X)^(-1) * X^T * y computes optimal weights directly in O(N^3) time without iterative stepping.",
      "Feature Scaling: Standardization (zero mean, unit variance) is essential for uniform contour gradients during iterative optimization.",
    ],
    resources: [
      {
        title: "Scikit-Learn: Linear Models Guide",
        type: "Guide",
        description: "Official scikit-learn documentation covering Ordinary Least Squares and mathematical formulation.",
        url: "https://scikit-learn.org/stable/modules/linear_model.html#ordinary-least-squares",
      },
      {
        title: "Stanford CS229: Supervised Learning & Regression",
        type: "Article",
        description: "Andrew Ng's lecture notes on OLS, probabilistic interpretations, and maximum likelihood equivalence.",
        url: "https://cs229.stanford.edu/notes2022fall/main_notes.pdf",
      },
      {
        title: "Interactive Loss Surface 3D Explorer",
        type: "Tool",
        description: "Visual exploration of convex parabolic MSE error surfaces and residual vectors.",
        url: "https://losslandscape.com/explorer",
      },
    ],
    theoreticalFormulation: {
      mathNote: "Minimizing Residual Sum of Squares (RSS) under Gaussian error distribution assumption corresponds to Maximum Likelihood Estimation.",
      keyEquation: "J(\\theta) = \\frac{1}{2m} \\sum_{i=1}^m \\left(h_\\theta(x^{(i)}) - y^{(i)}\\right)^2 \\quad \\Longrightarrow \\quad \\theta^* = (X^T X)^{-1} X^T y",
      codeSnippet: `import numpy as np

# Closed-form Ordinary Least Squares solution
def normal_equation(X: np.ndarray, y: np.ndarray) -> np.ndarray:
    # Add bias column (x_0 = 1)
    X_bias = np.c_[np.ones((X.shape[0], 1)), X]
    # Compute theta = (X^T X)^(-1) X^T y
    return np.linalg.pinv(X_bias.T @ X_bias) @ X_bias.T @ y`,
    },
  },
  {
    id: "ml_2",
    pathId: "ml_foundations",
    levelNumber: 2,
    title: "Gradient Descent & Optimization",
    shortTitle: "Gradient Descent",
    tag: "FOUNDATION",
    difficulty: "Beginner",
    estimatedMinutes: 50,
    description:
      "First-order iterative optimization, learning rate selection, divergence vs stagnation, Batch vs Mini-batch vs Stochastic Gradient Descent (SGD).",
    x: 78,
    y: 240,
    youtubeVideoId: "sDv4f4s2SB8",
    videoTitle: "Gradient Descent, Step-by-Step",
    videoChannel: "StatQuest with Josh Starmer",
    videoDuration: "23:54",
    keyTakeaways: [
      "Gradient Vector: Direction of steepest ascent in parameter space; updating in the negative direction guarantees descent on convex surfaces.",
      "Learning Rate (alpha): Too high causes oscillatory divergence; too low results in slow convergence or entrapment on flat plateaus.",
      "Batch vs Mini-batch vs SGD: Batch computes exact gradient over m samples; SGD uses 1 sample (noisy but fast); Mini-batch (32-256) balances vectorization and stability.",
      "Momentum: Accumulates an exponentially decaying moving average of past gradients to dampen oscillations across ravine walls.",
    ],
    resources: [
      {
        title: "An Overview of Gradient Descent Optimization Algorithms",
        type: "Article",
        description: "Sebastian Ruder's canonical survey on SGD, Momentum, Nesterov, AdaGrad, RMSProp, and Adam.",
        url: "https://ruder.io/optimizing-gradient-descent/",
      },
      {
        title: "Distill.pub: Why Momentum Really Works",
        type: "Article",
        description: "Interactive visual essay dissecting the physics and polynomials of momentum acceleration.",
        url: "https://distill.pub/2017/momentum/",
      },
    ],
    theoreticalFormulation: {
      mathNote: "Parameter update rule using learning rate alpha and gradient of the empirical risk objective function.",
      keyEquation: "\\theta_{t+1} = \\theta_t - \\alpha \\nabla_\\theta J(\\theta_t) = \\theta_t - \\frac{\\alpha}{m} \\sum_{i=1}^m \\left(h_\\theta(x^{(i)}) - y^{(i)}\\right) x^{(i)}",
      codeSnippet: `def mini_batch_gradient_descent(X, y, lr=0.01, epochs=100, batch_size=32):
    m, n = X.shape
    theta = np.zeros(n)
    for _ in range(epochs):
        indices = np.random.permutation(m)
        for i in range(0, m, batch_size):
            batch_idx = indices[i:i + batch_size]
            xi, yi = X[batch_idx], y[batch_idx]
            grad = (2 / len(batch_idx)) * xi.T @ (xi @ theta - yi)
            theta -= lr * grad
    return theta`,
    },
  },
  {
    id: "ml_3",
    pathId: "ml_foundations",
    levelNumber: 3,
    title: "Logistic Regression & Classification",
    shortTitle: "Logistic Regression",
    tag: "CORE",
    difficulty: "Beginner",
    estimatedMinutes: 55,
    description:
      "Binary classification, the logistic sigmoid mapping, log-odds transformation, Binary Cross-Entropy (Log-Loss), and decision boundary thresholds.",
    x: 50,
    y: 400,
    youtubeVideoId: "yIYKR4sgzI8",
    videoTitle: "StatQuest: Logistic Regression",
    videoChannel: "StatQuest with Josh Starmer",
    videoDuration: "19:48",
    keyTakeaways: [
      "Sigmoid Function: sigma(z) = 1 / (1 + e^(-z)) maps continuous linear outputs (-inf, +inf) to probabilities in (0, 1).",
      "Log-Odds (Logit): ln(p / (1 - p)) = theta^T * x. The hypothesis represents a linear decision hyperplane in feature space.",
      "Binary Cross-Entropy Loss: Penalizes confident incorrect predictions with infinite loss; convex with respect to parameters theta.",
      "Classification Threshold: Default is 0.5; adjusting threshold balances Precision vs Recall depending on false positive cost.",
    ],
    resources: [
      {
        title: "Scikit-Learn: Logistic Regression Guide",
        type: "Guide",
        description: "Solver benchmarks (lbfgs, liblinear, saga) and multi-class One-vs-Rest vs Multinomial strategies.",
        url: "https://scikit-learn.org/stable/modules/linear_model.html#logistic-regression",
      },
      {
        title: "Google ML Crash Course: Logistic Regression",
        type: "Article",
        description: "Interactive lessons on log-loss minimization and probability calibration.",
        url: "https://developers.google.com/machine-learning/crash-course/logistic-regression/calculating-a-probability",
      },
    ],
    theoreticalFormulation: {
      mathNote: "Log-likelihood maximization under Bernoulli trials leads to the Binary Cross-Entropy loss formulation.",
      keyEquation: "J(\\theta) = -\\frac{1}{m} \\sum_{i=1}^m \\left[ y^{(i)} \\ln\\sigma(\\theta^T x^{(i)}) + (1 - y^{(i)}) \\ln(1 - \\sigma(\\theta^T x^{(i)})) \\right]",
      codeSnippet: `def sigmoid(z: np.ndarray) -> np.ndarray:
    return 1.0 / (1.0 + np.exp(-np.clip(z, -500, 500)))

def binary_cross_entropy(y_true, y_pred, eps=1e-15):
    y_pred = np.clip(y_pred, eps, 1 - eps)
    return -np.mean(y_true * np.log(y_pred) + (1 - y_true) * np.log(1 - y_pred))`,
    },
  },
  {
    id: "ml_4",
    pathId: "ml_foundations",
    levelNumber: 4,
    title: "Regularization (L1 Lasso & L2 Ridge)",
    shortTitle: "L1 / L2 Regularization",
    tag: "CORE",
    difficulty: "Intermediate",
    estimatedMinutes: 50,
    description:
      "Overfitting control, bias-variance tradeoff, L1 Lasso sparsity, L2 Ridge weight shrinkage, ElasticNet, and hyperparameter tuning.",
    x: 22,
    y: 560,
    youtubeVideoId: "Q81RR3yKn30",
    videoTitle: "Regularization Part 1: Ridge (L2) Regression",
    videoChannel: "StatQuest with Josh Starmer",
    videoDuration: "16:05",
    keyTakeaways: [
      "Bias-Variance Tradeoff: Regularization intentionally increases training bias slightly to substantially decrease test variance.",
      "L2 Ridge (Weight Shrinkage): Adds lambda * ||theta||_2^2 penalty. Shrinks weights proportionally toward zero but never forces exact zeros.",
      "L1 Lasso (Feature Selection): Adds lambda * ||theta||_1 penalty. Sharp corner geometry forces non-informative feature weights to exactly 0.",
      "ElasticNet: Convex combination of L1 and L2 penalties, ideal when features are highly correlated.",
    ],
    resources: [
      {
        title: "Elements of Statistical Learning: Regularization",
        type: "Book",
        description: "Hastie, Tibshirani & Friedman chapter on shrinkage methods, Lasso geometry, and path algorithms.",
        url: "https://hastie.su.domains/ElemStatLearn/",
      },
      {
        title: "Scikit-Learn: Ridge and Lasso Compared",
        type: "Guide",
        description: "Parameter path comparisons and cross-validation selectors (RidgeCV, LassoCV).",
        url: "https://scikit-learn.org/stable/auto_examples/linear_model/plot_ridge_path.html",
      },
    ],
    theoreticalFormulation: {
      mathNote: "L1 norm produces non-differentiable corners at axes, causing contour intersections to land on exact zero axes.",
      keyEquation: "J_{Ridge}(\\theta) = J(\\theta) + \\lambda \\sum_{j=1}^n \\theta_j^2, \\quad J_{Lasso}(\\theta) = J(\\theta) + \\lambda \\sum_{j=1}^n |\\theta_j|",
    },
  },
  {
    id: "ml_5",
    pathId: "ml_foundations",
    levelNumber: 5,
    title: "Decision Trees & Impurity Metrics",
    shortTitle: "Decision Trees",
    tag: "CORE",
    difficulty: "Intermediate",
    estimatedMinutes: 55,
    description:
      "Greedy recursive splitting, Gini Impurity, Information Gain, Shannon Entropy, CART algorithm, and pre/post-pruning strategies.",
    x: 50,
    y: 720,
    youtubeVideoId: "_L39rN6gz7Y",
    videoTitle: "Decision and Classification Trees, Clearly Explained!!!",
    videoChannel: "StatQuest with Josh Starmer",
    videoDuration: "17:42",
    keyTakeaways: [
      "Greedy Recursive Partitioning: At each node, algorithm evaluates all features and split thresholds to find the maximal impurity reduction.",
      "Gini Impurity: G = 1 - sum(p_i^2). Measures probability of misclassifying a randomly chosen element from the subset.",
      "Entropy & Information Gain: H(S) = -sum(p_i * log2(p_i)). Information gain is the entropy drop before vs after the split.",
      "Pruning: Limiting max_depth, min_samples_split, or applying cost-complexity alpha pruning prevents memorization of noise.",
    ],
    resources: [
      {
        title: "Visual Introduction to Machine Learning: Decision Trees",
        type: "Tool",
        description: "R2D3 interactive visual guide walking through decision boundaries and tree splits.",
        url: "http://www.r2d3.us/visual-intro-to-machine-learning-part-1/",
      },
      {
        title: "Scikit-Learn: Decision Trees Mathematical Formulation",
        type: "Guide",
        description: "Detailed breakdown of the CART splitting cost function and cost-complexity pruning.",
        url: "https://scikit-learn.org/stable/modules/tree.html#mathematical-formulation",
      },
    ],
    theoreticalFormulation: {
      mathNote: "Gini impurity equals 0 when all samples belong to a single class (pure leaf).",
      keyEquation: "\\text{Gini}(S) = 1 - \\sum_{k=1}^K p_k^2, \\quad \\Delta \\text{Gini} = \\text{Gini}(S) - \\sum_{v \\in \\{L, R\\}} \\frac{|S_v|}{|S|} \\text{Gini}(S_v)",
    },
  },
  {
    id: "ml_6",
    pathId: "ml_foundations",
    levelNumber: 6,
    title: "Random Forests & Ensemble Learning",
    shortTitle: "Random Forests",
    tag: "CORE",
    difficulty: "Intermediate",
    estimatedMinutes: 60,
    description:
      "Bagging (Bootstrap Aggregating), random feature subsampling, variance reduction, Out-Of-Bag (OOB) error, and permutation feature importance.",
    x: 78,
    y: 880,
    youtubeVideoId: "J4Wdy0Wc_xQ",
    videoTitle: "StatQuest: Random Forests Part 1 - Building, Using and Evaluating",
    videoChannel: "StatQuest with Josh Starmer",
    videoDuration: "19:45",
    keyTakeaways: [
      "Bootstrap Aggregation (Bagging): Trains B independent trees on random subsets with replacement; averages predictions to slash variance.",
      "Random Subspace Selection: At each split, only sqrt(M) features are evaluated, decorrelating trees and preventing single dominant features.",
      "Out-Of-Bag (OOB) Score: Approximately 36.8% of samples are omitted per bootstrap; evaluating trees on unused samples yields free cross-validation.",
      "Feature Importance: Measured either by total MDI (Mean Decrease Impurity) or permutation importance on holdout validation data.",
    ],
    resources: [
      {
        title: "Leo Breiman: Random Forests (2001)",
        type: "Paper",
        description: "The seminal foundational machine learning paper introducing random forests and convergence proofs.",
        url: "https://www.stat.berkeley.edu/~breiman/randomforest2001.pdf",
      },
      {
        title: "Scikit-Learn: Ensemble Methods Guide",
        type: "Guide",
        description: "Best practices for bagging classifiers, extra trees, and feature importance interpretations.",
        url: "https://scikit-learn.org/stable/modules/ensemble.html#forests-of-randomized-trees",
      },
    ],
    theoreticalFormulation: {
      mathNote: "If B identical trees have individual variance sigma^2 and pairwise correlation rho, ensemble variance equals rho*sigma^2 + ((1-rho)/B)*sigma^2.",
      keyEquation: "\\text{Var}(\\bar{T}) = \\rho \\sigma^2 + \\frac{1 - \\rho}{B} \\sigma^2 \\quad \\xrightarrow{B \\to \\infty} \\quad \\rho \\sigma^2",
    },
  },
  {
    id: "ml_7",
    pathId: "ml_foundations",
    levelNumber: 7,
    title: "Gradient Boosting & XGBoost",
    shortTitle: "Boosting & XGBoost",
    tag: "ADVANCED",
    difficulty: "Advanced",
    estimatedMinutes: 65,
    description:
      "Sequential residual learning, gradient boosting formulation, shrinkage rate, second-order Taylor expansion in XGBoost, and LightGBM histogram binning.",
    x: 50,
    y: 1040,
    youtubeVideoId: "8b1JEDvenQU",
    videoTitle: "XGBoost Part 2 (of 4): Classification",
    videoChannel: "StatQuest with Josh Starmer",
    videoDuration: "25:12",
    keyTakeaways: [
      "Sequential Boosting: Unlike bagging (parallel), boosting builds trees sequentially where each new tree fits the pseudo-residuals of previous trees.",
      "Gradient Boosting as Gradient Descent: Fitting negative loss gradients in function space rather than parameter space.",
      "Second-Order Taylor Approximation: XGBoost optimizes both first-order gradients (g_i) and second-order Hessians (h_i) for faster convergence.",
      "Regularization in Trees: XGBoost penalizes leaf weights (L2 lambda) and leaf count (gamma), preventing runaway tree complexity.",
    ],
    resources: [
      {
        title: "Tianqi Chen & Carlos Guestrin: XGBoost Paper (2016)",
        type: "Paper",
        description: "XGBoost: A Scalable Tree Boosting System, explaining weighted quantile sketch and sparsity-aware splits.",
        url: "https://arxiv.org/abs/1603.02754",
      },
      {
        title: "LightGBM Documentation & Architecture",
        type: "Guide",
        description: "Histogram-based decision tree algorithms and Exclusive Feature Bundling (EFB).",
        url: "https://lightgbm.readthedocs.io/en/latest/Features.html",
      },
    ],
    theoreticalFormulation: {
      mathNote: "XGBoost objective at step t using second-order Taylor expansion of arbitrary differentiable loss function L.",
      keyEquation: "\\mathcal{L}^{(t)} \\approx \\sum_{i=1}^n \\left[ g_i f_t(x_i) + \\frac{1}{2} h_i f_t^2(x_i) \\right] + \\gamma T + \\frac{1}{2} \\lambda \\sum_{j=1}^T w_j^2",
    },
  },
  {
    id: "ml_8",
    pathId: "ml_foundations",
    levelNumber: 8,
    title: "Support Vector Machines (SVM) & Kernel Trick",
    shortTitle: "SVM & Kernels",
    tag: "CORE",
    difficulty: "Intermediate",
    estimatedMinutes: 60,
    description:
      "Maximum margin hyperplanes, support vectors, soft-margin formulation (C parameter), dual problem, and non-linear mapping via RBF kernels.",
    x: 22,
    y: 1200,
    youtubeVideoId: "efR1C6CvhmE",
    videoTitle: "Support Vector Machines Part 1 (of 3): Main Ideas!!!",
    videoChannel: "StatQuest with Josh Starmer",
    videoDuration: "20:32",
    keyTakeaways: [
      "Maximum Margin Separator: Finds the hyperplane that maximizes the geometric distance to the closest data points (support vectors).",
      "Support Vectors: Only the points lying on or inside the margin boundaries determine the final decision boundary; other points have zero influence.",
      "Soft Margin & C Parameter: Large C penalizes misclassifications heavily (narrow margin, risks overfitting); small C allows margin violations (wider margin, higher tolerance).",
      "Kernel Trick: Computes inner products in an infinite-dimensional Hilbert space K(x, z) = exp(-gamma * ||x - z||^2) without explicitly computing coordinates.",
    ],
    resources: [
      {
        title: "Stanford CS229: Support Vector Machines & Kernels",
        type: "Article",
        description: "Functional vs geometric margins, Lagrange duality, KKT conditions, and Mercer's theorem.",
        url: "https://cs229.stanford.edu/notes2022fall/main_notes.pdf#page=42",
      },
      {
        title: "Scikit-Learn: Support Vector Machines Guide",
        type: "Guide",
        description: "LibSVM implementation details, RBF gamma tuning, and Support Vector Regression (SVR).",
        url: "https://scikit-learn.org/stable/modules/svm.html",
      },
    ],
    theoreticalFormulation: {
      mathNote: "The dual formulation depends only on dot products between pairs of input vectors, enabling kernel substitution.",
      keyEquation: "\\max_\\alpha \\sum_{i=1}^m \\alpha_i - \\frac{1}{2} \\sum_{i,j=1}^m \\alpha_i \\alpha_j y^{(i)} y^{(j)} K(x^{(i)}, x^{(j)}) \\quad \\text{s.t. } 0 \\le \\alpha_i \\le C",
    },
  },
  {
    id: "ml_9",
    pathId: "ml_foundations",
    levelNumber: 9,
    title: "Unsupervised Clustering (K-Means & DBSCAN)",
    shortTitle: "K-Means & DBSCAN",
    tag: "CORE",
    difficulty: "Intermediate",
    estimatedMinutes: 50,
    description:
      "Expectation-Maximization clustering, Voronoi partitions, K-Means++ initialization, Elbow method, Silhouette analysis, and density-based DBSCAN.",
    x: 50,
    y: 1360,
    youtubeVideoId: "4b5d3muPQmA",
    videoTitle: "StatQuest: K-means clustering",
    videoChannel: "StatQuest with Josh Starmer",
    videoDuration: "10:57",
    keyTakeaways: [
      "Lloyd's Algorithm (K-Means): Alternates between Assignment step (assign to nearest centroid) and Update step (recalculate centroid means).",
      "K-Means++: Initializes centroids with probability proportional to squared distance from existing centers, guaranteeing O(log k) competitive ratio.",
      "Elbow Method & Silhouette Coefficient: Evaluates intra-cluster compactness vs inter-cluster separation (ranges from -1 to +1).",
      "DBSCAN: Groups points by density (eps radius and min_samples); naturally detects arbitrary non-convex shapes and isolates outlier noise.",
    ],
    resources: [
      {
        title: "VisuAlgo: Interactive Clustering Visualizer",
        type: "Tool",
        description: "Step-by-step interactive animations of K-Means assignment iterations and DBSCAN expansions.",
        url: "https://visualgo.net/en/clustering",
      },
      {
        title: "Scikit-Learn: Clustering Algorithm Comparison",
        type: "Guide",
        description: "Visual matrix comparing K-Means, MiniBatchKMeans, DBSCAN, Agglomerative, and Spectral clustering.",
        url: "https://scikit-learn.org/stable/modules/clustering.html",
      },
    ],
    theoreticalFormulation: {
      mathNote: "K-Means minimizes within-cluster sum of squares (inertia), which is NP-hard in general dimensions.",
      keyEquation: "\\mathcal{J}_{inertia} = \\sum_{k=1}^K \\sum_{x \\in S_k} \\|x - \\mu_k\\|^2, \\quad \\mu_k = \\frac{1}{|S_k|} \\sum_{x \\in S_k} x",
    },
  },
  {
    id: "ml_10",
    pathId: "ml_foundations",
    levelNumber: 10,
    title: "PCA & Model Evaluation Metrics",
    shortTitle: "PCA & Metrics",
    tag: "CORE",
    difficulty: "Intermediate",
    estimatedMinutes: 60,
    description:
      "Dimensionality reduction via Principal Component Analysis, covariance eigen-decomposition, Precision, Recall, F1-Score, ROC-AUC, and Cross-Validation.",
    x: 78,
    y: 1520,
    youtubeVideoId: "FgakZw6K1QQ",
    videoTitle: "StatQuest: Principal Component Analysis (PCA), Step-by-Step",
    videoChannel: "StatQuest with Josh Starmer",
    videoDuration: "21:57",
    keyTakeaways: [
      "PCA Eigen-Decomposition: Projects data along orthogonal axes of maximum variance, corresponding to eigenvectors of the sample covariance matrix.",
      "Explained Variance Ratio: Scree plots determine the optimal subspace dimension preserving 95% of total variance.",
      "Precision vs Recall: Precision = TP / (TP + FP) (minimizes false alarms); Recall = TP / (TP + FN) (minimizes missed detections).",
      "ROC-AUC vs PR-AUC: ROC plots TPR vs FPR across all thresholds; PR-AUC is heavily preferred for severely imbalanced datasets (e.g. fraud detection).",
    ],
    resources: [
      {
        title: "Google ML Crash Course: Classification Metrics",
        type: "Guide",
        description: "Interactive confusion matrices, ROC curves, and precision-recall trade-off analyzers.",
        url: "https://developers.google.com/machine-learning/crash-course/classification/true-false-positive-negative",
      },
      {
        title: "Interactive PCA 3D Projection Demo",
        type: "Tool",
        description: "Visual rotational manipulation of 3D data clouds down onto 2D principal component planes.",
        url: "https://setosa.io/ev/principal-component-analysis/",
      },
    ],
    theoreticalFormulation: {
      mathNote: "The principal components are given by the eigenvectors of the sample covariance matrix Sigma = (1/m) * X^T * X.",
      keyEquation: "\\Sigma v_i = \\lambda_i v_i, \\quad F_1 = 2 \\cdot \\frac{\\text{Precision} \\cdot \\text{Recall}}{\\text{Precision} + \\text{Recall}} = \\frac{2 \\text{TP}}{2 \\text{TP} + \\text{FP} + \\text{FN}}",
    },
  },
];

// -------------------------------------------------------------
// 2. Deep Learning Levels (10 Topics)
// -------------------------------------------------------------
const DEEP_LEARNING_LEVELS: AIMLTopicLevel[] = [
  {
    id: "dl_1",
    pathId: "deep_learning",
    levelNumber: 1,
    title: "Neural Networks & The Perceptron",
    shortTitle: "Perceptrons & MLPs",
    tag: "FOUNDATION",
    difficulty: "Beginner",
    estimatedMinutes: 50,
    description:
      "Biological vs artificial neurons, linear combinations, bias offsets, Multi-Layer Perceptrons (MLPs), matrix multiplications, and Universal Approximation Theorem.",
    x: 50,
    y: 80,
    youtubeVideoId: "aircAruvnKk",
    videoTitle: "But what is a neural network? | Deep learning chapter 1",
    videoChannel: "3Blue1Brown",
    videoDuration: "19:13",
    keyTakeaways: [
      "Artificial Neuron: Computes linear combination z = w^T * x + b and applies a non-linear activation a = sigma(z).",
      "Layer Vectorization: A_next = sigma(W * A_prev + b) computes an entire layer's activations via hardware-accelerated matrix GEMM.",
      "Universal Approximation Theorem: A feedforward neural network with a single hidden layer and non-linear activation can approximate any continuous function on compact subsets of R^n.",
      "Depth vs Width: Deep narrow networks learn hierarchical compositional features with exponentially fewer parameters than shallow wide networks.",
    ],
    resources: [
      {
        title: "Michael Nielsen: Neural Networks and Deep Learning",
        type: "Book",
        description: "Free online textbook walking through the first principles of neural computation and handwritten digit recognition.",
        url: "http://neuralnetworksanddeeplearning.com/chap1.html",
      },
      {
        title: "TensorFlow Playground: Neural Network Sandbox",
        type: "Tool",
        description: "Interactive visual simulator to play with neurons, hidden layers, and non-linear decision surfaces in real time.",
        url: "https://playground.tensorflow.org/",
      },
    ],
    theoreticalFormulation: {
      mathNote: "Feedforward vectorization expresses all neurons in layer l simultaneously as matrix-matrix multiplication.",
      keyEquation: "Z^{[l]} = W^{[l]} A^{[l-1]} + b^{[l]}, \\quad A^{[l]} = g^{[l]}(Z^{[l]})",
      codeSnippet: `import numpy as np

class DenseLayer:
    def __init__(self, in_features: int, out_features: int):
        # He / Kaiming normal initialization
        self.W = np.random.randn(out_features, in_features) * np.sqrt(2.0 / in_features)
        self.b = np.zeros((out_features, 1))

    def forward(self, A_prev: np.ndarray) -> np.ndarray:
        return self.W @ A_prev + self.b`,
    },
  },
  {
    id: "dl_2",
    pathId: "deep_learning",
    levelNumber: 2,
    title: "Activation Functions & Gradient Flow",
    shortTitle: "Activation Functions",
    tag: "CORE",
    difficulty: "Beginner",
    estimatedMinutes: 45,
    description:
      "Why non-linearity is mandatory, vanishing and exploding gradients, Sigmoid, Tanh, ReLU, Leaky ReLU, and modern smooth approximations (GELU, Swish/SiLU).",
    x: 78,
    y: 240,
    youtubeVideoId: "68BZ5f7P94E",
    videoTitle: "Neural Networks Pt. 3: ReLU In Action!!!",
    videoChannel: "StatQuest with Josh Starmer",
    videoDuration: "14:15",
    keyTakeaways: [
      "Without Non-Linearity: A composition of linear layers W_2 * (W_1 * x) collapses mathematically into a single linear transformation W_3 * x.",
      "Vanishing Gradients: Sigmoid and Tanh gradients saturate near 0 for large |z|, choking gradient flow backward through deep layers.",
      "ReLU (Rectified Linear Unit): f(z) = max(0, z) provides constant gradient 1 for z > 0, solving vanishing gradients in deep feedforward nets.",
      "Modern Activations: GELU (Gaussian Error Linear Unit) and Swish (x * sigma(beta * x)) provide smooth, non-monotonic curves utilized in Transformers and LLMs.",
    ],
    resources: [
      {
        title: "Dan Hendrycks: Gaussian Error Linear Units (GELU)",
        type: "Paper",
        description: "Research paper introducing GELU used across BERT, GPT-2, GPT-3, and ViT architectures.",
        url: "https://arxiv.org/abs/1606.08415",
      },
      {
        title: "Distill.pub: Visualizing Activation Spaces",
        type: "Article",
        description: "Visual analysis of how different activation topologies shape representation manifolds.",
        url: "https://distill.pub/2018/building-blocks/",
      },
    ],
    theoreticalFormulation: {
      mathNote: "GELU weights inputs by their probability under standard normal distribution: GELU(x) = x * Phi(x).",
      keyEquation: "\\text{GELU}(x) \\approx 0.5 x \\left(1 + \\tanh\\left(\\sqrt{\\frac{2}{\\pi}} (x + 0.044715 x^3)\\right)\\right)",
    },
  },
  {
    id: "dl_3",
    pathId: "deep_learning",
    levelNumber: 3,
    title: "Backpropagation & Autograd Engines",
    shortTitle: "Backpropagation",
    tag: "CORE",
    difficulty: "Intermediate",
    estimatedMinutes: 65,
    description:
      "Multivariate chain rule of calculus, computational directed acyclic graphs (DAGs), reverse-mode automatic differentiation, and Jacobian-vector products.",
    x: 50,
    y: 400,
    youtubeVideoId: "Ilg3gGewQ5U",
    videoTitle: "Backpropagation, intuitively | Deep Learning Chapter 3",
    videoChannel: "3Blue1Brown",
    videoDuration: "13:53",
    keyTakeaways: [
      "Reverse-Mode Autodiff: Propagates sensitivity dL/da from loss backward to inputs; takes O(1) backward passes regardless of parameter count.",
      "Chain Rule in DAGs: When an activation branches into multiple forward paths, its total gradient is the sum of gradients flowing from each branch.",
      "Memory Footprint: Forward pass must retain intermediate layer activations in GPU VRAM to evaluate gradients during the backward pass.",
      "Gradient Check: Verifying analytical backpropagation against finite numerical differences (f(x+h) - f(x-h)) / 2h verifies autograd correctness.",
    ],
    resources: [
      {
        title: "Andrej Karpathy: Building micrograd",
        type: "Guide",
        description: "A tiny 100-line scalar-valued autograd engine and neural net library implemented from scratch.",
        url: "https://github.com/karpathy/micrograd",
      },
      {
        title: "Yes you should understand backprop",
        type: "Article",
        description: "Karpathy's classic technical essay detailing common backpropagation gotchas and vectorized Jacobian products.",
        url: "https://karpathy.medium.com/yes-you-should-understand-backprop-e2f06eab49c6",
      },
    ],
    theoreticalFormulation: {
      mathNote: "Backward recurrence relation for layer l activations and parameter gradients.",
      keyEquation: "\\delta^{[l]} = \\left( (W^{[l+1]})^T \\delta^{[l+1]} \\right) \\odot g'^{[l]}(Z^{[l]}), \\quad \\frac{\\partial \\mathcal{L}}{\\partial W^{[l]}} = \\delta^{[l]} (A^{[l-1]})^T",
    },
  },
  {
    id: "dl_4",
    pathId: "deep_learning",
    levelNumber: 4,
    title: "Neural Network Optimizers (SGD, Adam, AdamW)",
    shortTitle: "Optimizers & AdamW",
    tag: "CORE",
    difficulty: "Intermediate",
    estimatedMinutes: 55,
    description:
      "Stochastic Gradient Descent with Momentum, Nesterov acceleration, RMSprop, Adam (1st and 2nd moment estimates), and decoupled weight decay (AdamW).",
    x: 22,
    y: 560,
    youtubeVideoId: "IHZwWFHWa-w",
    videoTitle: "Gradient descent, how neural networks learn | Deep Learning Chapter 2",
    videoChannel: "3Blue1Brown",
    videoDuration: "21:01",
    keyTakeaways: [
      "Momentum: Tracks running velocity v_t = beta * v_{t-1} + (1 - beta) * g_t, accelerating through flat ravines.",
      "RMSprop: Scales gradient inversely by square root of exponential moving average of squared gradients, adapting step size per parameter.",
      "Adam: Combines 1st moment (momentum) and 2nd moment (RMSprop) with bias correction factors for initial zero-bias.",
      "AdamW (Decoupled Weight Decay): Regularizes weights directly via theta_t = theta_{t-1} - lr * lambda * theta_{t-1} rather than through gradient L2 penalty, fixing optimizer distortion.",
    ],
    resources: [
      {
        title: "Loshchilov & Hutter: Decoupled Weight Decay Regularization (AdamW)",
        type: "Paper",
        description: "The seminal paper proving that standard Adam misapplied L2 regularization, introducing AdamW.",
        url: "https://arxiv.org/abs/1711.05101",
      },
      {
        title: "Fast.ai: AdamW and Super-convergence",
        type: "Article",
        description: "Deep dive into weight decay implementation bugs and learning rate scheduling.",
        url: "https://www.fast.ai/posts/2018-07-02-adam-decoupled.html",
      },
    ],
    theoreticalFormulation: {
      mathNote: "AdamW update with bias-corrected first moment m_hat, second moment v_hat, and decoupled weight decay lambda.",
      keyEquation: "\\theta_{t} = \\theta_{t-1} - \\alpha \\left( \\frac{\\hat{m}_t}{\\sqrt{\\hat{v}_t} + \\epsilon} + \\lambda \\theta_{t-1} \\right)",
    },
  },
  {
    id: "dl_5",
    pathId: "deep_learning",
    levelNumber: 5,
    title: "Convolutional Neural Networks (CNNs)",
    shortTitle: "Convolutional Networks",
    tag: "CORE",
    difficulty: "Intermediate",
    estimatedMinutes: 65,
    description:
      "Spatial feature extraction, 2D convolution kernels, stride, padding ('valid' vs 'same'), pooling layers, receptive fields, and residual skip connections (ResNet).",
    x: 50,
    y: 720,
    youtubeVideoId: "KuXjwB4LzSA",
    videoTitle: "But what is a convolution?",
    videoChannel: "3Blue1Brown",
    videoDuration: "23:00",
    keyTakeaways: [
      "Translational Invariance & Parameter Sharing: A small kernel (e.g. 3x3) slides across the entire image; the same weight detects edges anywhere in the visual field.",
      "Output Dimension Formula: Output dimension = floor((Input + 2*Padding - Kernel) / Stride) + 1.",
      "Receptive Field: Deep layers perceive larger contextual patches of the input space via stacked convolutional downsamplings.",
      "ResNet Residual Skip Connections: F(x) + x allows gradients to flow directly through identity shortcuts without vanishing, enabling 100+ layer architectures.",
    ],
    resources: [
      {
        title: "Stanford CS231n: Convolutional Neural Networks for Visual Recognition",
        type: "Guide",
        description: "Andrej Karpathy & Fei-Fei Li's comprehensive course notes on conv layers, pooling, and spatial dimensions.",
        url: "https://cs231n.github.io/convolutional-networks/",
      },
      {
        title: "He et al.: Deep Residual Learning for Image Recognition (ResNet)",
        type: "Paper",
        description: "The classic paper introducing residual learning blocks that won ImageNet 2015.",
        url: "https://arxiv.org/abs/1512.03385",
      },
    ],
    theoreticalFormulation: {
      mathNote: "Discrete 2D cross-correlation between input feature map X and kernel K with bias b.",
      keyEquation: "S(i, j) = (X * K)(i, j) + b = \\sum_{m} \\sum_{n} X(i - m, j - n) K(m, n) + b",
    },
  },
  {
    id: "dl_6",
    pathId: "deep_learning",
    levelNumber: 6,
    title: "Sequence Models & Recurrent Networks (RNN, LSTM, GRU)",
    shortTitle: "RNNs & LSTMs",
    tag: "CORE",
    difficulty: "Intermediate",
    estimatedMinutes: 60,
    description:
      "Autoregressive sequential processing, hidden state recurrence, Backpropagation Through Time (BPTT), vanishing gradients, and gating mechanisms (LSTM & GRU).",
    x: 78,
    y: 880,
    youtubeVideoId: "LHXXI4-IEns",
    videoTitle: "Illustrated Guide to Recurrent Neural Networks: Understanding the Intuition",
    videoChannel: "The A.I. Hacker - Michael Phi",
    videoDuration: "09:32",
    keyTakeaways: [
      "Hidden State Recurrence: h_t = tanh(W_hh * h_{t-1} + W_xh * x_t + b) passes information across arbitrary sequence lengths.",
      "Backpropagation Through Time (BPTT): Gradients multiply by weight matrix W_hh repeatedly; eigenvalues > 1 cause explosions, < 1 cause total vanishing.",
      "LSTM Cell State Highway: Carries long-term gradients via additive linear operations rather than multiplicative matrices.",
      "Gating Mechanisms: Forget gate decides what to discard from cell state; Input gate writes new candidate information; Output gate filters hidden state.",
    ],
    resources: [
      {
        title: "Christopher Olah: Understanding LSTM Networks",
        type: "Article",
        description: "The most widely referenced visual breakdown of LSTM cell state routing and gate operations.",
        url: "https://colah.github.io/posts/2015-08-Understanding-LSTMs/",
      },
      {
        title: "Andrej Karpathy: The Unreasonable Effectiveness of Recurrent Neural Networks",
        type: "Article",
        description: "Inspiring deep dive demonstrating character-level text generation across Shakespeare, Linux source code, and LaTeX.",
        url: "http://karpathy.github.io/2015/05/21/rnn-effectiveness/",
      },
    ],
    theoreticalFormulation: {
      mathNote: "LSTM cell state update combining forget gate f_t, input gate i_t, and candidate state c_tilde_t.",
      keyEquation: "f_t = \\sigma(W_f [h_{t-1}, x_t] + b_f), \\quad C_t = f_t \\odot C_{t-1} + i_t \\odot \\tilde{C}_t, \\quad h_t = o_t \\odot \\tanh(C_t)",
    },
  },
  {
    id: "dl_7",
    pathId: "deep_learning",
    levelNumber: 7,
    title: "Batch Normalization, Layer Normalization & Dropout",
    shortTitle: "Normalization & Dropout",
    tag: "ADVANCED",
    difficulty: "Intermediate",
    estimatedMinutes: 55,
    description:
      "Internal covariate shift debates, batch statistics during train vs test, LayerNorm across feature dimensions, Pre-LN vs Post-LN in Transformers, and inverted Dropout.",
    x: 50,
    y: 1040,
    youtubeVideoId: "dXB-KQYkzNU",
    videoTitle: "Batch Normalization (“batch norm”) explained",
    videoChannel: "deeplizard",
    videoDuration: "14:24",
    keyTakeaways: [
      "Batch Normalization: Normalizes across batch dimension N for each feature channel; tracks exponential running mean/variance for inference time.",
      "Batch Size Dependency: BatchNorm struggles with small batch sizes (e.g. batch=2) and variable sequence lengths in natural language processing.",
      "Layer Normalization: Normalizes across feature dimensions C for each individual sample independently; essential for Transformers and recurrent architectures.",
      "Inverted Dropout: Randomly zeroes activations with probability p during training and scales surviving activations by 1/(1-p) so test-time inference requires no changes.",
    ],
    resources: [
      {
        title: "Ba, Kiros & Hinton: Layer Normalization (2016)",
        type: "Paper",
        description: "The foundational paper proposing LayerNorm for sequential deep learning models.",
        url: "https://arxiv.org/abs/1607.06450",
      },
      {
        title: "Ioffe & Szegedy: Batch Normalization Paper",
        type: "Paper",
        description: "Accelerating Deep Network Training by Reducing Internal Covariate Shift.",
        url: "https://arxiv.org/abs/1502.03167",
      },
    ],
    theoreticalFormulation: {
      mathNote: "LayerNorm normalizes over feature dimension H for each sample independently with learnable affine parameters gamma and beta.",
      keyEquation: "\\hat{x}_i = \\frac{x_i - \\mu_L}{\\sqrt{\\sigma_L^2 + \\epsilon}}, \\quad y_i = \\gamma \\hat{x}_i + \\beta, \\quad \\mu_L = \\frac{1}{H} \\sum_{j=1}^H x_j",
    },
  },
  {
    id: "dl_8",
    pathId: "deep_learning",
    levelNumber: 8,
    title: "Autoencoders & Latent Space Representations",
    shortTitle: "Autoencoders & VAEs",
    tag: "CORE",
    difficulty: "Intermediate",
    estimatedMinutes: 55,
    description:
      "Bottleneck compression, encoder-decoder symmetry, reconstruction MSE loss, Denoising Autoencoders, Variational Autoencoders (VAEs), and the Reparameterization Trick.",
    x: 22,
    y: 1200,
    youtubeVideoId: "7mRfwaGGAPg",
    videoTitle: "Autoencoders - EXPLAINED!",
    videoChannel: "CodeEmporium",
    videoDuration: "12:18",
    keyTakeaways: [
      "Bottleneck Architecture: Encoder maps high-dimensional input x -> low-dimensional latent code z; Decoder reconstructs z -> x_hat.",
      "Self-Supervised Loss: Minimizes ||x - x_hat||^2 without requiring human labels, discovering low-dimensional manifold coordinates.",
      "Denoising Autoencoders: Corrupts input with Gaussian noise or masking; network learns to project corrupted samples back onto the true data manifold.",
      "Variational Autoencoders (VAEs): Constrains latent space to a smooth Gaussian prior N(0, I) via KL divergence, enabling continuous latent interpolation.",
    ],
    resources: [
      {
        title: "Kingma & Welling: Auto-Encoding Variational Bayes (VAE)",
        type: "Paper",
        description: "Seminal paper introducing stochastic variational inference and the reparameterization trick.",
        url: "https://arxiv.org/abs/1312.6114",
      },
      {
        title: "Lilian Weng: From Autoencoder to Beta-VAE",
        type: "Article",
        description: "Rigorous technical mathematical breakdown of VAE derivations and ELBO bounds.",
        url: "https://lilianweng.github.io/posts/2018-08-12-vae/",
      },
    ],
    theoreticalFormulation: {
      mathNote: "Reparameterization trick enables backpropagation through stochastic nodes by decomposing z into deterministic mu, sigma, and standard normal epsilon.",
      keyEquation: "z = \\mu_\\theta(x) + \\sigma_\\theta(x) \\odot \\epsilon, \\quad \\epsilon \\sim \\mathcal{N}(0, I), \\quad \\mathcal{L}_{ELBO} = \\mathbb{E}[\\log p(x|z)] - D_{KL}(q(z|x) \\parallel p(z))",
    },
  },
  {
    id: "dl_9",
    pathId: "deep_learning",
    levelNumber: 9,
    title: "Transfer Learning & Vision Transformers (ViT)",
    shortTitle: "Transfer Learning & ViT",
    tag: "ADVANCED",
    difficulty: "Advanced",
    estimatedMinutes: 60,
    description:
      "Pretrained weight transfer, feature extraction vs full fine-tuning, learning rate warmup, Patch Embedding, and Vision Transformer (ViT) self-attention over image patches.",
    x: 50,
    y: 1360,
    youtubeVideoId: "yofjFQddwHE",
    videoTitle: "Transfer Learning (C3W2L07)",
    videoChannel: "DeepLearning.AI / Andrew Ng",
    videoDuration: "06:15",
    keyTakeaways: [
      "Feature Reuse: Early layers learn universal Gabor filters and textures; transfer learning freezes early layers and fine-tunes task-specific heads.",
      "Fine-Tuning Protocol: Start by training only the new linear classifier head; subsequently unfreeze top backbone layers with 10x smaller learning rate.",
      "Patch Embeddings in ViT: Divides images into 16x16 flattened pixel patches and linearly projects them into token embeddings like words in NLP.",
      "Inductive Bias vs Scale: ConvNets have translation equivariance built into their architecture; ViTs lack inductive bias but dominate when pretrained on massive datasets.",
    ],
    resources: [
      {
        title: "Dosovitskiy et al.: An Image is Worth 16x16 Words (ViT)",
        type: "Paper",
        description: "Seminal Google paper establishing that pure Transformers directly applied to image patches achieve state-of-the-art vision results.",
        url: "https://arxiv.org/abs/2010.11929",
      },
      {
        title: "Hugging Face: Fine-Tuning Vision Models",
        type: "Guide",
        description: "Practical guide to fine-tuning pretrained Hugging Face image classification backbones.",
        url: "https://huggingface.co/docs/transformers/tasks/image_classification",
      },
    ],
    theoreticalFormulation: {
      mathNote: "Linear projection of 2D image patches x_p into dimension D with added learnable 1D position embeddings.",
      keyEquation: "z_0 = [x_{class}; x_p^1 E; x_p^2 E; \\dots; x_p^N E] + E_{pos}, \\quad E \\in \\mathbb{R}^{(P^2 \\cdot C) \\times D}",
    },
  },
  {
    id: "dl_10",
    pathId: "deep_learning",
    levelNumber: 10,
    title: "Training Recipe, Mixed Precision & Debugging",
    shortTitle: "Training Recipe & FP16",
    tag: "SPECIALIZED",
    difficulty: "Advanced",
    estimatedMinutes: 65,
    description:
      "Karpathy's training recipe, overfitting a single batch first, learning rate finders, automatic mixed precision (AMP FP16 / BF16), gradient accumulation, and GPU VRAM profiling.",
    x: 78,
    y: 1520,
    youtubeVideoId: "VMj-3S1tku0",
    videoTitle: "The spelled-out intro to neural networks and backpropagation: building micrograd",
    videoChannel: "Andrej Karpathy",
    videoDuration: "2:25:38",
    keyTakeaways: [
      "Overfit a Single Batch First: Always verify that your model architecture can achieve near-zero training loss on 10 samples before launching cluster training.",
      "Automatic Mixed Precision (AMP): Computes forward and backward passes in 16-bit floats (FP16/BF16) while accumulating master weights in FP32, doubling GPU throughput.",
      "Gradient Accumulation: Simulates effective batch sizes of 1024 on single GPUs by accumulating gradients over multiple micro-batches before calling optimizer.step().",
      "Gradient Clipping: torch.nn.utils.clip_grad_norm_(parameters, max_norm) caps gradient magnitude to prevent catastrophic divergence during loss spikes.",
    ],
    resources: [
      {
        title: "Andrej Karpathy: A Recipe for Training Neural Networks",
        type: "Article",
        description: "The definitive guide on neural net training hygiene, baseline verification, and debugging protocols.",
        url: "http://karpathy.github.io/2019/04/25/recipe/",
      },
      {
        title: "PyTorch Performance Tuning Guide",
        type: "Guide",
        description: "Official guide on torch.compile, AMP, pinned host memory, and PyTorch Profiler usage.",
        url: "https://pytorch.org/tutorials/recipes/recipes/tuning_guide.html",
      },
    ],
    theoreticalFormulation: {
      mathNote: "Gradient norm clipping scales all gradients proportionally if their L2 norm exceeds maximum threshold M.",
      keyEquation: "g \\leftarrow g \\cdot \\min\\left(1, \\frac{M}{\\|g\\|_2}\\right), \\quad \\text{where } \\|g\\|_2 = \\sqrt{\\sum_i g_i^2}",
    },
  },
];

// -------------------------------------------------------------
// 3. Generative AI Levels (10 Topics)
// -------------------------------------------------------------
const GENERATIVE_AI_LEVELS: AIMLTopicLevel[] = [
  {
    id: "genai_1",
    pathId: "generative_ai",
    levelNumber: 1,
    title: "Self-Attention & The Transformer Architecture",
    shortTitle: "Self-Attention",
    tag: "FOUNDATION",
    difficulty: "Intermediate",
    estimatedMinutes: 60,
    description:
      "Vaswani et al. seminal paper, Scaled Dot-Product Attention, Query-Key-Value projection matrices, quadratic attention complexity O(N^2), and Softmax scaling.",
    x: 50,
    y: 80,
    youtubeVideoId: "eMlx5fFNoYc",
    videoTitle: "Attention in transformers, step-by-step | Deep Learning Chapter 6",
    videoChannel: "3Blue1Brown",
    videoDuration: "25:40",
    keyTakeaways: [
      "Query, Key, Value Projections: Query vector Q asks 'what am I looking for?', Key vector K answers 'what do I contain?', Value vector V stores 'what content do I broadcast?'.",
      "Scaled Dot-Product: Q * K^T computes raw affinity scores; dividing by sqrt(d_k) prevents dot products from growing large and saturating softmax gradients.",
      "Softmax Normalization: Rows sum to 1, producing dynamic probability attention weights that weight the Value vectors.",
      "Quadratic Complexity: For sequence length N, calculating attention matrix QK^T requires O(N^2 * d) operations, motivating FlashAttention and KV caching.",
    ],
    resources: [
      {
        title: "Vaswani et al.: Attention Is All You Need (2017)",
        type: "Paper",
        description: "The seminal research paper that launched modern Generative AI and transformer language modeling.",
        url: "https://arxiv.org/abs/1706.03762",
      },
      {
        title: "Lilian Weng: Attention? Attention!",
        type: "Article",
        description: "Comprehensive historical overview of attention mechanisms from Bahdanau seq2seq to self-attention.",
        url: "https://lilianweng.github.io/posts/2018-06-24-attention/",
      },
      {
        title: "The Illustrated Transformer",
        type: "Article",
        description: "Jay Alammar's visual guide breaking down Query, Key, and Value matrix transformations.",
        url: "https://jalammar.github.io/illustrated-transformer/",
      },
    ],
    theoreticalFormulation: {
      mathNote: "Scaled dot-product attention formula computing weighted contextual values across all tokens.",
      keyEquation: "\\text{Attention}(Q, K, V) = \\text{softmax}\\left( \\frac{Q K^T}{\\sqrt{d_k}} \\right) V",
      codeSnippet: `import torch
import torch.nn.functional as F

def scaled_dot_product_attention(Q, K, V, mask=None):
    d_k = Q.size(-1)
    scores = torch.matmul(Q, K.transpose(-2, -1)) / (d_k ** 0.5)
    if mask is not None:
        scores = scores.masked_fill(mask == 0, -1e9)
    weights = F.softmax(scores, dim=-1)
    return torch.matmul(weights, V), weights`,
    },
  },
  {
    id: "genai_2",
    pathId: "generative_ai",
    levelNumber: 2,
    title: "Multi-Head Attention & Positional Encodings",
    shortTitle: "Multi-Head & RoPE",
    tag: "CORE",
    difficulty: "Intermediate",
    estimatedMinutes: 65,
    description:
      "Parallel attention subspaces (Multi-Head Attention), sinusoidal positional encodings, Rotary Position Embeddings (RoPE), ALiBi, and causal triangular attention masks.",
    x: 78,
    y: 240,
    youtubeVideoId: "ISNdQcPhsts",
    videoTitle: "Coding a Transformer from scratch on PyTorch, with full explanation, training and inference.",
    videoChannel: "Umar Jamil",
    videoDuration: "2:11:45",
    keyTakeaways: [
      "Multi-Head Attention: Divides d_model into h heads of dimension d_k; allows the model to jointly attend to information from different representation subspaces.",
      "Permutation Invariance: Pure self-attention treats tokens as an unordered set; positional encodings inject necessary sequence ordering information.",
      "Rotary Position Embeddings (RoPE): Encodes relative token distance by rotating Query and Key vectors in the 2D complex plane; utilized in LLaMA, Mistral, and Claude.",
      "Causal Masking: In decoder architectures, upper-triangular masking ensures token t cannot peek at future tokens t+1, preserving autoregressive causality.",
    ],
    resources: [
      {
        title: "Su et al.: RoFormer: Enhanced Transformer with Rotary Position Embedding",
        type: "Paper",
        description: "The mathematical derivation of RoPE and its relative distance decaying properties.",
        url: "https://arxiv.org/abs/2104.09864",
      },
      {
        title: "Umar Jamil: Transformer Scratch Implementation",
        type: "Guide",
        description: "Complete PyTorch code repository implementing every tensor shape transition and causal mask.",
        url: "https://github.com/hkproj/pytorch-transformer",
      },
    ],
    theoreticalFormulation: {
      mathNote: "Multi-Head Attention concatenates h heads and multiplies by output projection matrix W^O.",
      keyEquation: "\\text{MHA}(Q, K, V) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h) W^O, \\quad \\text{head}_i = \\text{Attention}(Q W_i^Q, K W_i^K, V W_i^V)",
    },
  },
  {
    id: "genai_3",
    pathId: "generative_ai",
    levelNumber: 3,
    title: "Autoregressive Decoder Models (GPT Architecture)",
    shortTitle: "Decoder LLMs & GPT",
    tag: "CORE",
    difficulty: "Intermediate",
    estimatedMinutes: 70,
    description:
      "Decoder-only architecture, next-token cross-entropy objective, language model pretraining scaling laws, and the KV Cache during autoregressive generation.",
    x: 50,
    y: 400,
    youtubeVideoId: "kCc8FmEb1nY",
    videoTitle: "Let's build GPT: from scratch, in code, spelled out.",
    videoChannel: "Andrej Karpathy",
    videoDuration: "1:56:22",
    keyTakeaways: [
      "Next-Token Prediction: Maximizes log-probability sum(log P(w_t | w_1, ..., w_{t-1})). High-capacity models memorize facts and acquire emergent reasoning.",
      "Decoder-Only Dominance: Standard encoder-decoder models (like T5) are largely replaced in frontier LLMs by unified autoregressive decoders (GPT, LLaMA).",
      "KV Cache Mechanism: During inference, previously computed Key and Value tensors for historical tokens are stored in GPU VRAM, turning generation from O(N^2) to O(N).",
      "Chinchilla Scaling Laws: Optimal training requires compute, parameters, and tokens to be scaled in equal proportion (approx 20 tokens per parameter).",
    ],
    resources: [
      {
        title: "Radford et al.: Language Models are Unsupervised Multitask Learners (GPT-2)",
        type: "Paper",
        description: "OpenAI's seminal paper demonstrating zero-shot task transfer from pure causal next-token pretraining.",
        url: "https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf",
      },
      {
        title: "KV Cache Visual Guide & Memory Math",
        type: "Article",
        description: "Calculating exact GPU memory consumption for KV cache across context window sizes.",
        url: "https://kipp.ly/transformer-inference-hallmarks/",
      },
    ],
    theoreticalFormulation: {
      mathNote: "Autoregressive generation decomposes joint probability over sequence into product of conditional probabilities.",
      keyEquation: "P(w_1, w_2, \\dots, w_T) = \\prod_{t=1}^T P(w_t \\mid w_1, \\dots, w_{t-1})",
    },
  },
  {
    id: "genai_4",
    pathId: "generative_ai",
    levelNumber: 4,
    title: "Tokenization & Byte Pair Encoding (BPE)",
    shortTitle: "Tokenization & BPE",
    tag: "FOUNDATION",
    difficulty: "Beginner",
    estimatedMinutes: 50,
    description:
      "Word vs character vs subword tokenization, the Byte Pair Encoding (BPE) merge algorithm, SentencePiece, tiktoken, and tokenizer edge cases.",
    x: 22,
    y: 560,
    youtubeVideoId: "HEikzVL-lZU",
    videoTitle: "Byte Pair Encoding Tokenization",
    videoChannel: "StatQuest with Josh Starmer",
    videoDuration: "15:42",
    keyTakeaways: [
      "Subword Tokenization: Solves out-of-vocabulary (OOV) tokens by splitting rare words into known subword fragments (e.g. 'un' + 'pre' + 'dictable').",
      "BPE Algorithm: Iteratively counts adjacent token pairs in corpus and replaces the most frequent pair with a newly created merged token ID.",
      "Byte-Level BPE: GPT tokenizers operate on raw UTF-8 bytes rather than unicode characters, guaranteeing zero out-of-vocabulary tokens for any language.",
      "Tokenizer Peculiarities: Explains why LLMs historically struggled with trailing spaces, reverse spelling, and simple arithmetic counting.",
    ],
    resources: [
      {
        title: "Hugging Face: Summary of Tokenizers",
        type: "Guide",
        description: "Comparison of BPE, WordPiece (BERT), and Unigram (SentencePiece) subword algorithms.",
        url: "https://huggingface.co/docs/transformers/tokenizer_summary",
      },
      {
        title: "tiktoken: Fast BPE Tokenizer by OpenAI",
        type: "Tool",
        description: "Official high-performance Rust/Python byte pair encoding library used for OpenAI models.",
        url: "https://github.com/openai/tiktoken",
      },
    ],
    theoreticalFormulation: {
      mathNote: "BPE starts with vocabulary equal to all individual bytes (256) and performs K greedy merge steps based on corpus co-occurrence frequencies.",
      keyEquation: "V_{t+1} = V_t \\cup \\{\\text{argmax}_{(u, v)} \\text{Freq}(u, v)\\}",
    },
  },
  {
    id: "genai_5",
    pathId: "generative_ai",
    levelNumber: 5,
    title: "Inference Decoding & Sampling Strategies",
    shortTitle: "Sampling & Decoding",
    tag: "CORE",
    difficulty: "Intermediate",
    estimatedMinutes: 55,
    description:
      "Greedy search, Beam search, Temperature scaling, Top-K filtering, Top-P (Nucleus) sampling, repetition penalties, and speculative decoding.",
    x: 50,
    y: 720,
    youtubeVideoId: "zjkBMFhNj_g",
    videoTitle: "[1hr Talk] Intro to Large Language Models",
    videoChannel: "Andrej Karpathy",
    videoDuration: "1:00:27",
    keyTakeaways: [
      "Temperature Scaling: P(w_i) = exp(z_i / T) / sum(exp(z_j / T)). High T flattens distribution (more creative); low T sharpens peaks (deterministic).",
      "Top-K Sampling: Truncates candidate pool to the K highest probability tokens; removes unpredictable tail tokens entirely.",
      "Top-P (Nucleus) Sampling: Selects the smallest dynamic set of tokens whose cumulative probability exceeds threshold P (e.g. P = 0.9), adjusting pool size dynamically based on confidence.",
      "Speculative Decoding: Uses a lightweight draft model to generate K tokens quickly, verified in parallel in one forward pass by the primary LLM.",
    ],
    resources: [
      {
        title: "Hugging Face: How to Generate Text with Language Models",
        type: "Guide",
        description: "Patrick von Platen's guide walking through greedy, beam, temperature, and top-p generation with code.",
        url: "https://huggingface.co/blog/how-to-generate",
      },
      {
        title: "Holtzman et al.: The Curious Case of Neural Text Degeneration (Top-P)",
        type: "Paper",
        description: "The seminal paper establishing nucleus sampling over greedy beam search.",
        url: "https://arxiv.org/abs/1904.09751",
      },
    ],
    theoreticalFormulation: {
      mathNote: "Nucleus Top-P chooses subset V^(p) of vocabulary such that cumulative mass equals p.",
      keyEquation: "\\sum_{w \\in V^{(p)}} P(w \\mid w_{1:t-1}) \\ge p, \\quad P'(w) = \\frac{P(w)}{\\sum_{v \\in V^{(p)}} P(v)}",
    },
  },
  {
    id: "genai_6",
    pathId: "generative_ai",
    levelNumber: 6,
    title: "Parameter-Efficient Fine-Tuning (LoRA & QLoRA)",
    shortTitle: "LoRA & QLoRA",
    tag: "ADVANCED",
    difficulty: "Advanced",
    estimatedMinutes: 65,
    description:
      "Full fine-tuning costs, Low-Rank Adaptation (LoRA), matrix rank decomposition W = W0 + (alpha/r)*BA, 4-bit NormalFloat quantization (QLoRA), and PEFT frameworks.",
    x: 78,
    y: 880,
    youtubeVideoId: "dA-NhCtrrVE",
    videoTitle: "Low-rank Adaption of Large Language Models: Explaining the Key Concepts Behind LoRA",
    videoChannel: "Umar Jamil",
    videoDuration: "19:20",
    keyTakeaways: [
      "Intrinsic Rank Hypothesis: Parameter updates Delta W during task adaptation reside on a low-dimensional manifold of intrinsic rank r << d.",
      "Matrix Factorization: Instead of tuning d x k weights, LoRA freezes W_0 and trains B (d x r) and A (r x k) where r is typically 8 to 64.",
      "Zero Inference Latency: At deployment, Delta W = (alpha/r) * B * A is directly folded into frozen base weights W_0: W_final = W_0 + Delta W.",
      "QLoRA: Quantizes base weights to 4-bit NormalFloat (NF4) with double quantization, enabling fine-tuning a 70B parameter model on a single 48GB GPU.",
    ],
    resources: [
      {
        title: "Hu et al.: LoRA: Low-Rank Adaptation of Large Language Models",
        type: "Paper",
        description: "Microsoft's landmark paper introducing parameter-efficient low-rank adaptation.",
        url: "https://arxiv.org/abs/2106.09685",
      },
      {
        title: "Dettmers et al.: QLoRA: Efficient Finetuning of Quantized LLMs",
        type: "Paper",
        description: "Introducing 4-bit NormalFloat, double quantization, and paged optimizers.",
        url: "https://arxiv.org/abs/2305.14314",
      },
    ],
    theoreticalFormulation: {
      mathNote: "A is initialized with Gaussian noise N(0, sigma^2) and B is initialized to 0, ensuring Delta W = 0 at the start of training.",
      keyEquation: "h = W_0 x + \\Delta W x = W_0 x + \\frac{\\alpha}{r} B A x, \\quad B \\in \\mathbb{R}^{d \\times r}, \\quad A \\in \\mathbb{R}^{r \\times k}",
    },
  },
  {
    id: "genai_7",
    pathId: "generative_ai",
    levelNumber: 7,
    title: "Retrieval-Augmented Generation (RAG) & Vector DBs",
    shortTitle: "RAG & Vector DBs",
    tag: "ADVANCED",
    difficulty: "Intermediate",
    estimatedMinutes: 65,
    description:
      "Mitigating hallucinations, dense embedding models, chunking strategies (semantic, recursive), cosine similarity, vector indexing (HNSW, IVFFlat), and cross-encoder re-ranking.",
    x: 50,
    y: 1040,
    youtubeVideoId: "T-D1OfcDW1M",
    videoTitle: "What is Retrieval-Augmented Generation (RAG)?",
    videoChannel: "IBM Technology",
    videoDuration: "06:17",
    keyTakeaways: [
      "Parametric vs Non-Parametric Memory: LLM weights store static knowledge; RAG dynamically retrieves authoritative external documents into the prompt context.",
      "Chunking Protocols: Fixed-size chunking with overlaps (e.g. 512 tokens with 50-token overlap) or AST-aware recursive text splitting preserves semantic coherence.",
      "Vector Indexing (HNSW): Hierarchical Navigable Small World graphs provide sub-linear O(log N) approximate nearest neighbor vector searches.",
      "Two-Stage Retrieval: Stage 1 uses bi-encoder vector similarity to retrieve top-100 candidates; Stage 2 uses cross-encoder re-rankers to select top-5 most relevant chunks.",
    ],
    resources: [
      {
        title: "Lewis et al.: Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
        type: "Paper",
        description: "The foundational Meta AI paper coining and establishing the RAG architecture.",
        url: "https://arxiv.org/abs/2005.11401",
      },
      {
        title: "Pinecone: Comprehensive Vector Indexing & HNSW Guide",
        type: "Guide",
        description: "Deep technical guide on approximate nearest neighbors, graph structures, and vector quantizations.",
        url: "https://www.pinecone.io/learn/series/faiss/vector-indexes/",
      },
    ],
    theoreticalFormulation: {
      mathNote: "Cosine similarity measures angular alignment between query embedding q and document chunk embedding d.",
      keyEquation: "\\text{Sim}(q, d) = \\frac{q \\cdot d}{\\|q\\|_2 \\|d\\|_2} = \\frac{\\sum_{i=1}^D q_i d_i}{\\sqrt{\\sum_{i=1}^D q_i^2} \\sqrt{\\sum_{i=1}^D d_i^2}}",
    },
  },
  {
    id: "genai_8",
    pathId: "generative_ai",
    levelNumber: 8,
    title: "Preference Alignment (RLHF & DPO)",
    shortTitle: "Alignment: RLHF & DPO",
    tag: "ADVANCED",
    difficulty: "Advanced",
    estimatedMinutes: 65,
    description:
      "Supervised Fine-Tuning (SFT), Reward Model training, PPO with KL penalties, and Direct Preference Optimization (DPO closed-form loss).",
    x: 22,
    y: 1200,
    youtubeVideoId: "sal78ACtGTc",
    videoTitle: "What's next for AI agentic workflows ft. Andrew Ng of AI Fund",
    videoChannel: "Sequoia Capital",
    videoDuration: "35:45",
    keyTakeaways: [
      "Three-Stage RLHF Pipeline: 1. Supervised Fine-Tuning (SFT), 2. Pairwise Reward Model (Bradley-Terry preference model), 3. PPO policy gradient optimization.",
      "KL-Divergence Penalty: D_KL(pi_theta || pi_ref) prevents the fine-tuned policy from drifting too far from base model distributions or gaming reward hacking.",
      "Direct Preference Optimization (DPO): Mathematically proves the optimal reward can be extracted directly from policy probabilities without training an explicit reward model.",
      "DPO Stability: Replaces complex multi-model actor-critic PPO reinforcement learning with a standard binary cross-entropy loss over token log-probabilities.",
    ],
    resources: [
      {
        title: "Rafailov et al.: Direct Preference Optimization (DPO)",
        type: "Paper",
        description: "Stanford paper demonstrating preference alignment without reinforcement learning.",
        url: "https://arxiv.org/abs/2305.18290",
      },
      {
        title: "Lilian Weng: Illustrative Notes on RLHF",
        type: "Article",
        description: "Technical mathematical breakdown of reward modeling, PPO updates, and reward hacking mitigations.",
        url: "https://lilianweng.github.io/posts/2021-01-02-controllable-text-generation/",
      },
    ],
    theoreticalFormulation: {
      mathNote: "DPO objective directly optimizing policy pi_theta over preferred y_w and dispreferred y_l completions given reference policy pi_ref.",
      keyEquation: "\\mathcal{L}_{DPO}(\\pi_\\theta; \\pi_{ref}) = -\\mathbb{E}_{(x, y_w, y_l)} \\left[ \\log \\sigma \\left( \\beta \\log \\frac{\\pi_\\theta(y_w \\mid x)}{\\pi_{ref}(y_w \\mid x)} - \\beta \\log \\frac{\\pi_\\theta(y_l \\mid x)}{\\pi_{ref}(y_l \\mid x)} \\right) \\right]",
    },
  },
  {
    id: "genai_9",
    pathId: "generative_ai",
    levelNumber: 9,
    title: "Diffusion Models & Generative Image Synthesis",
    shortTitle: "Diffusion Models",
    tag: "SPECIALIZED",
    difficulty: "Advanced",
    estimatedMinutes: 65,
    description:
      "Forward Markov noising process q(x_t|x_{t-1}), reverse denoising p_theta(x_{t-1}|x_t), U-Net noise predictor epsilon_theta, Classifier-Free Guidance (CFG), and Latent Diffusion.",
    x: 50,
    y: 1360,
    youtubeVideoId: "HoKDTa5jHvg",
    videoTitle: "Diffusion Models | Paper Explanation | Math Explained",
    videoChannel: "Umar Jamil",
    videoDuration: "36:12",
    keyTakeaways: [
      "Forward Process: Gradually injects Gaussian noise across T timesteps until the image becomes pure isotropic noise N(0, I); requires zero learnable parameters.",
      "Reverse Denoising: A neural network (typically U-Net with cross-attention) learns to predict the exact noise epsilon_t added at timestep t.",
      "Classifier-Free Guidance (CFG): Combines conditional and unconditional noise predictions with guidance scale w > 1: epsilon_guided = epsilon_uncond + w * (epsilon_cond - epsilon_uncond).",
      "Latent Diffusion (Stable Diffusion): Runs the diffusion process in the compressed latent space of a pretrained VAE, reducing compute requirements by 64x.",
    ],
    resources: [
      {
        title: "Ho et al.: Denoising Diffusion Probabilistic Models (DDPM)",
        type: "Paper",
        description: "The seminal 2020 paper demonstrating that diffusion models match and surpass GANs in sample quality.",
        url: "https://arxiv.org/abs/2006.11239",
      },
      {
        title: "Rombach et al.: High-Resolution Image Synthesis with Latent Diffusion Models",
        type: "Paper",
        description: "The foundation of Stable Diffusion, operating in autoencoder latent space.",
        url: "https://arxiv.org/abs/2112.10752",
      },
    ],
    theoreticalFormulation: {
      mathNote: "Simplified DDPM training objective minimizing L2 distance between true Gaussian noise and U-Net predicted noise.",
      keyEquation: "L_{simple}(\\theta) = \\mathbb{E}_{t, x_0, \\epsilon} \\left[ \\| \\epsilon - \\epsilon_\\theta(\\sqrt{\\bar{\\alpha}_t} x_0 + \\sqrt{1 - \\bar{\\alpha}_t} \\epsilon, t) \\|^2 \\right]",
    },
  },
  {
    id: "genai_10",
    pathId: "generative_ai",
    levelNumber: 10,
    title: "Agentic AI Architectures & Tool Use",
    shortTitle: "Agentic AI & Tools",
    tag: "SPECIALIZED",
    difficulty: "Advanced",
    estimatedMinutes: 70,
    description:
      "ReAct pattern (Reason + Act), structured tool calling (JSON Schema), function calling, reflection and self-correction loops, memory architectures, and multi-agent coordination.",
    x: 78,
    y: 1520,
    youtubeVideoId: "sal78ACtGTc",
    videoTitle: "What's next for AI agentic workflows ft. Andrew Ng of AI Fund",
    videoChannel: "Sequoia Capital",
    videoDuration: "35:45",
    keyTakeaways: [
      "ReAct Pattern: Interleaves Thought, Action, and Observation cycles. The agent reasons about sub-goals before executing external APIs.",
      "Tool Calling Protocols: Model outputs valid JSON conforming to predefined JSON Schema parameters; runtime executes the function and injects the return value.",
      "Reflection & Verification: An agent executes code or drafts a solution, inspects runtime error output, and autonomously iterates to fix errors before finalizing.",
      "Multi-Agent Orchestration: Decomposes complex tasks into specialized personas (Researcher, Coder, Critic, Reviewer) connected via hierarchical state graphs.",
    ],
    resources: [
      {
        title: "Yao et al.: ReAct: Synergizing Reasoning and Acting in Language Models",
        type: "Paper",
        description: "Princeton and Google Research paper introducing thought-action-observation interleaving.",
        url: "https://arxiv.org/abs/2210.03629",
      },
      {
        title: "Andrew Ng: Agentic Design Patterns",
        type: "Article",
        description: "Overview of reflection, tool use, planning, and multi-agent collaboration patterns.",
        url: "https://www.deeplearning.ai/the-batch/how-agents-can-improve-llm-performance/",
      },
    ],
    theoreticalFormulation: {
      mathNote: "Agent state transition function incorporating history of thoughts, actions, environment observations, and termination condition.",
      keyEquation: "s_{t+1} = \\mathcal{T}(s_t, a_t, o_t), \\quad a_t \\sim \\pi_\\theta(a \\mid s_t), \\quad o_t = \\text{Env}(a_t)",
    },
  },
];

export const AIML_PATHS: AIMLPathMeta[] = [
  {
    id: "ml_foundations",
    title: "Machine Learning Foundations",
    shortTitle: "ML Foundations",
    tagline: "Statistical Learning & Classical Algorithms",
    description:
      "Linear and logistic regression, convex optimization, regularization, decision trees, ensemble bagging & boosting, support vector machines, and dimensionality reduction.",
    icon: Brain,
    levels: ML_FOUNDATIONS_LEVELS,
  },
  {
    id: "deep_learning",
    title: "Deep Learning Architectures",
    shortTitle: "Deep Learning",
    tagline: "Neural Networks, Backpropagation & Representations",
    description:
      "Perceptrons, autograd computational graphs, adaptive optimizers (AdamW), convolutional networks, recurrent sequence models, batch/layer normalization, and training recipes.",
    icon: Cpu,
    levels: DEEP_LEARNING_LEVELS,
  },
  {
    id: "generative_ai",
    title: "Generative AI & LLMs",
    shortTitle: "Generative AI",
    tagline: "Transformers, Alignment, RAG & Agentic Systems",
    description:
      "Self-attention mechanisms, decoder-only LLMs, tokenization, inference sampling, PEFT (LoRA/QLoRA), vector search RAG, preference alignment (DPO/RLHF), diffusion models, and AI agents.",
    icon: Sparkles,
    levels: GENERATIVE_AI_LEVELS,
  },
];

const STORAGE_KEY_AIML_COMPLETED = "interviewai_aiml_completed_topics";

export const AIMLView: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Selected path tab
  const [activePathId, setActivePathId] = useState<AIMLPathId>("ml_foundations");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<AIMLTopicLevel | null>(null);
  const [modalTab, setModalTab] = useState<"video" | "resources">("video");
  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

  // Load completed topics from localStorage & sync from backend
  useEffect(() => {
    setMounted(true);
    let localCompleted: Record<string, boolean> = {};
    try {
      const stored = localStorage.getItem(STORAGE_KEY_AIML_COMPLETED);
      if (stored) {
        localCompleted = JSON.parse(stored);
        setCompletedTopics(localCompleted);
      }
    } catch {
      // Fallback
    }

    // Sync from FastAPI PostgreSQL backend
    fetchBackendProgress().then((summary) => {
      if (summary && summary.aiml) {
        setCompletedTopics((prev) => {
          const merged = { ...prev };
          summary.aiml.forEach((id) => {
            merged[id] = true;
          });
          try {
            localStorage.setItem(STORAGE_KEY_AIML_COMPLETED, JSON.stringify(merged));
          } catch {
            // Fallback
          }
          return merged;
        });
      }
    });
  }, []);

  // Save completed topics to localStorage and persist to backend
  const toggleTopicCompletion = (levelId: string) => {
    const isCurrentlyDone = !!completedTopics[levelId];
    const nextDoneState = !isCurrentlyDone;

    setCompletedTopics((prev) => {
      const updated = { ...prev, [levelId]: nextDoneState };
      try {
        localStorage.setItem(STORAGE_KEY_AIML_COMPLETED, JSON.stringify(updated));
      } catch {
        // Fallback
      }
      return updated;
    });

    // Find topic metadata across paths
    const matchedLevel = AIML_PATHS.flatMap((p) => p.levels).find((lvl) => lvl.id === levelId);
    recordProgressToggle(
      "aiml",
      levelId,
      nextDoneState,
      matchedLevel?.title || `AI/ML Topic ${levelId}`,
      matchedLevel?.difficulty || "Intermediate"
    );
  };

  const activePath = useMemo(() => {
    return AIML_PATHS.find((p) => p.id === activePathId) || AIML_PATHS[0];
  }, [activePathId]);

  // Filtered levels based on search query
  const filteredLevels = useMemo(() => {
    if (!searchQuery.trim()) return activePath.levels;
    const q = searchQuery.toLowerCase();
    return activePath.levels.filter(
      (lvl) =>
        lvl.title.toLowerCase().includes(q) ||
        lvl.description.toLowerCase().includes(q) ||
        lvl.keyTakeaways.some((k) => k.toLowerCase().includes(q))
    );
  }, [activePath, searchQuery]);

  // Statistics for current path
  const pathStats = useMemo(() => {
    const total = activePath.levels.length;
    const completed = activePath.levels.filter((lvl) => completedTopics[lvl.id]).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  }, [activePath, completedTopics]);

  // Overall Statistics across all 3 paths
  const overallStats = useMemo(() => {
    let total = 0;
    let completed = 0;
    AIML_PATHS.forEach((p) => {
      total += p.levels.length;
      completed += p.levels.filter((lvl) => completedTopics[lvl.id]).length;
    });
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  }, [completedTopics]);

  // SVG connection path calculation for winding track
  const svgPathData = useMemo(() => {
    const points = activePath.levels.map((lvl) => ({
      x: (lvl.x / 100) * 800,
      y: lvl.y,
    }));

    if (points.length === 0) return "";
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const cx1 = p1.x;
      const cy1 = (p1.y + p2.y) / 2;
      const cx2 = p2.x;
      const cy2 = (p1.y + p2.y) / 2;
      d += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p2.x} ${p2.y}`;
    }
    return d;
  }, [activePath]);

  return (
    <div className="space-y-6">
      {/* 1. Header & Overview Banner */}
      <div className="p-5 sm:p-6 rounded-lg bg-[#111115] border border-zinc-800 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-[10px] font-mono uppercase tracking-wider text-zinc-300 border border-zinc-700/60">
                Core Curricula
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-950/40 text-emerald-300 border border-emerald-900/40 text-[10px] font-mono">
                {overallStats.completed}/{overallStats.total} Overall Completed ({overallStats.percentage}%)
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Brain className="w-5 h-5 text-zinc-300" />
              <span>AI / ML Technical Mastery</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
              Curated, concept-first engineering progression covering Classical Machine Learning, Deep Neural Networks, and Generative AI Architectures with verified lecture materials, mathematical formulations, and research articles.
            </p>
          </div>

          {/* Quick Path Completion Summary Cards */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {AIML_PATHS.map((path) => {
              const count = path.levels.filter((l) => completedTopics[l.id]).length;
              const isSelected = activePathId === path.id;
              return (
                <button
                  key={path.id}
                  type="button"
                  onClick={() => {
                    setActivePathId(path.id);
                    setSearchQuery("");
                  }}
                  className={`p-2.5 sm:p-3 rounded-lg border text-left transition-all ${
                    isSelected
                      ? "bg-zinc-800 border-zinc-700 shadow-xs"
                      : "bg-[#0e0e12] border-zinc-800/80 hover:border-zinc-700/60"
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-300">
                    <path.icon className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="hidden sm:inline">{path.shortTitle}</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="font-mono text-xs sm:text-sm font-semibold text-white">
                      {count}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-500">
                      /{path.levels.length}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Path Switcher Segmented Control */}
        <div className="pt-2 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-[#0e0e12] p-1 rounded-lg border border-zinc-800 overflow-x-auto">
            {AIML_PATHS.map((path) => {
              const Icon = path.icon;
              const isActive = activePathId === path.id;
              const doneCount = path.levels.filter((l) => completedTopics[l.id]).length;
              return (
                <button
                  key={path.id}
                  type="button"
                  onClick={() => {
                    setActivePathId(path.id);
                    setSearchQuery("");
                  }}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-zinc-800 text-white border border-zinc-700/60 shadow-xs"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{path.title}</span>
                  <span
                    className={`ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded-sm ${
                      doneCount === path.levels.length
                        ? "bg-emerald-950/60 text-emerald-300 border border-emerald-900/60"
                        : "bg-zinc-900 text-zinc-400"
                    }`}
                  >
                    {doneCount}/{path.levels.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box within Active Path */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={`Search in ${activePath.shortTitle}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0e0e12] border border-zinc-800 rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Path Metadata Banner */}
        <div className="p-3 rounded-md bg-[#0e0e12] border border-zinc-850 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <activePath.icon className="w-4 h-4 text-zinc-400 shrink-0" />
            <span className="text-white font-medium">{activePath.tagline}:</span>
            <span className="text-zinc-400">{activePath.description}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0 text-zinc-400 font-mono text-[11px]">
            <span>{pathStats.completed} of {pathStats.total} Completed ({pathStats.percentage}%)</span>
            <div className="w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${pathStats.percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Roadmap Canvas (SVG Winding Railway) */}
      <div className="relative w-full min-h-[1700px] rounded-lg bg-[#09090b] border border-zinc-800 overflow-hidden shadow-2xl">
        {/* Dark Grid Background Texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Start Station Header Flag */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1 rounded-md bg-[#111115] border border-zinc-800 text-[11px] font-mono text-zinc-400">
          <Compass className="w-3.5 h-3.5 text-zinc-400" />
          <span>{activePath.title.toUpperCase()} MILESTONES</span>
        </div>

        {/* SVG Railway Track Rails */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 800 1680"
          preserveAspectRatio="none"
        >
          {/* Base Track Rail Glow */}
          <path
            d={svgPathData}
            fill="none"
            className="roadmap-track-rail"
            stroke={isLight ? "#e2e8f0" : "#1c1917"}
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Dashed Center Guide Line */}
          <path
            d={svgPathData}
            fill="none"
            className="roadmap-track-dots"
            stroke={isLight ? "#475569" : "#27272a"}
            strokeWidth="2.5"
            strokeDasharray="6 6"
            strokeLinecap="round"
          />
        </svg>

        {/* Interactive Milestones */}
        <div className="relative z-10 w-full h-[1680px]">
          {filteredLevels.map((level) => {
            const isCompleted = !!completedTopics[level.id];
            const isSelected = selectedLevel?.id === level.id;

            return (
              <div
                key={level.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer transition-transform duration-200 hover:scale-105"
                style={{
                  left: `${level.x}%`,
                  top: `${level.y}px`,
                }}
                onClick={() => {
                  setSelectedLevel(level);
                  setModalTab("video");
                }}
              >
                {/* Node Milestone Circle */}
                <div
                  className={`relative flex items-center justify-center w-14 h-14 rounded-full border-2 transition-all duration-200 ${
                    isCompleted
                      ? "bg-zinc-950 border-emerald-500 shadow-md shadow-emerald-950/40"
                      : isSelected
                      ? "bg-zinc-900 border-zinc-300 ring-2 ring-zinc-500/40"
                      : "bg-[#111115] border-zinc-700 hover:border-zinc-400 hover:bg-zinc-900"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <span className="font-mono font-bold text-sm text-zinc-100">
                      {level.levelNumber}
                    </span>
                  )}

                  {/* Play Indicator on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                  </div>
                </div>

                {/* Milestone Label */}
                <div className="mt-2.5 flex flex-col items-center text-center max-w-[200px] pointer-events-none">
                  <span className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors">
                    {level.shortTitle}
                  </span>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-sm bg-zinc-800 text-zinc-400 border border-zinc-750">
                      {level.tag}
                    </span>
                    {isCompleted ? (
                      <span className="text-[10px] font-mono text-emerald-400 font-medium">
                        Done
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {level.estimatedMinutes}m
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Level Detail Modal Drawer */}
      {selectedLevel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={() => setSelectedLevel(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-[#111115] border border-zinc-800 rounded-lg shadow-2xl overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-zinc-800 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-[10px] font-mono font-medium text-zinc-300 border border-zinc-700/60">
                    Level {selectedLevel.levelNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-[10px] font-mono text-zinc-400 border border-zinc-700/60">
                    {activePath.shortTitle}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-zinc-800/80 text-[10px] font-mono text-zinc-400">
                    {selectedLevel.difficulty}
                  </span>
                  <span className="text-xs text-zinc-500 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {selectedLevel.estimatedMinutes} mins
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {selectedLevel.title}
                </h2>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {selectedLevel.description}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Header Mark as Done Quick Toggle */}
                <button
                  type="button"
                  onClick={() => toggleTopicCompletion(selectedLevel.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                    completedTopics[selectedLevel.id]
                      ? "bg-emerald-950/50 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/50"
                      : "bg-zinc-800 text-zinc-200 border-zinc-700/80 hover:bg-zinc-750 hover:text-white"
                  }`}
                >
                  <CheckCircle2
                    className={`w-3.5 h-3.5 ${
                      completedTopics[selectedLevel.id] ? "text-emerald-400" : "text-zinc-400"
                    }`}
                  />
                  <span>
                    {completedTopics[selectedLevel.id] ? "Marked as Done" : "Mark as Done"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedLevel(null)}
                  className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Tabs: Concept Video vs Study Resources */}
            <div className="px-5 border-b border-zinc-800 flex items-center gap-4 text-xs font-medium bg-[#0e0e12]">
              <button
                type="button"
                onClick={() => setModalTab("video")}
                className={`py-3 flex items-center gap-2 border-b-2 transition-colors ${
                  modalTab === "video"
                    ? "border-white text-white font-semibold"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                <span>Concept Video</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab("resources")}
                className={`py-3 flex items-center gap-2 border-b-2 transition-colors ${
                  modalTab === "resources"
                    ? "border-white text-white font-semibold"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Study Resources & Articles ({selectedLevel.resources.length})</span>
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-5 max-h-[60vh] overflow-y-auto space-y-5 custom-scrollbar text-xs">
              {/* TAB 1: Concept Video */}
              {modalTab === "video" && (
                <div className="space-y-4">
                  {/* YouTube Player Embed */}
                  <div className="relative w-full aspect-video rounded-md overflow-hidden bg-black border border-zinc-800 shadow-md">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${selectedLevel.youtubeVideoId}?rel=0`}
                      title={selectedLevel.videoTitle}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full border-0"
                    />
                  </div>

                  {/* Video Metadata Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-md bg-[#0e0e12] border border-zinc-850">
                    <div>
                      <h4 className="text-xs font-semibold text-white">
                        {selectedLevel.videoTitle}
                      </h4>
                      <p className="text-[11px] text-zinc-400">
                        Channel: {selectedLevel.videoChannel} | Duration: {selectedLevel.videoDuration}
                      </p>
                    </div>

                    <a
                      href={`https://www.youtube.com/watch?v=${selectedLevel.youtubeVideoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-zinc-300 hover:text-white hover:underline shrink-0 font-medium"
                    >
                      <span>Watch on YouTube</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Key Takeaways */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Key Takeaways & Conceptual Mechanics</span>
                    </h4>
                    <div className="space-y-2">
                      {selectedLevel.keyTakeaways.map((takeaway, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-md bg-[#0e0e12] border border-zinc-850 flex items-start gap-2.5 text-zinc-300"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-1.5 shrink-0" />
                          <p className="leading-relaxed text-xs">{takeaway}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Theoretical Formulation (Formula Note) */}
                  {selectedLevel.theoreticalFormulation && (
                    <div className="p-3.5 rounded-md bg-[#0a0a0d] border border-zinc-800 space-y-2">
                      <span className="text-[11px] font-mono text-zinc-400 font-semibold uppercase tracking-wider block">
                        Mathematical & Theoretical Invariant
                      </span>
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        {selectedLevel.theoreticalFormulation.mathNote}
                      </p>
                      {selectedLevel.theoreticalFormulation.keyEquation && (
                        <div className="p-2.5 rounded bg-zinc-950 font-mono text-xs text-zinc-200 border border-zinc-850 overflow-x-auto">
                          {selectedLevel.theoreticalFormulation.keyEquation}
                        </div>
                      )}
                      {selectedLevel.theoreticalFormulation.codeSnippet && (
                        <div className="mt-2">
                          <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">
                            Reference Implementation:
                          </span>
                          <pre className="p-3 rounded bg-zinc-950 text-zinc-300 font-mono text-[11px] leading-relaxed border border-zinc-850 overflow-x-auto">
                            <code>{selectedLevel.theoreticalFormulation.codeSnippet}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: Study Resources & Articles */}
              {modalTab === "resources" && (
                <div className="space-y-3">
                  <p className="text-xs text-zinc-400">
                    High-impact research articles, interactive visualizations, and foundational papers to cement your understanding:
                  </p>

                  <div className="space-y-2.5">
                    {selectedLevel.resources.map((resource, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-md bg-[#0e0e12] border border-zinc-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-zinc-700 transition-colors"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono uppercase bg-zinc-800 text-zinc-300 border border-zinc-700/60">
                              {resource.type}
                            </span>
                            <h4 className="text-xs font-semibold text-white truncate">
                              {resource.title}
                            </h4>
                          </div>
                          <p className="text-[11px] text-zinc-400 leading-relaxed">
                            {resource.description}
                          </p>
                        </div>

                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-750 text-zinc-200 hover:text-white border border-zinc-700 text-xs font-medium shrink-0 transition-colors"
                        >
                          <span>Open Resource</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>

                  {/* Summary Study Note */}
                  <div className="p-3.5 rounded-md bg-zinc-950 border border-zinc-850 space-y-1.5 text-xs text-zinc-300">
                    <div className="flex items-center gap-1.5 font-medium text-white">
                      <FileText className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Study Recommendation</span>
                    </div>
                    <p className="text-zinc-400 leading-relaxed">
                      Review the conceptual video first to internalize the geometric intuition and algorithms. Then read the curated articles and verify the mathematical invariants before marking this milestone as completed.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Action Bar */}
            <div className="p-4 border-t border-zinc-800 bg-[#0e0e12] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 font-mono">
                  Topic Status:
                </span>
                {completedTopics[selectedLevel.id] ? (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Completed
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-zinc-500 font-medium">
                    <Circle className="w-3.5 h-3.5" />
                    Pending
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleTopicCompletion(selectedLevel.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-medium border transition-colors ${
                    completedTopics[selectedLevel.id]
                      ? "bg-emerald-950/60 text-emerald-300 border-emerald-800/80 hover:bg-emerald-900/60"
                      : "bg-white text-zinc-950 border-white hover:bg-zinc-200"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {completedTopics[selectedLevel.id] ? "Marked as Done ✓" : "Mark as Done"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedLevel(null)}
                  className="px-3 py-2 rounded-md bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white border border-zinc-700 text-xs font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
