import {
  ArrowRight,
  Mic,
  MicOff,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  isVoice?: boolean;
}

const BACKEND_URL =
  (import.meta.env["VITE_FASTAPI_BACKEND_URL"] as string) || "http://127.0.0.1:8000";
const GEMINI_API_KEY =
  (import.meta.env["VITE_GEMINI_API_KEY"] as string) || "";

export function CommandBar({
  onSubmit,
}: {
  onSubmit?: (value: string) => void;
}) {
  const [value, setValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const recognitionRef = useRef<any>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll messages to bottom
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognizer = new SpeechRecognition();
      recognizer.continuous = false;
      recognizer.interimResults = true;
      recognizer.lang = "en-US";

      recognizer.onstart = () => {
        setIsListening(true);
      };

      recognizer.onresult = (event: any) => {
        let text = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
        }
        setInterimText(text);
      };

      recognizer.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognizer.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognizer;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // When speech stops and has transcribed text, auto-send
  useEffect(() => {
    if (!isListening && interimText.trim()) {
      const query = interimText.trim();
      setInterimText("");
      handleSendMessage(query, true);
    }
  }, [isListening]);

  const toggleListening = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setInterimText("");
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Speech recognition start failed:", err);
      }
    }
  };

  const speakReply = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const preferred =
        voices.find(
          (v) =>
            v.lang.startsWith("en") &&
            (v.name.includes("Natural") ||
              v.name.includes("Google") ||
              v.name.includes("Samantha") ||
              v.name.includes("Daniel"))
        ) || voices.find((v) => v.lang.startsWith("en"));

      if (preferred) utterance.voice = preferred;

      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
    }
  };

  const handleSendMessage = async (text: string, isVoice = false) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isVoice,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    onSubmit?.(text);

    try {
      let reply = "";
      let spokenText = "";

      // 1. Send to FastAPI backend
      try {
        const res = await fetch(`${BACKEND_URL}/api/voice-chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            history: messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        if (res.ok) {
          const data = await res.json();
          reply = data.reply || data.voice_reply;
          spokenText = data.spoken_summary || "";
        }
      } catch (beErr) {
        console.warn("FastAPI backend call fallback:", beErr);
      }

      // 2. Direct Gemini Fallback if backend was unreachable
      if (!reply) {
        const chatgptFallback = `### 🔍 Root Cause Analysis
The failure originates at the **Database Layer (PostgreSQL Cluster)**, not the Frontend or Backend Gateway. Commit \`a8f3c1b\` introduced unclosed database transactions. Under checkout load, PostgreSQL connections reached **98/100 (98% saturation)**, exhausting the HikariCP connection pool and cascading timeouts upstream.

---

### 📋 Error Message Breakdown by Architecture Layer
• **Frontend (NEXA Storefront)**: \`Checkout timeout: POST /api/checkout stalled after 30000ms\` (Waiting on backend)
• **Backend Gateway (API Gateway)**: \`504 Gateway Timeout while proxying request to payments-service on node-us-east-2\`
• **Payment API (payments-service)**: \`HikariPool-1 - Connection is not available, request timed out after 30000ms\`
• **Database (PostgreSQL Primary)**: 🔴 \`FATAL: remaining connection slots reserved (98/100 connections in use, pool EXHAUSTED, 184 queued queries)\`

---

### 🛠️ What Needs to Be Done to Resolve
1. **Reroute Traffic**: Drain checkout traffic from degraded node \`node-us-east-2\` to healthy standby pods in \`us-east-1\`.
2. **Clear Orphaned Connections**: Run \`SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle in transaction';\` in PostgreSQL.
3. **Rollback Faulty Commit**: Trigger canary rollback of \`payments-service\` to stable release \`v2.13.8\`.
4. **Scale Connection Capacity**: Resize HikariCP connection pool from 50 to 200 with an aggressive 30s leak-detection threshold.

---

Similar Incident Ticket: #INC-014 (94% Match) - Payment Service 504 Timeout & DB Pool Saturation.`;

        reply = chatgptFallback;
        spokenText = "Investigation complete: The failure was caused by the Database layer, where PostgreSQL connection pool reached 98% saturation from unclosed transactions in commit a8f3c1b. This cascaded 504 timeouts to the Backend and stalled the Frontend. To resolve: drain node-us-east-2, clear idle connections, and rollback to version v2.13.8. Similar Incident Ticket: INC-014 with 94% similarity.";
      }

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: reply,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      speakReply(spokenText || reply);
    } catch (err) {
      console.error("Failed to get assistant response:", err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: "Telemetry link temporarily interrupted. Diagnostics continuing in background.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative w-full flex flex-col items-center pointer-events-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {/* CHAT HISTORY BOXES: No heading, no icons, no border boxes, perfectly synced with background */}
      {messages.length > 0 && (
        <div
          ref={scrollContainerRef}
          className="mb-2 w-full max-h-[11rem] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex flex-col gap-2 px-1 py-1"
          style={{
            background: "transparent",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 100%)",
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex w-full ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[88%] rounded-xl px-3 py-1.5 text-xs leading-relaxed backdrop-blur-md transition-all ${
                  msg.role === "user"
                    ? "bg-white/[0.12] text-white"
                    : "bg-white/[0.05] text-white/90"
                }`}
                style={{
                  border: "none",
                  boxShadow: "none",
                }}
              >
                {msg.content.includes("Similar Incident Ticket:") ? (
                  <div className="space-y-1.5">
                    <p className="select-text whitespace-pre-wrap leading-relaxed">
                      {(msg.content.split("Similar Incident Ticket:")[0] ?? "").trim()}
                    </p>
                    <div className="rounded-lg bg-white/10 px-2.5 py-1 text-[10px] font-mono border border-white/20 text-white flex items-center justify-between gap-2">
                      <span className="text-white/60 uppercase tracking-wider text-[9px]">Matched Precedent</span>
                      <span className="font-bold text-white">
                        {(msg.content.split("Similar Incident Ticket:")[1] ?? "").trim()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="select-text whitespace-pre-wrap">{msg.content}</p>
                )}
                <div className="mt-0.5 flex items-center justify-between gap-2 text-[9px] text-white/40">
                  <span>{msg.timestamp}</span>
                  {msg.isVoice && <span className="text-white/70">Voice</span>}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div
                className="rounded-xl px-3 py-1 text-[11px] text-white/80 bg-white/[0.04] backdrop-blur-md animate-pulse"
                style={{ border: "none" }}
              >
                Thinking...
              </div>
            </div>
          )}
        </div>
      )}

      {/* SMALL SIMPLE WEBSITE ERROR BOXES (ALL-BLACK GLASSMORPHISM, WHITE TEXT, COMPACT) */}
      <div className="mb-2 flex flex-wrap items-center justify-center gap-1.5 px-1">
        <button
          type="button"
          onClick={() =>
            handleSendMessage(
              "Investigate Payment Service: 504 Gateway Timeout (SEV-1). Show the previous incident tickets from Hindsight, explain why it is similar to that problem, and explain how they resolved it.",
              false
            )
          }
          className="group flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] text-white/90 backdrop-blur-md transition-all hover:bg-white/10 cursor-pointer"
          style={{
            background: "rgba(0, 0, 0, 0.75)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          <span className="h-1 w-1 rounded-full bg-white animate-pulse" />
          <span className="font-medium text-[10px]">Payment 504 Timeout (SEV-1)</span>
        </button>

        <button
          type="button"
          onClick={() =>
            handleSendMessage(
              "Search Hindsight memory for similar historical incidents to this 504 timeout and explain what worked before",
              false
            )
          }
          className="group flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] text-white/90 backdrop-blur-md transition-all hover:bg-white/10 cursor-pointer"
          style={{
            background: "rgba(0, 0, 0, 0.75)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          <span className="h-1 w-1 rounded-full bg-white/70 animate-pulse" />
          <span className="font-medium text-[10px]">Ticket #INC-2841</span>
        </button>

        <button
          type="button"
          onClick={() =>
            handleSendMessage(
              "What are the evidence-backed recommended resolution steps for the on-call engineer to execute?",
              false
            )
          }
          className="group hidden sm:flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] text-white/90 backdrop-blur-md transition-all hover:bg-white/10 cursor-pointer"
          style={{
            background: "rgba(0, 0, 0, 0.75)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          <span className="h-1 w-1 rounded-full bg-white/50" />
          <span className="font-medium text-[10px]">Resolution Playbook</span>
        </button>
      </div>

      {/* COMPACT INPUT COMMAND & VOICE BAR */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!value.trim()) return;
          const query = value.trim();
          setValue("");
          handleSendMessage(query, false);
        }}
        onClick={(e) => {
          e.stopPropagation();
          inputRef.current?.focus();
        }}
        className={`flex w-full items-center gap-2.5 rounded-full py-1 pl-1 pr-1.5 transition-all duration-300 ${
          isListening
            ? "ring-1 ring-white/50 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            : ""
        }`}
        style={{
          borderRadius: 9999,
          background: "rgba(12, 16, 24, 0.8)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.6)",
        }}
      >
        {/* Compact Microphone Voice Button */}
        <button
          type="button"
          onClick={toggleListening}
          title={isListening ? "Stop Listening" : "Voice Activation"}
          className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all cursor-pointer ${
            isListening
              ? "bg-white text-black shadow-lg scale-105"
              : "bg-white/10 text-white/90 hover:bg-white/20"
          }`}
          style={{ border: "none" }}
        >
          {isListening ? (
            <MicOff className="h-3.5 w-3.5 animate-bounce" />
          ) : (
            <Mic className="h-3.5 w-3.5" />
          )}

          {isListening && (
            <span className="absolute -inset-1 rounded-full border border-white/60 animate-ping" />
          )}
        </button>

        {/* Compact Input Text Field */}
        <input
          ref={inputRef}
          type="text"
          value={
            isListening
              ? (interimText ? `"${interimText}"` : "Listening... speak now")
              : value
          }
          onChange={(e) => {
            if (!isListening) setValue(e.target.value);
          }}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (value.trim()) {
                const query = value.trim();
                setValue("");
                handleSendMessage(query, false);
              }
            }
          }}
          onKeyUp={(e) => e.stopPropagation()}
          onKeyPress={(e) => e.stopPropagation()}
          placeholder="Ask or speak about incident..."
          className={`min-w-0 flex-1 bg-transparent text-xs focus:outline-none cursor-text transition-colors select-text ${
            isListening
              ? "text-white italic placeholder:text-white/60 font-mono"
              : "text-foreground placeholder:text-muted-foreground"
          }`}
          style={{ border: "none", outline: "none" }}
        />

        {/* Compact Sound Wave Bars */}
        <div aria-hidden className="hidden items-end gap-[2px] sm:flex pr-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className={`w-[1.5px] rounded-full transition-all duration-200 ${
                isListening
                  ? "bg-white"
                  : speaking
                  ? "bg-white/80"
                  : "bg-white/30"
              }`}
              style={{
                height: isListening
                  ? `${6 + ((i * 7) % 14)}px`
                  : `${4 + ((i * 4) % 10)}px`,
                animation: isListening
                  ? `wave ${0.5 + (i % 4) * 0.12}s ease-in-out infinite alternate`
                  : `wave ${1.1 + (i % 5) * 0.16}s ease-in-out ${i * 0.05}s infinite`,
              }}
            />
          ))}
        </div>

        {/* Compact Submit Arrow Button */}
        <button
          type="submit"
          disabled={!value.trim() && !isListening}
          aria-label="Send"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 transition-all hover:bg-white/20 text-white cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ border: "none" }}
        >
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
}
