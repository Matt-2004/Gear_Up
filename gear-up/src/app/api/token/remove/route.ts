import { cookies } from "next/headers";

export const POST = async () => {

    const cookieStore = await cookies();
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");
    return new Response(null, { status: 200 });
	
}