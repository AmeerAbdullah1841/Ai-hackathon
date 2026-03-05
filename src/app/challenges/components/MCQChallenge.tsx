"use client";

import { useState } from "react";
import { ChallengeLayout } from "./ChallengeLayout";

export type MCQQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
};

type MCQChallengeProps = {
  challengeTitle: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  points: number;
  questions: MCQQuestion[];
  subtitle?: string;
};

export function MCQChallenge({
  challengeTitle,
  difficulty,
  points,
  questions,
  subtitle = "MCQ · Beginner",
}: MCQChallengeProps) {
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);

  const handleSelect = (questionIndex: number, optionIndex: number) => {
    if (submitted) return;
    setSelected((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const allAnswered = questions.every((_, i) => selected[i] !== undefined);
  const score = submitted
    ? questions.filter((q, i) => selected[i] === q.correctIndex).length
    : null;
  const total = questions.length;
  const pct = score !== null ? Math.round((score / total) * 100) : 0;

  const handleSubmit = () => {
    if (!allAnswered) {
      alert("Please answer all questions before submitting.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <ChallengeLayout
      challengeTitle={challengeTitle}
      difficulty={difficulty}
      points={points}
    >
      <div className="space-y-6">
        {showTutorial && (
          <div className="mb-6 rounded-2xl border-2 border-blue-200 bg-blue-50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-xl font-bold">
                Multiple Choice (MCQ)
              </h3>
              <button
                type="button"
                onClick={() => setShowTutorial(false)}
                className="rounded-lg border border-blue-300 px-3 py-1 text-sm hover:bg-blue-100"
              >
                Hide
              </button>
            </div>
            <p className="text-sm text-slate-700">
              This is an <strong>MCQ</strong> challenge. Select one answer per question, then submit. 
              Level: <span className="font-semibold text-blue-700">{subtitle}</span>
            </p>
          </div>
        )}

        <div className="rounded-2xl bg-white p-6 shadow">
          <div className="mb-4 flex items-center gap-2 text-sm">
            <span className="rounded-full bg-violet-100 px-2.5 py-0.5 font-semibold text-violet-700">
              MCQ&apos;s
            </span>
            <span className="rounded-full bg-green-100 px-2.5 py-0.5 font-semibold text-green-700">
              {difficulty}
            </span>
            <span className="text-slate-500">{questions.length} questions</span>
          </div>

          <div className="space-y-8">
            {questions.map((q, qIdx) => (
              <div key={qIdx} className="rounded-xl border border-slate-200 p-4">
                <p className="mb-3 font-semibold text-slate-900">
                  {qIdx + 1}. {q.question}
                </p>
                <div className="space-y-2">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = selected[qIdx] === oIdx;
                    const isCorrect = q.correctIndex === oIdx;
                    const showResult = submitted;
                    const correctClass = showResult && isCorrect ? "border-green-500 bg-green-50" : "";
                    const wrongClass = showResult && isSelected && !isCorrect ? "border-red-400 bg-red-50" : "";
                    const baseClass = "flex cursor-pointer items-center gap-3 rounded-lg border-2 px-4 py-3 text-left transition";
                    const disabledClass = submitted ? "cursor-default opacity-90" : "hover:border-purple-300";
                    return (
                      <label
                        key={oIdx}
                        className={`${baseClass} ${disabledClass} ${
                          isSelected && !showResult ? "border-purple-500 bg-purple-50" : "border-slate-200"
                        } ${correctClass} ${wrongClass}`}
                      >
                        <input
                          type="radio"
                          name={`q-${qIdx}`}
                          checked={isSelected}
                          onChange={() => handleSelect(qIdx, oIdx)}
                          disabled={submitted}
                          className="h-4 w-4"
                        />
                        <span>{opt}</span>
                        {showResult && isCorrect && (
                          <span className="ml-auto text-sm font-semibold text-green-600">✓ Correct</span>
                        )}
                        {showResult && isSelected && !isCorrect && (
                          <span className="ml-auto text-sm font-semibold text-red-600">✗ Incorrect</span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {!submitted ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="mt-6 rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit MCQ
            </button>
          ) : (
            <div className="mt-6 rounded-xl border-2 border-green-200 bg-green-50 p-4">
              <p className="text-lg font-bold text-green-800">
                Score: {score}/{total} ({pct}%)
              </p>
              <p className="text-sm text-green-700">
                {pct >= 70 ? "Well done! You've completed this MCQ challenge." : "Review the correct answers above and try again for a higher score."}
              </p>
            </div>
          )}
        </div>
      </div>
    </ChallengeLayout>
  );
}
