"use client";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { ChatHistory, ChatMessage } from "@/generated/prisma";
import { useMutation } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { deleteChatHistoryAction } from "./chat-history.action";
export const ChatHistoryItem = (props: {
  orgSlug: string;
  chatHistory: ChatHistory & { messages: ChatMessage[] };
}) => {
  const { mutate: deleteChatHistory, isPending } = useMutation({
    mutationFn: deleteChatHistoryAction,
    onSuccess: () => {
      toast.success("Chat history deleted");
    },
    onError: () => {
      toast.error("Failed to delete chat history");
    },
  });

  return (
    <div
      key={props.chatHistory.id}
      className="relative group/item flex items-center justify-between p-4 rounded-lg border hover:border-primary transition-colors"
    >
      <Link
        href={`/orgs/${props.orgSlug}/chat/${props.chatHistory.id}`}
        className="block flex-1"
      >
        <div className="flex justify-between items-start mb-2">
          <Typography variant="h3">{props.chatHistory.title}</Typography>
          <Typography variant="small" className="text-muted-foreground">
            {formatDistanceToNow(props.chatHistory.updatedAt, {
              addSuffix: true,
            })}
          </Typography>
        </div>
        {props.chatHistory.messages[1] && (
          <Typography
            variant="small"
            className="text-muted-foreground line-clamp-2"
          >
            {props.chatHistory.messages[1].content}
          </Typography>
        )}
      </Link>
      <div className="group-hover/item:flex hidden ml-4">
        <Button
          variant="ghost"
          size="icon"
          disabled={isPending}
          onClick={() => {
            deleteChatHistory({ chatHistoryId: props.chatHistory.id });
          }}
          aria-label="Delete chat history"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
