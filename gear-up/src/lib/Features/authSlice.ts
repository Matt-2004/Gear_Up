import { createSlice } from "@reduxjs/toolkit"

interface AuthState {
	isAuthenticated: boolean
}

const initialState: AuthState = {
	isAuthenticated: false,
}

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		handleAuthenticationLogin: (state: AuthState) => {
			state.isAuthenticated = true
		},
		handleAuthenticationLogout: (state: AuthState) => {
			state.isAuthenticated = false
		},
	},
})

export const { handleAuthenticationLogin } = authSlice.actions
export default authSlice.reducer
