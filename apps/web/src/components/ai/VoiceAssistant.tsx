"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Sparkles, X, Send, Zap, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ImageUploader } from "./image-uploader";
import { toast } from "sonner";

export function VoiceAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isLiveMode, setIsLiveMode] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [response, setResponse] = useState("Hi! I'm Genie. Ask me to find products or navigate.");

    const recognitionRef = useRef<any>(null);
    const liveModeRef = useRef(false);
    const speakingRef = useRef(false);

    // Sync refs with state for use inside callbacks
    useEffect(() => { liveModeRef.current = isLiveMode; }, [isLiveMode]);
    useEffect(() => { speakingRef.current = isSpeaking; }, [isSpeaking]);

    useEffect(() => {
        if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
            // @ts-ignore
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = false; // We manually restart for better control
            recognition.interimResults = true;

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => {
                setIsListening(false);
                // Auto-restart if live mode is active and NOT speaking
                if (liveModeRef.current && !speakingRef.current) {
                    recognition.start();
                }
            };
            recognition.onresult = (event: any) => {
                const current = event.resultIndex;
                const result = event.results[current];
                const transcriptText = result[0].transcript;
                setTranscript(transcriptText);

                // Auto-submit in Live Mode if final
                if (result.isFinal && liveModeRef.current) {
                    handleSimulateCommand(transcriptText);
                }
            };

            recognitionRef.current = recognition;
        }
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            // If manual stop, maybe disable live mode too? 
            // Let's keep live mode active but paused listening until manual start/stop interaction?
            // Actually, if user manually clicks mic, they expect strict control.
            if (isLiveMode) toggleLiveMode();
        } else {
            setTranscript("");
            recognitionRef.current?.start();
        }
    };

    const toggleLiveMode = () => {
        const newState = !isLiveMode;
        setIsLiveMode(newState);

        if (newState) {
            toast.success("Live Mode On: Just speak!");
            recognitionRef.current?.start();
        } else {
            toast("Live Mode Off");
            recognitionRef.current?.stop();
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    const speakResponse = (text: string) => {
        if (typeof window === "undefined" || !window.speechSynthesis) return;

        // Cancel previous speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => {
            setIsSpeaking(true);
            // Stop listening while speaking to avoid echo
            recognitionRef.current?.stop();
        };
        utterance.onend = () => {
            setIsSpeaking(false);
            // Resume listening if live mode is still active
            if (liveModeRef.current) {
                recognitionRef.current?.start();
            }
        };

        // Optional: Select a better voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Samantha"));
        if (preferredVoice) utterance.voice = preferredVoice;

        window.speechSynthesis.speak(utterance);
    };

    const handleSimulateCommand = async (textOverride?: string) => {
        const textToProcess = typeof textOverride === 'string' ? textOverride : transcript;
        if (!textToProcess) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/ai/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: textToProcess,
                    context: `User is on the main dashboard. ${isLiveMode ? "You are speaking via TTS. Keep response generic, short, conversational and concise (max 2 sentences)." : ""}`
                }),
            });

            if (!res.ok) throw new Error("AI Request Failed");

            const data = await res.json();
            setResponse(data.response);

            if (isLiveMode) {
                speakResponse(data.response);
            }
        } catch (e) {
            console.error(e);
            setResponse("I'm having trouble connecting to my AI brain right now.");
        }
    };

    const handleImageUpload = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        setResponse("Analyzing image...");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/ai/analyze-image`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Image Analysis Failed");

            const data = await res.json();
            const reply = `I see ${data.description}. Searching for it now...`;
            setResponse(reply);

            if (isLiveMode) {
                speakResponse(reply);
            }

            if (data.search_query) {
                setTranscript(data.search_query);
                // In a real app we would navigate
            }

        } catch (e) {
            console.error(e);
            toast.error("Could not analyze image");
            setResponse("I couldn't verify that image. Try another one?");
        }
    };

    return (
        <>
            {/* Floating Trigger Button */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="fixed bottom-6 left-6 z-50"
            >
                <Button
                    onClick={() => setIsOpen(true)}
                    className={cn(
                        "rounded-full w-14 h-14 shadow-xl hover:scale-110 transition-transform p-0 relative",
                        isLiveMode ? "bg-red-500 hover:bg-red-600 shadow-red-500/50" : "bg-gradient-to-r from-pink-500 to-violet-600 shadow-purple-500/40"
                    )}
                >
                    <Sparkles className="w-7 h-7 text-white" />
                    {isLiveMode && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                        </span>
                    )}
                </Button>
            </motion.div>

            {/* Assistant Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed bottom-24 left-6 z-50 w-80 bg-white/90 dark:bg-black/90 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-pink-500/10 to-violet-600/10 p-4 flex justify-between items-center border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <div className={cn("w-2 h-2 rounded-full animate-ping", isLiveMode ? "bg-red-500" : "bg-green-500")} />
                                <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
                                    {isLiveMode ? "Jarvis Live" : "AI Genie"}
                                </span>
                            </div>
                            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={() => setIsOpen(false)}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Chat Area */}
                        <div className="p-4 min-h-[150px] flex flex-col justify-end gap-3">
                            <AnimatePresence mode="wait">
                                {isSpeaking && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="w-full flex justify-center gap-1 mb-2"
                                    >
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <motion.div
                                                key={i}
                                                animate={{ height: [10, 20, 10] }}
                                                transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                                                className="w-1 bg-violet-500 rounded-full"
                                            />
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="bg-neutral-100 dark:bg-neutral-800 p-3 rounded-2xl rounded-tl-none self-start max-w-[90%] text-sm shadow-sm">
                                {response}
                            </div>

                            {transcript && (
                                <div className="bg-gradient-to-r from-pink-500 to-violet-600 text-white p-3 rounded-2xl rounded-tr-none self-end max-w-[90%] text-sm shadow-sm">
                                    {transcript}
                                </div>
                            )}
                        </div>

                        {/* Controls */}
                        <div className="p-4 border-t border-white/10 flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <Button
                                    variant={isLiveMode ? "destructive" : (isListening ? "default" : "secondary")}
                                    size="icon"
                                    className={cn("rounded-full h-10 w-10 shrink-0 transition-all", isListening && "animate-pulse ring-4 ring-red-500/20")}
                                    onClick={toggleListening}
                                >
                                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                </Button>

                                <Button
                                    variant={isLiveMode ? "default" : "ghost"}
                                    size="icon"
                                    className={cn("rounded-full h-10 w-10 shrink-0 transition-all", isLiveMode && "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30")}
                                    onClick={toggleLiveMode}
                                    title="Toggle Live Mode"
                                >
                                    {isLiveMode ? <Zap className="w-4 h-4 fill-current" /> : <Volume2 className="w-4 h-4" />}
                                </Button>

                                <div className="w-[1px] h-6 bg-white/20 mx-1" />

                                <ImageUploader onImageSelected={handleImageUpload} disabled={isListening} />
                            </div>

                            {!isLiveMode && (
                                <div className="flex items-center gap-2">
                                    <input
                                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-2 py-1"
                                        placeholder="Type something..."
                                        value={transcript}
                                        onChange={(e) => setTranscript(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSimulateCommand()}
                                    />
                                    <Button size="icon" variant="ghost" onClick={() => handleSimulateCommand()} disabled={!transcript}>
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}

                            {isLiveMode && (
                                <div className="text-xs text-center text-red-400 animate-pulse font-medium">
                                    {isSpeaking ? "Genie Speaking..." : "Listening..."}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
