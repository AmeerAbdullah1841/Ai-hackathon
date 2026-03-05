"use client";

import { MCQChallenge, type MCQQuestion } from "../components/MCQChallenge";

const QUESTIONS: MCQQuestion[] = [
  {
    question: "AI bias can occur when:",
    options: ["The model is too fast", "Training data reflects unfair or skewed real-world patterns", "We use too little data", "The model has few parameters"],
    correctIndex: 1,
  },
  {
    question: "Why is fairness important in AI?",
    options: ["To make models slower", "To ensure systems do not discriminate unfairly against groups", "To reduce accuracy", "To avoid using data"],
    correctIndex: 1,
  },
  {
    question: "Responsible AI typically includes:",
    options: ["Ignoring user privacy", "Transparency, accountability, and minimizing harm", "Hiding how the model works completely", "Using only one type of data"],
    correctIndex: 1,
  },
  {
    question: "What can help reduce bias in AI systems?",
    options: ["Using only one demographic in data", "Diverse and representative training data and regular audits", "Avoiding evaluation", "Using the smallest dataset possible"],
    correctIndex: 1,
  },
  {
    question: "Ethical AI considerations include:",
    options: ["Only speed and cost", "Privacy, fairness, transparency, and societal impact", "Only accuracy", "Only the number of layers"],
    correctIndex: 1,
  },
];

export default function AIMCQ9Page() {
  return (
    <MCQChallenge
      challengeTitle="MCQ: Ethics in AI"
      difficulty="EASY"
      points={100}
      questions={QUESTIONS}
      subtitle="MCQ · Beginner"
    />
  );
}
