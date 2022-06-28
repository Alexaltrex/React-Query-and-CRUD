import React, {useCallback, useEffect, useState} from "react";
import style from "./Header.module.scss";
import {svgIcons} from "../../assets/svgIcons";
import {Link, useLocation} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../store/hooks";
import {selectBurgerMenu, setBurgerMenu, selectHideHeader} from "../../store/appSlice";
import clsx from "clsx";
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import IconButton from "@mui/material/IconButton";
import {useSelector} from "react-redux";
import src0 from "../../assets/jpeg/menu/characters.jpg";
import src0_1 from "../../assets/jpeg/menu/infinite.jpg";
import src1 from "../../assets/jpeg/menu/locations.jpg";
import src2 from "../../assets/jpeg/menu/episodes.jpg";
import src3 from "../../assets/jpeg/menu/crud.jpg";

export const links = [
    {
        label: "Characters",
        to: "/characters/1",
        slug: "characters",
        src: src0,
    },
    {
        label: "Infinite scroll",
        to: "/infinite-scroll",
        slug: "infinite-scroll",
        src: src0_1,
    },
    {
        label: "Infinite scroll + auto loading",
        to: "/auto-loading",
        slug: "auto-loading",
        src: src0_1,
    },
    {
        label: "Locations",
        to: "/locations/1",
        slug: "locations",
        src: src1,
    },
    {
        label: "Episodes",
        to: "/episodes/1",
        slug: "episodes",
        src: src2,
    },
    {
        label: "CRUD",
        to: "/products",
        slug: "products",
        src: src3,
    },
];

export const Header = () => {
    const burgerMenu = useAppSelector(selectBurgerMenu);
    const dispatch = useAppDispatch()
    const onBurger = () => dispatch(setBurgerMenu(!burgerMenu));
    const location = useLocation();

    const hideHeader = useSelector(selectHideHeader);

    return (
        <header className={style.header}>
            <div className={clsx({
                     [style.hidable]: true,
                     [style.hidable_hide]: hideHeader,
                 })}
            >
                <div className={style.inner}>
                    <Link className={style.logo}
                          to={`/`}
                    >
                        {svgIcons.logo}
                        <p>React Query + CRUD</p>
                    </Link>

                    <nav className={style.links}>
                        {
                            links.map(({label, to, slug}, index) => (
                                <Link key={index}
                                      to={to}
                                      className={clsx({
                                          [style.link]: true,
                                          [style.link_selected]: location.pathname.includes(slug),
                                      })}
                                >
                                    <span>{label}</span>
                                </Link>
                            ))
                        }
                    </nav>

                    <IconButton className={style.burger}
                                onClick={onBurger}
                    >
                        {burgerMenu ? <MenuOpenIcon/> : <MenuIcon/>}
                    </IconButton>
                </div>
            </div>

        </header>
    )
}