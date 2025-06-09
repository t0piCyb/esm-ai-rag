import { FileUploaderDialog } from "@/features/files/file-uploader-dialog";
import { FilesList } from "@/features/files/files-list";
import {
  Layout,
  LayoutActions,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { combineWithParentMetadata } from "@/lib/metadata";

export const generateMetadata = combineWithParentMetadata({
  title: "Files",
  description: "Manage the files of the chatbot knowledge base",
});

export default async function RoutePage() {
  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Files management</LayoutTitle>
        <LayoutActions>{<FileUploaderDialog />}</LayoutActions>
      </LayoutHeader>
      <LayoutContent className="flex flex-col gap-4">
        <FilesList />
      </LayoutContent>
    </Layout>
  );
}
