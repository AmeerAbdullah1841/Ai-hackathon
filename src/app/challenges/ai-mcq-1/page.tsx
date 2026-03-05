"use client";

import { MCQChallenge, type MCQQuestion } from "../components/MCQChallenge";

const QUESTIONS: MCQQuestion[] = [
  {
    question: "What does AI stand for?",
    options: ["Automated Intelligence", "Artificial Intelligence", "Advanced Integration", "Algorithmic Inference"],
    correctIndex: 1,
  },
  {
    question: "Which type of learning uses labeled data to train a model?",
    options: ["Unsupervised Learning", "Supervised Learning", "Reinforcement Learning", "Semi-supervised Learning"],
    correctIndex: 1,
  },
  {
    question: "Machine learning is a subset of which field?",
    options: ["Database Management", "Artificial Intelligence", "Networking", "Operating Systems"],
    correctIndex: 1,
  },
  {
    question: "Which of these is an example of narrow (weak) AI?",
    options: ["A system that can do any human task", "A chess-playing program", "General problem solver", "Human-level reasoning"],
    correctIndex: 1,
  },
  {
    question: "What is the main goal of machine learning?",
    options: ["To store large amounts of data", "To enable systems to learn from data and improve", "To replace all human jobs", "To build faster computers"],
    correctIndex: 1,
  },
];

export default function AIMCQ1Page() {
  return (
    <MCQChallenge
      challengeTitle="MCQ: AI Basics & Types of Learning"
      difficulty="EASY"
      points={100}
      questions={QUESTIONS}
      subtitle="MCQ · Beginner"
    />
  );
}
