"use client";

import { useState } from "react";
import { ChallengeLayout } from "../components/ChallengeLayout";

const PIPELINE_STEPS = [
  { id: "data", label: "Data Collection", done: false },
  { id: "preprocess", label: "Preprocessing", done: false },
  { id: "train", label: "Model Training", done: false },
  { id: "evaluate", label: "Evaluation", done: false },
  { id: "deploy", label: "Deployment", done: false },
];

export default function AIMLPipelinePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);

  const handleStepComplete = (stepId: string) => {
    setCompleted((prev) => ({ ...prev, [stepId]: true }));
    const idx = PIPELINE_STEPS.findIndex((s) => s.id === stepId);
    if (idx >= 0 && idx < PIPELINE_STEPS.length - 1) setCurrentStep(idx + 1);
  };

  const allComplete = PIPELINE_STEPS.every((s) => completed[s.id]);

  const handleSubmit = () => {
    if (!allComplete) {
      alert("Complete all pipeline steps first.");
      return;
    }
    alert("ML Pipeline submitted! Great work on building your end-to-end pipeline!");
    setSubmitted(true);
  };

  return (
    <ChallengeLayout
      challengeTitle="End-to-End: Complete ML Pipeline"
      difficulty="MEDIUM"
      points={340}
    >
      <div className="space-y-6">
        {showTutorial && (
          <div className="mb-6 rounded-2xl border-2 border-blue-200 bg-blue-50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-xl font-bold">Pipeline Overview</h3>
              <button
                type="button"
                onClick={() => setShowTutorial(false)}
                className="rounded-lg border border-blue-300 px-3 py-1 text-sm hover:bg-blue-100"
              >
                Hide Tutorial
              </button>
            </div>
            <p className="text-sm text-slate-700">
              Build a complete ML pipeline: data collection → preprocessing → training → evaluation → deployment. Use MLOps best practices. Complete each step below to simulate your pipeline.
            </p>
          </div>
        )}

        <div className="rounded-2xl bg-white p-6 shadow">
          <h3 className="mb-4 text-2xl font-bold">Pipeline Steps</h3>
          <div className="mb-6 flex flex-wrap gap-2">
            {PIPELINE_STEPS.map((step, idx) => (
              <button
                key={step.id}
                type="button"
                onClick={() => setCurrentStep(idx)}
                className={`rounded-lg px-4 py-2 text-sm font-medium ${
                  currentStep === idx
                    ? "bg-purple-600 text-white"
                    : completed[step.id]
                      ? "bg-green-100 text-green-800"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {completed[step.id] && "✓ "}
                {step.label}
              </button>
            ))}
          </div>

          <div className="rounded-xl border-2 border-purple-200 bg-purple-50 p-4">
            <h4 className="mb-2 font-semibold text-purple-900">
              Step: {PIPELINE_STEPS[currentStep].label}
            </h4>
            <p className="mb-4 text-sm text-slate-700">
              {PIPELINE_STEPS[currentStep].id === "data" && "Collect and load your dataset. Define schemas and validate quality."}
              {PIPELINE_STEPS[currentStep].id === "preprocess" && "Clean data, handle missing values, normalize features, and split train/val/test."}
              {PIPELINE_STEPS[currentStep].id === "train" && "Train your model. Tune hyperparameters and track experiments (e.g., MLflow)."}
              {PIPELINE_STEPS[currentStep].id === "evaluate" && "Evaluate on holdout set. Report metrics (accuracy, F1, etc.) and log results."}
              {PIPELINE_STEPS[currentStep].id === "deploy" && "Package model, containerize, and deploy (e.g., API or batch jobs)."}
            </p>
            <button
              type="button"
              onClick={() => handleStepComplete(PIPELINE_STEPS[currentStep].id)}
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
            >
              Mark step complete
            </button>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!allComplete || submitted}
            className="mt-6 rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitted ? "Challenge Submitted" : "Submit Pipeline"}
          </button>
        </div>
      </div>
    </ChallengeLayout>
  );
}
