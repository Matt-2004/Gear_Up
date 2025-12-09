import { configureStore } from "@reduxjs/toolkit"
import authReducer from "@/lib/Features/authSlice"

export const store = () => {
	return configureStore({
		reducer: {
			auth: authReducer,
		},
	})
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof store>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]
