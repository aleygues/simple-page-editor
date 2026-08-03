import { Page } from "../entities/Page";
import slugify from "slugify";

export async function getUniqueSlug(fromString: string): Promise<string> {
  let slug = slugify(fromString);
  let i = 0;
  const maxAttempts = 100;

  while (i < maxAttempts) {
    const existing = await Page.findOne({ where: { slug } });
    if (!existing) {
      return slug;
    }
    i++;
    slug = `${slugify(fromString)}-${i}`;
  }

  return slug;
}
