"use server"

import { IAdminUpdateStatus } from "@/types/kyc.types"
import { updateKycByAdmin } from "@/utils/API/AdminAPI"
import { revalidatePath } from "next/cache"

import { redirect, RedirectType } from "next/navigation"

export const rejectOnSubmit = async (data: IAdminUpdateStatus, id: string) => {
	await updateKycByAdmin(data, id)
	revalidatePath("profile/admin?tab=kyc-verification")
	redirect("/profile/admin?tab=kyc-verification", RedirectType.replace)
}
