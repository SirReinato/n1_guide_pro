import React from "react";
import Head from "next/head";
import GlobalStyle from "../src/theme/GlobalStyle";
import { ConteinerGeral } from "../src/theme/theme";
import Header from "../src/components/patterns/Header";
import Footer from "../src/components/patterns/Footer";
import { BuscaProvider } from "../src/context/BuscaContext";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import dynamic from "next/dynamic";

// AssistenteIA e Aviso carregados apenas no cliente (usam browser state)
const AssistenteIA = dynamic(
    () => import("../src/components/patterns/AssistenteIA"),
    { ssr: false },
);

const AvisoNovidadeIA = dynamic(
    () => import("../src/components/patterns/AvisoNovidadeIA"),
    { ssr: false },
);

function MyApp({ Component, pageProps }) {
    return (
        <BuscaProvider>
            <GlobalStyle />
            <ConteinerGeral>
                <Header />
                <Component {...pageProps} />
                <Footer />
                <AvisoNovidadeIA />
                <AssistenteIA />
                <Analytics />
                <SpeedInsights />
            </ConteinerGeral>
        </BuscaProvider>
    );
}


export default MyApp;

