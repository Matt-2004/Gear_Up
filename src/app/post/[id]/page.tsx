import { getPostById } from "@/app/shared/utils/API/PostAPI";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import CommentContextProvider from "../../features/comment/context/CommentContext";
import Details from "../../features/post/ui/PostDetails";
import { PostMapper } from "@/app/features/post/types/post.mapper";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const res = await getPostById(id);
    const post = res?.data;
    if (!post) {
      return { title: "Post not found", description: "This post could not be found." };
    }
    const title = `${post.caption?.substring(0, 60) ?? "Post"} | Gear Up`;
    const description = post.content?.substring(0, 160) ?? "Read this post on Gear Up";
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "article",
      },
    };
  } catch {
    return { title: "Post - Gear Up", description: "Read this post on Gear Up" };
  }
}

const getData = async (id: string) => {
  try {
    const res = await getPostById(id);
    return res?.data ?? null;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
};

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const postData = await getData(id);
  const cookieStore = await cookies();
  const access_token = cookieStore.get("access_token")?.value;

  if (!postData) notFound();

  const post = PostMapper(postData);

  return (
    <CommentContextProvider>
      <Details access_token={access_token ?? ""} postData={post} />
    </CommentContextProvider>
  );
};

export default Page;
