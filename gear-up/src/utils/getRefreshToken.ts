"use server";

import { cookies } from "next/headers";
import {NextResponse} from "next/server";

export const getRefreshToken = async () => {
    const cookieStore = cookies();
    const refresh_token = (await cookieStore).get("refresh_token");
    return refresh_token;
};