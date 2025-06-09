"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InlineTooltip } from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useQueryState } from "nuqs";
import { toast } from "sonner";
import { useAlertDialogStore } from "../alert-dialog/alert-dialog-store";
import { FileUploaderDialog } from "./file-uploader-dialog";
import { deleteDocumentAction } from "./uploadFiles.action";

const FileItemActions = (props: { id: string; name: string }) => {
  const dialog = useAlertDialogStore((state) => state.addDialog);

  const { execute, isExecuting } = useAction(deleteDocumentAction, {
    onSuccess: () => {
      toast.success(`File ${props.name} deleted`);
    },
    onError: () => {
      toast.error(`Failed to delete file ${props.name}`);
    },
  });
  const deleteDialog = (id: string, name: string) => {
    dialog({
      title: "Delete file",
      description: `Are you sure you want to delete this file? `,
      loading: isExecuting,
      action: {
        label: "Delete",
        onClick: () => execute({ id }),
        variant: "destructive",
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            e.stopPropagation();
            deleteDialog(props.id, props.name);
          }}
          className="text-red-600"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete file
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const FilesList = () => {
  const [namespace] = useQueryState("namespace", {
    defaultValue: "default",
  });
  const { data, isLoading } = useQuery({
    queryKey: ["files", namespace],
    queryFn: () =>
      fetch(`/api/pinecone/indexes/default/namespaces/${namespace}/files`).then(
        (res) => res.json(),
      ),
    enabled: !!namespace,
  });

  if (isLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex flex-col gap-4 py-8 text-center">
        <p className=" text-muted-foreground">
          No files found in this namespace.
        </p>
        <FileUploaderDialog />
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>File Name</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((file: { id: string; name: string; createdAt: string }) => (
            <TableRow key={file.id}>
              <TableCell className="font-medium max-w-[30vw] truncate">
                <InlineTooltip
                  title={file.name}
                  className="max-w-xl break-all whitespace-pre-line"
                >
                  {file.name}
                </InlineTooltip>
              </TableCell>
              <TableCell>{new Date(file.createdAt).toLocaleString()}</TableCell>
              <TableCell className="text-right">
                <FileItemActions id={file.id} name={file.name} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
