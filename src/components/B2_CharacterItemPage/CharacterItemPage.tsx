import React, {useEffect, useState} from "react";
import style from "./CharacterItemPage.module.scss";
import {Link, useNavigate, useParams} from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import IconButton from "@mui/material/IconButton";
import {useQuery, useQueryClient} from "react-query";
import {charactersApi} from "../../api/characters.api";
import {Preloader} from "../X_Common/Preloader/Preloader";
import {ICharacter, IInfo} from "../../types/character.types";
import {episodesApi} from "../../api/episodes.api";
import {IEpisode} from "../../types/episodes.types";
import {Skeleton} from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import {log} from "util";
import {useGetErrorHandler} from "../../hooks/useGetErrorHandler";
import {ErrorBlock} from "../X_Common/Error/ErrorBlock";

const preUrl = 'https://rickandmortyapi.com/api/episode/';

export const CharacterItemPage = () => {
    const {id} = useParams<{ id: string }>();

    const {isLoading: isLoadingInfo, data: dataInfo} = useQuery<IInfo, any>(
        "character info",
        charactersApi.getInfo
    )

    const {
        isLoading: isLoadingCharacter,
        isError: isErrorCharacter,
        error: errorCharacter,
        data,
        isPreviousData: isPreviousDataCharacter
    } = useQuery<ICharacter, any>(
        ["character", id],
        () => charactersApi.getById(id as string),
        {
            keepPreviousData: true
        }
    );

    const episodeIds = data?.episode.map(episode => episode.split(preUrl)[1]) ?? [];
    const {
        isLoading: isLoadingEpisodes,
        isError: isErrorEpisodes,
        error: errorEpisodes,
        data: episodes,
        isPreviousData: isPreviousDataEpisodes,
    } = useQuery<IEpisode[], any>(
        ["episodesOfCharacter", id],
        () => episodesApi.getMultipleItems(episodeIds),
        {
            enabled: Boolean(data?.episode),
            keepPreviousData: true
        }
    );
    useGetErrorHandler(isErrorEpisodes, errorEpisodes);

    const navigate = useNavigate();

    const onBackClickHandler = () => {
        if (id) {
            navigate(`/character/${Number(id) - 1}`)
        }
    }
    const onForwardClickHandler = () => {
        if (id) {
            navigate(`/character/${Number(id) + 1}`)
        }
    }

    const queryClient = useQueryClient();
    const prefetchPrev = async (id: string) => {
        const data = await queryClient.prefetchQuery<ICharacter, any>(
            ["character", id],
            () => charactersApi.getById(id)
        )
        console.log(data)
    }
    const prefetchNext = async (id: string) => {
        await queryClient.prefetchQuery<ICharacter, any>(
            ["character", id],
            () => charactersApi.getById(id)
        )
    }

    return (
        <div className={style.characterItemPage}>

            {
                isErrorCharacter ? (
                    <ErrorBlock error={errorCharacter}/>
                ) : (
                    <>
                        {
                            (
                                isLoadingInfo || isLoadingCharacter || isLoadingEpisodes ||
                                isPreviousDataCharacter || isPreviousDataEpisodes
                            ) && <LinearProgress className={style.linearProgressWrapper}/>

                        }

                        {
                            data ? (
                                <h1 className={style.title}>
                                    {data.name}
                                </h1>
                            ) : (
                                <Skeleton variant="rectangular" className={style.titleSkeleton}/>
                            )
                        }

                        <div className={style.imageBlock}>
                            <IconButton className={style.btn}
                                        onClick={onBackClickHandler}
                                        disabled={!id || Number(id) === 1 || isPreviousDataCharacter}
                                        onMouseEnter={async () => {
                                            if (id && Number(id) !== 1) {
                                                await prefetchPrev(String(Number(id) - 1))
                                            }
                                        }}
                            >
                                <ArrowBackIcon/>
                            </IconButton>

                            <div className={style.imgWrapper}>
                                {data && <img src={data.image} alt=""/>}
                            </div>

                            <IconButton className={style.btn}
                                        onClick={onForwardClickHandler}
                                        disabled={!id || !dataInfo || Boolean(id && dataInfo && (Number(id) === dataInfo.count)) || isPreviousDataCharacter}
                                        onMouseEnter={async () => {
                                            if (id && dataInfo && Number(id) !== dataInfo.count) {
                                                await prefetchNext(String(Number(id) + 1));
                                            }
                                        }}
                            >
                                <ArrowForwardIcon/>
                            </IconButton>
                        </div>

                        {
                            data &&
                            <div className={style.properties}>
                                <div className={style.row}>
                                    <p>Gender</p>
                                    <p>{data.gender}</p>
                                </div>

                                {data.species && <div className={style.row}>
                                    <p>Species</p>
                                    <p>{data.species}</p>
                                </div>}

                                {
                                    data.status &&
                                    <div className={style.row}>
                                        <p>Status</p>
                                        <p>{data.status}</p>
                                    </div>
                                }

                                {
                                    data.type &&
                                    <div className={style.row}>
                                        <p>Type</p>
                                        <p>{data.type}</p>
                                    </div>
                                }

                                {
                                    data.origin &&
                                    <div className={style.row}>
                                        <p>origin</p>
                                        {
                                            data.origin.url
                                                ? (
                                                    <button onClick={() => {
                                                        const id = data.origin.url.split("https://rickandmortyapi.com/api/location/")[1]
                                                        navigate(`/location/${id}`)
                                                    }}
                                                    >
                                                        {data.origin.name}
                                                    </button>
                                                )
                                                : <p>{data.origin.name}</p>
                                        }
                                    </div>
                                }

                                {
                                    data.location &&
                                    <div className={style.row}>
                                        <p>Location</p>
                                        {
                                            data.location.url
                                                ? (
                                                    <button onClick={() => {
                                                        const id = data.location.url.split("https://rickandmortyapi.com/api/location/")[1];
                                                        navigate(`/location/${id}`);
                                                    }}>
                                                        {data.location.name}
                                                    </button>
                                                )
                                                : <p>{data.location.name}</p>
                                        }
                                    </div>
                                }
                            </div>
                        }

                        {
                            episodes &&
                            <div className={style.episodesBlock}>
                                <div className={style.countBlock}>
                                    <p>List of episodes in which this character appeared:</p>
                                    <div>{episodes.length}</div>
                                </div>
                                <div className={style.list}>
                                    {
                                        episodes.map(episode => (
                                            <Link key={episode.id}
                                                  className={style.link}
                                                  to={`/episodes/${episode.id}`}
                                            >
                                                {`${episode.episode} - ${episode.name}`}
                                            </Link>
                                        ))
                                    }
                                </div>
                            </div>
                        }
                    </>
                )
            }


        </div>
    )
}