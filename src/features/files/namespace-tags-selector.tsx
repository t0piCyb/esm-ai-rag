"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { OrganizationTag } from "@/generated/prisma";
import { useQuery } from "@tanstack/react-query";
import { Edit2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { useCurrentOrg } from "../../../app/orgs/[orgSlug]/use-current-org";
import { OrgTagsForm } from "../tags/org-tags-form";
export const NamespaceTagsSelector = (props: { initModeEdit: boolean }) => {
  const [namespace, setNamespace] = useQueryState("namespace");
  const org = useCurrentOrg();
  const [isEditing, setIsEditing] = useState(props.initModeEdit);
  const router = useRouter();
  const {
    data: tags,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["tags", org?.id, org?.slug],
    queryFn: () => fetch(`/api/org/${org?.id}/tags`).then((res) => res.json()),
  });

  if (isLoading) return <Skeleton className="w-40 h-10" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization tags</CardTitle>

        <CardDescription>
          Select the tags where the files will be indexed. These tags will
          reference the files the AI can use to answer questions of your users
          with the same tags.
        </CardDescription>
        <CardAction>
          {!isEditing && (
            <Button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              variant={tags && tags.length > 0 ? "outline" : "default"}
              size="sm"
            >
              {tags && tags.length > 0 ? (
                <>
                  <Edit2 /> Edit tags
                </>
              ) : (
                <>
                  <Plus /> Add tags
                </>
              )}
            </Button>
          )}
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center flex-wrap gap-2">
          {isEditing ? (
            <OrgTagsForm
              tags={tags?.map((tag: OrganizationTag) => tag.name) ?? []}
              onfinish={() => {
                refetch();
                setIsEditing(false);
                if (props.initModeEdit) {
                  router.refresh();
                }
              }}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            tags &&
            tags.length > 0 && (
              <ToggleGroup
                type="single"
                value={namespace ?? undefined}
                onValueChange={setNamespace}
                size={"lg"}
              >
                {tags.map((tag: OrganizationTag) => (
                  <ToggleGroupItem key={tag.id} value={tag.name}>
                    {tag.name}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
};
