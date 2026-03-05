"use client";

import { useState } from "react";
import { ChallengeLayout } from "../components/ChallengeLayout";

const CATEGORIES = ["Sports", "Tech", "Politics", "Science"];

export default function AITextClassificationPage() {
  const [text, setText] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const classify = () => {
    if (!text.trim()) {
      alert("Enter some text.");
      return;
    }
    setCategory(CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]);
  };

  const handleSubmit = () => {
    if (!category) {
      alert("Classify some text first.");
      return;
    }
    alert("Text classification model submitted! Great work with transformers!");
    setSubmitted(true);
  };

  return (
    <ChallengeLayout
      challengeTitle="NLP: Text Classification with Transformers"
      difficulty="MEDIUM"
      points={300}
    >
      <div className="space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow">
          <h3 className="mb-2 text-2xl font-bold">Challenge</h3>
          <p className="mb-6 text-slate-700">
            Build a text classification system with BERT/GPT. Classify documents into categories. (Demo: enter text and run classification.)
          </p>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-semibold">Document text</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to classify..."
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
          <button
            type="button"
            onClick={classify}
            className="mb-4 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
          >
            Classify
          </button>
          {category && (
            <p className="mb-4 font-semibold">Predicted category: <span className="text-purple-600">{category}</span></p>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!category || submitted}
            className="rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {submitted ? "Submitted" : "Submit Challenge"}
          </button>
        </div>
      </div>
    </ChallengeLayout>
  );
}
