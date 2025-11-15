"use server";

import { cookies } from "next/headers";
import {NextResponse} from "next/server";

export const getRefreshToken = async () => {
    const cookieStore = cookies();
    console.log("Cookie Store :: ", cookieStore)
    const refresh_token = (await cookieStore).get("refresh_token");
    console.log("Refresh token :: ", refresh_token);
    return refresh_token;
};