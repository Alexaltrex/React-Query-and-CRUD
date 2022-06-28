import React, {FC} from "react";
import style from "./CharacterCard.module.scss";
import {ICharacter} from "../../../types/character.types";
import {Link} from "react-router-dom";

interface ICharacterCard {
    character: ICharacter
    onLoadHandler: () => void
}

export const CharacterCard: FC<ICharacterCard> = ({
                                                      character,
                                                      onLoadHandler,
}) => {
    return (
        <Link className={style.characterCard}
              to={`/character/${character.id}`}
        >
            <div className={style.imgWrapper}>
                <img src={character.image}
                     alt=""
                     onLoad={onLoadHandler}
                />
            </div>
            <p className={style.name}>{character.name}</p>
        </Link>
    )
}