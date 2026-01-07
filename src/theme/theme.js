const { default: styled } = require("styled-components");

export const theme = {
    colors: {
        azul: {
            escuro: "#081D35",
            medio: "#1A3A5F",
            claro: "#4F75A0",
        },
        azulMaisClaro: {
            escuro: "#448CB6",
            medio: "#6CA4C5",
            claro: "#9AC3DB",
        },
        clara: {
            escuro: "#DCC3A8",
            medio: "#F5F0EA",
            claro: "#F5F0EA",
            bgGeral: "#071629ff",
        },
    },
    fontsFamily: {
        titulos: "Aldrich",
        paragrafos: "Almarai",
    },
    fontSize: {
        titulos: {
            gg: "3rem",
            mm: "2.5rem",
            pp: "2.2rem",
        },
        titulosSecundarios: {
            gg: "2rem",
            mm: "1.8rem",
            pp: "1.6rem",
        },
        paragrafos: {
            gg: "1.5rem",
            mm: "1.125rem",
            pp: "1rem",
        },
    },
};

// Titulos e paragrafos

export const TitulosPrincipaisStl = styled.h1`
    font-size: ${theme.fontSize.titulos.gg};
    font-family: ${theme.fontsFamily.titulos};
    font-weight: 400;
    font-style: normal;
    color: ${(props) =>
        props.$primary ? theme.colors.azul.escuro : theme.colors.clara.claro};
    @media (min-width: 1401px) {
    }
    @media (min-width: 768px) and (max-width: 1200px) {
        font-size: 2.2rem;
    }
    @media (min-width: 481px) and (max-width: 767px) {
    }
    @media (max-width: 480px) {
        font-size: 2.6rem;
        text-align: center;
        align-items: start;
    }
`;
export const TitulosSecundariosStl = styled.h2`
    font-size: ${theme.fontSize.titulosSecundarios.gg};
    font-family: ${theme.fontsFamily.titulos};
    font-weight: 400;
    text-align: ${(props) => (props.$primary ? "center" : "start")};
    font-style: normal;
    color: ${(props) =>
        props.$primary
            ? `${theme.colors.clara.medio}`
            : `${theme.colors.azul.escuro}`};
    @media (min-width: 1401px) {
    }
    @media (min-width: 768px) and (max-width: 1200) {
        font-size: 1.8rem;
    }
    @media (min-width: 481px) and (max-width: 767px) {
    }
    @media (max-width: 480px) {
        font-size: 1.6rem;
        text-align: center;
    }
`;
export const ParagrafosStl = styled.p`
    font-size: ${(props) =>
        props.$gg
            ? theme.fontSize.paragrafos.gg
            : theme.fontSize.paragrafos.mm};
    font-family: ${theme.fontsFamily.paragrafos};
    font-weight: 400;
    font-style: normal;
    line-height: 28px;
    color: ${(props) =>
        props.$primary
            ? `${theme.colors.azulMaisClaro.medio}`
            : `${theme.colors.azul.escuro}`};
    @media (min-width: 1401px) {
    }
    @media (min-width: 768px) and (max-width: 1200) {
        font-size: 1rem;
    }
    @media (min-width: 481px) and (max-width: 767px) {
    }
    @media (max-width: 480px) {
        text-align: center;
    }
`;

// Conteiners
export const ConteinerGeral = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: ${(props) =>
        props.$primary
            ? `${theme.colors.azulMaisClaro.escuro}`
            : `${theme.colors.clara.bgGeral}`};
    @media (min-width: 1200) {
    }
    @media (min-width: 432px) and (max-width: 780px) {
    }
    @media (max-width: 431px) {
    }
`;
