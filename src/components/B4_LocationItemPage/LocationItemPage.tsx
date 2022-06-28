import React from "react";
import style from "./LocationItemPage.module.scss";
import {useNavigate, useParams} from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import IconButton from "@mui/material/IconButton";
import {locationsApi} from "../../api/locations.api";
import {ICharacter, IInfo} from "../../types/character.types";
import {useQuery, useQueryClient} from "react-query";
import {charactersApi} from "../../api/characters.api";
import {ILocation} from "../../types/location.types";
import LinearProgress from "@mui/material/LinearProgress";
import {ListOfCharacters} from "../X_Common/ListOfCharacters/ListOfCharacters";
import {ErrorBlock} from "../X_Common/Error/ErrorBlock";
import {useGetErrorHandler} from "../../hooks/useGetErrorHandler";

const preUrl = 'https://rickandmortyapi.com/api/character/';

export const LocationItemPage = () => {
    const { id } = useParams<{ id: string }>();

    const {
        isLoading: isLoadingInfo,
        isError: isErrorInfo,
        error: errorInfo,
        data: dataInfo
    } = useQuery<IInfo, any>("location info", locationsApi.getInfo)

    const {
        isLoading: isLoadingLocation,
        isError: isErrorLocation,
        error: errorLocation,
        data,
        isPreviousData: isPreviousDataLocation
    } = useQuery<ILocation, any>(
        ["location", id],
        () => locationsApi.getById(id as string),
        {
            keepPreviousData: true
        }
    )

    const navigate = useNavigate();

    const onBackClickHandler = () => navigate(`/location/${Number(id) - 1}`)
    const onForwardClickHandler = () => navigate(`/location/${Number(id) + 1}`)

    const residentIds = data?.residents.map(resident => resident.split(preUrl)[1]) ?? []

    const {
        isLoading: isLoadingResidents,
        isError: isErrorResidents,
        error: errorResidents,
        data: residents,
        isPreviousData: isPreviousDataResidents,
    } = useQuery<ICharacter[], any>(
        ["charactersOfLocation", id],
        () => charactersApi.getMultipleItems(residentIds),
        {
            enabled: Boolean(data?.residents) && Boolean(data?.residents.length),
            keepPreviousData: true
        }
    );
    useGetErrorHandler(isErrorResidents, errorResidents);

    const queryClient = useQueryClient();
    const prefetchPrev = async (id: string) => {
        await queryClient.prefetchQuery<ILocation, any>(
            ["location", id],
            () => locationsApi.getById(id)
        )
    }
    const prefetchNext = async (id: string) => {
        await queryClient.prefetchQuery<ILocation, any>(
            ["location", id],
            () => locationsApi.getById(id)
        )
    }

    return (
        <div className={style.locationItemPage}>

            {
                (isErrorInfo || isErrorLocation) ? (
                    <ErrorBlock error={isErrorInfo ? errorInfo : errorLocation}/>
                ) : (
                    <>
                        {
                            (
                                isLoadingInfo || isLoadingLocation || isLoadingResidents ||
                                isPreviousDataLocation || isPreviousDataResidents
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

                                        <h1 className={style.title}>
                                            {data.name}
                                        </h1>

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

                                    <div className={style.infoBlock}>
                                        <div className={style.row}>
                                            <p>Dimension</p>
                                            <p>{data.dimension}</p>
                                        </div>
                                        {
                                            data.type && <div className={style.row}>
                                                <p>Type</p>
                                                <p>{data.type}</p>
                                            </div>
                                        }
                                    </div>
                                </>
                            )
                        }

                        {
                            residents && (
                                <ListOfCharacters title="List of characters who have been seen in the location:"
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