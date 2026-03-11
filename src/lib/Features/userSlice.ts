import { UserItem } from "@/types/user.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface userState {
  user: UserItem | null;
}

const initialState = {
  user: null,
} as userState;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state: userState, action: PayloadAction<UserItem>) => {
      state.user = action.payload;
    },

    getUser: (state: userState) => {
      state.user;
    },
  },
});

export const { addUser, getUser } = userSlice.actions;
export default userSlice.reducer;
