import { useState, useRef, useEffect } from 'react';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/hooks/useCareerGuidance';

interface CareerChatbotProps {
  messages: ChatMessage[];
  loading: boolean;
  onSendMessage: (message: string, language: string) => void;
}

const SUGGESTION_CHIPS = [
  "What career suits me best?",
  "How can I become a Data Scientist?",
  "What skills should I learn?",
  "Compare Software Engineer vs Data Analyst",
  "Explain my roadmap in Hindi",
];

export function CareerChatbot({ messages, loading, onSendMessage }: CareerChatbotProps) {
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState<'English' | 'Hindi'>('English');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    onSendMessage(input.trim(), language);
    setInput('');
  };

  const handleChipClick = (chip: string) => {
    onSendMessage(chip, language);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageCircle className="h-5 w-5 text-primary" />
            AI Career Mentor
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLanguage(l => l === 'English' ? 'Hindi' : 'English')}
            className="gap-1"
          >
            <Globe className="h-3 w-3" />
            {language}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4" ref={scrollRef}>
          <div className="space-y-4 py-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium text-foreground mb-2">
                  Hi! I'm your AI Career Mentor
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Ask me anything about careers, skills, or your personalized roadmap.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {SUGGESTION_CHIPS.slice(0, 3).map((chip, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => handleChipClick(chip)}
                    >
                      {chip}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex",
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-3",
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-muted rounded-bl-md'
                    )}
                  >
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-1 mb-1">
                        <Sparkles className="h-3 w-3 text-primary" />
                        <span className="text-xs font-medium text-primary">AI Mentor</span>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    <p className={cn(
                      "text-[10px] mt-1",
                      msg.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    )}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Suggestion Chips */}
        {messages.length > 0 && (
          <div className="px-4 py-2 border-t border-border/50">
            <ScrollArea className="w-full">
              <div className="flex gap-2 pb-1">
                {SUGGESTION_CHIPS.map((chip, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors whitespace-nowrap"
                    onClick={() => handleChipClick(chip)}
                  >
                    {chip}
                  </Badge>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about careers..."
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={loading}
              className="flex-1"
            />
            <Button 
              onClick={handleSend} 
              disabled={!input.trim() || loading}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
