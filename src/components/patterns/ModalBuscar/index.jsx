import { useEffect, useRef } from "react";
import styled from "styled-components";
import { useBusca } from "../../../context/BuscaContext";
import CardManuais from "../../CardManuais";
import {
    ParagrafosStl,
    theme,
    TitulosSecundariosStl,
} from "../../../theme/theme";
import { Search } from "react-feather";

export default function ModalBuscar() {
    const { busca, setBusca, modalAberto, setModalAberto, todosOsItens = [] } = useBusca();
    const inputRef = useRef(null);

    useEffect(() => {
        if (modalAberto || busca) {
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [modalAberto, busca]);

    if (!busca && !modalAberto) return null;

    const filtrados = busca.trim()
        ? todosOsItens.filter((item) =>
            item.nome.toLowerCase().includes(busca.toLowerCase()) ||
            (item.descricao && item.descricao.toLowerCase().includes(busca.toLowerCase()))
        )
        : todosOsItens.slice(0, 10); // Sugere os primeiros se o input estiver vazio

    function fechar() {
        setBusca("");
        setModalAberto(false);
    }

    return (
        <ModalContainerStl>
            <ModalHeaderStl>
                <BarraPesquisaModalStl>
                    <Search size={18} color={theme.colors.azulMaisClaro.claro} />
                    <InputModalStl
                        ref={inputRef}
                        type="text"
                        placeholder="Pesquisar manual... (Esc)"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                </BarraPesquisaModalStl>
                <BotaoFecharModalStl onClick={fechar} title="Fechar (Esc)">✕</BotaoFecharModalStl>
            </ModalHeaderStl>

            <ModalConteudoStl>
                {!busca.trim() && (
                    <DicaBuscaStl>
                        💡 Digite uma palavra-chave para filtrar os manuais:
                    </DicaBuscaStl>
                )}

                {busca.trim() && filtrados.length === 0 ? (
                    <NenhumResultadoStl>
                        <ParagrafosStl $primary>
                            Nenhum manual encontrado para "{busca}".
                        </ParagrafosStl>
                        <p className="dicaIa">
                            Experimente perguntar ao <strong>Assistente IA</strong> no botão flutuante para gerar um procedimento novo!
                        </p>
                    </NenhumResultadoStl>
                ) : (
                    filtrados.map((item) => (
                        <div key={item.id} onClick={fechar}>
                            <CardManuais
                                path={item.id}
                                nome={item.nome}
                                descricao={item.descricao}
                            />
                        </div>
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
    padding: 14px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    background: ${theme.colors.azul.escuro};
`;

const BarraPesquisaModalStl = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
    background: ${theme.colors.azul.medio};
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid ${theme.colors.azulMaisClaro.escuro};
`;

const InputModalStl = styled.input`
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: ${theme.colors.clara.medio};
    font-family: ${theme.fontsFamily.paragrafos};
    font-size: 0.9rem;

    &::placeholder {
        color: ${theme.colors.azulMaisClaro.claro};
        opacity: 0.8;
    }
`;

const BotaoFecharModalStl = styled.button`
    background: none;
    border: none;
    color: ${theme.colors.clara.claro};
    font-size: 1.2rem;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.2s;

    &:hover {
        opacity: 0.7;
    }
`;

const ModalConteudoStl = styled.div`
    padding: 16px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const DicaBuscaStl = styled.p`
    font-size: 0.82rem;
    color: ${theme.colors.azulMaisClaro.claro};
    font-family: ${theme.fontsFamily.paragrafos};
    margin-bottom: 4px;
`;

const NenhumResultadoStl = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 12px 0;

    .dicaIa {
        font-size: 0.85rem;
        color: ${theme.colors.azulMaisClaro.claro};
        font-family: ${theme.fontsFamily.paragrafos};
        line-height: 1.4;

        strong {
            color: #f59e0b;
        }
    }
`;
