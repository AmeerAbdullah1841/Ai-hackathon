"use client";

import { MCQChallenge, type MCQQuestion } from "../components/MCQChallenge";

const QUESTIONS: MCQQuestion[] = [
  {
    question: "Classification predicts:",
    options: ["A continuous value (e.g., price)", "A category or class label", "The best hyperparameters", "Training time"],
    correctIndex: 1,
  },
  {
    question: "Regression predicts:",
    options: ["A category (e.g., spam/not spam)", "A continuous value (e.g., temperature)", "Which features to remove", "Number of layers"],
    correctIndex: 1,
  },
  {
    question: "Predicting whether an email is spam or not is a:",
    options: ["Regression problem", "Classification problem", "Clustering problem", "Reinforcement problem"],
    correctIndex: 1,
  },
  {
    question: "Which algorithm is commonly used for regression?",
    options: ["K-Nearest Neighbors (for classification)", "Linear Regression", "K-Means", "Decision Tree (classification only)"],
    correctIndex: 1,
  },
  {
    question: "Binary classification has how many possible output classes?",
    options: ["One", "Two", "Three or more", "Unlimited"],
    correctIndex: 1,
  },
];

export default function AIMCQ6Page() {
  return (
    <MCQChallenge
      challengeTitle="MCQ: Classification vs Regression"
      difficulty="EASY"
      points={100}
      questions={QUESTIONS}
      subtitle="MCQ · Beginner"
    />
  );
}
