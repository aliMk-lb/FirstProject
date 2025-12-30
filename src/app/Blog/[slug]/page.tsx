"use client";

import Link from "next/link";

type Params = { slug: string };

export default function BlogPostPage({ params }: { params: Params }) {
  const { slug } = params;

  return (
    <main className="min-h-screen bg-white dark:bg-darkmode text-midnight_text dark:text-white px-4 py-16">
      <div className="max-w-3xl mx-auto space-y-6 text-center">
        <h1 className="text-3xl font-bold">Blog post coming soon</h1>
        <p className="text-lg text-grey dark:text-white/70">
          We couldn't find content for "{slug}". Please check back later or
          return to the blog list.
        </p>
        <Link
          href="/Blog"
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/80"
        >
          Back to Blog
        </Link>
      </div>
    </main>
  );
}
