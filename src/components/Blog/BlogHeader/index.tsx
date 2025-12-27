import { getAllPosts, getPostBySlug } from "@/utils/markdown";
import markdownToHtml from "@/utils/markdownToHtml";
import { format } from "date-fns";
import Image from "next/image";

type Props = {
    params: { slug: string };
};

export async function generateMetadata({ params }: Props) {
    const posts = getAllPosts(["title", "date", "excerpt", "coverImage", "slug"]);
    const post = getPostBySlug(params.slug);

    const siteName = process.env.SITE_NAME || "Your Site Name";
    const authorName = process.env.AUTHOR_NAME || "Your Author Name";

    if (post) {
        const metadata = {
            title: `${post.frontmatter.title || "Single Post Page"} | ${siteName}`,
            author: authorName,
            robots: {
                index: true,
                follow: true,
                nocache: true,
                googleBot: {
                    index: true,
                    follow: false,
                    "max-video-preview": -1,
                    "max-image-preview": "large",
                    "max-snippet": -1,
                },
            },
        };

        return metadata;
    } else {
        return {
            title: "Not Found",
            description: "No blog article has been found",
            author: authorName,
            robots: {
                index: false,
                follow: false,
                nocache: false,
                googleBot: {
                    index: false,
                    follow: false,
                    "max-video-preview": -1,
                    "max-image-preview": "large",
                    "max-snippet": -1,
                },
            },
        };
    }
}

export default async function BlogHead({ params }: Props) {
    const posts = getAllPosts(["title", "date", "excerpt", "coverImage", "slug"]);
    const post = getPostBySlug(params.slug);

    if (!post) return null;

    const content = await markdownToHtml(post.content || "");
    const formattedDate =
        post.frontmatter.date &&
            !Number.isNaN(new Date(post.frontmatter.date).getTime())
            ? format(new Date(post.frontmatter.date), "dd MMM yyyy")
            : null;

    return (
        <>
            <section className="pt-44">
                <div className="container mx-auto max-w-[1200px]">
                    <div className="grid md:grid-cols-12 grid-cols-1 items-center">
                        <div className="col-span-8">
                            <div className="flex flex-col sm:flex-row">
                                {formattedDate && (
                                    <span className="text-base text-midnight_text pr-7 border-r border-solid border-white w-fit">
                                        {formattedDate}
                                    </span>
                                )}
                                <span className="text-base text-midnight_text sm:pl-7 pl-0 w-fit">13 Comments</span>
                            </div>
                            <h2 className="text-midnight_text pt-7 text-[40px] leading-tight font-bold">
                                {post.frontmatter.title}
                            </h2>
                        </div>
                        <div className="flex  gap-6 col-span-4 pt-4 md:pt-0">
                            <Image
                                src={post.frontmatter.authorImage}
                                alt="image"
                                className="rounded-full"
                                width={84}
                                height={84}
                                quality={100}
                                style={{ width: 'auto', height: 'auto' }}
                            />
                            <div>
                                <span className="text-[22px] leading-tight text-midnight_text">Silicaman</span>
                                <p className="text-xl text-midnight_text">Author</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
