import CardManuais from "../../../components/CardManuais";
import styled from "styled-components";
import { theme } from "../../../theme/theme";
import { useBusca } from "../../../context/BuscaContext";

export default function Manuais({ instalacoesPorCategoria = {}, todosOsItens = [] }) {
    const { busca } = useBusca();

    /* A section de manuais só aparece quando o usuário pesquisa */
    if (!busca) return null;

    const itensFiltrados = todosOsItens.filter(
        (item) =>
            item.nome.toLowerCase().includes(busca.toLowerCase()) ||
            item.descricao.toLowerCase().includes(busca.toLowerCase()),
    );

    return (
        <ManuaisStl>
            <ConteinerManualDuplo>
                {itensFiltrados.length === 0 ? (
                    <ManualNaoEncontradoStl>
                        Nenhum manual encontrado
                    </ManualNaoEncontradoStl>
                ) : (
                    itensFiltrados.map((dados) => (
                        <CardManuais
                            key={dados.id}
                            path={dados.id}
                            nome={dados.nome}
                            descricao={dados.descricao}
                        />
                    ))
                )}
            </ConteinerManualDuplo>
        </ManuaisStl>
    );
}

const ManuaisStl = styled.section`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 16px;
    padding: 32px 0 0;

    @media (max-width: 480px) {
        flex-direction: column;
    }
`;

const ConteinerManualDuplo = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
    align-items: stretch;
    @media (max-width: 481px) {
        grid-template-columns: 1fr;
    }
`;

const ManualNaoEncontradoStl = styled.p`
    grid-column: 1 / -1;
    font-size: ${theme.fontSize.titulosSecundarios.mm};
    font-family: ${theme.fontsFamily.titulos};
    color: ${theme.colors.azulMaisClaro.medio};
    text-align: center;
`;
