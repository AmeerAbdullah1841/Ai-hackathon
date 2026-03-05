"use client";

import { useState } from "react";
import { ChallengeLayout } from "../components/ChallengeLayout";

export default function AIObjectDetectionPage() {
  const [detections, setDetections] = useState<{ label: string; confidence: number }[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const runDetection = () => {
    setDetections([
      { label: "person", confidence: 0.92 },
      { label: "car", confidence: 0.88 },
      { label: "bicycle", confidence: 0.75 },
    ]);
  };

  const handleSubmit = () => {
    if (detections.length === 0) {
      alert("Run object detection first.");
      return;
    }
    alert("Object detection model submitted! Great work with YOLO/SSD!");
    setSubmitted(true);
  };

  return (
    <ChallengeLayout
      challengeTitle="Computer Vision: Object Detection System"
      difficulty="MEDIUM"
      points={320}
    >
      <div className="space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow">
          <h3 className="mb-2 text-2xl font-bold">Challenge</h3>
          <p className="mb-6 text-slate-700">
            Build an object detection system (YOLO, SSD). Detect and locate objects; report mAP. (Demo: simulate detections.)
          </p>
          <button
            type="button"
            onClick={runDetection}
            className="mb-4 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
          >
            Run detection (demo)
          </button>
          {detections.length > 0 && (
            <ul className="mb-4 list-disc pl-6">
              {detections.map((d, i) => (
                <li key={i}>{d.label}: {(d.confidence * 100).toFixed(0)}%</li>
              ))}
            </ul>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={detections.length === 0 || submitted}
            className="rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {submitted ? "Submitted" : "Submit Challenge"}
          </button>
        </div>
      </div>
    </ChallengeLayout>
  );
}
