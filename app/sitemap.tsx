import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  //const posts = await getPosts();
  return [
    {
      url: "https://esm-ai.vercel.app",
      lastModified: new Date(),
      changeFrequency: "monthly",
    },
    {
      url: "https://esm-ai.vercel.app/login",
      lastModified: new Date(),
      changeFrequency: "monthly",
    },
    {
      url: "https://esm-ai.vercel.app/home",
      lastModified: new Date(),
      changeFrequency: "monthly",
    },
    // ...posts.map(
    //   (post) =>
    //     ({
    //       url: `https://esm-ai.vercel.app/posts/${post.slug}`,
    //       lastModified: new Date(post.attributes.date),
    //       changeFrequency: "monthly",
    //     }) as const,
    // ),
  ];
}
