import {AlertColor} from "@mui/material";

export interface ISnackbar {
    open: boolean
    message: string
    severity: AlertColor
}