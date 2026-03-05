"use client";

import { MCQChallenge, type MCQQuestion } from "../components/MCQChallenge";

const QUESTIONS: MCQQuestion[] = [
  {
    question: "CNN stands for:",
    options: ["Central Neural Network", "Convolutional Neural Network", "Conditional Neural Network", "Complex Neural Network"],
    correctIndex: 1,
  },
  {
    question: "CNNs are especially good at:",
    options: ["Text generation only", "Image and spatial data (e.g., object detection)", "Audio only", "Tabular data only"],
    correctIndex: 1,
  },
  {
    question: "Deep learning uses:",
    options: ["Only one hidden layer", "Many layers (deep networks)", "No hidden layers", "Only the output layer"],
    correctIndex: 1,
  },
  {
    question: "Which is a typical application of deep learning?",
    options: ["Sorting a list", "Image recognition and speech recognition", "Simple calculator", "File compression only"],
    correctIndex: 1,
  },
  {
    question: "The 'convolution' operation in a CNN is used to:",
    options: ["Store results", "Extract features (e.g., edges) from input", "Delete data", "Print logs"],
    correctIndex: 1,
  },
];

export default function AIMCQ7Page() {
  return (
    <MCQChallenge
      challengeTitle="MCQ: Deep Learning Introduction"
      difficulty="EASY"
      points={100}
      questions={QUESTIONS}
      subtitle="MCQ · Beginner"
    />
  );
}
