import { IUserData } from "@/app/types/user.types"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface userState {
	user: IUserData | null
}

const initialState = {
	user: null,
} as userState

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		addUser: (state: userState, action: PayloadAction<IUserData>) => {
			state.user = action.payload
		},

		getUser: (state: userState) => {
			state.user
		},
	},
})

export const { addUser, getUser } = userSlice.actions
export default userSlice.reducer
