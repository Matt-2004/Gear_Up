import { MainResponse } from "@/app/shared/types.ts/main-response";
import { Tokens } from "../../../signIn/types/sign-in-response";

export interface AdminResponse extends MainResponse<Tokens | null> {}
