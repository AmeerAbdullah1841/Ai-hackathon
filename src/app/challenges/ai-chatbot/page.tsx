"use client";

import { useState } from "react";
import { ChallengeLayout } from "../components/ChallengeLayout";

export default function AIChatbotPage() {
  const [message, setMessage] = useState("");
  const [replies, setReplies] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const sendMessage = () => {
    if (!message.trim()) return;
    setReplies((prev) => [...prev, `You: ${message}`, "Bot: I understand. (RAG demo response)"]);
    setMessage("");
  };

  const handleSubmit = () => {
    if (replies.length === 0) {
      alert("Have a conversation with the chatbot first.");
      return;
    }
    alert("RAG chatbot submitted! Great work on retrieval and generation!");
    setSubmitted(true);
  };

  return (
    <ChallengeLayout
      challengeTitle="Generative AI: AI Chatbot with RAG"
      difficulty="HARD"
      points={400}
    >
      <div className="space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow">
          <h3 className="mb-2 text-2xl font-bold">Challenge</h3>
          <p className="mb-6 text-slate-700">
            Build a RAG chatbot: document retrieval, context injection, response generation. (Demo: send messages.)
          </p>
          <div className="mb-4 max-h-48 overflow-y-auto rounded border bg-slate-50 p-3 text-sm">
            {replies.length === 0 && <p className="text-slate-500">No messages yet.</p>}
            {replies.map((r, i) => (
              <p key={i} className="mb-1">{r}</p>
            ))}
          </div>
          <div className="mb-4 flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2"
            />
            <button
              type="button"
              onClick={sendMessage}
              className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
            >
              Send
            </button>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={replies.length === 0 || submitted}
            className="rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {submitted ? "Submitted" : "Submit Challenge"}
          </button>
        </div>
      </div>
    </ChallengeLayout>
  );
}
