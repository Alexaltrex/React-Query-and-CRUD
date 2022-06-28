import React, {ChangeEvent} from "react";
import style from "./LocationsPage.module.scss"
import {Link, useNavigate, useParams} from "react-router-dom";
import {Pagination} from "@mui/material";
import {useQuery} from "react-query";
import {AxiosError} from "axios";
import { IGetLocations } from "../../types/location.types";
import {locationsApi} from "../../api/locations.api";
import LinearProgress from "@mui/material/LinearProgress";
import {ErrorBlock} from "../X_Common/Error/ErrorBlock";

export const LocationsPage = () => {
    const {id} = useParams<{id: string}>();

    const {
        isLoading,
        isError,
        error,
        data,
        isPreviousData,
    } = useQuery<IGetLocations, AxiosError>(
        ["locations", id],
        () => locationsApi.getAll(id as string),
        {
            enabled: Boolean(id),
            keepPreviousData: true
        }
    )

    const navigate = useNavigate();

    const onChangeHandler = (e: ChangeEvent<unknown>, value: number) => {
        navigate(`/locations/${value}`)

    };

    return (
        <div className={style.locationsPage}>
            {isLoading || isPreviousData && <LinearProgress  className={style.linearProgressWrapper}/>}

            {
                isError ? (
                    <ErrorBlock error={error}/>
                ) : (
                    <>
                        <h1 className={style.title}>Locations</h1>



                        {
                            data && (
                                <>
                                    <Pagination count={data.info.pages}
                                                page={Number(id)}
                                                variant="outlined"
                                                shape="rounded"
                                                size="small"
                                                className={style.pagination}
                                                sx={paginationSx}
                                                onChange={onChangeHandler}
                                    />

                                    <div className={style.list}>
                                        <div className={style.listHeader}>
                                            <p>Name</p>
                                            <p>Type</p>
                                            <p>Dimension</p>
                                        </div>
                                        {
                                            data.results.map(item => (
                                                <Link className={style.item}
                                                      key={item.id}
                                                      to={`/location/${item.id}`}
                                                >
                                                    <p>{item.name}</p>
                                                    <p>{item.type}</p>
                                                    <p>{item.dimension}</p>
                                                </Link>
                                            ))
                                        }
                                    </div>
                                </>
                            )
                        }
                    </>
                )
            }





        </div>
    )
}

//=================== STYLES ====================//
const paginationSx = {
    "& .MuiButtonBase-root": {
        backgroundColor: "#FFF",
        transition: "0.3s",
        "&:hover": {
            backgroundColor: "#CCC",
        }
    },
    "& .Mui-selected": {
        backgroundColor: "#AAA!important",
        "&:hover": {
            backgroundColor: "#AAA",
        }
    }
}