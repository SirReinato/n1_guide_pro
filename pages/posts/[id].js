import instalacoes from "../../instalacao.json";
import Link from "next/link";
import styled from "styled-components";
import {
    TitulosPrincipaisStl,
    TitulosSecundariosStl,
    theme,
} from "../../src/theme/theme";
import Banner from "../../src/components/patterns/Banner";
import PassoAPasso from "../../src/components/passo_a_passo";

const todosOsItens = Object.values(instalacoes).flat();

export async function getStaticPaths() {
    const paths = todosOsItens.map((item) => ({
        params: { id: String(item.id) },
    }));

    return {
        paths,
        fallback: false,
    };
}

export async function getStaticProps({ params }) {
    const id = Number(params.id);

    const post = todosOsItens.find((item) => item.id === id);

    if (!post) {
        return { notFound: true };
    }

    return {
        props: {
            nome: post.nome,
            descricao: post.descricao,
            passo_a_passo: post.passo_passo,
        },
    };
}

export default function Post({ nome, descricao, passo_a_passo }) {
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
                        paragrafo={dados.descricao}
                        titulo={dados.titulo}
                        passo={dados.passo}
                        img={dados.imagem || null}
                    />
                ))}

                <Link href="/">
                    <BtnVoltarSrl>Voltar para a página inicial</BtnVoltarSrl>
                </Link>
            </ConteinerPostStl>

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
        padding: 32px 2%;
        flex-direction: column;
    }
`;

const BtnVoltarSrl = styled.button`
    width: fit-content;
    display: flex;
    align-items: center;
    padding: 8px 16px;
    border-radius: 8px;
    gap: 8px;
    border: none;
    font-size: ${theme.fontSize.paragrafos.mm};
    font-family: ${theme.fontsFamily.paragrafos};
    color: ${theme.colors.azul.escuro};
    background: ${theme.colors.azulMaisClaro.claro};
    cursor: pointer;
    &:hover {
        background: ${theme.colors.azulMaisClaro.medio};
    }
`;
