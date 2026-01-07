import React from "react";
import Head from "next/head";
import GlobalStyle from "../src/theme/GlobalStyle";
import { ConteinerGeral } from "../src/theme/theme";
import Header from "../src/components/patterns/Header";
import Footer from "../src/components/patterns/Footer";

function MyApp({ Component, pageProps }) {
    return (
        <>
            <ConteinerGeral>
                <GlobalStyle />
                <Header />
                <Component {...pageProps} />
                <Footer />
            </ConteinerGeral>
        </>
    );
}

export default MyApp;
