"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/providers/auth-provider"
import { Send, Bot, User, DollarSign } from "lucide-react"
import { apiClient } from "@/lib/api-client"

interface Message {
    sender: "user" | "vendor_agent"
    content: string
    offer_price?: number
    type?: string
}

interface NegotiationChatProps {
    productId: string
    productName: string
    initialPrice: number
}

export function NegotiationChat({ productId, productName, initialPrice }: NegotiationChatProps) {
    const { user } = useAuth()
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [isConnected, setIsConnected] = useState(false)
    const [socket, setSocket] = useState<WebSocket | null>(null)
    const [currentPrice, setCurrentPrice] = useState(initialPrice)
    const scrollRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const startNegotiation = async () => {
        if (!user) return

        try {
            // 1. Initialize session via API
            const session = await apiClient<{ negotiation_id: string }>('/api/negotiation/start', {
                method: 'POST',
                params: {
                    user_id: user.id || "1",
                    product_id: productId,
                    initial_price: initialPrice.toString()
                }
            })

            // 2. Connect WebSocket
            const wsUrl = `ws://127.0.0.1:8000/api/negotiation/${session.negotiation_id}`
            const ws = new WebSocket(wsUrl)

            ws.onopen = () => {
                setIsConnected(true)
                setMessages(prev => [...prev, {
                    sender: "vendor_agent",
                    content: `Hello! I see you're interested in ${productName}. I can help with pricing questions.`,
                }])
            }

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data)
                setMessages(prev => [...prev, data])
                if (data.offer_price) {
                    setCurrentPrice(data.offer_price)
                }
            }

            ws.onclose = () => setIsConnected(false)
            setSocket(ws)

        } catch (error) {
            console.error("Failed to start negotiation", error)
        }
    }

    const sendMessage = () => {
        if (!socket || !input.trim()) return

        socket.send(JSON.stringify({
            type: "message",
            content: input
        }))
        setInput("")
    }

    if (!user) {
        return (
            <Card className="w-full">
                <CardContent className="pt-6 text-center text-muted-foreground">
                    Please log in to chat with the vendor.
                </CardContent>
            </Card>
        )
    }

    if (!isConnected) {
        return (
            <Card className="w-full bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20">
                <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
                    <div className="p-4 bg-white dark:bg-slate-900 rounded-full shadow-lg">
                        <Bot className="w-8 h-8 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">Negotiate Price</h3>
                        <p className="text-sm text-muted-foreground">Chat with our AI agent to discuss a better deal.</p>
                    </div>
                    <Button onClick={startNegotiation} className="w-full max-w-xs">
                        Start Chat
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="flex flex-col h-[500px] w-full shadow-lg border-indigo-100">
            <CardHeader className="border-b bg-slate-50/50 dark:bg-slate-900/50 px-4 py-3 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                        Live
                    </Badge>
                    <CardTitle className="text-sm font-medium">Negotiation</CardTitle>
                </div>
                <div className="flex items-center gap-1 text-sm font-bold text-indigo-600">
                    <DollarSign className="w-4 h-4" />
                    {currentPrice.toFixed(2)}
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
                <ScrollArea className="h-full p-4" ref={scrollRef}>
                    <div className="space-y-4">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`flex items-start gap-2 max-w-[80%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === "user" ? "bg-slate-200" : "bg-indigo-100"
                                        }`}>
                                        {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-indigo-600" />}
                                    </div>
                                    <div
                                        className={`rounded-lg p-3 text-sm ${msg.sender === "user"
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted text-foreground"
                                            }`}
                                    >
                                        {msg.content}
                                        {msg.offer_price && (
                                            <div className="mt-2 pt-2 border-t border-indigo-200/50 font-semibold text-indigo-700">
                                                New Offer: ${msg.offer_price}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="p-3 bg-slate-50 dark:bg-slate-900/50">
                <form
                    className="flex w-full gap-2"
                    onSubmit={(e) => {
                        e.preventDefault()
                        sendMessage()
                    }}
                >
                    <Input
                        placeholder="Ask for a discount..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={!input.trim()}>
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </CardFooter>
        </Card>
    )
}
