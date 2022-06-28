import {useAppDispatch} from "../store/hooks";
import {useEffect} from "react";
import {setSnackbar} from "../store/appSlice";
import {AxiosError} from "axios";

export const useGetErrorHandler = (isError: boolean, error: AxiosError<any, any> | null) => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (isError && error) {
            process.env.NODE_ENV === 'development' &&  console.log(error);
            const message = error?.response?.data?.message ?? error.message
            dispatch(setSnackbar({open: true, message, severity: "error"}));
        }
    }, [isError, error])
}