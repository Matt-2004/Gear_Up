import userReducer from "@/lib/Features/userSlice"
import { configureStore } from "@reduxjs/toolkit"

export const store = () => {
	return configureStore({
		reducer: {
			user: userReducer,
		},
	})
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof store>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]
