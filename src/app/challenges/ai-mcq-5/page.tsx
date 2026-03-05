"use client";

import { MCQChallenge, type MCQQuestion } from "../components/MCQChallenge";

const QUESTIONS: MCQQuestion[] = [
  {
    question: "NumPy is primarily used for:",
    options: ["Web development", "Numerical computing and array operations", "Database management", "Game development"],
    correctIndex: 1,
  },
  {
    question: "Pandas is commonly used for:",
    options: ["Building neural networks", "Data manipulation and analysis (tables, CSV)", "Writing operating systems", "Graphics rendering"],
    correctIndex: 1,
  },
  {
    question: "Which library provides ready-to-use ML algorithms like linear regression and decision trees?",
    options: ["NumPy", "Pandas", "scikit-learn", "TensorFlow only"],
    correctIndex: 2,
  },
  {
    question: "In Python ML, a 'DataFrame' is typically from:",
    options: ["NumPy", "Pandas", "scikit-learn", "Python built-in"],
    correctIndex: 1,
  },
  {
    question: "Which function is often used to load a CSV file in Pandas?",
    options: ["read_json()", "read_csv()", "load_csv()", "open_csv()"],
    correctIndex: 1,
  },
];

export default function AIMCQ5Page() {
  return (
    <MCQChallenge
      challengeTitle="MCQ: Python & AI Libraries"
      difficulty="EASY"
      points={100}
      questions={QUESTIONS}
      subtitle="MCQ · Beginner"
    />
  );
}
