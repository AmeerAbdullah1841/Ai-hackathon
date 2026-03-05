"use client";

import { useState } from "react";
import { ChallengeLayout } from "../components/ChallengeLayout";

export default function AIQLearningPage() {
  const [episodes, setEpisodes] = useState("");
  const [reward, setReward] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const train = () => {
    const n = parseInt(episodes, 10) || 100;
    setReward(Math.min(100, 20 + Math.floor(n / 10) + Math.floor(Math.random() * 30)));
  };

  const handleSubmit = () => {
    if (reward === null) {
      alert("Train the Q-learning agent first.");
      return;
    }
    alert("Q-Learning agent submitted! Great work on reinforcement learning!");
    setSubmitted(true);
  };

  return (
    <ChallengeLayout
      challengeTitle="Reinforcement Learning: Q-Learning Agent"
      difficulty="MEDIUM"
      points={290}
    >
      <div className="space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow">
          <h3 className="mb-2 text-2xl font-bold">Challenge</h3>
          <p className="mb-6 text-slate-700">
            Build a Q-Learning agent (e.g. Frozen Lake, CartPole). Implement Q-learning and achieve optimal policy. (Demo: set episodes and train.)
          </p>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-semibold">Training episodes</label>
            <input
              type="number"
              value={episodes}
              onChange={(e) => setEpisodes(e.target.value)}
              placeholder="e.g. 1000"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
          <button
            type="button"
            onClick={train}
            className="mb-4 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
          >
            Train agent (demo)
          </button>
          {reward !== null && (
            <p className="mb-4 font-semibold">Average reward: <span className="text-green-600">{reward}</span></p>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={reward === null || submitted}
            className="rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {submitted ? "Submitted" : "Submit Challenge"}
          </button>
        </div>
      </div>
    </ChallengeLayout>
  );
}
