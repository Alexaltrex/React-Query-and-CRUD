import React from "react";
import style from "./CharactersInfinitePage.module.scss";
import {useInfiniteQuery} from "react-query";
import {charactersApi} from "../../api/characters.api";
import Button from "@mui/material/Button";
import {CharacterCard} from "./CharacterCard/CharacterCard";
import LinearProgress from "@mui/material/LinearProgress";
import {ErrorBlock} from "../X_Common/Error/ErrorBlock";
import {IGetCharactersInfinite} from "../../types/character.types";

export const CharactersInfinitePage = () => {
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

                        <h1 className={style.title}>Characters infinite</h1>
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

                        {
                            hasNextPage &&
                            <Button variant="contained"
                                    onClick={() => fetchNextPage()}
                                    disabled={isFetchingNextPage}
                                    className={style.seeMoreBtn}
                            >
                                See more...
                            </Button>
                        }
                    </>
                )
            }


        </div>
    )
}