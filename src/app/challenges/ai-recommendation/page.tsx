"use client";

import { useState } from "react";
import { ChallengeLayout } from "../components/ChallengeLayout";

export default function AIRecommendationPage() {
  const [userId, setUserId] = useState("");
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const getRecommendations = () => {
    if (!userId.trim()) {
      alert("Enter a user ID.");
      return;
    }
    setRecommendations(["Item A", "Item B", "Item C", "Item D", "Item E"]);
  };

  const handleSubmit = () => {
    if (recommendations.length === 0) {
      alert("Get recommendations first.");
      return;
    }
    alert("Recommendation system submitted! Great work on collaborative/content-based filtering!");
    setSubmitted(true);
  };

  return (
    <ChallengeLayout
      challengeTitle="End-to-End: AI-Powered Recommendation System"
      difficulty="HARD"
      points={360}
    >
      <div className="space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow">
          <h3 className="mb-2 text-2xl font-bold">Challenge</h3>
          <p className="mb-6 text-slate-700">
            Build a recommendation system (collaborative, content-based, or deep learning). Handle cold-start and report precision/recall/NDCG. (Demo: enter user ID.)
          </p>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-semibold">User ID</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="e.g. user_123"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
          <button
            type="button"
            onClick={getRecommendations}
            className="mb-4 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
          >
            Get recommendations (demo)
          </button>
          {recommendations.length > 0 && (
            <ul className="mb-4 list-disc pl-6">
              {recommendations.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={recommendations.length === 0 || submitted}
            className="rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {submitted ? "Submitted" : "Submit Challenge"}
          </button>
        </div>
      </div>
    </ChallengeLayout>
  );
}
