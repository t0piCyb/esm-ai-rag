import { cn, formattedSourceText } from "@/lib/utils";
import { Message } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Balancer from "react-wrap-balancer";

interface ChatBubbleProps extends Message {
  sources: { content: string; title: string }[];
}

export const ChatBubble = ({
  role = "assistant",
  content,
  sources,
}: ChatBubbleProps) => {
  if (!content) return null;

  return (
    <div>
      <Card className="mb-2">
        <CardHeader>
          <CardTitle
            className={cn(
              role !== "assistant"
                ? "text-amber-500 dark:text-amber-200"
                : "text-blue-500 dark:text-blue-200",
            )}
          >
            {role === "assistant" ? "🤖" : "👤"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Balancer>
            <ReactMarkdown>{content}</ReactMarkdown>
          </Balancer>
        </CardContent>
        <CardFooter>
          <CardDescription>
            {sources.length > 0 && (
              <Accordion type="single" collapsible>
                {sources.map(
                  (source, i) =>
                    source.content && (
                      <AccordionItem key={i} value={`source-${i}`}>
                        <AccordionTrigger>{source.title}</AccordionTrigger>
                        <AccordionContent>
                          <ReactMarkdown>
                            {formattedSourceText(source.content)}
                          </ReactMarkdown>
                        </AccordionContent>
                      </AccordionItem>
                    ),
                )}
              </Accordion>
            )}
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
};
