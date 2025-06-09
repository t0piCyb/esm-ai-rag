"use client";
import { logger } from "@/lib/logger";
import { useAction } from "next-safe-action/hooks";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useZodForm,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useQueryState } from "nuqs";
import { toast } from "sonner";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { uploadFilesAction } from "./uploadFiles.action";

const FileUploaderFormSchema = zfd.formData({
  namespace: zfd.text(),
  docs: zfd.file().array(),
});

export const FileUploader = (props: { namespaces?: string[] }) => {
  const mutation = useAction(uploadFilesAction, {
    onSuccess: () => {
      form.reset();
      toast.success("Files uploaded successfully");
    },
    onError: (error) => {
      logger.error("Error uploading files", error);
      toast.error("Error uploading files");
    },
  });

  const {
    data: tags,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["tags"],
    queryFn: () => fetch(`/api/chat/userTags`).then((res) => res.json()),
  });

  const [namespace, _] = useQueryState("namespace");

  const form = useZodForm({
    schema: FileUploaderFormSchema,
    defaultValues: {
      namespace: namespace || undefined,
    },
  });

  const onSubmit = (data: z.infer<typeof FileUploaderFormSchema>) => {
    mutation.execute(data);
  };

  return (
    <div className="flex flex-col gap-4">
      <Form form={form} onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <FormField
            control={form.control}
            name="namespace"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tag</FormLabel>
                {isLoading ? (
                  <Skeleton className="w-full h-10" />
                ) : (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a tag" />
                    </SelectTrigger>
                    <SelectContent>
                      {tags?.map((tag: { name: string }) => (
                        <SelectItem key={tag.name} value={tag.name}>
                          {tag.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="docs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Docs</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    placeholder="docs"
                    multiple
                    accept=".txt"
                    onChange={(e) => {
                      const files = e.target.files
                        ? Array.from(e.target.files)
                        : [];
                      field.onChange(files);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 className="animate-spin" /> : "Submit"}
        </Button>
      </Form>
    </div>
  );
};
