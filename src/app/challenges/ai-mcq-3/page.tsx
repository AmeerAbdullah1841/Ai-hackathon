"use client";

import { MCQChallenge, type MCQQuestion } from "../components/MCQChallenge";

const QUESTIONS: MCQQuestion[] = [
  {
    question: "What is a neuron in a neural network?",
    options: ["A type of database", "A basic unit that receives inputs and produces an output", "A programming language", "A cloud service"],
    correctIndex: 1,
  },
  {
    question: "Which activation function outputs values between 0 and 1?",
    options: ["ReLU", "Sigmoid", "Linear", "Tanh (in negative range)"],
    correctIndex: 1,
  },
  {
    question: "The 'input layer' in a neural network:",
    options: ["Produces the final prediction", "Receives the raw features of the data", "Stores the weights", "Runs the backward pass"],
    correctIndex: 1,
  },
  {
    question: "What are 'weights' in a neural network?",
    options: ["The number of layers", "Parameters that are learned during training", "The size of the dataset", "The learning rate only"],
    correctIndex: 1,
  },
  {
    question: "A 'hidden layer' is:",
    options: ["Visible to the user", "A layer between input and output that processes data", "The same as the output layer", "Used only in unsupervised learning"],
    correctIndex: 1,
  },
];

export default function AIMCQ3Page() {
  return (
    <MCQChallenge
      challengeTitle="MCQ: Neural Networks Basics"
      difficulty="EASY"
      points={100}
      questions={QUESTIONS}
      subtitle="MCQ · Beginner"
    />
  );
}
