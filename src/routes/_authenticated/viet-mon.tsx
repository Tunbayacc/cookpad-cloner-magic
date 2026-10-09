import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/_authenticated/viet-mon")({
  validateSearch: (s: Record<string, unknown>): { id?: string } =>
    typeof s["id"] === "string" ? { id: s["id"] } : {},
  head: () => ({
    meta: [
      { title: "Viết món mới — Bếp Nhà" },
      { name: "description", content: "Chia sẻ công thức nấu ăn của bạn lên Bếp Nhà." },
      { property: "og:title", content: "Viết món mới — Bếp Nhà" },
      { property: "og:description", content: "Chia sẻ công thức nấu ăn của bạn lên Bếp Nhà." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NewRecipe,
});

const input = "w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

function NewRecipe() {
  const { user } = Route.useRouteContext();
  const { id: editId } = Route.useSearch();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [intro, setIntro] = useState("");
  const [time, setTime] = useState("");
  const [servings, setServings] = useState("");
  const [ings, setIngs] = useState([{ name: "", amount: "" }]);
  const [steps, setSteps] = useState([""]);
  const [tips, setTips] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [oldImage, setOldImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editId) return;
    supabase
      .from("user_recipes")
      .select("*")
      .eq("id", editId)
      .eq("author_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return setError("Không tìm thấy món của bạn để sửa.");
        setTitle(data.title);
        setIntro(data.intro);
        setTime(data.time);
        setServings(data.servings);
        const i = data.ingredients as { name: string; amount: string }[];
        setIngs(i.length ? i : [{ name: "", amount: "" }]);
        const st = data.steps as string[];
        setSteps(st.length ? st : [""]);
        setTips(data.tips ?? "");
        setOldImage(data.image_path);
      });
  }, [editId, user.id]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const ingredients = ings.filter((i) => i.name.trim());
    const cleanSteps = steps.map((s) => s.trim()).filter(Boolean);
    if (!title.trim() || ingredients.length === 0 || cleanSteps.length === 0) {
      setError("Cần có tên món, ít nhất 1 nguyên liệu và 1 bước nấu.");
      return;
    }
    setSaving(true);
    setError("");
    let image_path: string | null = oldImage;
    if (file) {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
      const up = await supabase.storage.from("recipe-images").upload(path, file);
      if (up.error) {
        setSaving(false);
        setError("Tải ảnh lên không được (ảnh tối đa 5 MB).");
        return;
      }
      image_path = path;
    }
    const fields = {
      title: title.trim(),
      intro: intro.trim(),
      time: time.trim(),
      servings: servings.trim(),
      ingredients,
      steps: cleanSteps,
      tips: tips.trim() || null,
      image_path,
    };
    const { data, error } = editId
      ? await supabase.from("user_recipes").update(fields).eq("id", editId).select("id").single()
      : await supabase.from("user_recipes").insert({ author_id: user.id, ...fields }).select("id").single();
    setSaving(false);
    if (error || !data) {
      setError("Lưu món không được. Vui lòng thử lại.");
      return;
    }
    if (editId && file && oldImage) await supabase.storage.from("recipe-images").remove([oldImage]);
    qc.invalidateQueries();
    navigate({ to: "/cong-thuc/$id", params: { id: data.id } });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-3xl font-extrabold">{editId ? "Sửa món" : "Viết món mới"}</h1>
        <form onSubmit={submit} className="mt-6 space-y-5">
          <label className="block space-y-1">
            <span className="text-sm font-semibold">Ảnh món</span>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="block text-sm" />
            {file && <img src={URL.createObjectURL(file)} alt="Xem trước" className="mt-2 h-48 w-full rounded-xl object-cover" />}
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-semibold">Tên món *</span>
            <input className={input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="VD: Cá kho tộ" />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-semibold">Giới thiệu</span>
            <textarea className={input} rows={2} value={intro} onChange={(e) => setIntro(e.target.value)} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input className={input} value={time} onChange={(e) => setTime(e.target.value)} placeholder="Thời gian (VD: 45 phút)" />
            <input className={input} value={servings} onChange={(e) => setServings(e.target.value)} placeholder="Khẩu phần (VD: 4 người)" />
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold">Nguyên liệu *</p>
            <div className="space-y-2">
              {ings.map((i, idx) => (
                <div key={idx} className="flex gap-2">
                  <input className={input} placeholder="Tên" value={i.name}
                    onChange={(e) => setIngs(ings.map((x, j) => (j === idx ? { ...x, name: e.target.value } : x)))} />
                  <input className={`${input} max-w-[9rem]`} placeholder="Lượng" value={i.amount}
                    onChange={(e) => setIngs(ings.map((x, j) => (j === idx ? { ...x, amount: e.target.value } : x)))} />
                  <button type="button" onClick={() => setIngs(ings.filter((_, j) => j !== idx))} className="px-2 text-muted-foreground">✕</button>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setIngs([...ings, { name: "", amount: "" }])} className="mt-2 text-sm font-semibold text-primary">
              + Thêm nguyên liệu
            </button>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold">Các bước nấu *</p>
            <div className="space-y-2">
              {steps.map((s, idx) => (
                <div key={idx} className="flex gap-2">
                  <span className="pt-2 text-sm font-bold text-primary">{idx + 1}.</span>
                  <textarea className={input} rows={2} value={s}
                    onChange={(e) => setSteps(steps.map((x, j) => (j === idx ? e.target.value : x)))} />
                  <button type="button" onClick={() => setSteps(steps.filter((_, j) => j !== idx))} className="px-2 text-muted-foreground">✕</button>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setSteps([...steps, ""])} className="mt-2 text-sm font-semibold text-primary">
              + Thêm bước
            </button>
          </div>

          <label className="block space-y-1">
            <span className="text-sm font-semibold">Mẹo nhỏ</span>
            <textarea className={input} rows={2} value={tips} onChange={(e) => setTips(e.target.value)} />
          </label>

          {error && <p className="text-sm text-destructive">{error}</p>}
          <button disabled={saving} className="w-full rounded-full bg-primary px-4 py-3 font-semibold text-primary-foreground disabled:opacity-60">
            {saving ? "Đang lưu..." : editId ? "Lưu thay đổi" : "Đăng món"}
          </button>
        </form>
      </main>
    </div>
  );
}
