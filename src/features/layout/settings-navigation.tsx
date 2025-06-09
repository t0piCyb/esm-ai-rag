"use client";

import { useMatchingPathname } from "@/hooks/use-matching-pathname";
import { motion } from "framer-motion";
import Link from "next/link";

type SettingLink = {
  href: string;
  label: string;
};

type SettingsNavigationProps = {
  links: SettingLink[];
};

export const SettingsNavigation = (props: SettingsNavigationProps) => {
  const matchingLink = useMatchingPathname(props.links.map((l) => l.href));

  return (
    <div
      className="top-4 flex items-start justify-start gap-2 max-md:w-full lg:sticky lg:flex-col lg:items-stretch"
      style={{ minWidth: 150 }}
    >
      {props.links.map((link) => {
        const isMatching = link.href === matchingLink;

        return (
          <div key={link.href} className="relative h-10">
            {isMatching && (
              <motion.div
                className="absolute inset-0 rounded-md bg-accent/50"
                layoutId="settings-link-list"
              />
            )}
            <Link
              className="relative line-clamp-1 inline-flex h-10 w-full items-center justify-center rounded-md border border-transparent px-2.5 text-sm text-foreground transition-all duration-75 hover:border-accent/50 lg:text-left"
              href={link.href}
            >
              {link.label}
            </Link>
          </div>
        );
      })}
    </div>
  );
};
