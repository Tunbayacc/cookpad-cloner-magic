import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import hero from "@/assets/hero.jpg";
import { recipes } from "@/data/recipes";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bếp Nhà — Công thức nấu ăn mỗi ngày" },
      { name: "description", content: "Tìm và chia sẻ công thức nấu ăn gia đình Việt." },
      { property: "og:title", content: "Bếp Nhà — Công thức nấu ăn mỗi ngày" },
      { property: "og:description", content: "Tìm và chia sẻ công thức nấu ăn gia đình Việt." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const tags = ["Thịt kho", "Canh chua", "Gà rán", "Bánh flan", "Cá kho tộ", "Bún bò", "Chay", "Ăn sáng"];

function Index() {
  const [q, setQ] = useState("");
  const list = recipes.filter((r) => r.title.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <Link to="/" className="text-2xl font-extrabold text-primary">
            Bếp Nhà
          </Link>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm tên món hay nguyên liệu"
            className="flex-1 rounded-full border bg-card px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <button className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            + Viết món mới
          </button>
        </div>
      </header>

      <section className="relative">
        <img src={hero} alt="Bữa cơm gia đình Việt" className="h-[360px] w-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center bg-foreground/40">
          <h1 className="px-4 text-center text-3xl font-extrabold text-background md:text-5xl">
            Hôm nay nấu gì?
          </h1>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="mb-4 text-xl font-bold">Từ khóa thịnh hành</h2>
        <div className="mb-10 flex flex-wrap gap-2">
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setQ(t)}
              className="rounded-full bg-secondary px-4 py-2 text-sm font-medium hover:bg-primary hover:text-primary-foreground"
            >
              {t}
            </button>
          ))}
        </div>

        <h2 className="mb-4 text-xl font-bold">Món mới nhất</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((r) => (
            <Link
              key={r.slug}
              to="/mon/$slug"
              params={{ slug: r.slug }}
              className="overflow-hidden rounded-xl border bg-card shadow-sm transition hover:shadow-md"
            >
              <div className="flex h-40 items-center justify-center bg-secondary text-5xl">🍲</div>
              <div className="p-4">
                <h3 className="font-semibold">{r.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {r.author} · {r.time}
                </p>
              </div>
            </Link>
          ))}
          {list.length === 0 && <p className="text-muted-foreground">Không tìm thấy món nào.</p>}
        </div>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        © 2026 Bếp Nhà
      </footer>
    </div>
  );
}
