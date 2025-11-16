import fs from "fs";
import path from "path";
import matter from "gray-matter";

// CORRECT folder path
const blogDir = path.join(process.cwd(), "markdown", "Blog");

export function getAllPosts(fields: string[] = []) {
  const files = fs
    .readdirSync(blogDir)
    .filter((file) => file.endsWith(".mdx"));

  return files.map((filename) => {
    const slug = filename.replace(".mdx", "");
    const fullPath = path.join(blogDir, filename);
    const fileContents = fs.readFileSync(fullPath, "utf-8");
    const { data } = matter(fileContents);

    const item: any = {};

    fields.forEach((field) => {
      if (field === "slug") item[field] = slug;
      if (data[field]) item[field] = data[field];
    });

    return item;
  });
}

export function getPostBySlug(slug: string) {
  const fullPath = path.join(blogDir, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(fileContents);

  return {
    frontmatter: data,
    content,
  };
}
