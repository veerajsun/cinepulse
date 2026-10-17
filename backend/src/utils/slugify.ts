import slugifyLib from "slugify";

export function generateSlug(text: string): string {
  const cleaned = slugifyLib(text, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  });
  return cleaned || `dispatch-${Date.now()}`;
}
