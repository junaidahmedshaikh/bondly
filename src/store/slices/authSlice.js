import { createSlice } from "@reduxjs/toolkit";

// Load initial state from localStorage
const getInitialState = () => {
  try {
    const storedUser = localStorage.getItem("bondly_user");
    const storedAuth = localStorage.getItem("bondly_isAuthenticated");

    if (storedUser && storedAuth === "true") {
      return {
        user: JSON.parse(storedUser),
        isAuthenticated: true,
      };
    }
  } catch (error) {
    console.error("Failed to load auth state from localStorage:", error);
  }

  return {
    user: null,
    isAuthenticated: false,
  };
};

const initialState = getInitialState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      // Persist to localStorage
      localStorage.setItem("bondly_user", JSON.stringify(action.payload));
      localStorage.setItem("bondly_isAuthenticated", "true");
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      // Remove from localStorage
      localStorage.removeItem("bondly_user");
      localStorage.removeItem("bondly_isAuthenticated");
    },
    restoreAuth: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      // Persist to localStorage
      localStorage.setItem("bondly_user", JSON.stringify(state.user));
    },
  },
});

export const { login, logout, restoreAuth, updateUser } = authSlice.actions;
export default authSlice.reducer;
