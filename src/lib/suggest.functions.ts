import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type Suggestion = { slug: string; reason: string; missing: string[] };

export const suggestRecipes = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ ingredients: z.string().trim().min(1).max(1000) }).parse(d),
  )
  .handler(async ({ data }): Promise<{ suggestions: Suggestion[]; error?: string }> => {
    const { runSuggest } = await import("./suggest.server");
    return runSuggest(data.ingredients);
  });
