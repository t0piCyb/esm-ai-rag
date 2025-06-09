import { buttonVariants } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import Link from "next/link";
import { SectionLayout } from "../section-layout";

export const CTAImageSection = () => {
  return (
    <div
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
        backgroundSize: "cover",
      }}
    >
      <SectionLayout
        variant="image"
        className="flex min-h-[500px] flex-col items-center justify-center gap-4 text-white drop-shadow-md"
      >
        <Typography
          variant="h2"
          className="text-center text-5xl font-extrabold"
        >
          Transform How Alumni Engage With Your Training
        </Typography>
        <Typography className="text-center font-bold">
          Protect your content while providing ongoing value through AI-powered
          answers
        </Typography>
        <Link href="#pricing" className={buttonVariants({ size: "lg" })}>
          Discover the Solution
        </Link>
      </SectionLayout>
    </div>
  );
};
