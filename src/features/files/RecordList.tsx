"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Plus, RefreshCw } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { FileUploader } from "./file-uploader";
import { RecordItemActions } from "./RecordItemActions";

const PAGE_SIZES = [10, 25, 50, 100] as const;

export const RecordList = (props: { orgId: string }) => {
  const [index] = useQueryState("index");
  const [namespace] = useQueryState("namespace");
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [next, setNext] = useQueryState("next");
  const [pageSize, setPageSize] = useQueryState(
    "pageSize",
    parseAsInteger.withDefault(10),
  );

  const { data, isPending, refetch } = useQuery({
    queryKey: ["records", index, namespace, page, next, pageSize],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      queryParams.set("limit", pageSize.toString());
      if (next && page > 1) {
        queryParams.set("next", next);
      }
      const url = `/api/org/${props.orgId}/pinecone/indexes/${index}/namespaces/${namespace}/records?${queryParams.toString()}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch records");
      }
      const data = await response.json();

      return data;
    },
    enabled: !!index && !!namespace,
  });

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (data?.pagination?.next) {
      setPage(page + 1);
      setNext(data.pagination.next);
    }
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(parseInt(value));
    setPage(1); // Reset to first page when changing page size
    setNext(null); // Reset pagination token
  };

  if (!index || !namespace) return <FileUploader />;

  if (isPending) return <Skeleton className="h-10 w-full" />;

  if (!data) {
    return (
      <div>
        <FileUploader />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Records</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            title="Refresh Records"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4" />
                Add Files
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Files</DialogTitle>
                <DialogDescription>
                  Upload files to the namespace.
                </DialogDescription>
              </DialogHeader>
              <FileUploader />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {data.vectors?.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          No records found in this namespace.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableCaption>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground">
                    Page {page}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Show:</span>
                    <Select
                      value={pageSize.toString()}
                      onValueChange={handlePageSizeChange}
                    >
                      <SelectTrigger className="w-[80px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PAGE_SIZES.map((size) => (
                          <SelectItem key={size} value={size.toString()}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={page <= 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={!data.pagination?.next}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Record ID</TableHead>
                <TableHead className="w-[150px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.vectors.map((vector: { id: string }) => (
                <TableRow key={vector.id}>
                  <TableCell className="font-medium">
                    <div className="truncate ">{vector.id}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <RecordItemActions
                      id={vector.id}
                      index={index}
                      namespace={namespace}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
