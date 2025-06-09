import Link from "next/link";
import { buttonVariants } from "../../components/ui/button";
import { Typography } from "../../components/ui/typography";

export function Page401() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-8">
      <div className="space-y-3 text-center">
        <Typography variant="code">401</Typography>
        <Typography variant="h1">Unauthorized</Typography>
        <Typography>
          Sorry, you are not authorized to access this page.
        </Typography>
      </div>
      <div className="flex items-center gap-4">
        <Link
          href="/auth/signin"
          className={buttonVariants({ variant: "invert" })}
        >
          Sign in
        </Link>
      </div>
    </main>
  );
}
