"use client";

import { useState } from "react";
import { ChallengeLayout } from "../components/ChallengeLayout";

export default function AICustomerChurnPage() {
  const [tenure, setTenure] = useState("");
  const [usage, setUsage] = useState("");
  const [prediction, setPrediction] = useState<"At Risk" | "Retained" | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const runPrediction = () => {
    const t = parseFloat(tenure) || 0;
    const u = parseFloat(usage) || 0;
    const risk = t < 12 && u < 50 ? "At Risk" : "Retained";
    setPrediction(risk);
  };

  const handleSubmit = () => {
    if (!prediction) {
      alert("Run a prediction first.");
      return;
    }
    alert("Churn prediction model submitted! Great work on your classification model!");
    setSubmitted(true);
  };

  return (
    <ChallengeLayout
      challengeTitle="Machine Learning: Customer Churn Prediction"
      difficulty="MEDIUM"
      points={250}
    >
      <div className="space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow">
          <h3 className="mb-2 text-2xl font-bold">Challenge</h3>
          <p className="mb-6 text-slate-700">
            Predict which customers will churn. Build a classification model, handle class imbalance, and achieve high recall. (Demo: enter tenure in months and usage score.)
          </p>
          <div className="mb-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold">Tenure (months)</label>
              <input
                type="number"
                value={tenure}
                onChange={(e) => setTenure(e.target.value)}
                placeholder="e.g. 6"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">Usage score (0–100)</label>
              <input
                type="number"
                value={usage}
                onChange={(e) => setUsage(e.target.value)}
                placeholder="e.g. 30"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={runPrediction}
            className="mb-4 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
          >
            Predict churn risk
          </button>
          {prediction && (
            <p className="mb-4 font-semibold">
              Prediction: <span className={prediction === "At Risk" ? "text-red-600" : "text-green-600"}>{prediction}</span>
            </p>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!prediction || submitted}
            className="rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {submitted ? "Submitted" : "Submit Challenge"}
          </button>
        </div>
      </div>
    </ChallengeLayout>
  );
}
