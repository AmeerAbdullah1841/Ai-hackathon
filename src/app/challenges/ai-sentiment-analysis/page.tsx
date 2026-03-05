"use client";

import { useState } from "react";
import { ChallengeLayout } from "../components/ChallengeLayout";

type Sentiment = "positive" | "negative" | "neutral";

export default function AISentimentAnalysisPage() {
  const [inputText, setInputText] = useState("");
  const [prediction, setPrediction] = useState<Sentiment | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);

  const sampleTexts = [
    "I love this product! It's amazing and works perfectly.",
    "This is terrible. Worst purchase ever. Very disappointed.",
    "It's okay, nothing special. Does the job but nothing more.",
    "Excellent quality! Highly recommend to everyone.",
    "Poor service and bad quality. Not worth the money.",
  ];

  const analyzeSentiment = () => {
    if (!inputText.trim()) {
      alert("Please enter some text to analyze");
      return;
    }

    // Simple sentiment analysis (in real implementation, would use trained model)
    const text = inputText.toLowerCase();
    const positiveWords = ["love", "amazing", "excellent", "great", "good", "perfect", "wonderful", "fantastic"];
    const negativeWords = ["terrible", "worst", "bad", "poor", "disappointed", "hate", "awful", "horrible"];

    const positiveCount = positiveWords.filter(word => text.includes(word)).length;
    const negativeCount = negativeWords.filter(word => text.includes(word)).length;

    let predictedSentiment: Sentiment;
    let conf: number;

    if (positiveCount > negativeCount) {
      predictedSentiment = "positive";
      conf = Math.min(95, 70 + positiveCount * 5);
    } else if (negativeCount > positiveCount) {
      predictedSentiment = "negative";
      conf = Math.min(95, 70 + negativeCount * 5);
    } else {
      predictedSentiment = "neutral";
      conf = 60;
    }

    setPrediction(predictedSentiment);
    setConfidence(conf);
  };

  const handleSampleClick = (text: string) => {
    setInputText(text);
  };

  const handleSubmit = () => {
    if (!prediction) {
      alert("Please analyze some text first");
      return;
    }
    alert("Sentiment analysis model submitted! Great work on building your NLP system!");
    setSubmitted(true);
  };

  return (
    <ChallengeLayout
      challengeTitle="NLP: Sentiment Analysis System"
      difficulty="EASY"
      points={230}
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
                NLP Tutorial
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
                    <span>Build a sentiment analysis system using NLP techniques</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Classify text as positive, negative, or neutral</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Use text preprocessing and feature extraction (TF-IDF, word embeddings)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Train and evaluate classification models (Naive Bayes, SVM, or Neural Networks)</span>
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
                    <span><strong>NLP:</strong> Natural Language Processing - understanding text</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span><strong>Sentiment:</strong> Emotional tone (positive/negative/neutral)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span><strong>Text Classification:</strong> Categorizing text into classes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span><strong>Feature Extraction:</strong> Converting text to numbers (TF-IDF, embeddings)</span>
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
              Build a sentiment analysis system that classifies text as positive, negative, or neutral. 
              Use traditional ML or deep learning approaches. Process real-world text data and achieve good accuracy. 
              Submit your model with evaluation metrics.
            </p>
          </div>

          {/* Challenge Materials */}
          <div className="mb-6 rounded-xl border-2 border-purple-200 bg-purple-50 p-4">
            <h4 className="mb-3 font-semibold text-purple-900">Challenge Instructions</h4>
            <div className="space-y-3 text-sm text-slate-700">
              <p>
                <strong>Step 1:</strong> Preprocess text (lowercase, remove punctuation, tokenize)
              </p>
              <p>
                <strong>Step 2:</strong> Extract features using TF-IDF or word embeddings
              </p>
              <p>
                <strong>Step 3:</strong> Train a classifier (Naive Bayes, SVM, or Neural Network)
              </p>
              <p>
                <strong>Step 4:</strong> Evaluate on test set and submit accuracy, precision, recall, F1-score
              </p>
            </div>
          </div>

          {/* Sample Texts */}
          <div className="mb-6">
            <h4 className="mb-3 font-semibold">Sample Texts (Click to try):</h4>
            <div className="space-y-2">
              {sampleTexts.map((text, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSampleClick(text)}
                  className="w-full rounded-lg border border-slate-300 bg-white p-3 text-left text-sm hover:bg-slate-50"
                >
                  {text}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <div className="mb-6">
            <h3 className="mb-4 text-xl font-bold">Analyze Text Sentiment</h3>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to analyze sentiment..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              rows={4}
            />
            <button
              type="button"
              onClick={analyzeSentiment}
              disabled={!inputText.trim()}
              className="mt-4 rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Analyze Sentiment
            </button>
          </div>

          {/* Prediction Result */}
          {prediction && (
            <div className={`mb-6 rounded-lg border-2 p-6 ${
              prediction === "positive" 
                ? "border-green-200 bg-green-50" 
                : prediction === "negative"
                ? "border-red-200 bg-red-50"
                : "border-yellow-200 bg-yellow-50"
            }`}>
              <h4 className="mb-3 font-semibold">Sentiment Analysis Result:</h4>
              <div className="space-y-2">
                <p className={`text-2xl font-bold ${
                  prediction === "positive" 
                    ? "text-green-700" 
                    : prediction === "negative"
                    ? "text-red-700"
                    : "text-yellow-700"
                }`}>
                  {prediction.toUpperCase()}
                </p>
                <p className="text-sm text-slate-600">
                  Confidence: {confidence}%
                </p>
                <p className="text-sm text-slate-600">
                  Text: "{inputText}"
                </p>
              </div>
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





