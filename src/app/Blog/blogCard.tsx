import React, { FC } from "react";
import Image from "next/image";
import { Blog } from "@/types/blog";
import { format } from "date-fns";
import Link from "next/link";
import { getImgPath } from "@/utils/image";

const BlogCard = ({ blog }: { blog: Blog }) => {
  const { title, coverImage, excerpt, date, slug } = blog;

  // Use coverImage or image from MDX, fallback to a default image
  const imgSrc = getImgPath(
    coverImage || (blog as any).image || "/images/blog/blog_1.png"
  );
  const parsedDate = date ? new Date(date) : null;
  const formattedDate =
    parsedDate && !Number.isNaN(parsedDate.getTime())
      ? format(parsedDate, "dd MMM yyyy")
      : null;

  return (
    <div className="group mb-0 relative">
      <div className="mb-8 overflow-hidden rounded-sm">
        <Link href={`/blog/${blog.slug}`} className="block">
          <Image
            src={imgSrc}
            alt={title || "blog image"}
            className="w-full transition group-hover:scale-125"
            width={408}
            height={272}
            style={{ width: "100%", height: "auto" }}
            quality={100}
          />
        </Link>
      </div>

      <div>
        <h3>
          <Link
            href={`/blog/${slug}`}
            className="mb-4 inline-block font-semibold text-dark text-black hover:text-primary dark:text-white dark:hover:text-primary text-[22px] leading-tight"
          >
            {title}
          </Link>
        </h3>
        {formattedDate && (
          <span className="text-sm font-semibold leading-loose text-SereneGray">
            {formattedDate}
          </span>
        )}
      </div>
    </div>
  );
};

export default BlogCard;
