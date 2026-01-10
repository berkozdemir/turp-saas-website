import { useState, useRef, useEffect } from "react";
import { Button } from "@/iwrs/components/ui/button";
import { Input } from "@/iwrs/components/ui/input";
import { Card } from "@/iwrs/components/ui/card";
import { ScrollArea } from "@/iwrs/components/ui/scroll-area";
import { Bot, Send, X, Minimize2 } from "lucide-react";
import { useToast } from "@/iwrs/components/ui/use-toast";
import ReactMarkdown from "react-markdown";
import { useTranslation } from "react-i18next";
import { useChatbot } from "@/hooks/useChatbot";
import { useEndUserAuth } from "@/hooks/useEndUserAuth";

export const RandomizationBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [conversationReady, setConversationReady] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { t } = useTranslation();
  const { user } = useEndUserAuth();

  // Use the shared chatbot hook - no initial session, we'll start fresh
  const { messages, isLoading, sendMessage, error, startConversation } = useChatbot(null);

  // Start conversation when bot opens AND we have a user AND haven't started yet
  useEffect(() => {
    const initConversation = async () => {
      if (isOpen && user && !conversationReady) {
        const result = await startConversation({
          email: user.email || 'user@iwrs.com.tr',
          name: user.name || 'IWRS User',
          context_type: 'podcast_hub' // Generic context for IWRS
        });
        if (result.success) {
          setConversationReady(true);
        } else {
          console.error('Failed to start conversation:', result.error);
          toast({
            title: "Hata",
            description: result.error || "Sohbet başlatılamadı.",
            variant: "destructive",
          });
        }
      }
    };
    initConversation();
  }, [isOpen, user, conversationReady, startConversation, toast]);

  // Listen for custom event to open chat from external CTA button
  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('openChatBot', handleOpenChat);
    return () => window.removeEventListener('openChatBot', handleOpenChat);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput("");

    try {
      const result = await sendMessage(userMessage);

      if (!result.success && result.error) {
        toast({
          title: "Hata",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("Chat error:", err);
      toast({
        title: "Hata",
        description: err.message || "Mesaj gönderilemedi.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-red-600 hover:bg-red-700 z-50"
          style={{
            animation: 'gentle-pulse 2s ease-in-out infinite'
          }}
          size="icon"
          title={t('index.chatIconTooltip') || 'AI Randomizasyon Asistanına Yaz'}
        >
          <Bot className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-2xl flex flex-col z-50 animate-fade-in-up border-red-200">
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <h3 className="font-semibold">{t('randomizationBot.title') || "AI Randomizasyon Asistanı"}</h3>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={() => setIsOpen(false)}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Bot className="h-12 w-12 mx-auto mb-4 opacity-50 text-red-400" />
                <p className="text-sm">Çalışmanızdaki randomizasyon akışları ve IWRS kullanımıyla ilgili sorularınızı sorabilirsiniz!</p>
                <p className="text-xs mt-2 text-gray-400">Türkçe veya İngilizce yazabilirsiniz.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${msg.role === "user"
                        ? "bg-red-600 text-white"
                        : "bg-muted text-foreground"
                        }`}
                    >
                      {msg.role === "user" ? (
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted text-foreground max-w-[80%] rounded-lg p-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder={t('randomizationBot.placeholder') || "Mesajınızı yazın..."}
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                size="icon"
                className="bg-red-600 hover:bg-red-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {error && (
              <p className="text-xs text-red-500 mt-2">{error}</p>
            )}
          </div>
        </Card>
      )}

      {/* Global animation style */}
      <style>{`
        @keyframes gentle-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4); }
          50% { transform: scale(1.05); box-shadow: 0 0 0 8px rgba(220, 38, 38, 0); }
        }
      `}</style>
    </>
  );
};