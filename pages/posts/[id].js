import instalacoes from "../../instalacao.json";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    TitulosPrincipaisStl,
    TitulosSecundariosStl,
    theme,
} from "../../src/theme/theme";
import Banner from "../../src/components/patterns/Banner";
import styled from "styled-components";
import PassoAPasso from "../../src/components/passo_a_passo";

const todosOsItens = [
    ...instalacoes.Instalacões,
    ...instalacoes.Outlook,
    ...instalacoes.Vpn,
    ...instalacoes.Configurações,
    ...instalacoes["Criando-User"],
];
export async function getStaticPaths() {
    const paths = todosOsItens.map((dados) => {
        return { params: { id: `${dados.id}` } };
    });
    return {
        paths: paths,
        fallback: false,
    };
}

export async function getStaticProps({ params }) {
    const id = parseInt(params.id);

    const post = todosOsItens.find((postAtual) => postAtual.id === id);

    if (!post) {
        return { notFound: true };
    }

    return {
        props: {
            id: post.id,
            nome: post.nome,
            descricao: post.descricao,
            passo_a_passo: post.passo_passo,
        },
    };
}

export default function Post({ nome, descricao, passo_a_passo }) {
    const router = useRouter();
    if (router.isFallback) {
        return "Essa página não existe";
    }

    return (
        <>
            <ConteinerPostStl>
                <TitulosPrincipaisStl>{nome}</TitulosPrincipaisStl>
                <TitulosSecundariosStl $primary>
                    {descricao}
                </TitulosSecundariosStl>

                {passo_a_passo.map((dados) => {
                    return (
                        <PassoAPasso
                            paragrafo={dados.descricao}
                            titulo={dados.titulo}
                            passo={dados.passo}
                            img={dados.imagem ? dados.imagem : null}
                            key={dados.passo + 1}
                        />
                    );
                })}
                <Link href={"/"}>
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
