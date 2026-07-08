type AvatarProps = {
  name: string;
  avatarUrl?: string;
  size?: number;
};

export default function Avatar({ name, avatarUrl, size = 36 }: AvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <div
      style={{ width: size, height: size }}
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-[var(--rr-surface)] text-sm font-semibold text-[var(--rr-text)]"
    >
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
      ) : (
        initial
      )}
    </div>
  );
}
