"use client";

import { useState } from "react";
import { ChallengeLayout } from "../components/ChallengeLayout";

export default function AITextGenerationPage() {
  const [prompt, setPrompt] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);

  const samplePrompts = [
    "The future of artificial intelligence",
    "Once upon a time in a world",
    "Machine learning is transforming",
    "In the year 2030, technology",
  ];

  const generateText = () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt");
      return;
    }

    // Simulate text generation (in real implementation, would use GPT or similar model)
    const continuations = [
      " will revolutionize how we work and live. AI systems will become more intelligent and capable of understanding complex human needs.",
      " where AI and humans collaborate seamlessly. The boundaries between artificial and natural intelligence will blur, creating new possibilities.",
      " industries across the globe. From healthcare to finance, machine learning algorithms are solving complex problems and driving innovation.",
      " will see unprecedented advances in AI. Autonomous systems will handle routine tasks, allowing humans to focus on creativity and innovation.",
    ];

    const randomContinuation = continuations[Math.floor(Math.random() * continuations.length)];
    setGeneratedText(prompt + randomContinuation);
  };

  const handleSampleClick = (samplePrompt: string) => {
    setPrompt(samplePrompt);
  };

  const handleSubmit = () => {
    if (!generatedText) {
      alert("Please generate some text first");
      return;
    }
    alert("Text generation model submitted! Great work on building your generative AI system!");
    setSubmitted(true);
  };

  return (
    <ChallengeLayout
      challengeTitle="Generative AI: Text Generation Bot"
      difficulty="MEDIUM"
      points={270}
    >
      <div className="space-y-6">
        {/* Tutorial Section */}
        {showTutorial && (
          <div className="mb-6 rounded-2xl border-2 border-blue-200 bg-blue-50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-xl font-bold">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                  />
                </svg>
                Generative AI Tutorial
              </h3>
              <button
                type="button"
                onClick={() => setShowTutorial(false)}
                className="rounded-lg border border-blue-300 px-3 py-1 text-sm hover:bg-blue-100"
              >
                Hide Tutorial
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-3 font-semibold text-blue-700">
                  Challenge Objectives:
                </h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Build a text generation system using GPT or similar language models</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Generate coherent and contextually relevant text from prompts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Fine-tune pre-trained models or use prompt engineering</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Understand transformer architecture and autoregressive generation</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-3 font-semibold text-green-700">
                  Key Concepts:
                </h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span><strong>GPT:</strong> Generative Pre-trained Transformer - language model</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span><strong>Autoregressive:</strong> Generates text one token at a time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span><strong>Prompt Engineering:</strong> Crafting effective prompts for better outputs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span><strong>Temperature:</strong> Controls randomness in generation (creativity vs consistency)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Challenge Section */}
        <div className="rounded-2xl bg-white p-6 shadow">
          <div className="mb-6">
            <h3 className="mb-2 text-2xl font-bold">Challenge Description</h3>
            <p className="text-slate-700">
              Build a text generation system using GPT or similar language models. Generate coherent and 
              contextually relevant text from prompts. Fine-tune a pre-trained model or use prompt engineering. 
              Submit generated samples and evaluation metrics.
            </p>
          </div>

          {/* Challenge Materials */}
          <div className="mb-6 rounded-xl border-2 border-purple-200 bg-purple-50 p-4">
            <h4 className="mb-3 font-semibold text-purple-900">Challenge Instructions</h4>
            <div className="space-y-3 text-sm text-slate-700">
              <p>
                <strong>Step 1:</strong> Choose a language model (GPT-2, GPT-3, or similar)
              </p>
              <p>
                <strong>Step 2:</strong> Fine-tune on your domain or use prompt engineering
              </p>
              <p>
                <strong>Step 3:</strong> Generate text from various prompts
              </p>
              <p>
                <strong>Step 4:</strong> Evaluate quality (coherence, relevance, creativity) and submit samples
              </p>
            </div>
          </div>

          {/* Sample Prompts */}
          <div className="mb-6">
            <h4 className="mb-3 font-semibold">Sample Prompts (Click to try):</h4>
            <div className="space-y-2">
              {samplePrompts.map((samplePrompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSampleClick(samplePrompt)}
                  className="w-full rounded-lg border border-slate-300 bg-white p-3 text-left text-sm hover:bg-slate-50"
                >
                  {samplePrompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <div className="mb-6">
            <h3 className="mb-4 text-xl font-bold">Generate Text</h3>
            <label className="mb-2 block text-sm font-semibold">
              Enter Prompt:
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter a prompt to generate text from..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              rows={3}
            />
            <button
              type="button"
              onClick={generateText}
              disabled={!prompt.trim()}
              className="mt-4 rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate Text
            </button>
          </div>

          {/* Generated Text Result */}
          {generatedText && (
            <div className="mb-6 rounded-lg border-2 border-green-200 bg-green-50 p-6">
              <h4 className="mb-3 font-semibold">Generated Text:</h4>
              <p className="whitespace-pre-wrap text-slate-700">{generatedText}</p>
              <p className="mt-3 text-xs text-slate-500">
                Prompt: "{prompt}"
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!generatedText || submitted}
            className="rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitted ? "Challenge Submitted" : "Submit Challenge"}
          </button>
        </div>
      </div>
    </ChallengeLayout>
  );
}





