import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import type { ChatMessage } from '@/hooks/useCareerGuidance';

interface FullscreenChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
  "Explain my career roadmap",
  "What are emerging tech careers?",
  "How to transition into AI/ML?",
  "Best certifications for my field?",
];

const SUGGESTION_CHIPS_HINDI = [
  "मेरे लिए कौन सा करियर सबसे अच्छा है?",
  "Data Scientist कैसे बनें?",
  "पहले कौन से स्किल्स सीखूं?",
  "सॉफ्टवेयर इंजीनियर की सैलरी कितनी है?",
  "मेरा करियर रोडमैप समझाएं",
  "उभरते हुए टेक करियर क्या हैं?",
  "AI/ML में कैसे आएं?",
  "मेरे क्षेत्र के लिए सर्वश्रेष्ठ सर्टिफिकेशन?",
];

export function FullscreenChatDialog({
  open,
  onOpenChange,
  messages,
  loading,
  onSendMessage,
  onClearChat,
}: FullscreenChatDialogProps) {
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

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] h-[90vh] p-0 gap-0 overflow-hidden bg-gradient-to-br from-background via-background to-muted/30">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-success/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Header */}
        <DialogHeader className="p-4 border-b border-border/30 bg-gradient-to-r from-primary/10 via-accent/5 to-success/10 relative z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
                  <Bot className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-success rounded-full border-2 border-background flex items-center justify-center">
                  <Zap className="h-2.5 w-2.5 text-success-foreground" />
                </div>
              </div>
              <div>
                <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">AI Career Mentor</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">Online • Full Experience Mode</span>
                </div>
              </div>
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage(l => l === 'English' ? 'Hindi' : 'English')}
                className="gap-2 bg-background/80 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/50 transition-all"
              >
                <Globe className="h-4 w-4" />
                {language === 'English' ? 'English' : 'हिंदी'}
              </Button>
              {messages.length > 0 && onClearChat && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClearChat}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative z-10">
          <ScrollArea className="flex-1 h-[calc(90vh-180px)]" ref={scrollRef}>
            <div className="space-y-6 p-6">
              {messages.length === 0 ? (
                <div className="text-center py-16 animate-fade-in">
                  <div className="relative w-28 h-28 mx-auto mb-8">
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/30 via-accent/20 to-success/30 animate-pulse" />
                    <div className="absolute inset-2 rounded-2xl bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center backdrop-blur-sm">
                      <Sparkles className="h-14 w-14 text-primary-foreground animate-bounce" style={{ animationDuration: '2s' }} />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-xl bg-gradient-to-br from-success to-success/80 flex items-center justify-center shadow-lg animate-bounce" style={{ animationDelay: '0.5s' }}>
                      <MessageSquare className="h-4 w-4 text-success-foreground" />
                    </div>
                  </div>
                  
                  <h2 className="font-bold text-3xl mb-4 bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent">
                    {language === 'Hindi' ? 'नमस्ते! मैं आपका AI करियर मेंटर हूं' : "Welcome to AI Career Mentor"}
                  </h2>
                  <p className="text-muted-foreground mb-8 max-w-lg mx-auto text-lg leading-relaxed">
                    {language === 'Hindi' 
                      ? 'करियर, स्किल्स, या अपने रोडमैप के बारे में कुछ भी पूछें। मैं आपकी मदद के लिए यहां हूं!'
                      : 'Ask me anything about careers, skills, salary insights, or your personalized learning roadmap. I\'m here to guide your journey!'}
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
                    {chips.map((chip, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className={cn(
                          "cursor-pointer px-4 py-3 text-sm font-medium justify-center text-center",
                          "bg-gradient-to-br from-muted to-muted/80 hover:from-primary hover:to-accent",
                          "hover:text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg",
                          "animate-fade-in border border-border/50 hover:border-primary/50"
                        )}
                        style={{ animationDelay: `${i * 80}ms` }}
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
                      "flex gap-4 animate-fade-in max-w-4xl",
                      msg.role === 'user' ? 'flex-row-reverse ml-auto' : 'flex-row'
                    )}
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <div className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-lg transition-transform hover:scale-110",
                      msg.role === 'user' 
                        ? "bg-gradient-to-br from-accent to-accent/80" 
                        : "bg-gradient-to-br from-primary to-primary/80"
                    )}>
                      {msg.role === 'user' ? (
                        <User className="h-5 w-5 text-accent-foreground" />
                      ) : (
                        <Bot className="h-5 w-5 text-primary-foreground" />
                      )}
                    </div>
                    
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-5 py-4 shadow-lg transition-all duration-300 hover:shadow-xl",
                        msg.role === 'user'
                          ? 'bg-gradient-to-br from-accent to-accent/90 text-accent-foreground rounded-tr-sm'
                          : 'bg-gradient-to-br from-card to-muted/50 rounded-tl-sm border border-border/50'
                      )}
                    >
                      {msg.role === 'assistant' ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <p className="mb-3 last:mb-0 text-[15px] leading-relaxed">{children}</p>,
                              ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-2">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-2">{children}</ol>,
                              li: ({ children }) => <li className="text-[15px]">{children}</li>,
                              strong: ({ children }) => <strong className="font-bold text-primary">{children}</strong>,
                              h1: ({ children }) => <h3 className="font-bold text-lg mb-3 text-foreground">{children}</h3>,
                              h2: ({ children }) => <h4 className="font-bold text-base mb-2 text-foreground">{children}</h4>,
                              h3: ({ children }) => <h5 className="font-semibold text-[15px] mb-2 text-foreground">{children}</h5>,
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-[15px]">{msg.content}</p>
                      )}
                      <p className={cn(
                        "text-xs mt-3 opacity-60",
                        msg.role === 'user' ? 'text-right' : 'text-left'
                      )}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              
              {loading && (
                <div className="flex gap-4 animate-fade-in">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                    <Bot className="h-5 w-5 text-primary-foreground animate-pulse" />
                  </div>
                  <div className="bg-gradient-to-br from-card to-muted/50 rounded-2xl rounded-tl-sm px-5 py-4 shadow-lg border border-border/50">
                    <div className="flex items-center gap-4">
                      <div className="flex gap-2">
                        <span className="w-3 h-3 bg-gradient-to-br from-primary to-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-3 h-3 bg-gradient-to-br from-accent to-success rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-3 h-3 bg-gradient-to-br from-success to-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-sm text-muted-foreground font-medium">
                        {language === 'Hindi' ? 'सोच रहा हूं...' : 'Crafting your personalized response...'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Suggestions */}
          {messages.length > 0 && (
            <div className="px-6 py-3 border-t border-border/30 bg-gradient-to-r from-muted/30 via-background to-muted/30">
              <ScrollArea className="w-full">
                <div className="flex gap-2 pb-1">
                  {chips.map((chip, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className={cn(
                        "cursor-pointer whitespace-nowrap transition-all duration-300 px-4 py-2",
                        "bg-background/80 border-border/50 backdrop-blur-sm",
                        loading 
                          ? "opacity-50 cursor-not-allowed" 
                          : "hover:bg-gradient-to-r hover:from-primary hover:to-accent hover:text-primary-foreground hover:border-primary/50 hover:scale-105 hover:shadow-lg"
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
          <div className="p-4 border-t border-border/30 bg-gradient-to-r from-background via-muted/20 to-background">
            <div className="flex gap-3 max-w-3xl mx-auto">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={language === 'Hindi' ? 'अपना सवाल पूछें...' : 'Ask about careers, skills, salaries...'}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                disabled={loading}
                className="flex-1 h-12 text-base bg-muted/30 border-border/50 focus:border-primary focus:ring-primary/20 transition-all duration-300 placeholder:text-muted-foreground/60"
              />
              <Button 
                onClick={handleSend} 
                disabled={!input.trim() || loading}
                size="lg"
                className={cn(
                  "shrink-0 h-12 px-6 transition-all duration-300",
                  "bg-gradient-to-r from-primary via-primary to-accent hover:from-primary/90 hover:to-accent/90",
                  "shadow-lg hover:shadow-xl hover:scale-105",
                  "disabled:opacity-50 disabled:hover:scale-100"
                )}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Send
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
