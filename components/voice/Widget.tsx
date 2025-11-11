"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";
import { vapi } from "@/lib/vapi";

const Widget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageContainerRef, setMessageContainerRef] = useState<HTMLDivElement | null>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (messageContainerRef) {
      messageContainerRef.scrollTop = messageContainerRef.scrollHeight;
    }
  }, [messages, messageContainerRef]);

  useEffect(() => {
    const handleCallStart = () => {
      setConnecting(false);
      setCallActive(true);
      setMessages([]); // Clear messages on new call
    };

    const handleCallEnd = () => {
      setCallActive(false);
      setConnecting(false);
    };

    const handleMessage = (message: any) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = {
          content: message.transcript,
          role: message.role === "assistant" ? "assistant" : "user",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const handleError = (error: any) => {
      console.error("Vapi Error:", error);
      setConnecting(false);
      setCallActive(false);
    };

    vapi
      .on("call-start", handleCallStart)
      .on("call-end", handleCallEnd)
      .on("message", handleMessage)
      .on("error", handleError);

    return () => {
      vapi
        .off("call-start", handleCallStart)
        .off("call-end", handleCallEnd)
        .off("message", handleMessage)
        .off("error", handleError);
    };
  }, []);

  const toggleCall = async () => {
    if (callActive) {
      vapi.stop();
    } else {
      try {
        setConnecting(true);
        await vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID);
      } catch (error) {
        console.error("Failed to start call:", error);
        setConnecting(false);
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Widget Button */}
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl bg-[#4C4EFB] hover:bg-[#4C4EFB]/90 p-0 flex items-center justify-center"
          title="Chat with Pollen Assistant"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      ) : (
        /* Widget Popup */
        <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-32px)] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-96">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#4C4EFB] to-[#4C4EFB]/80 p-4 flex items-center justify-between text-white">
            <div>
              <h3 className="font-bold text-lg">Pollen Assistant</h3>
              <p className="text-xs text-white/80">
                {callActive ? "Call active" : connecting ? "Connecting..." : "Ready to help"}
              </p>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-white/20 text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Message Area */}
          <div
            ref={setMessageContainerRef}
            className="flex-1 p-4 overflow-y-auto flex flex-col"
          >
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 text-[#4C4EFB]/30 mx-auto mb-2" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {callActive ? "Conversation started..." : "Click below to start talking"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[70%] rounded-lg px-3 py-2 ${
                        msg.role === "user"
                          ? "bg-[#4C4EFB] text-white rounded-br-none"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm break-words">{msg.content}</p>
                      <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Call Button */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <Button
              onClick={toggleCall}
              disabled={connecting}
              className={`w-full ${
                callActive
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-[#4C4EFB] hover:bg-[#4C4EFB]/90"
              } text-white font-medium`}
            >
              {connecting ? "Connecting..." : callActive ? "End Call" : "Start Call"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Widget;
