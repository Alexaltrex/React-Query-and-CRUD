import {App} from "./App";
import React from "react";
import {HashRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {store} from "../../store/store";
import {QueryClient, QueryClientProvider} from "react-query";
import {ReactQueryDevtools} from "react-query/devtools";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: Infinity,
        },
        mutations: {
            retry: 1
        }
    }
});

export const AppContainer = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} />
            <Provider store={store}>
                <HashRouter>
                    <App/>
                </HashRouter>
            </Provider>
        </QueryClientProvider>
    )
}