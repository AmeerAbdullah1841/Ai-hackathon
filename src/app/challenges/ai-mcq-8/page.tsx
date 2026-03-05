"use client";

import { MCQChallenge, type MCQQuestion } from "../components/MCQChallenge";

const QUESTIONS: MCQQuestion[] = [
  {
    question: "NLP stands for:",
    options: ["Natural Logic Programming", "Natural Language Processing", "Neural Language Protocol", "Network Learning Process"],
    correctIndex: 1,
  },
  {
    question: "Which of these is an NLP application?",
    options: ["Image compression", "Machine translation (e.g., Google Translate)", "Video editing", "Database indexing"],
    correctIndex: 1,
  },
  {
    question: "Tokenization in NLP means:",
    options: ["Encrypting text", "Splitting text into smaller units (e.g., words or subwords)", "Deleting words", "Translating to another language"],
    correctIndex: 1,
  },
  {
    question: "Sentiment analysis aims to:",
    options: ["Correct grammar", "Determine if text is positive, negative, or neutral", "Summarize only", "Count words"],
    correctIndex: 1,
  },
  {
    question: "Which is a common NLP task?",
    options: ["Image classification", "Text classification, chatbots, and translation", "Regression on numbers only", "Clustering images only"],
    correctIndex: 1,
  },
];

export default function AIMCQ8Page() {
  return (
    <MCQChallenge
      challengeTitle="MCQ: Natural Language Processing Basics"
      difficulty="EASY"
      points={100}
      questions={QUESTIONS}
      subtitle="MCQ · Beginner"
    />
  );
}
