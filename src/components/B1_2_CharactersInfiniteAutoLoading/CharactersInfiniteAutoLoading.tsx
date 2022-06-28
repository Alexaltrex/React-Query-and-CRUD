import React, {useEffect} from "react";
import style from "../B1_1_CharactersInfinitePage/CharactersInfinitePage.module.scss";
import {useInfiniteQuery} from "react-query";
import {charactersApi} from "../../api/characters.api";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import {ErrorBlock} from "../X_Common/Error/ErrorBlock";
import {IGetCharactersInfinite} from "../../types/character.types";
import {CharacterCard} from "../B1_1_CharactersInfinitePage/CharacterCard/CharacterCard";
import {useSelector} from "react-redux";
import {selectIsEndPage, setIsEndPage} from "../../store/appSlice";
import {useAppDispatch} from "../../store/hooks";

export const CharactersInfiniteAutoLoading = () => {
    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isError,
        error,
    } =
        useInfiniteQuery<IGetCharactersInfinite, any>(
            'characters infinite',
            charactersApi.getInfinite,
            {
                getNextPageParam: (lastPage, pages) => {
                    return lastPage.nextPage
                },
            }
        );

    const dispatch = useAppDispatch();
    const isEndPage = useSelector(selectIsEndPage);
    useEffect(() => {
        if (isEndPage) {
            if (hasNextPage) {
                fetchNextPage();
                dispatch(setIsEndPage(false));
            }
        }
    }, [isEndPage])

    // useEffect(() => {
    //     console.log("isEndPage: ", isEndPage)
    // }, [isEndPage])

    return (
        <div className={style.charactersInfinitePage}>

            {
                isError ? (
                    <ErrorBlock error={error}/>
                ) : (
                    <>
                        {
                            (isLoading || isFetchingNextPage) &&
                            <LinearProgress className={style.linearProgressWrapper}/>
                        }

                        <h1 className={style.title}>Characters infinite + auto loading</h1>
                        <div className={style.list}>
                            {
                                data && (
                                    data.pages.map((group, index) => (
                                        <div key={index}>
                                            {
                                                group.response.map((character, index) => (
                                                    <CharacterCard key={index} data={character}/>
                                                ))
                                            }
                                        </div>
                                    ))
                                )
                            }
                        </div>
                    </>
                )
            }


        </div>
    )
}