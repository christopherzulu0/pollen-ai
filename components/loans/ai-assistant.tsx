"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Bot, X, Send, Maximize2, Minimize2, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI financial assistant. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isOpen])

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, isMinimized])

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response after a delay
    setTimeout(() => {
      const responses = [
        "I can help you analyze your loan portfolio for risk factors.",
        "Based on your group's history, you might qualify for a lower interest rate.",
        "Your current repayment schedule looks good. All payments are on track.",
        "I notice you have several outstanding loans. Would you like me to suggest a consolidation strategy?",
        "The current group savings rate is 3.5% higher than the market average. Great job!",
        "I can help you calculate the optimal loan amount based on your contribution history.",
        "Would you like me to prepare a financial health report for your cooperative?",
      ]

      const aiMessage: Message = {
        id: Date.now().toString(),
        content: responses[Math.floor(Math.random() * responses.length)],
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const toggleOpen = () => {
    setIsOpen(!isOpen)
    setIsMinimized(false)
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  return (
    <>
      {!isOpen && (
        <Button
          onClick={toggleOpen}
          className="fixed bottom-20 right-4 md:bottom-6 md:right-6 rounded-full h-12 w-12 shadow-lg bg-primary hover:bg-primary/90 p-0 z-50"
        >
          <Bot className="h-6 w-6" />
          <span className="sr-only">Open AI Assistant</span>
        </Button>
      )}

      {isOpen && (
        <div
          className={cn(
            "fixed z-50 transition-all duration-300 ease-in-out",
            isMinimized
              ? "bottom-20 right-4 md:bottom-6 md:right-6 w-64 h-14"
              : "bottom-20 right-4 md:bottom-6 md:right-6 w-[calc(100%-2rem)] sm:w-80 md:w-96 h-[500px] max-h-[calc(100vh-120px)]",
          )}
        >
          <Card className="h-full flex flex-col shadow-xl border-primary/20 overflow-hidden">
            <CardHeader className="p-3 flex flex-row items-center justify-between space-y-0 bg-primary text-primary-foreground">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 border-2 border-primary-foreground/20">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI Assistant" />
                  <AvatarFallback className="bg-primary-foreground/10 text-primary-foreground">AI</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-sm font-semibold">Financial Assistant</h4>
                  {!isMinimized && <p className="text-xs opacity-80">Powered by AI</p>}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full hover:bg-primary-foreground/20 text-primary-foreground"
                  onClick={toggleMinimize}
                >
                  {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                  <span className="sr-only">{isMinimized ? "Maximize" : "Minimize"}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full hover:bg-primary-foreground/20 text-primary-foreground"
                  onClick={toggleOpen}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
            </CardHeader>

            {!isMinimized && (
              <>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn("flex items-start gap-3 max-w-[85%]", message.role === "user" ? "ml-auto" : "")}
                      >
                        {message.role === "assistant" && (
                          <Avatar className="h-8 w-8 mt-0.5 border-2 border-primary/20">
                            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI Assistant" />
                            <AvatarFallback className="bg-primary/10 text-primary">AI</AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={cn(
                            "rounded-lg px-3 py-2 text-sm",
                            message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                          )}
                        >
                          {message.content}
                        </div>
                        {message.role === "user" && (
                          <Avatar className="h-8 w-8 mt-0.5 border-2 border-primary/20">
                            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                            <AvatarFallback className="bg-primary/10 text-primary">SJ</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex items-start gap-3 max-w-[85%]">
                        <Avatar className="h-8 w-8 mt-0.5 border-2 border-primary/20">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI Assistant" />
                          <AvatarFallback className="bg-primary/10 text-primary">AI</AvatarFallback>
                        </Avatar>
                        <div className="rounded-lg px-3 py-2 text-sm bg-muted flex items-center">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Thinking...
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <CardFooter className="p-3 border-t">
                  <div className="flex items-center w-full gap-2">
                    <Input
                      ref={inputRef}
                      placeholder="Ask a question..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="rounded-full bg-muted border-muted"
                    />
                    <Button
                      size="icon"
                      className="rounded-full h-8 w-8"
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                    >
                      <Send className="h-4 w-4" />
                      <span className="sr-only">Send</span>
                    </Button>
                  </div>
                </CardFooter>
              </>
            )}

            {isMinimized && (
              <CardContent className="p-3 flex items-center">
                <span className="text-sm font-medium">Financial Assistant</span>
                <ChevronRight className="h-4 w-4 ml-auto" />
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </>
  )
}
