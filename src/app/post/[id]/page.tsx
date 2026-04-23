import { getPostById } from "@/app/shared/utils/API/PostAPI";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import CommentContextProvider from "../../features/comment/context/CommentContext";
import Details from "../../features/post/ui/PostDetails";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const post = await getPostById(id);
    const postData = post?.data;
    return {
      title: postData?.title ? `${postData.title} - Gear Up` : "Post - Gear Up",
      description:
        postData?.content?.substring(0, 150) || "Read this post on Gear Up",
    };
  } catch {
    return {
      title: "Post - Gear Up",
      description: "Read this post on Gear Up",
    };
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

  if (!postData) notFound();
  const cookieStore = await cookies();
  const access_token = cookieStore.get("access_token")?.value;

  return (
    <CommentContextProvider>
      <Details access_token={access_token ?? ""} postData={postData} />
    </CommentContextProvider>
  );
};

export default Page;
