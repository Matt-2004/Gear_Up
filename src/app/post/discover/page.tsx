import DiscoverPost from "../../features/post/ui/DiscoverPost";

export const dynamic = "force-dynamic";

const Page = async () => {
  const initialPostData = {
    items: [],
    hasMore: false,
    nextCursor: "",
  };

  return <DiscoverPost post={initialPostData} />;
};

export default Page;
