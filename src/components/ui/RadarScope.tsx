/**
 * Decorative radar-scope backdrop: concentric rings + a rotating phosphor
 * sweep, echoing the "Radar" in ReviewRadar. Purely presentational.
 */
export default function RadarScope() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 sm:h-[720px] sm:w-[720px]"
    >
      <div className="absolute inset-0 rounded-full border border-[var(--rr-signal)]/10" />
      <div className="absolute inset-[12%] rounded-full border border-[var(--rr-signal)]/10" />
      <div className="absolute inset-[24%] rounded-full border border-[var(--rr-signal)]/10" />
      <div className="absolute inset-[36%] rounded-full border border-[var(--rr-signal)]/10" />

      <div className="absolute inset-0 animate-radar-sweep rounded-full [mask-image:radial-gradient(circle,black,transparent_78%)]">
        <div
          className="h-full w-full rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, transparent 300deg, var(--rr-signal) 358deg, transparent 360deg)",
            opacity: 0.5,
          }}
        />
      </div>

      <div className="absolute inset-0 rounded-full bg-[var(--rr-signal)]/[0.04] blur-3xl" />
    </div>
  );
}
