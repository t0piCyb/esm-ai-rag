import type { NavigationGroup } from "@/features/navigation/navigation.type";
import { Files, History, MessageSquare } from "lucide-react";

export const getOrganizationNavigation = (): NavigationGroup[] => {
  return ORGANIZATION_LINKS;
};

export const ORGANIZATION_LINKS: NavigationGroup[] = [
  {
    title: "Menu",
    links: [
      {
        href: `/files`,
        Icon: Files,
        label: "Files",
      },
    ],
  },
  {
    title: "Chat",
    links: [
      {
        label: "New Chat",
        href: `/chat`,
        Icon: MessageSquare,
      },
      {
        label: "Chat History",
        href: `/chat/history`,
        Icon: History,
      },
    ],
  },
] satisfies NavigationGroup[];
