"use client";

import { BentoGrid, BentoGridItem } from "@/components/ui/bentoo";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { BarChart3, Calendar, Sparkles } from "lucide-react";
import { SectionLayout } from "./section-layout";

export function BentoGridSection() {
  return (
    <SectionLayout>
      <div className="mx-auto max-w-4xl text-center mb-12">
        <Typography variant="h2">Who It's For</Typography>
        <Typography variant="muted" className="mt-4">
          Keep alumni engaged and connected, without rebuilding your system
        </Typography>
      </div>
      <BentoGrid className="mx-auto max-w-4xl md:auto-rows-[20rem]">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            header={item.header}
            className={cn("[&>p:text-lg]", item.className)}
            icon={item.icon}
          />
        ))}
      </BentoGrid>
    </SectionLayout>
  );
}

const Skeleton1 = () => (
  <div className="flex h-full flex-col gap-3 p-2">
    <div className="flex items-center gap-2">
      <img
        alt="student avatar"
        src="https://i.pravatar.cc/40?u=student1"
        className="size-8 rounded-full border"
      />
      <span className="rounded bg-primary/10 px-2 py-1 text-xs text-primary">
        Student
      </span>
    </div>
    <div className="mt-2 rounded-lg bg-background p-3 shadow">
      <p className="text-xs text-muted-foreground">
        What is teached about being holy?
      </p>
    </div>
    <div className="ml-6 mt-1 flex items-start gap-2">
      <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-700">
        AI
      </span>
      <p className="text-xs text-foreground">
        The Bible teaches that being holy is important.{" "}
        <span className="text-primary">[See summary]</span>
      </p>
    </div>
  </div>
);

const Skeleton2 = () => {
  // Training Organizations: Tag-based access control
  return (
    <div className="flex h-full flex-col gap-3 p-2">
      <div className="flex items-center gap-2">
        <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700">
          in-training
        </span>
        <span className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-700">
          graduate
        </span>
        <span className="rounded bg-purple-100 px-2 py-1 text-xs text-purple-700">
          VIP
        </span>
      </div>
      <div className="mt-2 flex flex-col gap-2">
        <div className="flex items-center gap-2 rounded bg-background p-2 shadow">
          <span className="text-xs text-muted-foreground">
            Module 5: Advanced AI
          </span>
          <span className="ml-auto rounded bg-green-200 px-2 py-0.5 text-xs text-green-700">
            Access granted
          </span>
        </div>
        <div className="flex items-center gap-2 rounded bg-background p-2 shadow">
          <span className="text-xs text-muted-foreground">
            Module 6: Premium Content
          </span>
          <span className="ml-auto rounded bg-red-200 px-2 py-0.5 text-xs text-red-700">
            Restricted
          </span>
        </div>
      </div>
    </div>
  );
};

const Skeleton3 = () => {
  // Professional Learning Platforms: Engagement & value
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-2">
      <div className="flex items-center gap-2">
        <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-700">
          Alumni
        </span>
        <span className="rounded bg-primary/10 px-2 py-1 text-xs text-primary">
          AI Answered
        </span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="text-2xl font-bold text-green-600">+32%</span>
        <span className="text-xs text-muted-foreground">Alumni engagement</span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-700">
          Lifetime Value ↑
        </span>
      </div>
    </div>
  );
};

const Skeleton4 = () => {
  const first = {
    initial: {
      x: 20,
      rotate: -5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  };
  const second = {
    initial: {
      x: -20,
      rotate: 5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  };
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 flex-row gap-4"
    >
      <motion.div
        variants={first}
        className="flex h-full w-1/3 flex-col items-center justify-center rounded-2xl border border-border bg-background p-4"
      >
        <Typography variant="large">+123 followers</Typography>
        <Typography variant={"muted"}>In the last 30 days</Typography>
        <Typography variant={"muted"} className="text-green-500">
          +12%
        </Typography>
      </motion.div>
      <motion.div className="flex h-full w-1/3 flex-col items-center justify-center rounded-2xl border border-border bg-background p-4">
        <Typography variant="large">+1.4 M Views</Typography>
        <Typography variant={"muted"}>In the last 30 days</Typography>
        <Typography variant={"muted"} className="text-green-500">
          +21%
        </Typography>
      </motion.div>
      <motion.div
        variants={second}
        className="flex h-full w-1/3 flex-col items-center justify-center rounded-2xl border border-border bg-background p-4"
      >
        <Typography variant="large">1244 likes</Typography>
        <Typography variant="large">766 replis</Typography>
        <Typography variant={"muted"}>In the last 30 days</Typography>
        <Typography variant={"muted"} className="text-green-500">
          +12%
        </Typography>
      </motion.div>
    </motion.div>
  );
};

const Skeleton5 = () => {
  const variants = {
    initial: {
      x: 0,
    },
    animate: {
      x: 10,
      rotate: 5,
      transition: {
        duration: 0.2,
      },
    },
  };
  const variantsSecond = {
    initial: {
      x: 0,
    },
    animate: {
      x: -10,
      rotate: -5,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-col gap-2"
    >
      <motion.div
        variants={variants}
        className="flex flex-row items-start gap-2 rounded-2xl border border-border bg-background p-3"
      >
        <img
          src="https://melvynx.com/_next/image?url=%2Fimages%2Fmy-face.png&w=828&q=75"
          alt="avatar"
          height="100"
          width="100"
          className="size-10 rounded-full"
        />
        <p className="text-xs text-neutral-500">
          What I need to do to get more followers ?
        </p>
      </motion.div>
      <motion.div
        variants={variantsSecond}
        className="flex flex-row items-start justify-end gap-2 rounded-2xl border border-border bg-background p-3"
      >
        <div>
          <p className="text-xs text-neutral-500">Searching...</p>
          <motion.p
            className="text-xs text-neutral-500"
            variants={{
              initial: {
                opacity: 0,
              },
              animate: {
                opacity: 1,
              },
            }}
          >
            Based on the Threads activity of the past 30 days, you should focus
            creating content on Next.js
          </motion.p>
        </div>
        <div className="size-6 shrink-0 rounded-full bg-gradient-to-r from-pink-500 to-violet-500" />
      </motion.div>
    </motion.div>
  );
};

const items = [
  {
    title: "Online Educators",
    description:
      "Perfect for course creators and online education platforms that want to provide continued value to graduates while protecting premium content.",
    header: null,
    className: "md:col-span-1",
    icon: <Calendar className="size-6" />,
  },
  {
    title: "Training Organizations & Schools",
    description:
      "Ideal for educational institutions that want to enhance alumni engagement without diminishing the value of their courses and programs.",
    header: null,
    className: "md:col-span-1",
    icon: <Sparkles className="size-6" />,
  },
  {
    title: "Professional Learning Platforms",
    description:
      "Designed for professional development providers who want to offer continued support to past participants while maintaining content exclusivity.",
    header: null,
    className: "md:col-span-2",
    icon: <BarChart3 className="size-6" />,
  },
];
