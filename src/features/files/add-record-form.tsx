"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useZodForm,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { createRecordAction } from "./record.action";

const formSchema = z.object({
  id: z.string().min(1, "ID is required"),
  values: z.string().min(1, "Vector values are required"),
  metadata: z.string().optional(),
});

export const AddRecordForm = (props: {
  index: string;
  namespace: string;
  onSuccess?: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useZodForm({
    schema: formSchema,
    defaultValues: {
      id: "",
      values: "",
      metadata: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      // Parse the vector values from the string input
      let vectorValues: number[];
      try {
        vectorValues = JSON.parse(data.values);
        if (
          !Array.isArray(vectorValues) ||
          !vectorValues.every((v) => typeof v === "number")
        ) {
          throw new Error("Invalid vector format");
        }
      } catch {
        form.setError("values", {
          type: "custom",
          message: "Invalid JSON array format for vector values",
        });
        return;
      }

      // Parse the metadata if provided
      let metadata: Record<string, unknown> | undefined;
      if (data.metadata) {
        try {
          metadata = JSON.parse(data.metadata);
          if (typeof metadata !== "object" || metadata === null) {
            throw new Error("Invalid metadata format");
          }
        } catch {
          form.setError("metadata", {
            type: "custom",
            message: "Invalid JSON format for metadata",
          });
          return;
        }
      }

      // Submit the record
      await createRecordAction({
        indexId: props.index,
        namespaceName: props.namespace,
        record: {
          id: data.id,
          values: vectorValues,
          metadata,
        },
      });

      toast.success("Record created successfully");
      setOpen(false);
      form.reset();

      if (props.onSuccess) {
        props.onSuccess();
      }
    } catch (error) {
      toast.error("Failed to create record");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Record</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Record</DialogTitle>
          <DialogDescription>
            Create a new vector record in the Pinecone database.
          </DialogDescription>
        </DialogHeader>
        <Form form={form} onSubmit={onSubmit}>
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Record ID</FormLabel>
                <FormControl>
                  <Input placeholder="unique-id-123" {...field} />
                </FormControl>
                <FormDescription>
                  A unique identifier for this record
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="values"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vector Values</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="[0.1, 0.2, 0.3, ...]"
                    className="font-mono text-sm"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormDescription>JSON array of vector values</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="metadata"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Metadata (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='{"key": "value", "category": "example"}'
                    className="font-mono text-sm"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  JSON object with metadata properties
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Record"}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
