import { z } from "zod";

export const rawItemSchema = z.object({
  id: z.string().nullish(),
  name: z.string().nullish(),
  family: z.string().nullish(),
  sub_family: z.string().nullish(),
  price_gold: z.number().nullish(),
  availability: z.string().nullish(),
  more: z.string().nullish(),
  damage: z.array(z.string()).nullish(),
  weight_kg: z.number().nullish(),
});

export const rawItemsSchema = z.array(rawItemSchema);
