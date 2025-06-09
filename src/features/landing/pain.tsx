"use client";

import { Typography } from "@/components/ui/typography";
import { SectionLayout } from "./section-layout";

export const PainSection = () => {
  return (
    <SectionLayout
      variant="card"
      size="base"
      className="flex flex-col items-center justify-center gap-4"
    >
      <div className="flex w-full flex-col items-center gap-3 lg:gap-4 xl:gap-6">
        <Typography variant="h1">Why This Project?</Typography>
        <Typography variant="large">
          Keeping alumni connected without compromising formation value
        </Typography>
        <div className="flex items-start gap-4 max-lg:flex-col">
          <div className="flex-1 rounded-lg bg-red-500/20 p-4 lg:p-6">
            <Typography variant="h3" className="text-red-500">
              😞 The Challenge
            </Typography>
            <ul className="ml-4 mt-4 flex list-disc flex-col gap-2 text-lg text-foreground/80">
              <li>Alumni want to stay connected to the formation</li>
              <li>Exposing the full content would destroy its value</li>
              <li>Questions remain unanswered over time</li>
              <li>Valuable knowledge goes unused</li>
            </ul>
          </div>
          <div className="flex-1 rounded-lg bg-green-500/20 p-4 lg:p-6">
            <Typography variant="h3" className="text-green-500">
              😎 The Solution
            </Typography>
            <ul className="ml-4 mt-4 flex list-disc flex-col gap-2 text-lg text-foreground/80">
              <li>AI that quotes video transcripts to answer questions</li>
              <li>Precise answers without revealing actual material</li>
              <li>Students stay connected to your training</li>
              <li>You maintain control of your valuable content</li>
            </ul>
          </div>
        </div>
      </div>
    </SectionLayout>
  );
};
