"use client";

import { useState } from "react";
import { ChallengeLayout } from "../components/ChallengeLayout";

export default function AIImageGenerationPage() {
  const [prompt, setPrompt] = useState("");
  const [generated, setGenerated] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const generate = () => {
    if (!prompt.trim()) {
      alert("Enter a prompt.");
      return;
    }
    setGenerated(true);
  };

  const handleSubmit = () => {
    if (!generated) {
      alert("Generate an image first.");
      return;
    }
    alert("Image generation model submitted! Great work with Stable Diffusion!");
    setSubmitted(true);
  };

  return (
    <ChallengeLayout
      challengeTitle="Generative AI: Image Generation with Stable Diffusion"
      difficulty="HARD"
      points={380}
    >
      <div className="space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow">
          <h3 className="mb-2 text-2xl font-bold">Challenge</h3>
          <p className="mb-6 text-slate-700">
            Build an image generation system (Stable Diffusion). Generate images from text; report FID/IS. (Demo: enter prompt.)
          </p>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-semibold">Text prompt</label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A cat on a beach"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
          <button
            type="button"
            onClick={generate}
            disabled={!prompt.trim()}
            className="mb-4 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:opacity-50"
          >
            Generate (demo)
          </button>
          {generated && (
            <p className="mb-4 text-green-600 font-semibold">Image generated for: &quot;{prompt}&quot;</p>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!generated || submitted}
            className="rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {submitted ? "Submitted" : "Submit Challenge"}
          </button>
        </div>
      </div>
    </ChallengeLayout>
  );
}
