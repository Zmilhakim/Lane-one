import { clsx } from "@/lib/clsx";

/**
 * One figure off the chain. `value` is whatever was read — when there is nothing
 * to read it says so, rather than showing a zero that could be mistaken for a
 * measurement.
 */
export function StatTile({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: string | null | undefined;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={clsx("rounded-lg border border-marking/30 bg-sign-deep px-3 py-2.5", className)}>
      <div className="label text-marking-dim">{label}</div>
      <div
        className={clsx(
          "mt-1 truncate font-mono text-lg font-semibold",
          value ? "text-marking" : "text-marking-faint",
        )}
      >
        {value ?? "n/a"}
      </div>
      {hint && <div className="label mt-0.5 text-marking-faint">{hint}</div>}
    </div>
  );
}
