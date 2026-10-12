import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/lib/session";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, LogOut, Plus, Refrigerator, ChefHat } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

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
  const avatarUrl = (user?.user_metadata?.["avatar_url"] as string) || "";
  const initial = name ? name.trim().charAt(0).toUpperCase() : "?";

  return (
    <header className="glass-header sticky top-0 z-10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-5 py-4">
        <SidebarTrigger className="md:hidden" />
        <Link to="/" className="flex items-center gap-2 text-lg font-extrabold text-primary md:hidden">
          <ChefHat className="h-5 w-5" /> Bếp Nhà
        </Link>
        <div className="min-w-[160px] flex-1">{children}</div>
        <div className="header-actions flex flex-wrap items-center gap-2">
        <Button asChild variant="outline" className="glass-control rounded-full">
          <Link to="/goi-y"><Refrigerator /> <span className="hidden lg:inline">Tủ lạnh có gì?</span><span className="lg:hidden">Tủ lạnh</span></Link>
        </Button>
        <Button asChild className="rounded-full">
          <Link to="/viet-mon"><Plus /> Viết món mới</Link>
        </Button>
        {ready &&
          (user ? (
            <div className="flex items-center gap-2 text-sm">
              <Button asChild variant="ghost" size="icon" className="rounded-full" title="Món yêu thích"><Link to="/yeu-thich" aria-label="Món yêu thích"><Heart /></Link></Button>
              <Avatar className="h-8 w-8 ring-1 ring-border">
                <AvatarImage src={avatarUrl} alt={name} />
                <AvatarFallback className="bg-muted text-xs font-semibold">{initial}</AvatarFallback>
              </Avatar>
              <Button onClick={signOut} variant="ghost" size="icon" title="Đăng xuất" aria-label="Đăng xuất"><LogOut /></Button>
            </div>
          ) : (
            <Button asChild variant="ghost" className="rounded-full"><Link to="/auth">Đăng nhập</Link></Button>
          ))}
        </div>
      </div>
    </header>
  );
}
