import { useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { useBusca } from "../../../context/BuscaContext";
import CardManuais from "../../CardManuais";
import { ParagrafosStl, theme } from "../../../theme/theme";
import { Search, X } from "react-feather";

export default function ModalBuscar() {
    const {
        busca,
        setBusca,
        modalAberto,
        setModalAberto,
        todosOsItens = [],
    } = useBusca();
    const inputRef = useRef(null);
    const ultimoTermoRegistrado = useRef("");

    useEffect(() => {
        if (modalAberto || busca) {
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [modalAberto, busca]);

    const filtrados = busca.trim()
        ? todosOsItens.filter(
              (item) =>
                  item.nome.toLowerCase().includes(busca.toLowerCase()) ||
                  (item.descricao &&
                      item.descricao
                          .toLowerCase()
                          .includes(busca.toLowerCase())),
          )
        : todosOsItens.slice(0, 10);

    // Registra telemetria de termos buscados que não possuem manual correspondente (oportunidades)
    useEffect(() => {
        const termo = busca.trim();
        if (
            termo.length >= 3 &&
            filtrados.length === 0 &&
            termo !== ultimoTermoRegistrado.current
        ) {
            const timer = setTimeout(() => {
                ultimoTermoRegistrado.current = termo;
                fetch("/api/telemetria/busca", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ termo }),
                }).catch(() => {});
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [busca, filtrados.length]);

    if (!busca && !modalAberto) return null;

    function fechar() {
        setBusca("");
        setModalAberto(false);
    }

    return (
        <>
            <OverlayBuscaStl onClick={fechar} />
            <ModalContainerStl role="dialog" aria-label="Pesquisar manuais">
                <ModalHeaderStl>
                    <BarraPesquisaModalStl>
                        <Search
                            size={18}
                            color={theme.colors.azulMaisClaro.claro}
                        />
                        <InputModalStl
                            ref={inputRef}
                            type="text"
                            placeholder="Pesquisar manual... (Esc)"
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                        />
                    </BarraPesquisaModalStl>
                    <BotaoFecharModalStl
                        onClick={fechar}
                        title="Fechar (Esc)"
                        aria-label="Fechar busca"
                    >
                        <X size={18} />
                    </BotaoFecharModalStl>
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
                                Experimente perguntar ao{" "}
                                <strong>Assistente IA</strong> no botão
                                flutuante para gerar um procedimento novo!
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
        </>
    );
}

const slideInRight = keyframes`
    from {
        transform: translateX(100%);
    }
    to {
        transform: translateX(0);
    }
`;

const OverlayBuscaStl = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(4, 12, 24, 0.55);
    backdrop-filter: blur(2px);
    z-index: 9998;
`;

const ModalContainerStl = styled.aside`
    position: fixed;
    top: 0;
    right: 0;
    width: 440px;
    height: 100vh;
    background: rgba(8, 29, 53, 0.96);
    backdrop-filter: blur(12px);
    border-left: 1px solid rgba(108, 164, 197, 0.22);
    box-shadow: -8px 0 32px rgba(0, 0, 0, 0.45);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    animation: ${slideInRight} 0.22s cubic-bezier(0.16, 1, 0.3, 1);

    @media (max-width: 480px) {
        width: 88%;
    }
`;

const ModalHeaderStl = styled.div`
    padding: 14px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid rgba(108, 164, 197, 0.16);
    background: rgba(7, 22, 41, 0.85);
`;

const BarraPesquisaModalStl = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(26, 58, 95, 0.55);
    padding: 9px 14px;
    border-radius: 10px;
    border: 1px solid rgba(108, 164, 197, 0.3);

    &:focus-within {
        border-color: ${theme.colors.azulMaisClaro.claro};
    }
`;

const InputModalStl = styled.input`
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: ${theme.colors.clara.medio};
    font-family: ${theme.fontsFamily.paragrafos};
    font-size: 0.92rem;

    &::placeholder {
        color: ${theme.colors.azulMaisClaro.claro};
        opacity: 0.75;
    }
`;

const BotaoFecharModalStl = styled.button`
    background: rgba(26, 58, 95, 0.5);
    border: 1px solid rgba(108, 164, 197, 0.2);
    border-radius: 8px;
    color: ${theme.colors.clara.claro};
    cursor: pointer;
    padding: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;

    &:hover {
        background: ${theme.colors.azulMaisClaro.escuro};
        color: #ffffff;
    }
`;

const ModalConteudoStl = styled.div`
    --scrollbar-thumb: rgba(108, 164, 197, 0.3);
    --scrollbar-track: transparent;

    padding: 16px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 14px;
    flex: 1;
    scrollbar-width: thin;
    scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
`;

const DicaBuscaStl = styled.p`
    font-size: 0.84rem;
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
        font-size: 0.86rem;
        color: ${theme.colors.azulMaisClaro.claro};
        font-family: ${theme.fontsFamily.paragrafos};
        line-height: 1.45;

        strong {
            color: #f59e0b;
        }
    }
`;
