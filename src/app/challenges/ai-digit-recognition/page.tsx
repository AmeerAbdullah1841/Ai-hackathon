"use client";

import { useState } from "react";
import { ChallengeLayout } from "../components/ChallengeLayout";

export default function AIDigitRecognitionPage() {
  const [selectedDigit, setSelectedDigit] = useState<number | null>(null);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);

  // Sample digits for demonstration (in real challenge, would use actual MNIST data)
  const sampleDigits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  const handleDigitSelect = (digit: number) => {
    setSelectedDigit(digit);
    // Simulate model prediction (in real implementation, would use trained model)
    // For demo: predict correctly 90% of the time
    const correctPrediction = Math.random() > 0.1;
    setPrediction(correctPrediction ? digit : (digit + 1) % 10);
    setAccuracy(correctPrediction ? 95.5 : 85.2);
  };

  const handleSubmit = () => {
    if (!prediction) {
      alert("Please test the model first by selecting a digit");
      return;
    }
    alert("Digit recognition model submitted! Great work on building your neural network!");
    setSubmitted(true);
  };

  return (
    <ChallengeLayout
      challengeTitle="Deep Learning: Handwritten Digit Recognition"
      difficulty="EASY"
      points={220}
    >
      <div className="space-y-6">
        {/* Tutorial Section */}
        {showTutorial && (
          <div className="mb-6 rounded-2xl border-2 border-blue-200 bg-blue-50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-xl font-bold">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                  />
                </svg>
                Deep Learning Tutorial
              </h3>
              <button
                type="button"
                onClick={() => setShowTutorial(false)}
                className="rounded-lg border border-blue-300 px-3 py-1 text-sm hover:bg-blue-100"
              >
                Hide Tutorial
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-3 font-semibold text-blue-700">
                  Challenge Objectives:
                </h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Build a neural network to recognize handwritten digits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Understand neural network architecture (layers, neurons, activation)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Achieve at least 95% accuracy on MNIST dataset</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Learn about training, validation, and testing</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-3 font-semibold text-green-700">
                  Key Concepts:
                </h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span><strong>Neural Networks:</strong> Layers of interconnected neurons</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span><strong>MNIST:</strong> Standard dataset of 70,000 handwritten digits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span><strong>Classification:</strong> Predicting discrete categories (0-9)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span><strong>Accuracy:</strong> Percentage of correct predictions</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Challenge Section */}
        <div className="rounded-2xl bg-white p-6 shadow">
          <div className="mb-6">
            <h3 className="mb-2 text-2xl font-bold">Challenge Description</h3>
            <p className="text-slate-700">
              Build a neural network to recognize handwritten digits (0-9) from the MNIST dataset. 
              Create a multi-layer perceptron or CNN that achieves at least 95% accuracy. 
              Submit your model architecture and training results.
            </p>
          </div>

          {/* Challenge Materials */}
          <div className="mb-6 rounded-xl border-2 border-purple-200 bg-purple-50 p-4">
            <h4 className="mb-3 font-semibold text-purple-900">Challenge Instructions</h4>
            <div className="space-y-3 text-sm text-slate-700">
              <p>
                <strong>Step 1:</strong> Build a neural network with input layer (784 neurons for 28x28 pixels), 
                hidden layers, and output layer (10 neurons for digits 0-9)
              </p>
              <p>
                <strong>Step 2:</strong> Train the model on MNIST training set (60,000 images)
              </p>
              <p>
                <strong>Step 3:</strong> Evaluate on test set (10,000 images) and achieve ≥95% accuracy
              </p>
              <p>
                <strong>Step 4:</strong> Submit your model architecture, training code, and accuracy results
              </p>
            </div>
          </div>

          {/* Interactive Demo */}
          <div className="mb-6">
            <h3 className="mb-4 text-xl font-bold">Test Your Model</h3>
            <p className="mb-4 text-slate-600">
              Select a digit to test the recognition model:
            </p>
            
            <div className="grid grid-cols-5 gap-4 mb-6">
              {sampleDigits.map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleDigitSelect(digit)}
                  className={`rounded-lg border-2 p-4 text-4xl font-bold transition-all ${
                    selectedDigit === digit
                      ? "border-purple-600 bg-purple-100"
                      : "border-slate-300 bg-white hover:border-purple-300"
                  }`}
                >
                  {digit}
                </button>
              ))}
            </div>

            {prediction !== null && (
              <div className="rounded-lg border-2 border-green-200 bg-green-50 p-6">
                <h4 className="mb-3 font-semibold">Model Prediction:</h4>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-green-700">
                    Predicted: {prediction}
                  </p>
                  <p className="text-sm text-slate-600">
                    Actual: {selectedDigit} {prediction === selectedDigit ? "✓ Correct" : "✗ Incorrect"}
                  </p>
                  <p className="text-sm text-slate-600">
                    Model Accuracy: {accuracy}%
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!prediction || submitted}
            className="rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitted ? "Challenge Submitted" : "Submit Challenge"}
          </button>
        </div>
      </div>
    </ChallengeLayout>
  );
}





