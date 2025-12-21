import { useState, useRef, useEffect } from "react";
import { chatApi } from "@/iwrs/lib/api"; // Added
import { Button } from "@/iwrs/components/ui/button";
import { Input } from "@/iwrs/components/ui/input";
import { Card } from "@/iwrs/components/ui/card";
import { ScrollArea } from "@/iwrs/components/ui/scroll-area";
import { Bot, Send, X, Minimize2 } from "lucide-react";
import { useToast } from "@/iwrs/components/ui/use-toast";
import ReactMarkdown from "react-markdown";
// import { supabase } from "@/iwrs/integrations/supabase/client"; // Removed
import { useTranslation } from "react-i18next";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export const RandomizationBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput(""); // Inputu temizle

    // Kullanıcı mesajını ekrana ekle
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // 1. PHP API üzerinden Yapay Zeka'ya sor
      const data = await chatApi.sendMessage(userMessage);

      // 2. Gelen cevabı ekrana ekle
      const aiResponse = data?.reply || "Üzgünüm, bir cevap alamadım.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: aiResponse }
      ]);

    } catch (error: any) {
      console.error("Chat error:", error);
      toast({
        title: "Hata",
        description: error.message || "Mesaj gönderilemedi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 animate-float z-50"
          size="icon"
        >
          <Bot className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-2xl flex flex-col z-50 animate-fade-in-up">
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary to-secondary text-primary-foreground">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <h3 className="font-semibold">{t('randomizationBot.title') || "AI Asistanı"}</h3>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => setIsOpen(false)}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => {
                  setIsOpen(false);
                  setMessages([]);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Bana klinik araştırmalar ve randomizasyon hakkında soru sorabilirsiniz!</p>
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
                        ? "bg-primary text-primary-foreground"
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
                      <p className="text-sm">Yazıyor...</p>
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
              <Button onClick={handleSend} disabled={isLoading || !input.trim()} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};