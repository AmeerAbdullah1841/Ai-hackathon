"use client";

import { useState } from "react";
import { ChallengeLayout } from "../components/ChallengeLayout";

export default function AIFaceRecognitionPage() {
  const [matched, setMatched] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const runMatch = () => setMatched(Math.random() > 0.3);

  const handleSubmit = () => {
    if (matched === null) {
      alert("Run face matching first.");
      return;
    }
    alert("Face recognition system submitted! Great work on detection and matching!");
    setSubmitted(true);
  };

  return (
    <ChallengeLayout
      challengeTitle="Computer Vision: Face Recognition System"
      difficulty="HARD"
      points={350}
    >
      <div className="space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow">
          <h3 className="mb-2 text-2xl font-bold">Challenge</h3>
          <p className="mb-6 text-slate-700">
            Build a face recognition system: detection, feature extraction, matching. Handle lighting and pose. (Demo: simulate match.)
          </p>
          <button
            type="button"
            onClick={runMatch}
            className="mb-4 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
          >
            Run face match (demo)
          </button>
          {matched !== null && (
            <p className="mb-4 font-semibold">
              Match: <span className={matched ? "text-green-600" : "text-red-600"}>{matched ? "Yes" : "No"}</span>
            </p>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={matched === null || submitted}
            className="rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {submitted ? "Submitted" : "Submit Challenge"}
          </button>
        </div>
      </div>
    </ChallengeLayout>
  );
}
