import {handleAuthenticationLogin} from "@/lib/Features/authSlice";
import {AppDispatch} from "@/lib/Store";

export const updateAuthStatus = (dispatch: AppDispatch) => {
    dispatch(handleAuthenticationLogin());
}