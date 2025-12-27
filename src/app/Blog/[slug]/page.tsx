import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts } from "@/utils/markdown";
import markdownToHtml from "@/utils/markdownToHtml";
import { format } from "date-fns";
import Image from "next/image";
import { getImgPath } from "@/utils/image";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = getAllPosts(["slug"]);
  return posts.map((p: any) => ({ slug: p.slug }));
}

export default async function PostPage({ params: paramsPromise }: Props) {
  const params = await paramsPromise;
  const post = getPostBySlug(params.slug);

  if (!post) return notFound();

  const contentHtml = await markdownToHtml(post.content);

  const frontmatter = post.frontmatter || {};
  const formattedDate =
    frontmatter.date && !Number.isNaN(new Date(frontmatter.date).getTime())
      ? format(new Date(frontmatter.date), "dd MMM yyyy")
      : null;

  return (
    <main className="bg-section dark:bg-darkmode">
      <section className="container mx-auto max-w-6xl px-4 md:pt-40 pt-28 pb-16">
        <header className="flex flex-col gap-4 md:gap-3">
          {formattedDate && (
            <span className="text-base text-grey dark:text-white/70">
              {formattedDate}
            </span>
          )}
          <h1 className="text-3xl md:text-[40px] leading-tight font-bold text-midnight_text dark:text-white">
            {frontmatter.title}
          </h1>
        </header>

        {frontmatter.coverImage && (
          <div className="mt-8 mb-10 overflow-hidden rounded-lg shadow-service">
            <Image
              src={getImgPath(frontmatter.coverImage)}
              alt={frontmatter.title || "Blog cover"}
              width={1200}
              height={675}
              quality={100}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        )}

        <article
          className="blog-details text-midnight_text dark:text-white"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </section>
    </main>
  );
}
