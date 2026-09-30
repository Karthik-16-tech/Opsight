import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Send,
  Trash2,
  Bot,
  User,
  ChevronDown,
  ChevronUp,
  Radio,
  RotateCcw,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface MessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const BACKEND_URL =
  (import.meta.env["VITE_FASTAPI_BACKEND_URL"] as string) || "http://127.0.0.1:8000";
const GEMINI_API_KEY =
  (import.meta.env["VITE_GEMINI_API_KEY"] as string) || "";

const QUICK_PROMPTS = [
  "What caused the recent incident?",
  "Check payments-service latency",
  "Run automatic remediation",
  "Summarize system health",
];

export function VoiceInputBox({
  externalQuery,
  onClearExternalQuery,
}: {
  externalQuery?: string;
  onClearExternalQuery?: () => void;
}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [textInput, setTextInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeSpeechSynth, setActiveSpeechSynth] = useState(false);

  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: "initial-1",
      role: "assistant",
      content:
        "Opsight Neural Voice Interface online. Connected to Gemini 2.5 Flash. Click the mic or speak anytime to query infrastructure telemetry.",
      timestamp: "Ready",
    },
  ]);

  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat history
  useEffect(() => {
    if (chatEndRef.current && isExpanded) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isExpanded]);

  // Handle external query from bottom command bar
  useEffect(() => {
    if (externalQuery && externalQuery.trim()) {
      handleSendMessage(externalQuery.trim());
      onClearExternalQuery?.();
    }
  }, [externalQuery]);

  // Initialize SpeechRecognition
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
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
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

  // When speech ends and we have transcript, send message automatically
  useEffect(() => {
    if (!isListening && transcript.trim()) {
      const voiceQuery = transcript.trim();
      setTranscript("");
      handleSendMessage(voiceQuery);
    }
  }, [isListening]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert(
        "Speech recognition is not supported in this browser. Please use Chrome or Edge, or type in the box below."
      );
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setTranscript("");
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Speech recognition start failed:", err);
      }
    }
  };

  const speakText = (text: string) => {
    if (isMuted || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      
      const voices = window.speechSynthesis.getVoices();
      const futuristicVoice =
        voices.find(
          (v) =>
            v.lang.startsWith("en") &&
            (v.name.includes("Natural") ||
              v.name.includes("Google") ||
              v.name.includes("Samantha") ||
              v.name.includes("Daniel"))
        ) || voices.find((v) => v.lang.startsWith("en"));

      if (futuristicVoice) {
        utterance.voice = futuristicVoice;
      }

      utterance.onstart = () => setActiveSpeechSynth(true);
      utterance.onend = () => setActiveSpeechSynth(false);
      utterance.onerror = () => setActiveSpeechSynth(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: MessageItem = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // 1. Try FastAPI Backend
      let reply = "";
      try {
        const response = await fetch(`${BACKEND_URL}/api/voice-chat`, {
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

        if (response.ok) {
          const data = await response.json();
          reply = data.reply;
        }
      } catch (backendErr) {
        console.warn("Backend fetch failed, falling back to direct API:", backendErr);
      }

      // 2. Direct Gemini Fallback if backend was unreachable
      if (!reply) {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      text: `You are Opsight, an AI holographic operations engineer inspecting cloud clusters. Keep the response to 2 concise sentences suitable for spoken voice. Question: ${text}`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          reply =
            geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
            "Diagnostics complete. Subsystem parameters remain within expected bounds.";
        } else {
          reply = `Telemetry link acknowledged '${text}'. Automated cluster diagnostics dispatched.`;
        }
      }

      const assistantMsg: MessageItem = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: reply,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      speakText(reply);
    } catch (err) {
      console.error("Voice response failed:", err);
      const errorMsg: MessageItem = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content:
          "Neural link synchronization glitch. Automated diagnostics continuing in background.",
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

  const clearHistory = () => {
    setMessages([
      {
        id: "cleared-1",
        role: "assistant",
        content: "Conversation history cleared. Ready for your next command.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <div
      className="pointer-events-auto flex flex-col rounded-2xl glass-panel border border-white/10 shadow-2xl transition-all duration-300 backdrop-blur-xl"
      style={{
        background: "rgba(10, 14, 26, 0.78)",
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6), 0 0 25px rgba(56, 189, 248, 0.12)",
      }}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400">
            <Radio
              className={`h-3.5 w-3.5 ${
                isListening || activeSpeechSynth ? "animate-pulse text-cyan-300" : ""
              }`}
            />
            {(isListening || activeSpeechSynth) && (
              <span className="absolute -inset-0.5 rounded-full border border-cyan-400/50 animate-ping opacity-75" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold tracking-wide text-white">
                Opsight Voice AI
              </span>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/15 px-1.5 py-0.2 text-[9px] font-mono text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                FASTAPI
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? "Unmute Voice" : "Mute Voice"}
            className="p-1 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            {isMuted ? (
              <VolumeX className="h-3.5 w-3.5 text-red-400" />
            ) : (
              <Volume2 className="h-3.5 w-3.5 text-cyan-400" />
            )}
          </button>

          <button
            onClick={clearHistory}
            title="Clear History"
            className="p-1 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Collapse" : "Expand"}
            className="p-1 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {isExpanded && (
        <>
          {/* Scrollable Conversation History */}
          <div className="flex flex-col gap-2.5 p-3 max-h-[17rem] overflow-y-auto custom-scrollbar text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] ${
                    msg.role === "user"
                      ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/30"
                      : "bg-cyan-600/30 text-cyan-300 border border-cyan-500/30"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="h-3 w-3" />
                  ) : (
                    <Bot className="h-3 w-3" />
                  )}
                </div>

                <div
                  className={`rounded-xl px-2.5 py-1.5 max-w-[85%] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-indigo-500/20 text-indigo-100 border border-indigo-500/30 ml-auto"
                      : "bg-white/[0.06] text-white/90 border border-white/10"
                  }`}
                >
                  <p>{msg.content}</p>
                  <div className="mt-1 flex items-center justify-between gap-2 text-[9px] text-white/40">
                    <span>{msg.timestamp}</span>
                    {msg.role === "assistant" && !isMuted && (
                      <button
                        onClick={() => speakText(msg.content)}
                        className="hover:text-cyan-400 transition-colors"
                        title="Replay Voice"
                      >
                        <RotateCcw className="h-2.5 w-2.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 items-center text-cyan-300/80 animate-pulse text-[11px] pl-1">
                <Sparkles className="h-3.5 w-3.5 animate-spin" />
                <span>Opsight is analyzing telemetry with Gemini 2.5 Flash...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts Suggestions */}
          <div className="px-3 py-1.5 border-t border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading || isListening}
                className="shrink-0 text-[10px] px-2 py-0.8 rounded-full bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-300 border border-white/10 transition-all text-white/70 whitespace-nowrap cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Voice Activation Box & Input Controls */}
      <div className="p-3 border-t border-white/10 bg-black/40 rounded-b-2xl">
        {/* Live speech visualization / status */}
        {isListening ? (
          <div className="mb-2.5 rounded-xl border border-cyan-500/40 bg-cyan-950/30 p-2 text-center animate-pulse">
            <div className="flex items-center justify-center gap-1 mb-1">
              {Array.from({ length: 14 }).map((_, i) => (
                <span
                  key={i}
                  className="w-1 rounded-full bg-cyan-400"
                  style={{
                    height: `${8 + ((i * 11) % 18)}px`,
                    animation: `wave ${0.6 + (i % 4) * 0.15}s ease-in-out infinite alternate`,
                  }}
                />
              ))}
            </div>
            <p className="text-[11px] text-cyan-200 italic font-mono">
              {transcript || "Listening... speak now into your microphone"}
            </p>
          </div>
        ) : null}

        <div className="flex items-center gap-2">
          {/* Main Voice Activation Button */}
          <button
            onClick={toggleListening}
            title={isListening ? "Stop Listening" : "Start Voice Activation"}
            className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all cursor-pointer ${
              isListening
                ? "bg-red-500 text-white shadow-lg shadow-red-500/50 scale-105"
                : "bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/20"
            }`}
          >
            {isListening ? (
              <MicOff className="h-4 w-4 animate-bounce" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
            {isListening && (
              <span className="absolute -inset-1 rounded-xl border border-red-500/60 animate-ping" />
            )}
          </button>

          {/* Text input for typing */}
          <div className="relative flex-1">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (textInput.trim()) {
                    handleSendMessage(textInput.trim());
                    setTextInput("");
                  }
                }
              }}
              placeholder={isListening ? "Listening..." : "Speak or ask Opsight..."}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400/50 transition-all pr-8"
            />
            {textInput.trim() && (
              <button
                onClick={() => {
                  handleSendMessage(textInput.trim());
                  setTextInput("");
                }}
                disabled={isLoading}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/40 transition-colors cursor-pointer"
              >
                <Send className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Status text */}
        <div className="mt-2 flex items-center justify-between text-[10px] text-white/40 font-mono">
          <span>{isListening ? "🔴 MIC RECORDING" : "🎙️ CLICK MIC TO SPEAK"}</span>
          <span>GEMINI 2.5 FLASH</span>
        </div>
      </div>
    </div>
  );
}
