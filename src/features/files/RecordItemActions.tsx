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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { deleteRecordAction } from "./record.action";

type RecordDetails = {
  id: string;
  values: number[];
  metadata?: Record<string, unknown>;
};

export const RecordItemActions = (props: {
  id: string;
  index: string;
  namespace: string;
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const { data: recordDetails, isLoading } = useQuery({
    queryKey: ["record", props.index, props.namespace, props.id],
    queryFn: async (): Promise<RecordDetails | null> => {
      const response = await fetch(
        `/api/pinecone/indexes/${props.index}/namespaces/${props.namespace}/records/${props.id}`,
      );
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error("Failed to fetch record details");
      }
      return response.json();
    },
    enabled: detailsDialogOpen,
  });

  const handleDelete = async () => {
    try {
      await deleteRecordAction({
        indexId: props.index,
        namespaceName: props.namespace,
        recordId: props.id,
      });
      toast.success("Record deleted successfully");
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Failed to delete record");
      console.error(error);
    }
  };

  return (
    <div className="flex justify-end">
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={() => setDetailsDialogOpen(true)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View details
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={() => setDeleteDialogOpen(true)}
                  //variant="destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete record
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this record? This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Details</DialogTitle>
            <DialogDescription>ID: {props.id}</DialogDescription>
          </DialogHeader>
          {isLoading ? (
            <div className="py-4">
              <Skeleton className="h-32 w-full" />
            </div>
          ) : !recordDetails ? (
            <div className="py-4 text-center text-gray-500">
              Could not load record details.
            </div>
          ) : (
            <div className="py-4">
              <h3 className="font-medium mb-2">Vector Values (first 5):</h3>
              <pre className="bg-slate-100 p-2 rounded text-xs overflow-auto">
                {JSON.stringify(recordDetails.values.slice(0, 5), null, 2)}
                {recordDetails.values.length > 5 ? "..." : ""}
              </pre>

              {recordDetails.metadata && (
                <>
                  <h3 className="font-medium mt-4 mb-2">Metadata:</h3>
                  <pre className="bg-slate-100 p-2 rounded text-xs overflow-auto">
                    {JSON.stringify(recordDetails.metadata, null, 2)}
                  </pre>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
