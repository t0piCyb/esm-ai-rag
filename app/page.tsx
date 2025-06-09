import type { PageParams } from "@/types/next";
import { redirect } from "next/navigation";

export default async function RoutePage(props: PageParams<{}>) {
  redirect("/chat");
}
