"use client";

import { MCQChallenge, type MCQQuestion } from "../components/MCQChallenge";

const QUESTIONS: MCQQuestion[] = [
  {
    question: "In supervised learning, the model learns from:",
    options: ["Unlabeled data only", "Labeled input-output pairs", "Trial and error only", "Predefined rules only"],
    correctIndex: 1,
  },
  {
    question: "Clustering is typically associated with:",
    options: ["Supervised learning", "Unsupervised learning", "Reinforcement learning", "Deep learning only"],
    correctIndex: 1,
  },
  {
    question: "Which task is a regression problem?",
    options: ["Classifying emails as spam or not", "Predicting house prices", "Grouping customers", "Identifying objects in images"],
    correctIndex: 1,
  },
  {
    question: "What is a 'label' in machine learning?",
    options: ["The name of the dataset", "The correct output we want the model to predict", "A type of algorithm", "A hardware component"],
    correctIndex: 1,
  },
  {
    question: "Which algorithm is commonly used for classification?",
    options: ["K-Means", "Linear Regression", "Logistic Regression", "PCA"],
    correctIndex: 2,
  },
];

export default function AIMCQ2Page() {
  return (
    <MCQChallenge
      challengeTitle="MCQ: Machine Learning Introduction"
      difficulty="EASY"
      points={100}
      questions={QUESTIONS}
      subtitle="MCQ · Beginner"
    />
  );
}
