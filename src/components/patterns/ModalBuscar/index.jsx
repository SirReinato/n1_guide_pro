import styled from "styled-components";
import { useBusca } from "../../../context/BuscaContext";
import instalacoes from "../../../data/instalacao.json";
import CardManuais from "../../CardManuais";
import {
    ParagrafosStl,
    theme,
    TitulosSecundariosStl,
} from "../../../theme/theme";

export default function ModalBuscar() {
    const { busca, setBusca } = useBusca();

    if (!busca) return null;

    const todosOsItens = Object.values(instalacoes).flat();

    const filtrados = todosOsItens.filter((item) =>
        item.nome.toLowerCase().includes(busca.toLowerCase()),
    );

    return (
        <ModalContainerStl>
            <ModalHeaderStl>
                <TitulosSecundariosStl $primary>
                    Resultados
                </TitulosSecundariosStl>
                <button onClick={() => setBusca("")}>✕</button>
            </ModalHeaderStl>

            <ModalConteudoStl>
                {filtrados.length === 0 ? (
                    <ParagrafosStl $primary>
                        Nenhum manual encontrado
                    </ParagrafosStl>
                ) : (
                    filtrados.map((item) => (
                        <CardManuais
                            key={item.id}
                            path={item.id}
                            nome={item.nome}
                            descricao={item.descricao}
                        />
                    ))
                )}
            </ModalConteudoStl>
        </ModalContainerStl>
    );
}

const ModalContainerStl = styled.aside`
    position: fixed;
    top: 0;
    right: 0;
    width: 420px;
    height: 100vh;
    background: ${theme.colors.azul.medio};
    box-shadow: -4px 0 12px rgba(0, 0, 0, 0.15);
    z-index: 9999;
    display: flex;
    flex-direction: column;

    @media (max-width: 480px) {
        width: 80%;
    }
`;

const ModalHeaderStl = styled.div`
    padding: 16px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid ${theme.colors.clara.medio};

    button {
        background: none;
        border: none;
        font-size: 20px;
        color: ${theme.colors.clara.claro};
        cursor: pointer;
    }
`;

const ModalConteudoStl = styled.div`
    padding: 16px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
`;
