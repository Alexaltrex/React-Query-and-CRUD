import React, {ChangeEvent, useEffect, useState} from "react";
import style from "./CharactersPage.module.scss"
import {Pagination} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {CharacterCard} from "./CharacterCard/CharacterCard";
import {useQuery} from "react-query";
import {charactersApi} from "../../api/characters.api";
import {IGetCharacters} from "../../types/character.types";
import {AxiosError} from "axios";
import LinearProgress from "@mui/material/LinearProgress";
import {ErrorBlock} from "../X_Common/Error/ErrorBlock";
import {placeholderCharacters} from "./placeholderCharacters";

export const CharactersPage = () => {
    const {id} = useParams<{ id: string }>();

    const navigate = useNavigate();

    const onChangeHandler = (e: ChangeEvent<unknown>, value: number) => {
        navigate(`/characters/${value}`)
        setLoadedImagesCount(0);
    };

    const {
        isLoading,
        isError,
        error,
        data,
        isPreviousData,
    } = useQuery<IGetCharacters, AxiosError>(
        ["characters", id],
        () => charactersApi.getAll(id as string),
        {
            enabled: Boolean(id),
            keepPreviousData: true,
            //placeholderData: placeholderCharacters,
        },

    );

    const [loadedImagesCount, setLoadedImagesCount] = useState(0);

    return (
        <div className={style.charactersPage}
        >

            {
                isError ? (
                    <ErrorBlock error={error}/>
                ) : (
                    <>
                        <h1 className={style.title}>Characters</h1>
                        {
                            (isLoading || isPreviousData || (data && data.results.length !== loadedImagesCount)) &&
                            <LinearProgress className={style.linearProgressWrapper}/>
                        }

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
                                <div className={style.cards}>
                                    <div className={style.inner}>
                                        {
                                            data.results.map(character => (
                                                    <CharacterCard key={character.id}
                                                                   character={character}
                                                                   onLoadHandler={() => setLoadedImagesCount(loadedImagesCount => loadedImagesCount + 1)}
                                                    />
                                                )
                                            )
                                        }
                                    </div>

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