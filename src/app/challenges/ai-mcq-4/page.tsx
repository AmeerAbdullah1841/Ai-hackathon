"use client";

import { MCQChallenge, type MCQQuestion } from "../components/MCQChallenge";

const QUESTIONS: MCQQuestion[] = [
  {
    question: "Why do we split data into training and test sets?",
    options: ["To make training faster", "To evaluate how well the model generalizes to new data", "To reduce dataset size", "To avoid using labels"],
    correctIndex: 1,
  },
  {
    question: "Overfitting occurs when:",
    options: ["The model is too simple", "The model memorizes training data and performs poorly on new data", "We use too much data", "The learning rate is too low"],
    correctIndex: 1,
  },
  {
    question: "A typical train/test split ratio is:",
    options: ["50/50", "80/20 or 70/30", "10/90", "100/0"],
    correctIndex: 1,
  },
  {
    question: "What is 'data preprocessing'?",
    options: ["Deleting the dataset", "Cleaning and transforming raw data before training", "Training the model", "Deploying the model"],
    correctIndex: 1,
  },
  {
    question: "Missing values in a dataset can be handled by:",
    options: ["Ignoring the entire dataset", "Imputation (e.g., mean/median) or removing rows", "Always filling with zero", "Never handling them"],
    correctIndex: 1,
  },
];

export default function AIMCQ4Page() {
  return (
    <MCQChallenge
      challengeTitle="MCQ: Data & Training Basics"
      difficulty="EASY"
      points={100}
      questions={QUESTIONS}
      subtitle="MCQ · Beginner"
    />
  );
}
