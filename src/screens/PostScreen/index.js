import Link from "next/link";
import styled from "styled-components";
import {
    TitulosPrincipaisStl,
    TitulosSecundariosStl,
    theme,
} from "../../theme/theme";
import Banner from "../../components/patterns/Banner";
import PassoAPasso from "../../components/passo_a_passo";

export default function PostScreen({ nome, descricao, passo_a_passo }) {
    return (
        <>
            <ConteinerPostStl>
                <TitulosPrincipaisStl>{nome}</TitulosPrincipaisStl>

                <TitulosSecundariosStl $primary>
                    {descricao}
                </TitulosSecundariosStl>

                {passo_a_passo.map((dados) => (
                    <PassoAPasso
                        key={`${dados.passo}-${dados.titulo}`}
                        passo={dados.passo}
                        titulo={dados.titulo}
                        paragrafo={dados.descricao}
                        img={dados.imagem || null}
                    />
                ))}
            </ConteinerPostStl>
            <Link href="/">
                <BotaoFlutuante>← Home</BotaoFlutuante>
            </Link>
            <Banner />
        </>
    );
}

const ConteinerPostStl = styled.div`
    width: 80%;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 32px 2%;
    margin: 64px 0;
    gap: 32px;
    border: 2px solid ${theme.colors.azulMaisClaro.escuro};
    border-radius: 16px;
    @media (min-width: 1401px) {
        /* padding: 64px 16%; */
    }
    @media (min-width: 768px) and (max-width: 1200px) {
        padding: 16px 6%;
    }
    @media (min-width: 481px) and (max-width: 767px) {
        padding: 16px 10%;
    }
    @media (max-width: 480px) {
        width: 100%;
        padding: 32px 2%;
        flex-direction: column;
    }
`;

const BotaoFlutuante = styled.button`
    position: fixed;
    right: 24px;
    bottom: 64px;
    z-index: 1000;

    padding: 12px 20px;
    border-radius: 999px;
    border: none;

    font-size: ${theme.fontSize.paragrafos.mm};
    font-family: ${theme.fontsFamily.paragrafos};

    color: ${theme.colors.azul.escuro};
    background: ${theme.colors.azulMaisClaro.claro};

    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

    transition: all 0.2s ease;

    &:hover {
        background: ${theme.colors.azulMaisClaro.medio};
        transform: translateY(-2px);
    }

    @media (max-width: 480px) {
        right: 16px;
        bottom: 16px;
        padding: 10px 16px;
    }
`;
