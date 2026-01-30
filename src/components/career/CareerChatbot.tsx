import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Send,
  Sparkles,
  Loader2,
  Globe,
  Trash2,
  Bot,
  User,
  Zap,
  MessageSquare,
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
    <Card className="h-full flex flex-col overflow-hidden border-0 shadow-xl bg-gradient-to-b from-card via-card to-muted/30">
      {/* Animated Header */}
      <CardHeader className="pb-3 border-b border-border/30 bg-gradient-to-r from-primary/5 via-accent/5 to-success/5 relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-2 left-4 w-2 h-2 rounded-full bg-primary/20 animate-pulse" />
          <div className="absolute top-4 right-8 w-1.5 h-1.5 rounded-full bg-accent/30 animate-bounce" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-2 left-1/3 w-1 h-1 rounded-full bg-success/25 animate-ping" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="flex items-center justify-between relative z-10">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25 animate-pulse">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
              {/* Online indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-success rounded-full border-2 border-card flex items-center justify-center">
                <Zap className="h-2 w-2 text-success-foreground" />
              </div>
            </div>
            <div>
              <span className="font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">AI Career Mentor</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                </span>
                <span className="text-[10px] text-muted-foreground font-medium">Online • Powered by AI</span>
              </div>
            </div>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(l => l === 'English' ? 'Hindi' : 'English')}
              className="gap-1.5 h-8 bg-background/50 backdrop-blur-sm border-border/50 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300"
            >
              <Globe className="h-3.5 w-3.5" />
              {language === 'English' ? 'EN' : 'हिं'}
            </Button>
            {messages.length > 0 && onClearChat && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClearChat}
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300"
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
              <div className="text-center py-8 animate-fade-in">
                {/* Hero illustration */}
                <div className="relative w-20 h-20 mx-auto mb-5">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 via-accent/20 to-success/20 animate-pulse" />
                  <div className="absolute inset-1 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                    <Sparkles className="h-10 w-10 text-primary animate-bounce" style={{ animationDuration: '2s' }} />
                  </div>
                  {/* Orbiting elements */}
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-success/80 flex items-center justify-center animate-bounce" style={{ animationDelay: '0.3s' }}>
                    <MessageSquare className="h-2.5 w-2.5 text-success-foreground" />
                  </div>
                </div>
                
                <h3 className="font-bold text-foreground mb-2 text-lg">
                  {language === 'Hindi' ? 'नमस्ते! मैं आपका AI करियर मेंटर हूं' : "Hi! I'm your AI Career Mentor"}
                </h3>
                <p className="text-sm text-muted-foreground mb-5 max-w-[280px] mx-auto leading-relaxed">
                  {language === 'Hindi' 
                    ? 'करियर, स्किल्स, या अपने रोडमैप के बारे में कुछ भी पूछें।'
                    : 'Ask me anything about careers, skills, or your personalized roadmap.'}
                </p>
                
                {/* Suggestion chips with stagger animation */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {chips.slice(0, 3).map((chip, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className={cn(
                        "cursor-pointer px-3 py-1.5 text-xs font-medium",
                        "bg-gradient-to-r from-muted to-muted/80 hover:from-primary hover:to-primary/80",
                        "hover:text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-md",
                        "animate-fade-in"
                      )}
                      style={{ animationDelay: `${i * 100}ms` }}
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
                    "flex gap-3 animate-fade-in",
                    msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  )}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  {/* Avatar */}
                  <div className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md transition-transform hover:scale-110",
                    msg.role === 'user' 
                      ? "bg-gradient-to-br from-accent to-accent/80" 
                      : "bg-gradient-to-br from-primary to-primary/80"
                  )}>
                    {msg.role === 'user' ? (
                      <User className="h-4 w-4 text-accent-foreground" />
                    ) : (
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    )}
                  </div>
                  
                  {/* Message bubble */}
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-3 shadow-md transition-all duration-300 hover:shadow-lg",
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-accent to-accent/90 text-accent-foreground rounded-tr-md'
                        : 'bg-gradient-to-br from-muted/90 to-muted/70 rounded-tl-md border border-border/30'
                    )}
                  >
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="mb-2 last:mb-0 text-sm leading-relaxed">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                            li: ({ children }) => <li className="text-sm">{children}</li>,
                            strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
                            h1: ({ children }) => <h3 className="font-bold text-base mb-2 text-foreground">{children}</h3>,
                            h2: ({ children }) => <h4 className="font-bold text-sm mb-1 text-foreground">{children}</h4>,
                            h3: ({ children }) => <h5 className="font-semibold text-sm mb-1 text-foreground">{children}</h5>,
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm">{msg.content}</p>
                    )}
                    <p className={cn(
                      "text-[10px] mt-2 opacity-60",
                      msg.role === 'user' ? 'text-right' : 'text-left'
                    )}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
            
            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-3 animate-fade-in">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
                  <Bot className="h-4 w-4 text-primary-foreground animate-pulse" />
                </div>
                <div className="bg-gradient-to-br from-muted/90 to-muted/70 rounded-2xl rounded-tl-md px-4 py-3 shadow-md border border-border/30">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 bg-gradient-to-br from-primary to-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2.5 h-2.5 bg-gradient-to-br from-accent to-success rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2.5 h-2.5 bg-gradient-to-br from-success to-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
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
          <div className="px-3 py-2.5 border-t border-border/30 bg-gradient-to-r from-muted/30 via-background to-muted/30">
            <ScrollArea className="w-full">
              <div className="flex gap-2 pb-1">
                {chips.map((chip, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className={cn(
                      "cursor-pointer whitespace-nowrap transition-all duration-300 px-3 py-1",
                      "bg-background/50 border-border/50",
                      loading 
                        ? "opacity-50 cursor-not-allowed" 
                        : "hover:bg-gradient-to-r hover:from-primary hover:to-primary/80 hover:text-primary-foreground hover:border-primary/50 hover:scale-105 hover:shadow-md"
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
        <div className="p-3 border-t border-border/30 bg-gradient-to-r from-background via-muted/20 to-background">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={language === 'Hindi' ? 'अपना सवाल पूछें...' : 'Ask about careers...'}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              disabled={loading}
              className="flex-1 bg-muted/30 border-border/50 focus:border-primary focus:ring-primary/20 transition-all duration-300 placeholder:text-muted-foreground/60"
            />
            <Button 
              onClick={handleSend} 
              disabled={!input.trim() || loading}
              size="icon"
              className={cn(
                "shrink-0 transition-all duration-300",
                "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-accent",
                "shadow-md hover:shadow-lg hover:scale-105",
                "disabled:opacity-50 disabled:hover:scale-100"
              )}
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
