import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { lovable } from "@/integrations/lovable/index";
import { useUser } from "@/lib/session";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Đăng nhập / Đăng ký — Bếp Nhà" },
      { name: "description", content: "Đăng nhập Bếp Nhà để chia sẻ công thức nấu ăn của bạn." },
      { property: "og:title", content: "Đăng nhập / Đăng ký — Bếp Nhà" },
      { property: "og:description", content: "Đăng nhập Bếp Nhà để chia sẻ công thức nấu ăn của bạn." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/viet-mon" });
  }, [user, navigate]);

  async function google() {
    setLoading(true);
    setError("");
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (result.error) {
      setError("Không đăng nhập được. Vui lòng thử lại.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary px-4 text-foreground">
      <div className="w-full max-w-sm rounded-2xl border bg-card p-8 text-center shadow-sm">
        <Link to="/" className="text-3xl font-extrabold text-primary">
          Bếp Nhà
        </Link>
        <h1 className="mt-4 text-xl font-bold">Đăng nhập hoặc đăng ký</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Lần đầu đăng nhập sẽ tự tạo tài khoản. Sau đó bạn có thể đăng món của riêng mình.
        </p>
        <button
          onClick={google}
          disabled={loading}
          className="mt-6 w-full rounded-full border bg-background px-4 py-3 font-semibold hover:bg-secondary disabled:opacity-60"
        >
          {loading ? "Đang mở Google..." : "Tiếp tục với Google"}
        </button>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      </div>
    </div>
  );
}
