import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/lib/session";

export function SiteHeader({ children }: { children?: ReactNode }) {
  const { user, ready } = useUser();
  const navigate = useNavigate();
  const qc = useQueryClient();

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const name = (user?.user_metadata?.["full_name"] as string) || user?.email || "";

  return (
    <header className="sticky top-0 z-10 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
        <Link to="/" className="text-2xl font-extrabold text-primary">
          Bếp Nhà
        </Link>
        <div className="flex-1">{children}</div>
        <Link to="/goi-y" className="rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary">
          Tủ lạnh có gì?
        </Link>
        <Link to="/viet-mon" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          + Viết món mới
        </Link>
        {ready &&
          (user ? (
            <div className="flex items-center gap-2 text-sm">
              <Link to="/yeu-thich" className="rounded-full border px-3 py-2 font-semibold hover:bg-secondary">
                ♥ Yêu thích
              </Link>
              <span className="hidden max-w-[10rem] truncate text-muted-foreground lg:inline">{name}</span>
              <button onClick={signOut} className="rounded-full border px-3 py-2 hover:bg-secondary">
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link to="/auth" className="rounded-full border px-4 py-2 text-sm font-semibold hover:bg-secondary">
              Đăng nhập
            </Link>
          ))}
      </div>
    </header>
  );
}
