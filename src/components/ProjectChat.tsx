import { useEffect, useRef, useState } from "react";
import { useChatStore } from "@/stores/chatStore";
import { useAuthStore } from "@/stores/authStore";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ProjectChatProps {
  projectId: string;
}

export default function ProjectChat({ projectId }: ProjectChatProps) {
  const { user } = useAuthStore();
  const { messages, loading, fetchMessages, sendMessage, subscribeToMessages } = useChatStore();
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages(projectId);
    const unsubscribe = subscribeToMessages(projectId);
    return unsubscribe;
  }, [projectId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      await sendMessage(projectId, newMessage, user.$id, user.name);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <Card className="glass-strong flex flex-col h-[600px]">
      <div className="p-4 border-b border-border/50">
        <h3 className="font-semibold">Team Chat</h3>
        <p className="text-xs text-muted-foreground">Collaborate with your team</p>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {loading ? (
          <div className="text-center text-muted-foreground">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-muted-foreground">No messages yet. Start the conversation!</div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.$id}
                className={`flex flex-col ${
                  message.userId === user?.$id ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.userId === user?.$id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  <div className="text-xs font-medium mb-1 opacity-80">
                    {message.userName}
                  </div>
                  <div className="text-sm break-words">{message.content}</div>
                  <div className="text-xs opacity-60 mt-1">
                    {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <form onSubmit={handleSend} className="p-4 border-t border-border/50">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </Card>
  );
}
