"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ChatMessage, OrganizationTag } from "@/generated/prisma";
import { Message, useChat } from "@ai-sdk/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ChatBubble } from "./chat-bubble";

export const Chat = (props: { chatHistoryId?: string }) => {
  const chatHistoryId = props.chatHistoryId;
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const { data: chatHistory } = useQuery({
    queryKey: ["chatHistory", props.chatHistoryId],
    queryFn: () =>
      fetch(`/api/chat/history/${props.chatHistoryId}`).then((res) =>
        res.json(),
      ),
    enabled: !!props.chatHistoryId,
  });

  const { data: tags, isLoading: tagsLoading } = useQuery({
    queryKey: ["userTags"],
    queryFn: () => fetch(`/api/chat/userTags`).then((res) => res.json()),
  });

  const {
    messages,
    isLoading,
    input,
    handleInputChange,
    handleSubmit,
    data,
    setData,
  } = useChat({
    api: `/api/chat`,
    body: {
      chatHistoryId,
      tag: selectedTag,
    },
    initialMessages: chatHistory?.messages,
  });

  useEffect(() => {
    if (tags && tags.length > 0) {
      setSelectedTag(tags[0].name);
    }
  }, [tags]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Reset sources and data before sending a new message
    setData(undefined);
    handleSubmit(e);
  };

  if (tagsLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-28" />
      </div>
    );
  }

  const getSources = (role: string, messageId: string) => {
    if (role === "assistant") {
      if (messageId && chatHistory) {
        return (
          chatHistory?.messages.find((m: ChatMessage) => m.id === messageId)
            ?.sources ?? []
        );
      } else {
        return data?.slice(0, -1) ?? [];
      }
    }
    return [];
  };

  return (
    <div className="h-full flex flex-col">
      {tags && tags.length > 1 && (
        <ToggleGroup
          type="single"
          value={selectedTag ?? undefined}
          onValueChange={setSelectedTag}
        >
          {tags?.map((tag: OrganizationTag) => (
            <ToggleGroupItem key={tag.id} value={tag.name}>
              {tag.name}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      )}
      {selectedTag ? (
        <div className="h-full flex flex-col justify-between relative flex-1">
          <div className="p-6 overflow-auto mb-32 ">
            {messages.map(({ id, role, content }: Message) => (
              <ChatBubble
                key={id}
                id={id}
                role={role}
                content={content}
                sources={getSources(role, id)}
              />
            ))}
          </div>

          <div className="flex absolute bottom-5 w-full z-2 p-10 ">
            <form
              onSubmit={handleFormSubmit}
              className="flex flex-row gap-2 w-full"
            >
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask a question"
                className="w-full bg-background"
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send"}
              </Button>
            </form>
          </div>
        </div>
      ) : tags && tags.length > 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-sm text-muted-foreground">
            Select a tag to start chatting
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-sm text-muted-foreground">
            You have no tags yet, please contact your admin to get a tag.
          </p>
        </div>
      )}
    </div>
  );
};
