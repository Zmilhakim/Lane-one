import type { ReactNode } from "react";
import { clsx } from "@/lib/clsx";

type BadgeTone = "live" | "idle" | "exit";

/** `exit` is the orange tab every guide sign carries in its corner. */
const TONES: Record<BadgeTone, string> = {
  live: "border-open/70 bg-open/15 text-open",
  idle: "border-marking/40 bg-sign-deep text-marking-dim",
  exit: "border-orange bg-orange text-road-deep",
};

export function Badge({ tone = "idle", children }: { tone?: BadgeTone; children: ReactNode }) {
  return (
    <span
      className={clsx(
        "label inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-semibold",
        TONES[tone],
      )}
    >
      {tone === "live" && <span className="size-1.5 shrink-0 rounded-full bg-open" />}
      {children}
    </span>
  );
}
