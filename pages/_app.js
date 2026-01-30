import React from "react";
import Head from "next/head";
import GlobalStyle from "../src/theme/GlobalStyle";
import { ConteinerGeral } from "../src/theme/theme";
import Header from "../src/components/patterns/Header";
import Footer from "../src/components/patterns/Footer";
import { BuscaProvider } from "../src/context/BuscaContext";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

function MyApp({ Component, pageProps }) {
    return (
        <BuscaProvider>
            <GlobalStyle />
            <ConteinerGeral>
                <Header />
                <Component {...pageProps} />
                <Footer />
                <Analytics />
                <SpeedInsights />
            </ConteinerGeral>
        </BuscaProvider>
    );
}

export default MyApp;
