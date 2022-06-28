import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "./store";
import {ISnackbar} from "../types/app.types";
import {AlertColor} from "@mui/material";

const initialState = {
    burgerMenu: false,
    snackbar: {
        open: false,
        message: "",
        severity: "success" as AlertColor
    },
    hideHeader: false,
    isEndPage: false
}

export type InitialStateType = typeof initialState

export const appSlice = createSlice({
    name: "app",
    initialState: initialState as InitialStateType,
    reducers: {
        setBurgerMenu: (state, action: PayloadAction<boolean>) => {
            state.burgerMenu = action.payload
        },
        setSnackbar: (state, action: PayloadAction<ISnackbar>) => {
            state.snackbar = action.payload
        },
        setHideHeader: (state, action: PayloadAction<boolean>) => {
            state.hideHeader = action.payload
        },
        setIsEndPage: (state, action: PayloadAction<boolean>) => {
            state.isEndPage = action.payload
        },
    }
})

export const {
    setBurgerMenu,
    setSnackbar,
    setHideHeader,
    setIsEndPage,
} = appSlice.actions

export const selectBurgerMenu = (state: RootState) => state.app.burgerMenu;
export const selectSnackbar = (state: RootState) => state.app.snackbar;
export const selectHideHeader = (state: RootState) => state.app.hideHeader;
export const selectIsEndPage = (state: RootState) => state.app.isEndPage;

export const appReducer = appSlice.reducer