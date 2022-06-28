import React from "react";
import style from "./EpisodeItemPage.module.scss"
import {useNavigate, useParams} from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import IconButton from "@mui/material/IconButton";
import {useQuery, useQueryClient} from "react-query";
import {ICharacter, IInfo} from "../../types/character.types";
import {charactersApi} from "../../api/characters.api";
import {episodesApi} from "../../api/episodes.api";
import {IEpisode} from "../../types/episodes.types";
import LinearProgress from "@mui/material/LinearProgress";
import {ListOfCharacters} from "../X_Common/ListOfCharacters/ListOfCharacters";
import {useGetErrorHandler} from "../../hooks/useGetErrorHandler";
import {ErrorBlock} from "../X_Common/Error/ErrorBlock";

const preUrl = 'https://rickandmortyapi.com/api/character/';

export const EpisodeItemPage = () => {
    const {id} = useParams<{ id: string }>();

    const navigate = useNavigate();

    const {
        isLoading: isLoadingInfo,
        isError: isErrorInfo,
        error: errorInfo,
        data: dataInfo
    } = useQuery<IInfo, any>(
        "episode info",
        episodesApi.getInfo
    )

    const {
        isLoading: isLoadingEpisode,
        isError: isErrorEpisode,
        error: errorEpisode,
        data,
        isPreviousData: isPreviousDataEpisode
    } = useQuery<IEpisode, any>(
        ["episode", id],
        () => episodesApi.getById(id as string),
        {
            keepPreviousData: true
        }
    );

    const onBackClickHandler = () => navigate(`/episode/${Number(id) - 1}`);
    const onForwardClickHandler = () => navigate(`/episode/${Number(id) + 1}`);

    const characterIds = data?.characters.map(character => character.split(preUrl)[1]) ?? [];
    const {
        isLoading: isLoadingResidents,
        isError: isErrorResidents,
        error: errorResidents,
        data: residents,
        isPreviousData: isPreviousDataResidents,
    } = useQuery<ICharacter[], any>(
        ["charactersOfEpisode", id],
        () => charactersApi.getMultipleItems(characterIds),
        {
            enabled: Boolean(data?.characters) && Boolean(data?.characters.length),
            keepPreviousData: true
        }
    );
    useGetErrorHandler(isErrorResidents, errorResidents);

    const queryClient = useQueryClient();
    const prefetchPrev = async (id: string) => {
        await queryClient.prefetchQuery<IEpisode, any>(
            ["episode", id],
            () => episodesApi.getById(id)
        )
    }
    const prefetchNext = async (id: string) => {
        await queryClient.prefetchQuery<IEpisode, any>(
            ["episode", id],
            () => episodesApi.getById(id)
        )
    }

    return (
        <div className={style.episodeItemPage}>

            {
                (isErrorInfo || isErrorEpisode) ? (
                    <ErrorBlock error={isErrorInfo ? errorInfo : errorEpisode}/>
                ) : (
                    <>
                        {
                            (
                                isLoadingInfo || isLoadingEpisode || isLoadingResidents ||
                                isPreviousDataEpisode || isPreviousDataResidents
                            ) && <LinearProgress  className={style.linearProgressWrapper}/>
                        }

                        {
                            data && (
                                <>

                                    <div className={style.titleBlock}>

                                        <IconButton className={style.btn}
                                                    onClick={onBackClickHandler}
                                                    disabled={Number(id) === 1}
                                                    onMouseEnter={async () => {
                                                        if (id && Number(id) !== 1) {
                                                            await prefetchPrev(String(Number(id) - 1))
                                                        }
                                                    }}
                                        >
                                            <ArrowBackIcon/>
                                        </IconButton>

                                        <div className={style.titleWrapper}>
                                            <h1 className={style.title}>
                                                <span>{data.episode}</span><span> - </span><span>{data.name}</span>
                                            </h1>
                                            <p className={style.air}>{`Air date: ${data.air_date}`}</p>
                                        </div>

                                        <IconButton className={style.btn}
                                                    onClick={onForwardClickHandler}
                                                    disabled={Boolean(!dataInfo) || Boolean(dataInfo && (Number(id) === dataInfo.count))}
                                                    onMouseEnter={async () => {
                                                        if (id && dataInfo && Number(id) !== dataInfo.count) {
                                                            await prefetchNext(String(Number(id) + 1));
                                                        }
                                                    }}
                                        >
                                            <ArrowForwardIcon/>
                                        </IconButton>

                                    </div>

                                </>
                            )
                        }

                        {
                            residents && (
                                <ListOfCharacters title="List of characters who have been seen in the episode:"
                                                  characters={residents}
                                                  className={style.residents}
                                />
                            )
                        }
                    </>
                )
            }



        </div>
    )
}