"use client";

import { useState } from "react";
import { ChallengeLayout } from "../components/ChallengeLayout";

export default function AIHousePricePredictionPage() {
  const [formData, setFormData] = useState({
    size_sqft: "",
    bedrooms: "",
    bathrooms: "",
    age_years: "",
  });
  const [prediction, setPrediction] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const makePrediction = () => {
    // Simple linear regression model (for demo purposes)
    // In real implementation, this would call a trained ML model
    const size = parseFloat(formData.size_sqft) || 0;
    const bedrooms = parseFloat(formData.bedrooms) || 0;
    const bathrooms = parseFloat(formData.bathrooms) || 0;
    const age = parseFloat(formData.age_years) || 0;

    // Simple formula: price = base + (size * rate) + (bedrooms * rate) + (bathrooms * rate) - (age * depreciation)
    const basePrice = 50000;
    const sizeRate = 100;
    const bedroomRate = 15000;
    const bathroomRate = 10000;
    const depreciationRate = 2000;

    const predictedPrice =
      basePrice +
      size * sizeRate +
      bedrooms * bedroomRate +
      bathrooms * bathroomRate -
      age * depreciationRate;

    setPrediction(Math.max(0, predictedPrice));
  };

  const handleSubmit = () => {
    if (!prediction) {
      alert("Please make a prediction first");
      return;
    }
    alert("House price prediction submitted! Great work on building your ML model!");
    setSubmitted(true);
  };

  return (
    <ChallengeLayout
      challengeTitle="Machine Learning: House Price Prediction"
      difficulty="EASY"
      points={200}
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
                Machine Learning Tutorial
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
                    <span>Build a regression model to predict house prices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Understand feature engineering and data preprocessing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Evaluate model performance using metrics (MSE, R²)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Learn about linear regression and feature importance</span>
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
                    <span><strong>Regression:</strong> Predicting continuous values (prices)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span><strong>Features:</strong> Input variables (size, bedrooms, etc.)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span><strong>Training:</strong> Learning patterns from data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span><strong>Evaluation:</strong> Testing model accuracy</span>
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
              Build a machine learning model to predict house prices based on features like size, 
              bedrooms, bathrooms, and age. Use regression techniques to achieve the best accuracy. 
              Submit your model's predictions and evaluation metrics.
            </p>
          </div>

          {/* Challenge Materials */}
          <div className="mb-6 rounded-xl border-2 border-purple-200 bg-purple-50 p-4">
            <h4 className="mb-3 font-semibold text-purple-900">Challenge Instructions</h4>
            <div className="space-y-3 text-sm text-slate-700">
              <p>
                <strong>Step 1:</strong> Input house features (size, bedrooms, bathrooms, age)
              </p>
              <p>
                <strong>Step 2:</strong> Your model will predict the house price
              </p>
              <p>
                <strong>Step 3:</strong> Review the prediction and submit your results
              </p>
              <p>
                <strong>Note:</strong> In a real implementation, you would train a model using 
                historical house price data. This demo uses a simplified formula.
              </p>
            </div>
          </div>

          {/* Input Form */}
          <div className="mb-6">
            <h3 className="mb-4 text-xl font-bold">House Features</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold">
                  Size (sqft):
                </label>
                <input
                  type="number"
                  value={formData.size_sqft}
                  onChange={(e) => handleInputChange("size_sqft", e.target.value)}
                  placeholder="e.g., 2000"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold">
                  Bedrooms:
                </label>
                <input
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => handleInputChange("bedrooms", e.target.value)}
                  placeholder="e.g., 3"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold">
                  Bathrooms:
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.bathrooms}
                  onChange={(e) => handleInputChange("bathrooms", e.target.value)}
                  placeholder="e.g., 2.5"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold">
                  Age (years):
                </label>
                <input
                  type="number"
                  value={formData.age_years}
                  onChange={(e) => handleInputChange("age_years", e.target.value)}
                  placeholder="e.g., 10"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={makePrediction}
              disabled={!formData.size_sqft || !formData.bedrooms || !formData.bathrooms || !formData.age_years}
              className="mt-4 rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Predict Price
            </button>
          </div>

          {/* Prediction Result */}
          {prediction !== null && (
            <div className="mb-6 rounded-lg border-2 border-green-200 bg-green-50 p-6">
              <h4 className="mb-3 font-semibold">Predicted House Price:</h4>
              <p className="text-3xl font-bold text-green-700">
                ${prediction.toLocaleString()}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Based on: {formData.size_sqft} sqft, {formData.bedrooms} bedrooms, 
                {formData.bathrooms} bathrooms, {formData.age_years} years old
              </p>
            </div>
          )}

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





