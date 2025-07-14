"use client"
import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import SunIcon from "@heroicons/react/24/outline/SunIcon";
import MoonIcon from "@heroicons/react/24/outline/MoonIcon";
import Image from "next/image";

export interface ChatWidgetProps {
  primaryColor?: string;
  logoUrl?: string;
  fontFamily?: string;
  darkMode?: boolean;
  onAuthToken?: (token: string) => void;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  primaryColor = "#6366f1",
  logoUrl,
  fontFamily = "inherit",
  darkMode = false,
  onAuthToken,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Widget is closed by default, opens as modal on icon click
  const [open, setOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Auth token from URL
  const [authToken, setAuthToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("authToken");
    }
    return null;
  });

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  // Listen for parent postMessage (for auth, sizing, etc)
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === "AUTH_TOKEN" && onAuthToken) {
        onAuthToken(event.data.token);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [onAuthToken]);

  // Theme toggle
  const [isDark, setIsDark] = useState(darkMode);
  useEffect(() => {
    setIsDark(darkMode);
  }, [darkMode]);

  // Send message handler
  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !authToken) return;
    setLoading(true);
    setError(null);
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    try {
      // Call your existing chat API route (streaming response)
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ message: input }),
      });
      if (res.status === 401 || res.status === 403) {
        setAuthToken(null);
        localStorage.removeItem("pepperbot_auth_token");
        // Optionally show error in UI, but just hide widget for now
        return;
      }
      if (!res.ok) throw new Error("Network error");

      // Streaming response: show AI reply as it arrives
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");
      let aiReply = "";
      let done = false;
      const decoder = new TextDecoder();
      // Add a pending assistant message
      let aiMsgId = Date.now().toString() + "-ai";
      setMessages((msgs) => [
        ...msgs,
        {
          id: aiMsgId,
          role: "assistant",
          content: "",
          timestamp: new Date().toISOString(),
        },
      ]);
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value);
          chunk.split("\n").forEach((line) => {
            if (line.startsWith("0:")) {
              try {
                const word = JSON.parse(line.slice(2));
                // If the word contains explicit newlines, preserve them
                // Otherwise, add a space between words (except after newlines)
                if (typeof word === "string") {
                  if (
                    aiReply.endsWith("\n") ||
                    word.startsWith("\n") ||
                    aiReply === ""
                  ) {
                    aiReply += word;
                  } else {
                    aiReply += " " + word;
                  }
                }
                // Update the last assistant message as it streams
                setMessages((msgs) =>
                  msgs.map((m) =>
                    m.id === aiMsgId && m.role === "assistant"
                      ? { ...m, content: aiReply }
                      : m
                  )
                );
              } catch {}
            }
          });
        }
      }
    } catch (err: any) {
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Keyboard send
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      sendMessage();
    }
  };

  // Always render the floating button, open modal on click
  return (
    <>
      {/* Floating chat icon button (only if authToken present) */}
      {authToken && !open && (
        <button
          className="fixed bottom-6 right-6 z-50 bg-[var(--primaryColor)] text-white rounded-full p-4 shadow-lg focus:outline-none focus:ring-2"
          style={{ backgroundColor: primaryColor }}
          aria-label="Open chat"
          onClick={() => setOpen(true)}
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M12 3C7.03 3 3 6.58 3 11c0 2.38 1.19 4.5 3.13 6.03-.13.47-.5 1.7-.62 2.13-.1.36.26.68.6.54.7-.28 2.02-.8 2.6-1.04C10.1 18.87 11.03 19 12 19c4.97 0 9-3.58 9-8s-4.03-8-9-8z" fill="currentColor"/></svg>
        </button>
      )}
      {/* Modal overlay and chat window */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />
          <div
            className={cn(
              "fixed bottom-6 right-6 z-50 shadow-2xl rounded-2xl overflow-hidden flex flex-col w-full max-w-sm h-[600px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 transition-all",
              isDark && "dark"
            )}
            style={{ fontFamily, borderColor: primaryColor }}
            role="dialog"
            aria-modal="true"
          >
            {/* If no authToken in URL, show nothing or a message */}
            {!authToken ? (
              <div className="flex flex-col items-center justify-center flex-1 p-8">
                <span className="text-lg font-semibold mb-2 text-red-600">Access denied</span>
                <span className="text-gray-500">No access token found in URL.</span>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center gap-2">
                    {logoUrl && (
                      <Image src={logoUrl} alt="Logo" width={32} height={32} className="rounded" />
                    )}
                    <span className="font-semibold text-lg">AI Chat</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      aria-label="Toggle theme"
                      className="ml-2"
                      onClick={() => setIsDark((d) => !d)}
                    >
                      <SunIcon className="h-5 w-5 text-gray-500 dark:hidden" />
                      <MoonIcon className="h-5 w-5 text-gray-400 hidden dark:block" />
                    </button>
                    <button
                      aria-label="Close chat"
                      className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      onClick={() => setOpen(false)}
                    >
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    </button>
                  </div>
                </div>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white dark:bg-gray-900" tabIndex={0} aria-live="polite">
                  {messages.length === 0 && (
                    <div className="text-gray-400 text-center mt-12">How can I help you today?</div>
                  )}
                  {messages.map((msg, idx) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex items-end gap-2",
                        msg.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      {msg.role === "assistant" && (
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          {logoUrl ? (
                            <Image src={logoUrl} alt="Bot" width={28} height={28} className="rounded-full" />
                          ) : (
                            <span className="text-xs text-gray-500">AI</span>
                          )}
                        </div>
                      )}
                      <div
                        className={cn(
                          "px-4 py-2 rounded-xl max-w-[75%] text-sm shadow",
                          msg.role === "user"
                            ? "bg-[var(--primaryColor)] text-white ml-auto"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        )}
                        style={msg.role === "user" ? { backgroundColor: primaryColor } : {}}
                      >
                        {/* Render response with preserved newlines */}
                        {msg.content.split("\n").map((line, i) => (
                          <React.Fragment key={i}>
                            {line}
                            {i < msg.content.split("\n").length - 1 && <br />}
                          </React.Fragment>
                        ))}
                        {/* Show typing indicator for last assistant message if loading */}
                        {idx === messages.length - 1 && msg.role === "assistant" && loading && (
                          <span className="ml-1 inline-block align-middle animate-pulse text-xs text-gray-400">|</span>
                        )}
                        <div className="text-[10px] text-gray-400 mt-1 text-right">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                {/* Error */}
                {error && (
                  <div className="bg-red-100 text-red-700 px-4 py-2 text-xs text-center">{error}</div>
                )}
                {/* Input */}
                <form
                  className="p-4 border-t dark:border-gray-700 flex gap-2 bg-gray-50 dark:bg-gray-800"
                  autoComplete="off"
                  onSubmit={sendMessage}
                >
                  <input
                    className="flex-1 rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 transition"
                    style={{ borderColor: primaryColor }}
                    placeholder="Type your message…"
                    aria-label="Type your message"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    className="bg-[var(--primaryColor)] text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
                    style={{ backgroundColor: primaryColor }}
                    disabled={loading || !input.trim()}
                  >
                    {loading ? (
                      <svg className="animate-spin h-5 w-5 mx-auto" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                    ) : (
                      "Send"
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};
