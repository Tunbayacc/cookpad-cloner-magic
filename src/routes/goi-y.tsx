import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { suggestRecipes, type Suggestion } from "@/lib/suggest.functions";
import { getRecipe } from "@/data/recipes";

export const Route = createFileRoute("/goi-y")({
  head: () => ({
    meta: [
      { title: "Tủ lạnh có gì? — Gợi ý món bằng AI | Bếp Nhà" },
      { name: "description", content: "Nhập nguyên liệu bạn có, AI gợi ý món phù hợp từ Bếp Nhà." },
      { property: "og:title", content: "Tủ lạnh có gì? — Bếp Nhà" },
      { property: "og:description", content: "Nhập nguyên liệu bạn có, AI gợi ý món phù hợp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SuggestPage,
});

function SuggestPage() {
  const suggest = useServerFn(suggestRecipes);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [results, setResults] = useState<Suggestion[] | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || loading) return;
    setLoading(true);
    setError(undefined);
    try {
      const r = await suggest({ data: { ingredients: text } });
      setResults(r.suggestions);
      setError(r.error);
    } catch {
      setError("Không thể gợi ý lúc này. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto max-w-3xl px-4 py-3">
          <Link to="/" className="text-2xl font-extrabold text-primary">Bếp Nhà</Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-extrabold">Tủ lạnh nhà bạn có gì?</h1>
        <p className="mt-2 text-muted-foreground">
          Nhập các nguyên liệu bạn đang có, AI sẽ gợi ý món phù hợp trong Bếp Nhà.
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="Ví dụ: thịt ba chỉ, trứng, nước dừa, hành tím"
            className="w-full rounded-xl border bg-card p-4 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            disabled={loading || !text.trim()}
            className="rounded-full bg-primary px-6 py-2 font-semibold text-primary-foreground disabled:opacity-50"
          >
            {loading ? "Đang tìm món..." : "Gợi ý món"}
          </button>
        </form>

        {error && <p className="mt-6 rounded-lg bg-destructive/10 p-3 text-destructive">{error}</p>}

        {results && !error && results.length === 0 && (
          <p className="mt-6 text-muted-foreground">Chưa có món nào hợp với nguyên liệu này.</p>
        )}

        <div className="mt-6 space-y-4">
          {results?.map((s) => {
            const r = getRecipe(s.slug);
            if (!r) return null;
            return (
              <Link
                key={s.slug}
                to="/mon/$slug"
                params={{ slug: s.slug }}
                className="block rounded-xl border bg-card p-5 transition hover:shadow-md"
              >
                <h2 className="text-lg font-bold">{r.title}</h2>
                <p className="mt-1 text-sm">{s.reason}</p>
                {s.missing.length > 0 && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Cần thêm: {s.missing.join(", ")}
                  </p>
                )}
                <p className="mt-2 text-xs text-muted-foreground">{r.author} · {r.time}</p>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
