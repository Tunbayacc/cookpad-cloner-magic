import { createOpenAI } from "@ai-sdk/openai";
import { streamText, Output } from "ai";
import { z } from "zod";
import { recipes } from "@/data/recipes";
import type { Suggestion } from "./suggest.functions";

const schema = z.object({
  suggestions: z.array(
    z.object({ slug: z.string(), reason: z.string(), missing: z.array(z.string()) }),
  ),
});

export async function runSuggest(ingredients: string) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) return { suggestions: [], error: "Chưa cấu hình AI." };

  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
  });

  const catalog = recipes
    .map((r) => `- slug: ${r.slug} | ${r.title} | nguyên liệu: ${r.ingredients.map((i) => i.name).join(", ")}`)
    .join("\n");

  try {
    const result = streamText({
      model: provider.responses("openai/gpt-6-astra"),
      instructions:
        "Bạn là trợ lý bếp. Chỉ chọn món từ danh sách được cung cấp, dùng đúng slug. Xếp theo mức phù hợp, tối đa 3 món. 'reason' là 1 câu ngắn tiếng Việt. 'missing' là các nguyên liệu chính người dùng còn thiếu. Nếu không món nào hợp, trả mảng rỗng.",
      prompt: `Danh sách món:\n${catalog}\n\nNguyên liệu tôi có: ${ingredients}`,
      output: Output.object({ schema }),
      providerOptions: {
        openai: {
          forceReasoning: true,
          reasoningEffort: "low",
          reasoningSummary: "auto",
          store: false,
          include: ["reasoning.encrypted_content"],
        },
      },
    });
    const out = await result.output;
    const valid = new Set(recipes.map((r) => r.slug));
    const suggestions: Suggestion[] = out.suggestions.filter((s) => valid.has(s.slug)).slice(0, 3);
    return { suggestions };
  } catch (e) {
    const status = (e as { statusCode?: number }).statusCode;
    const msg =
      status === 429
        ? "Hệ thống đang bận, vui lòng thử lại sau ít phút."
        : status === 402
          ? "Đã hết lượt dùng AI. Vui lòng nạp thêm tín dụng."
          : "Không thể gợi ý lúc này. Vui lòng thử lại.";
    console.error("suggest error", e);
    return { suggestions: [], error: msg };
  }
}
