import React, {ChangeEvent} from "react";
import style from "./EpisodesPage.module.scss"
import {Link, useNavigate, useParams} from "react-router-dom";
import {Pagination} from "@mui/material";
import {useQuery} from "react-query";
import {AxiosError} from "axios";
import {IGetEpisodes} from "../../types/episodes.types";
import {episodesApi} from "../../api/episodes.api";
import LinearProgress from "@mui/material/LinearProgress";
import {ErrorBlock} from "../X_Common/Error/ErrorBlock";

export const EpisodesPage = () => {
    const { id } = useParams<{ id: string }>();

    const navigate = useNavigate();

    const onChangeHandler = (e: ChangeEvent<unknown>, value: number) => {
        navigate(`/episodes/${value}`)
    };

    const {
        isLoading,
        isError,
        error,
        data,
        isPreviousData,
    } = useQuery<IGetEpisodes, AxiosError>(
        ["episodes", id],
        () => episodesApi.getAll(id as string),
        {
            enabled: Boolean(id),
            keepPreviousData: true
        }
    )

    return (
        <div className={style.episodesPage}>

            {
                isError ? (
                    <ErrorBlock error={error}/>
                ) : (
                    <>
                        {(isLoading || isPreviousData) && <LinearProgress  className={style.linearProgressWrapper}/>}

                        <h1 className={style.title}>Episodes</h1>

                        {
                            data &&
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
                                    {
                                        data.results.map(episode => (
                                                <Link className={style.link}
                                                      key={episode.id}
                                                      to={`/episode/${episode.id}`}
                                                >
                                                    {`${episode.episode} - ${episode.name}`}
                                                </Link>
                                            )
                                        )
                                    }
                                </div>
                            </>
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