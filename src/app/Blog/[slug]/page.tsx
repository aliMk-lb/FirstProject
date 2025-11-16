import React from "react";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts } from "@/utils/markdown";
import markdownToHtml from "@/utils/markdownToHtml";

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const posts = getAllPosts(["slug"]);
  return posts.map((p: any) => ({ slug: p.slug }));
}

export default async function PostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);

  if (!post) return notFound();

  const contentHtml = await markdownToHtml(post.content);

  const frontmatter = post.frontmatter || {};

  return (
    <main className="container mx-auto py-8 px-4">
      <article>
        <h1 className="text-3xl font-bold mb-2">{frontmatter.title}</h1>
        {frontmatter.date && (
          <p className="text-sm text-gray-500 mb-4">{frontmatter.date}</p>
        )}
        {frontmatter.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={frontmatter.coverImage} alt={frontmatter.title} className="mb-6 w-full" />
        )}

        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </article>
    </main>
  );
}
