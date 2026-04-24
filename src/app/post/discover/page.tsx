import { getAllPosts } from "@/app/shared/utils/API/PostAPI";
import DiscoverPost from "../../features/post/ui/DiscoverPost";
import { PostRoot } from "@/app/features/post/types/post.types";

export const dynamic = "force-dynamic";

const getData = async (): Promise<PostRoot> => {
  const response = getAllPosts();
  return response;
};

const Page = async () => {
  const res = await getData();

  const initialPostData = {
    items: res.data.items,
    hasMore: res.data.hasMore,
    nextCursor: res.data.nextCursor,
  };

  return <DiscoverPost post={initialPostData} />;
};

export default Page;
