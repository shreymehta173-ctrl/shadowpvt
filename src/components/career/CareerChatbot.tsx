import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  MessageCircle,
  Send,
  Sparkles,
  Loader2,
  Globe,
  Trash2,
  Bot,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/hooks/useCareerGuidance';

interface CareerChatbotProps {
  messages: ChatMessage[];
  loading: boolean;
  onSendMessage: (message: string, language: string) => void;
  onClearChat?: () => void;
}

const SUGGESTION_CHIPS = [
  "What career suits me best?",
  "How do I become a Data Scientist?",
  "Which skills should I learn first?",
  "What's the salary range for Software Engineers?",
  "Explain my roadmap",
];

const SUGGESTION_CHIPS_HINDI = [
  "मेरे लिए कौन सा करियर सबसे अच्छा है?",
  "Data Scientist कैसे बनें?",
  "पहले कौन से स्किल्स सीखूं?",
  "सॉफ्टवेयर इंजीनियर की सैलरी कितनी है?",
  "मेरा रोडमैप समझाएं",
];

export function CareerChatbot({ messages, loading, onSendMessage, onClearChat }: CareerChatbotProps) {
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState<'English' | 'Hindi'>('English');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages, loading]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    onSendMessage(input.trim(), language);
    setInput('');
    inputRef.current?.focus();
  };

  const handleChipClick = (chip: string) => {
    if (loading) return;
    onSendMessage(chip, language);
  };

  const chips = language === 'Hindi' ? SUGGESTION_CHIPS_HINDI : SUGGESTION_CHIPS;

  return (
    <Card className="h-full flex flex-col border-primary/20 bg-gradient-to-b from-card to-card/50">
      <CardHeader className="pb-3 border-b border-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <span>AI Career Mentor</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(l => l === 'English' ? 'Hindi' : 'English')}
              className="gap-1.5 h-8"
            >
              <Globe className="h-3.5 w-3.5" />
              {language === 'English' ? 'EN' : 'हिं'}
            </Button>
            {messages.length > 0 && onClearChat && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClearChat}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ScrollArea className="flex-1" ref={scrollRef}>
          <div className="space-y-4 p-4">
            {messages.length === 0 ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 animate-pulse">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {language === 'Hindi' ? 'नमस्ते! मैं आपका AI करियर मेंटर हूं' : "Hi! I'm your AI Career Mentor"}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-[280px] mx-auto">
                  {language === 'Hindi' 
                    ? 'करियर, स्किल्स, या अपने रोडमैप के बारे में कुछ भी पूछें।'
                    : 'Ask me anything about careers, skills, or your personalized roadmap.'}
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {chips.slice(0, 3).map((chip, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover:scale-105"
                      onClick={() => handleChipClick(chip)}
                    >
                      {chip}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
                    msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                    msg.role === 'user' 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-gradient-to-br from-primary/20 to-accent/20"
                  )}>
                    {msg.role === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-3 shadow-sm",
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-tr-md'
                        : 'bg-muted/80 rounded-tl-md'
                    )}
                  >
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="mb-2 last:mb-0 text-sm">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                            li: ({ children }) => <li className="text-sm">{children}</li>,
                            strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                            h1: ({ children }) => <h3 className="font-bold text-base mb-2">{children}</h3>,
                            h2: ({ children }) => <h4 className="font-bold text-sm mb-1">{children}</h4>,
                            h3: ({ children }) => <h5 className="font-semibold text-sm mb-1">{children}</h5>,
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm">{msg.content}</p>
                    )}
                    <p className={cn(
                      "text-[10px] mt-2 opacity-70",
                      msg.role === 'user' ? 'text-right' : 'text-left'
                    )}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
            
            {loading && (
              <div className="flex gap-3 animate-in fade-in-0 slide-in-from-bottom-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-muted/80 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-xs text-muted-foreground ml-1">
                      {language === 'Hindi' ? 'सोच रहा हूं...' : 'Thinking...'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Suggestions */}
        {messages.length > 0 && (
          <div className="px-3 py-2 border-t border-border/50 bg-muted/30">
            <ScrollArea className="w-full">
              <div className="flex gap-2 pb-1">
                {chips.map((chip, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className={cn(
                      "cursor-pointer whitespace-nowrap transition-all duration-200",
                      loading 
                        ? "opacity-50 cursor-not-allowed" 
                        : "hover:bg-primary hover:text-primary-foreground hover:scale-105"
                    )}
                    onClick={() => handleChipClick(chip)}
                  >
                    {chip}
                  </Badge>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Input Area */}
        <div className="p-3 border-t border-border bg-background/80 backdrop-blur-sm">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={language === 'Hindi' ? 'अपना सवाल पूछें...' : 'Ask about careers...'}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              disabled={loading}
              className="flex-1 bg-muted/50 border-muted-foreground/20 focus:border-primary"
            />
            <Button 
              onClick={handleSend} 
              disabled={!input.trim() || loading}
              size="icon"
              className="bg-primary hover:bg-primary/90 shrink-0"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
