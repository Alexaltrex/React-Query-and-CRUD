import React from "react";
import {Link, useParams} from "react-router-dom";
import style from "./ProductItemPage.module.scss";
import {FormikHelpers} from "formik";
import {IProduct, ProductUpdateType} from "../../types/product.types";
import {useAppDispatch} from "../../store/hooks";
import {setSnackbar} from "../../store/appSlice";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {productsApi} from "../../api/products.api";
import {ProductForm} from "../X_Common/ProductForm/ProductForm";
import EditIcon from '@mui/icons-material/Edit';
import {ErrorBlock} from "../X_Common/Error/ErrorBlock";
import LinearProgress from "@mui/material/LinearProgress";

export const ProductItemPage = () => {
    const dispatch = useAppDispatch();
    const { id } = useParams<{ id: string }>();

    const {isLoading, isError, data, error} = useQuery<IProduct, any>(
        ["product", id],
        ({ queryKey }) => {
            //console.log(queryKey);
            return productsApi.getById(id as string)
        },
        {
            enabled: Boolean(id)
        }
    )

    const queryClient = useQueryClient();
    const updateMutation = useMutation(productsApi.update, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('products');
            //queryClient.invalidateQueries(['product', id]);
            queryClient.setQueryData(["product", id], data.data)
        },
        onError: (e: any) => {
            const message = e?.response?.data?.message ?? e.message;
            dispatch(setSnackbar({open: true, message, severity: "error"}))
        }
    });

    const onUpdateHandler = async (
        values: ProductUpdateType,
        formikHelpers: FormikHelpers<ProductUpdateType>
    ) => {
        try {
            const response = await updateMutation.mutateAsync({updateProduct: values, id: (id as string)});
            dispatch(setSnackbar({open: true, message: response.message, severity: "success"}))
        } catch (e: any) {
            process.env.NODE_ENV === 'development' &&  console.log(e);
        } finally {
            formikHelpers.setSubmitting(false);
            formikHelpers.resetForm();
        }
    }

    return (
        <div className={style.productItemPage}>

            {
                isError ? (
                    <ErrorBlock error={error}/>
                ) : (
                    <>
                        {
                            (isLoading || updateMutation.isLoading) &&
                            <LinearProgress className={style.linearProgressWrapper}/>
                        }

                        {
                            data && (
                                <>
                                    <div className={style.titleWrapper}>
                                        <Link className={style.link}
                                              to="/products"
                                        >
                                            {"Products / "}
                                        </Link>
                                        <h1 className={style.title}>
                                            {data.name}
                                        </h1>
                                    </div>

                                    <div className={style.properties}>
                                        <div className={style.row}>
                                            <p>Size</p>
                                            <p>{data.size}</p>
                                        </div>
                                        <div className={style.row}>
                                            <p>Weight</p>
                                            <p>{data.weight}</p>
                                        </div>
                                        <div className={style.row}>
                                            <p>Description</p>
                                            <p>{data.description}</p>
                                        </div>
                                    </div>

                                    <ProductForm buttonLabel="Edit product (Updates from Mutation Responses)"
                                                 initialValues={{
                                                     name: data.name,
                                                     size: data.size,
                                                     weight: data.weight,
                                                     description: data.description,
                                                 }}
                                                 onSubmitHandler={onUpdateHandler}
                                                 topButtonIcon={<EditIcon/>}
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