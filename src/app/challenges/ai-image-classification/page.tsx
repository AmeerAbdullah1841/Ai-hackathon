"use client";

import { useState } from "react";
import { ChallengeLayout } from "../components/ChallengeLayout";

type ImageCategory = "cat" | "dog" | "bird" | "car" | "airplane";

export default function AIImageClassificationPage() {
  const [selectedCategory, setSelectedCategory] = useState<ImageCategory | null>(null);
  const [prediction, setPrediction] = useState<ImageCategory | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);

  const categories: ImageCategory[] = ["cat", "dog", "bird", "car", "airplane"];

  const handleCategorySelect = (category: ImageCategory) => {
    setSelectedCategory(category);
    // Simulate CNN prediction (in real implementation, would use trained CNN model)
    // For demo: predict correctly 85% of the time
    const correctPrediction = Math.random() > 0.15;
    setPrediction(correctPrediction ? category : categories[Math.floor(Math.random() * categories.length)]);
    setConfidence(correctPrediction ? 92.5 : 65.3);
  };

  const handleSubmit = () => {
    if (!prediction) {
      alert("Please test the model first by selecting an image category");
      return;
    }
    alert("Image classification model submitted! Great work on building your CNN!");
    setSubmitted(true);
  };

  return (
    <ChallengeLayout
      challengeTitle="Deep Learning: Image Classification with CNNs"
      difficulty="MEDIUM"
      points={280}
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
                CNN Tutorial
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
                    <span>Build a Convolutional Neural Network (CNN) for image classification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Understand CNN architecture (conv layers, pooling, fully connected)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Use transfer learning or build from scratch</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Achieve high accuracy on image classification task</span>
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
                    <span><strong>CNN:</strong> Convolutional Neural Network - specialized for images</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span><strong>Convolution:</strong> Detects patterns (edges, shapes, objects)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span><strong>Pooling:</strong> Reduces size, makes detection position-invariant</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span><strong>Transfer Learning:</strong> Using pre-trained models (VGG, ResNet, etc.)</span>
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
              Build a Convolutional Neural Network (CNN) to classify images into multiple categories. 
              Use transfer learning or build from scratch. Achieve high accuracy on a custom dataset. 
              Submit your model architecture, training curves, and classification results.
            </p>
          </div>

          {/* Challenge Materials */}
          <div className="mb-6 rounded-xl border-2 border-purple-200 bg-purple-50 p-4">
            <h4 className="mb-3 font-semibold text-purple-900">Challenge Instructions</h4>
            <div className="space-y-3 text-sm text-slate-700">
              <p>
                <strong>Step 1:</strong> Prepare image dataset (organize into folders by category)
              </p>
              <p>
                <strong>Step 2:</strong> Build CNN with convolutional layers, pooling, and dense layers
              </p>
              <p>
                <strong>Step 3:</strong> Train model with data augmentation (rotation, flipping, etc.)
              </p>
              <p>
                <strong>Step 4:</strong> Evaluate on test set and submit accuracy, confusion matrix, and model architecture
              </p>
            </div>
          </div>

          {/* Interactive Demo */}
          <div className="mb-6">
            <h3 className="mb-4 text-xl font-bold">Test Your CNN Model</h3>
            <p className="mb-4 text-slate-600">
              Select an image category to test the classification model:
            </p>
            
            <div className="grid grid-cols-5 gap-4 mb-6">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategorySelect(category)}
                  className={`rounded-lg border-2 p-6 text-center font-semibold transition-all ${
                    selectedCategory === category
                      ? "border-purple-600 bg-purple-100"
                      : "border-slate-300 bg-white hover:border-purple-300"
                  }`}
                >
                  <div className="text-4xl mb-2">
                    {category === "cat" && "🐱"}
                    {category === "dog" && "🐶"}
                    {category === "bird" && "🐦"}
                    {category === "car" && "🚗"}
                    {category === "airplane" && "✈️"}
                  </div>
                  <div className="text-sm capitalize">{category}</div>
                </button>
              ))}
            </div>

            {prediction && (
              <div className="rounded-lg border-2 border-green-200 bg-green-50 p-6">
                <h4 className="mb-3 font-semibold">CNN Classification Result:</h4>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-green-700 capitalize">
                    Predicted: {prediction}
                  </p>
                  <p className="text-sm text-slate-600">
                    Actual: {selectedCategory} {prediction === selectedCategory ? "✓ Correct" : "✗ Incorrect"}
                  </p>
                  <p className="text-sm text-slate-600">
                    Confidence: {confidence}%
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





