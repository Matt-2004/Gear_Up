import { getAllPosts } from "@/app/shared/utils/API/PostAPI";
import DiscoverPost from "../../features/post/ui/DiscoverPost";
import { handleServerError } from "@/app/shared/utils/errors/handleServerError";
import { PostResponse } from "@/app/features/post/types/post.dto";
import { PostMapper } from "@/app/features/post/types/post.mapper";

export const dynamic = "force-dynamic";

const getData = async (): Promise<PostResponse> => {
  try {
    const response = await getAllPosts();

    return response;
  } catch (error) {
    handleServerError(error);
    throw error;
  }
};

const Page = async () => {
  const res = await getData();

  const initialPostData = {
    items: res.data.items.map(PostMapper),
    hasMore: res.data.hasMore,
    nextCursor: res.data.nextCursor,
  };

  return <DiscoverPost post={initialPostData} />;
};

export default Page;
