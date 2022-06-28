import React, {useEffect} from "react";
import style from "./ProductsPage.module.scss"
import {Link} from "react-router-dom";
import Button from "@mui/material/Button";
import {FormikHelpers} from "formik";
import DeleteIcon from '@mui/icons-material/Delete';
import {IconButton} from "@mui/material";
import {useAppDispatch} from "../../store/hooks";
import {setSnackbar} from "../../store/appSlice";
import {IProduct, ProductUpdateType} from "../../types/product.types";
import {Preloader} from "../X_Common/Preloader/Preloader";
import {ProductForm} from "../X_Common/ProductForm/ProductForm";
import {productsApi} from "../../api/products.api";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {useGetErrorHandler} from "../../hooks/useGetErrorHandler";
import LinearProgress from "@mui/material/LinearProgress";
import AddIcon from '@mui/icons-material/Add';
import {ErrorBlock} from "../X_Common/Error/ErrorBlock";
import {log} from "util";

export const ProductsPage = () => {
    const {
        isLoading,
        isError,
        data,
        error
    } = useQuery<IProduct[], any>(
        'products',
        productsApi.getAll,
    )

    const dispatch = useAppDispatch();

    const queryClient = useQueryClient();

    const createMutation = useMutation(productsApi.create, {
        onSuccess: () => {
            queryClient.invalidateQueries('products')
        },
        onError: (e: any) => {
            const message = e?.response?.data?.message ?? e.message;
            dispatch(setSnackbar({open: true, message, severity: "error"}))
        }
    });

    const deleteMutation = useMutation(productsApi.delete, {
        onSuccess: () => {
            queryClient.invalidateQueries('products')
        },
        onError: (e: any) => {
            const message = e?.response?.data?.message ?? e.message;
            dispatch(setSnackbar({open: true, message, severity: "error"}))
        }
    });

    const onCreateHandler = async (
        values: ProductUpdateType,
        formikHelpers: FormikHelpers<ProductUpdateType>
    ) => {
        try {
            const response = await createMutation.mutateAsync(values);
            dispatch(setSnackbar({open: true, message: response, severity: "success"}));
        } catch (e: any) {
            process.env.NODE_ENV === 'development' && console.log(e);
        } finally {
            formikHelpers.setSubmitting(false);
            formikHelpers.resetForm();
        }
    }

    const onDeleteHandler = async (id: string) => {
        try {
            await deleteMutation.mutateAsync(id)
        } catch (e: any) {
            process.env.NODE_ENV === 'development' && console.log(e);
        }
    }

    return (
        <div className={style.productsPage}>

            {
                isError ? (
                    <ErrorBlock error={error}/>
                ) : (
                    <>
                        {
                            (isLoading || deleteMutation.isLoading || createMutation.isLoading) &&
                            <LinearProgress className={style.linearProgressWrapper}/>
                        }

                        <h1 className={style.title}>Products</h1>

                        {
                            data && (
                                <>
                                    <div className={style.items}>
                                        {
                                            data.map(product => (
                                                <div key={product.id}
                                                     className={style.item}
                                                >
                                                    <Link
                                                        className={style.link}
                                                        to={`/product/${product.id}`}
                                                    >
                                                        {product.name}
                                                    </Link>
                                                    <IconButton className={style.deleteBtn}
                                                                onClick={() => onDeleteHandler(product.id)}
                                                                disabled={isLoading || deleteMutation.isLoading || createMutation.isLoading}
                                                    >
                                                        <DeleteIcon sx={{color: "#FFF"}}/>
                                                    </IconButton>
                                                </div>

                                            ))
                                        }
                                    </div>

                                    <ProductForm buttonLabel="Add product"
                                                 initialValues={{
                                                     name: "",
                                                     size: 1,
                                                     weight: 1,
                                                     description: "",
                                                 }}
                                                 onSubmitHandler={onCreateHandler}
                                                 topButtonIcon={<AddIcon/>}
                                                 className={style.form}
                                    />


                                </>

                            )
                        }
                    </>
                )
            }


        </div>
    )
}