import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { getRecipe, recipes } from "@/data/recipes";

export const Route = createFileRoute("/mon/$slug")({
  loader: ({ params }) => {
    const recipe = getRecipe(params.slug);
    if (!recipe) throw notFound();
    return { recipe };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Không tìm thấy món — Bếp Nhà" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { recipe } = loaderData;
    return {
      meta: [
        { title: `${recipe.title} — Bếp Nhà` },
        { name: "description", content: recipe.intro },
        { property: "og:title", content: `${recipe.title} — Bếp Nhà` },
        { property: "og:description", content: recipe.intro },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: RecipeNotFound,
  component: RecipeDetail,
});

function RecipeDetail() {
  const { recipe } = Route.useLoaderData();
  const authorOthers = recipes.filter((r) => r.slug !== recipe.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <Link to="/" className="text-2xl font-extrabold text-primary">
            Bếp Nhà
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Về trang chủ
        </Link>

        <div className="mt-4 flex h-48 items-center justify-center rounded-xl bg-secondary text-7xl">
          🍲
        </div>

        <h1 className="mt-6 text-3xl font-extrabold">{recipe.title}</h1>
        <p className="mt-2 text-muted-foreground">{recipe.intro}</p>

        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-secondary px-3 py-1">⏱ {recipe.time}</span>
          <span className="rounded-full bg-secondary px-3 py-1">🍛 {recipe.servings}</span>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-[1fr_2fr]">
          <section>
            <h2 className="mb-3 text-lg font-bold">Nguyên liệu</h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((i) => (
                <li key={i.name} className="flex justify-between gap-4 border-b pb-2 text-sm">
                  <span>{i.name}</span>
                  <span className="whitespace-nowrap text-muted-foreground">{i.amount}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-xl border bg-card p-4">
              <h3 className="font-semibold">Người đăng</h3>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  {recipe.author.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{recipe.author}</p>
                  <p className="text-xs text-muted-foreground">
                    {recipe.authorRecipes} công thức
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{recipe.authorBio}</p>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold">Hướng dẫn nấu</h2>
            <ol className="space-y-4">
              {recipe.steps.map((s, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {idx + 1}
                  </span>
                  <p className="pt-1 text-sm">{s}</p>
                </li>
              ))}
            </ol>

            {recipe.tips && (
              <div className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
                <span className="font-semibold">💡 Mẹo nhỏ: </span>
                {recipe.tips}
              </div>
            )}
          </section>
        </div>

        <section className="mt-12">
          <h2 className="mb-4 text-lg font-bold">Công thức khác</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {authorOthers.map((r) => (
              <Link
                key={r.slug}
                to="/mon/$slug"
                params={{ slug: r.slug }}
                className="rounded-xl border bg-card p-4 transition hover:shadow-md"
              >
                <div className="mb-2 flex h-20 items-center justify-center rounded-lg bg-secondary text-3xl">
                  🍲
                </div>
                <p className="font-medium">{r.title}</p>
                <p className="text-xs text-muted-foreground">
                  {r.author} · {r.time}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        © 2026 Bếp Nhà
      </footer>
    </div>
  );
}

function RecipeNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-foreground">
      <p className="text-5xl">🍜</p>
      <h1 className="text-2xl font-bold">Không tìm thấy món này</h1>
      <Link to="/" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
        Về trang chủ
      </Link>
    </div>
  );
}
