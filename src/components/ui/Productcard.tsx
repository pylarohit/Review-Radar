type ProductCardProps = {
  product: {
    id: string;
    name: string;
    category: string;
    description: string | null;
  };
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <span className="text-xs font-semibold uppercase text-violet-600 tracking-wider">
        {product.category}
      </span>

      <h3 className="mt-3 text-xl font-bold text-zinc-900">{product.name}</h3>

      <p className="mt-3 line-clamp-2 text-sm text-zinc-500">
        {product.description ?? "No description available."}
      </p>

      <a
        href={`/analysis/${product.id}`}
        className="mt-6 inline-block text-sm font-semibold text-violet-600 hover:text-violet-800 transition-colors"
      >
        View Analysis →
      </a>
    </article>
  );
}