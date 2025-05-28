import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface AuthState {
    token: string | null
    isAuthenticated: boolean
    user: { id: any, name: string, email: string, credits: number, } | null
}

const initialState: AuthState = {
    token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
    isAuthenticated: !!(typeof window !== "undefined" && localStorage.getItem("token")),
    user: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login(state, action: PayloadAction<string>) {
            state.token = action.payload
            state.isAuthenticated = true
            localStorage.setItem("token", action.payload)
        },
        logout(state) {
            state.token = null
            state.token = null
            state.isAuthenticated = false
            localStorage.removeItem("token")
        },
        setUser(state, action: PayloadAction<any>) {
            state.user = action.payload
            localStorage.setItem("user", JSON.stringify(action.payload))
        },
    },
})

export const { login, logout, setUser } = authSlice.actions
export default authSlice.reducer
