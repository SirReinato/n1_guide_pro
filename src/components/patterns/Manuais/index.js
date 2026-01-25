import CardManuais from "../../../components/CardManuais";
import styled from "styled-components";
import { theme, TitulosPrincipaisStl } from "../../../theme/theme";
import slugify from "../../../utils/slogify";
import { useBusca } from "../../../context/BuscaContext";

export default function Manuais({
    instalacoesPorCategoria = {},
    todosOsItens = [],
}) {
    const { busca } = useBusca();

    const itensFiltrados = todosOsItens.filter(
        (item) =>
            item.nome.toLowerCase().includes(busca.toLowerCase()) ||
            item.descricao.toLowerCase().includes(busca.toLowerCase())
    );

    const titulos = Object.keys(instalacoesPorCategoria);

    return (
        <ManuaisStl>
            {busca ? (
                <>
                    {itensFiltrados.length === 0 ? (
                        <ManualNaoEncontradoStl>
                            Nenhum manual encontrado
                        </ManualNaoEncontradoStl>
                    ) : (
                        <ConteinerManualDuplo>
                            {itensFiltrados.map((dados) => (
                                <CardManuais
                                    key={dados.id}
                                    path={dados.id}
                                    nome={dados.nome}
                                    descricao={dados.descricao}
                                />
                            ))}
                        </ConteinerManualDuplo>
                    )}
                </>
            ) : (
                titulos.map((titulo) => (
                    <ConteinerDosManuais key={titulo} id={slugify(titulo)}>
                        <TitulosPrincipaisStl>{titulo}</TitulosPrincipaisStl>

                        <ConteinerManualDuplo>
                            {instalacoesPorCategoria[titulo].map((dados) => (
                                <CardManuais
                                    key={dados.id}
                                    path={dados.id}
                                    nome={dados.nome}
                                    descricao={dados.descricao}
                                />
                            ))}
                        </ConteinerManualDuplo>
                    </ConteinerDosManuais>
                ))
            )}
        </ManuaisStl>
    );
}

const ManuaisStl = styled.section`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
    padding: 64px 12%;
    @media (min-width: 1401px) {
        padding: 64px 16%;
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

const ConteinerDosManuais = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
    scroll-margin-top: 140px;
`;

const ConteinerManualDuplo = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
    align-items: stretch;
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const ManualNaoEncontradoStl = styled.p`
    font-size: ${theme.fontSize.titulosSecundarios.mm};
    font-family: ${theme.fontsFamily.titulos};
    color: ${theme.colors.azulMaisClaro.medio};
    text-align: center;
`;
