import React from "react";
import { useRouter } from "next/router";
import GlobalStyle from "../src/theme/GlobalStyle";
import { ConteinerGeral } from "../src/theme/theme";
import Header from "../src/components/patterns/Header";
import Footer from "../src/components/patterns/Footer";
import { BuscaProvider } from "../src/context/BuscaContext";
import { MenuProvider } from "../src/context/MenuContext";
import WikiLayout from "../src/components/layout/WikiLayout";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import dynamic from "next/dynamic";

// Componentes cliente carregados dinamicamente
const AssistenteIA = dynamic(
    () => import("../src/components/patterns/AssistenteIA"),
    { ssr: false },
);

const AvisoNovidadeIA = dynamic(
    () => import("../src/components/patterns/AvisoNovidadeIA"),
    { ssr: false },
);

const ModalBuscar = dynamic(
    () => import("../src/components/patterns/ModalBuscar"),
    { ssr: false },
);

function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const isAdminRoute = router?.pathname?.startsWith("/admin");

    if (isAdminRoute) {
        return (
            <>
                <GlobalStyle />
                <Component {...pageProps} />
                <Analytics />
                <SpeedInsights />
            </>
        );
    }

    return (
        <BuscaProvider>
            <GlobalStyle />
            <MenuProvider>
                <ConteinerGeral>
                    <Header />
                    <ModalBuscar />
                    <WikiLayout>
                        <Component {...pageProps} />
                    </WikiLayout>
                    <Footer />
                    <AvisoNovidadeIA />
                    <AssistenteIA />
                    <Analytics />
                    <SpeedInsights />
                </ConteinerGeral>
            </MenuProvider>
        </BuscaProvider>
    );
}

export default MyApp;
