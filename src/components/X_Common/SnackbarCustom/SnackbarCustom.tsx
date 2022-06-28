import {Snackbar} from "@mui/material";
import React from "react";
import Alert from "@mui/material/Alert";
import {useAppDispatch, useAppSelector} from "../../../store/hooks";
import {selectSnackbar} from "../../../store/appSlice";
import {setSnackbar} from "../../../store/appSlice";

export const SnackbarCustom = () => {
    const dispatch = useAppDispatch();
    const { open, message, severity } = useAppSelector(selectSnackbar);


    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch(setSnackbar({open: false, message, severity}))
    };

    return (
        <Snackbar open={open}
                  autoHideDuration={6000}
                  onClose={handleClose}
                  anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right"
                  }}
        >
            <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    )
}