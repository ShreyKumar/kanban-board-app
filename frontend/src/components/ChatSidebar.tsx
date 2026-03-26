"use client";

import { useState, useRef, useEffect } from "react";
import { type BoardData } from "@/lib/kanban";

type Message = { role: "user" | "ai"; content: string };

type ChatSidebarProps = {
  onBoardUpdated: (newBoard: BoardData) => void;
};

export const ChatSidebar = ({ onBoardUpdated }: ChatSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role === "ai" ? "assistant" : "user", content: m.content }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, history }),
      });
      if (!res.ok) throw new Error("Failed to call chat api");
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);

      setMessages((prev) => [...prev, { role: "ai", content: data.message }]);
      
      if (data.boardUpdate) {
        onBoardUpdated(data.boardUpdate);
      }
    } catch (err: any) {
      setMessages((prev) => [...prev, { role: "ai", content: "Error: " + err.message }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary-blue)] text-white shadow-lg transition-transform hover:scale-105"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}

      <div
        className={`fixed right-0 top-0 z-40 h-screen w-80 transform border-l border-[var(--stroke)] bg-white/95 backdrop-blur shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-[var(--stroke)] p-4">
            <h2 className="font-semibold text-[var(--navy-dark)]">AI Assistant</h2>
            <button onClick={() => setIsOpen(false)} className="text-[var(--gray-text)] hover:text-[var(--primary-blue)]">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <p className="text-center text-sm text-[var(--gray-text)]">
                Ask me to update the board, add columns, or create cards!
              </p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                    m.role === "user"
                      ? "bg-[var(--primary-blue)] text-white rounded-br-none"
                      : "bg-[var(--surface)] text-[var(--navy-dark)] border border-[var(--stroke)] rounded-bl-none"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[var(--surface)] border border-[var(--stroke)] text-[var(--navy-dark)] rounded-2xl rounded-bl-none p-3 text-sm">
                  <span className="flex space-x-1">
                    <span className="h-2 w-2 bg-[var(--gray-text)] rounded-full animate-bounce"></span>
                    <span className="h-2 w-2 bg-[var(--gray-text)] rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></span>
                    <span className="h-2 w-2 bg-[var(--gray-text)] rounded-full animate-bounce" style={{animationDelay: "0.4s"}}></span>
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="border-t border-[var(--stroke)] p-4 bg-[var(--surface)]">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                disabled={isLoading}
                className="flex-1 rounded-full border border-[var(--stroke)] px-4 py-2 text-sm focus:border-[var(--primary-blue)] focus:outline-none"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--secondary-purple)] text-white disabled:opacity-50"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
