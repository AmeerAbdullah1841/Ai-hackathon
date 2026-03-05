"use client";

import { useState } from "react";
import { ChallengeLayout } from "../components/ChallengeLayout";

export default function AIDQNGamePage() {
  const [score, setScore] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const play = () => setScore(100 + Math.floor(Math.random() * 500));

  const handleSubmit = () => {
    if (score === null) {
      alert("Run the DQN game agent first.");
      return;
    }
    alert("DQN game agent submitted! Great work on experience replay and target networks!");
    setSubmitted(true);
  };

  return (
    <ChallengeLayout
      challengeTitle="Reinforcement Learning: Deep Q-Network Game Agent"
      difficulty="HARD"
      points={420}
    >
      <div className="space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow">
          <h3 className="mb-2 text-2xl font-bold">Challenge</h3>
          <p className="mb-6 text-slate-700">
            Build a DQN agent for Atari-like environments. Use experience replay, target networks, epsilon-greedy. (Demo: run and get score.)
          </p>
          <button
            type="button"
            onClick={play}
            className="mb-4 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
          >
            Run DQN agent (demo)
          </button>
          {score !== null && (
            <p className="mb-4 font-semibold">Game score: <span className="text-green-600">{score}</span></p>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={score === null || submitted}
            className="rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {submitted ? "Submitted" : "Submit Challenge"}
          </button>
        </div>
      </div>
    </ChallengeLayout>
  );
}
