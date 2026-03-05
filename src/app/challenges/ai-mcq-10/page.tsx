"use client";

import { MCQChallenge, type MCQQuestion } from "../components/MCQChallenge";

const QUESTIONS: MCQQuestion[] = [
  {
    question: "Which everyday product often uses AI?",
    options: ["A plain calculator", "Voice assistants (e.g., Siri, Alexa)", "A mechanical watch", "A simple lamp"],
    correctIndex: 1,
  },
  {
    question: "Recommendation systems (e.g., Netflix, YouTube) use AI to:",
    options: ["Store videos only", "Suggest content based on your behavior and preferences", "Delete old content", "Display ads only"],
    correctIndex: 1,
  },
  {
    question: "Facial recognition on smartphones is an example of:",
    options: ["Only hardware", "AI/ML (e.g., face detection and matching)", "Pure database lookup", "No AI involved"],
    correctIndex: 1,
  },
  {
    question: "Spam filters in email use:",
    options: ["Only rule-based logic", "Often ML/AI to classify spam vs non-spam", "No classification", "Manual review only"],
    correctIndex: 1,
  },
  {
    question: "Navigation apps (e.g., Google Maps) use AI for:",
    options: ["Only displaying maps", "Route optimization, traffic prediction, and ETA", "Storing addresses only", "Nothing related to AI"],
    correctIndex: 1,
  },
];

export default function AIMCQ10Page() {
  return (
    <MCQChallenge
      challengeTitle="MCQ: AI in Everyday Life"
      difficulty="EASY"
      points={100}
      questions={QUESTIONS}
      subtitle="MCQ · Beginner"
    />
  );
}
