import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Camera, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAvatarUrl, useProfile, useUser } from "@/lib/session";
import { SiteHeader } from "@/components/SiteHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/ca-nhan")({
  head: () => ({
    meta: [
      { title: "Trang cá nhân — Bếp Nhà" },
      { name: "description", content: "Đổi ảnh đại diện và tên tài khoản Bếp Nhà của bạn." },
      { property: "og:title", content: "Trang cá nhân — Bếp Nhà" },
      { property: "og:description", content: "Đổi ảnh đại diện và tên tài khoản Bếp Nhà của bạn." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, ready } = useUser();
  const { profile, loaded } = useProfile(user?.id);
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const oldAvatarUrl = useAvatarUrl(profile?.avatar_url);
  const previewUrl = file ? URL.createObjectURL(file) : oldAvatarUrl;

  useEffect(() => {
    if (profile) setName(profile.display_name ?? "");
  }, [profile]);

  if (!ready || !loaded || !user) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Đang tải hồ sơ...
      </div>
    );
  }

  const initial = (name || user.email || "?").trim().charAt(0).toUpperCase();

  async function save() {
    if (!user) return;
    const displayName = name.trim();
    if (!displayName) {
      toast.error("Vui lòng nhập tên hiển thị.");
      return;
    }
    setSaving(true);
    try {
      let avatarPath = profile?.avatar_url ?? null;
      if (file) {
        const ext = file.name.split(".").pop() || "jpg";
        const newPath = `${user.id}/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("avatars").upload(newPath, file);
        if (upErr) throw upErr;
        if (avatarPath) await supabase.storage.from("avatars").remove([avatarPath]);
        avatarPath = newPath;
      }

      const { error: dbErr } = await supabase
        .from("profiles")
        .update({ display_name: displayName, avatar_url: avatarPath })
        .eq("id", user.id);
      if (dbErr) throw dbErr;

      await supabase.auth.updateUser({
        data: { full_name: displayName },
      });

      toast.success("Đã lưu hồ sơ của bạn.");
      setFile(null);
      router.invalidate();
    } catch {
      toast.error("Không lưu được. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen">
      <SiteHeader>
        <h1 className="text-lg font-bold">Trang cá nhân</h1>
      </SiteHeader>
      <main className="mx-auto max-w-xl px-5 py-8">
        <div className="glass-surface rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="group relative rounded-full"
              title="Đổi ảnh đại diện"
            >
              <Avatar className="h-28 w-28 ring-2 ring-border">
                {previewUrl && <AvatarImage src={previewUrl} alt={name} />}
                <AvatarFallback className="bg-muted text-3xl font-bold">{initial}</AvatarFallback>
              </Avatar>
              <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <Camera className="h-7 w-7 text-white" />
              </span>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <p className="text-xs text-muted-foreground">Bấm vào ảnh để chọn ảnh mới · JPG, PNG hoặc WebP · tối đa 5 MB</p>
          </div>

          <div className="mt-6 space-y-2">
            <Label htmlFor="display-name">Tên hiển thị</Label>
            <Input
              id="display-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tên của bạn"
              maxLength={60}
            />
            <p className="text-xs text-muted-foreground">Tên này hiển thị cùng các món bạn đăng.</p>
          </div>

          <div className="mt-6 space-y-2">
            <Label>Email</Label>
            <Input value={user.email ?? ""} disabled />
          </div>

          <Button onClick={save} disabled={saving} className="mt-8 w-full rounded-full">
            {saving ? <Loader2 className="animate-spin" /> : <Save />}
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </main>
    </div>
  );
}
