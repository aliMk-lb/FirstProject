import fs from "fs";
import path from "path";
import matter from "gray-matter";

// CORRECT folder path
const blogDir = path.join(process.cwd(), "markdown", "Blog");

const normalizeDate = (value: any) => {
  if (!value) return undefined;

  const date =
    value instanceof Date
      ? value
      : typeof value === "string"
      ? new Date(value)
      : undefined;

  if (!date || Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
};

export function getAllPosts(fields: string[] = []) {
  const files = fs
    .readdirSync(blogDir)
    .filter((file) => file.endsWith(".mdx"));

  return files
    .map((filename) => {
      const slug = filename.replace(".mdx", "");
      const fullPath = path.join(blogDir, filename);
      const fileContents = fs.readFileSync(fullPath, "utf-8");
      const { data } = matter(fileContents);

      const item: any = {};

      fields.forEach((field) => {
        if (field === "slug") item[field] = slug;
        if (field === "date") {
          const date = normalizeDate(data.date);
          if (date) item.date = date;
        }
        if (data[field] && field !== "date") item[field] = data[field];
      });

      return item;
    })
    .filter((item) => {
      const requiredFields = fields.filter((field) => field !== "slug");
      const hasAllRequiredFields = requiredFields.every(
        (field) => Boolean(item[field])
      );

      const hasValidDate =
        !fields.includes("date") || Boolean(item.date);

      return hasAllRequiredFields && hasValidDate;
    });
}

export function getPostBySlug(slug: string) {
  const fullPath = path.join(blogDir, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(fileContents);
  const frontmatter: any = { ...data };
  const date = normalizeDate(frontmatter.date);

  if (date) {
    frontmatter.date = date;
  } else {
    delete frontmatter.date;
  }

  return {
    frontmatter,
    content,
  };
}
