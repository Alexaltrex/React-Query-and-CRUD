import React, {UIEventHandler, useCallback, useEffect, useRef, useState} from 'react';
import {Header} from "../A1_Header/Header";
import style from "./App.module.scss";
import {ProductsPage} from "../B7_ProductsPage/ProductsPage";
import {Route, Routes} from 'react-router-dom';
import {ProductItemPage} from "../B8_ProductItemPage/ProductItemPage";
import {SnackbarCustom} from "../X_Common/SnackbarCustom/SnackbarCustom";
import clsx from "clsx";
import {useAppDispatch, useAppSelector} from "../../store/hooks";
import {selectBurgerMenu, setHideHeader, setIsEndPage} from "../../store/appSlice";
import { HomePage } from '../B0_HomePage/HomePage';
import {BurgerMenu} from "../A2_BurgerMenu/BurgerMenu";
import {CharactersPage} from "../B1_CharactersPage/CharactersPage";
import {CharacterItemPage} from "../B2_CharacterItemPage/CharacterItemPage";
import {LocationsPage} from "../B3_LocationsPage/LocationsPage";
import {LocationItemPage} from "../B4_LocationItemPage/LocationItemPage";
import {EpisodesPage} from "../B5_EpisodesPage/EpisodesPage";
import {EpisodeItemPage} from "../B6_EpisodeItemPage/EpisodeItemPage";
import {CharactersInfinitePage} from "../B1_1_CharactersInfinitePage/CharactersInfinitePage";
import {CharactersInfiniteAutoLoading} from "../B1_2_CharactersInfiniteAutoLoading/CharactersInfiniteAutoLoading";

const routes = [
    {path: "/", element: <HomePage/>},
    {path: "/infinite-scroll", element: <CharactersInfinitePage/>},
    {path: "/auto-loading", element: <CharactersInfiniteAutoLoading/>},
    {path: "/characters/:id", element: <CharactersPage/>},
    {path: "/character/:id", element: <CharacterItemPage/>},
    {path: "/locations/:id", element: <LocationsPage/>},
    {path: "/location/:id", element: <LocationItemPage/>},
    {path: "/episodes/:id", element: <EpisodesPage/>},
    {path: "/episode/:id", element: <EpisodeItemPage/>},
    {path: "/products", element: <ProductsPage/>},
    {path: "/product/:id", element: <ProductItemPage/>},
];

export const App = () => {
    const burgerMenu = useAppSelector(selectBurgerMenu);

    const ref = useRef<HTMLDivElement>(null)

    const [scrollTop, setScrollTop] = useState(0);

    const dispatch = useAppDispatch();
    const onScrollHandler = (e: any) => {
        if (ref && ref.current) {
            const newScrollTop = ref.current.scrollTop;

            const scrollHeight = ref.current.scrollHeight;
            const clientHeight = ref.current.clientHeight;
            const delta = scrollHeight - newScrollTop - clientHeight;
            const isEnd = delta <= 100;
            if (isEnd) {
                dispatch(setIsEndPage(true));
            }
            //console.log("isEnd: ", isEnd)

            if (newScrollTop > scrollTop) {
                dispatch(setHideHeader(true));
            } else {
                dispatch(setHideHeader(false));
            }
            setScrollTop(newScrollTop);
        }
    };

    return (
        <div className={clsx({
            [style.app]: true,
            [style.app_fixed]: burgerMenu,
        })}
             ref={ref}
             onScroll={onScrollHandler}
        >
            <Header/>
            <SnackbarCustom/>
            <BurgerMenu/>
            <main className={style.main}
            >
                <Routes>
                    {
                        routes.map(({path, element}, index) => (
                            <Route key={index}
                                   path={path}
                                   element={element}
                            />
                        ))
                    }
                </Routes>
            </main>
        </div>
    );
}

