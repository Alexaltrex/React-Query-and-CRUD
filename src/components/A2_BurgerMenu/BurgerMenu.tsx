import React from "react";
import style from "./BurgerMenu.module.scss";
import clsx from "clsx";
import {useAppDispatch, useAppSelector} from "../../store/hooks";
import {selectBurgerMenu, setBurgerMenu} from "../../store/appSlice";
import {links} from "../A1_Header/Header";
import {Link} from "react-router-dom";

export const BurgerMenu = () => {
    const burgerMenu = useAppSelector(selectBurgerMenu);
    const dispatch = useAppDispatch();

    return (
        <aside className={clsx({
            [style.burgerMenu]: true,
            [style.burgerMenu_open]: burgerMenu,
        })}>
            <div className={style.inner}>
                {
                    links.map(({to, label}, index) => (
                        <Link to={to} key={index} className={style.link}
                              onClick={() => dispatch(setBurgerMenu(false))}
                        >
                            {label}
                        </Link>
                    ))
                }
            </div>
        </aside>
    )
}