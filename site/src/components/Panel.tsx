import type { ReactNode } from "react";
import { clsx } from "@/lib/clsx";

type PanelProps = {
  /** The caption along the top of the sign. */
  label?: string;
  /** Anything that belongs on the right of it — a status, a count. */
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
};

/**
 * A guide sign.
 *
 * Green panel, rounded, with the white border set in from the edge — that inset
 * is the one detail that makes a green rectangle read as signage rather than as
 * a card. Every surface on this page is one, the way every surface on the
 * launchpad's site is a sharp-cornered panel with a yellow batten. Neither
 * should be mistakable for the other.
 */
export function Panel({ label, aside, children, className, bodyClassName }: PanelProps) {
  return (
    <section className={clsx("sign-panel", className)}>
      <div className="h-full rounded-lg border-[3px] border-marking">
        {(label || aside) && (
          <header className="flex items-center justify-between gap-3 border-b border-marking/35 px-4 py-2.5">
            {label ? <span className="label font-semibold text-marking">{label}</span> : <span />}
            {aside}
          </header>
        )}
        <div className={clsx("p-4 sm:p-5", bodyClassName)}>{children}</div>
      </div>
    </section>
  );
}
