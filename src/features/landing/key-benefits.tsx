"use client";

import { Typography } from "@/components/ui/typography";
import { AlertCircle, CheckCircle } from "lucide-react";
import { SectionLayout } from "./section-layout";

export const KeyBenefitsSection = () => {
  return (
    <SectionLayout
      variant="card"
      size="base"
      className="flex flex-col items-center justify-center gap-8"
    >
      <div className="text-center">
        <Typography variant="h2">Key Benefits</Typography>
        <Typography variant="muted" className="mt-2 max-w-2xl">
          Our solution addresses the core challenge of maintaining alumni
          engagement while protecting your valuable training content
        </Typography>
      </div>

      <div className="grid w-full gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-lg border bg-red-500/10 p-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <Typography variant="h3" className="text-red-500">
              The Problem
            </Typography>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="mt-1 text-red-500">•</span>
              <Typography>
                Students want continued access after finishing the course
              </Typography>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-red-500">•</span>
              <Typography>
                Sharing all content openly isn't sustainable
              </Typography>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-red-500">•</span>
              <Typography>Alumni become disconnected over time</Typography>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-red-500">•</span>
              <Typography>Valuable learning relationships are lost</Typography>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border bg-green-500/10 p-6">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <Typography variant="h3" className="text-green-500">
              The Solution
            </Typography>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="mt-1 text-green-500">•</span>
              <Typography>
                AI answers questions with references to your resources
              </Typography>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-green-500">•</span>
              <Typography>You retain full control over what is seen</Typography>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-green-500">•</span>
              <Typography>
                Easily manage users through tags and access levels
              </Typography>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-green-500">•</span>
              <Typography>
                Increase course lifetime value and alumni engagement
              </Typography>
            </li>
          </ul>
        </div>
      </div>
    </SectionLayout>
  );
};
