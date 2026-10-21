import Link from "next/link";
import styled from "styled-components";
import {
    TitulosPrincipaisStl,
    TitulosSecundariosStl,
    theme,
} from "../../theme/theme";
import PassoAPasso from "../../components/passo_a_passo";
import dynamic from "next/dynamic";

import { useState, useEffect } from "react";
import { Copy, Check, ThumbsUp, ThumbsDown, ArrowLeft } from "react-feather";

// dynamic() fora do componente para evitar recriação a cada render
const ModalBuscar = dynamic(
    () => import("../../components/patterns/ModalBuscar"),
    { ssr: false },
);

export default function PostScreen({ id, nome, descricao, passo_a_passo }) {
    const [copiado, setCopiado] = useState(false);
    const [votoRegistrado, setVotoRegistrado] = useState(null);

    useEffect(() => {
        if (!id) return;
        const jaVotou = localStorage.getItem(`n1_voto_manual_${id}`);
        if (jaVotou) setVotoRegistrado(jaVotou);

        // Registra visualização única por sessão de navegador
        const chaveSessao = `n1_view_manual_${id}`;
        if (!sessionStorage.getItem(chaveSessao)) {
            sessionStorage.setItem(chaveSessao, "1");
            fetch("/api/manuais/avaliar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, voto: "visualizacao" }),
            }).catch(() => {});
        }
    }, [id]);

    async function votar(tipo) {
        if (votoRegistrado || !id) return;
        setVotoRegistrado(tipo);
        localStorage.setItem(`n1_voto_manual_${id}`, tipo);

        try {
            await fetch("/api/manuais/avaliar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, voto: tipo }),
            });
        } catch (_) {}
    }

    function copiarParaChamado() {
        let texto = `=========================================\n`;
        texto += `📋 PROCEDIMENTO N1: ${nome}\n`;
        if (descricao) texto += `Objetivo: ${descricao}\n`;
        texto += `=========================================\n\n`;

        passo_a_passo.forEach((dados) => {
            texto += `Passo ${dados.passo}: ${dados.titulo}\n`;
            if (dados.descricao) texto += `${dados.descricao}\n\n`;
        });

        texto += `-----------------------------------------\n`;
        texto += `Base de Conhecimento: N1 Guide Pro\n`;

        if (navigator.clipboard) {
            navigator.clipboard.writeText(texto.trim()).then(() => {
                setCopiado(true);
                setTimeout(() => setCopiado(false), 2500);
            });
        }
    }

    return (
        <PostWrapperStl>
            <ModalBuscar />

            <ConteinerPostStl>
                <HeaderDocStl>
                    <TopActionsRowStl>
                        <Link href="/" passHref>
                            <BtnVoltarDocStl>
                                <ArrowLeft size={16} />
                                <span>Voltar ao Início</span>
                            </BtnVoltarDocStl>
                        </Link>

                        <BotaoCopiarChamadoStl
                            onClick={copiarParaChamado}
                            title="Copiar procedimento formatado para colar em chamado ou ticket"
                        >
                            {copiado ? (
                                <Check size={17} color="#10b981" />
                            ) : (
                                <Copy size={17} />
                            )}
                            <span>
                                {copiado
                                    ? "Copiado para o Chamado! ✅"
                                    : "Copiar para o Chamado"}
                            </span>
                        </BotaoCopiarChamadoStl>
                    </TopActionsRowStl>

                    <TituloDocStl>{nome}</TituloDocStl>

                    {descricao && (
                        <DescricaoDocStl>{descricao}</DescricaoDocStl>
                    )}
                </HeaderDocStl>

                <PassosListaStl>
                    {passo_a_passo.map((dados) => (
                        <PassoAPasso
                            key={`${dados.passo}-${dados.titulo}`}
                            passo={dados.passo}
                            titulo={dados.titulo}
                            paragrafo={dados.descricao}
                            img={dados.imagem || null}
                        />
                    ))}
                </PassosListaStl>

                {/* Bloco de Avaliação de Utilidade */}
                <BoxAvaliacaoStl>
                    <div className="textoAvaliacao">
                        <ThumbsUp size={18} color="#f59e0b" />
                        <span>
                            Este procedimento ajudou a resolver o problema?
                        </span>
                    </div>

                    {votoRegistrado ? (
                        <MensagemAgradecimentoStl>
                            ✅ Obrigado pelo seu feedback! Isso ajuda a
                            aprimorar a base de conhecimento.
                        </MensagemAgradecimentoStl>
                    ) : (
                        <BotoesVotoStl>
                            <BotaoVotoStl
                                onClick={() => votar("positivo")}
                                title="Sim, resolveu"
                            >
                                <ThumbsUp size={15} /> Sim, ajudou
                            </BotaoVotoStl>
                            <BotaoVotoStl
                                onClick={() => votar("negativo")}
                                title="Não resolveu"
                            >
                                <ThumbsDown size={15} /> Não ajudou
                            </BotaoVotoStl>
                        </BotoesVotoStl>
                    )}
                </BoxAvaliacaoStl>
            </ConteinerPostStl>
        </PostWrapperStl>
    );
}

const PostWrapperStl = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const ConteinerPostStl = styled.article`
    width: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 36px 48px;
    margin: 8px 0 24px;
    gap: 28px;
    background: rgba(8, 29, 53, 0.72);
    border: 1px solid rgba(108, 164, 197, 0.2);
    border-radius: 18px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.22);

    @media (max-width: 1024px) {
        padding: 28px 24px;
    }

    @media (max-width: 480px) {
        padding: 20px 16px;
        gap: 20px;
    }
`;

const HeaderDocStl = styled.header`
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-bottom: 24px;
    border-bottom: 1px solid rgba(108, 164, 197, 0.16);
`;

const TopActionsRowStl = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
`;

const BtnVoltarDocStl = styled.a`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    border-radius: 8px;
    font-family: ${theme.fontsFamily.paragrafos};
    font-size: 0.88rem;
    font-weight: 600;
    color: ${theme.colors.azulMaisClaro.claro};
    background: rgba(26, 58, 95, 0.55);
    border: 1px solid rgba(108, 164, 197, 0.22);
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s ease;

    &:hover {
        background: ${theme.colors.azulMaisClaro.escuro};
        color: #ffffff;
    }
`;

const TituloDocStl = styled(TitulosPrincipaisStl)`
    font-size: 2.3rem;
    line-height: 1.2;
    text-align: left;

    @media (max-width: 768px) {
        font-size: 1.75rem;
    }
`;

const DescricaoDocStl = styled(TitulosSecundariosStl)`
    font-size: 1.15rem;
    font-family: ${theme.fontsFamily.paragrafos};
    color: ${theme.colors.azulMaisClaro.claro};
    line-height: 1.55;
    text-align: left;
    font-weight: 400;

    @media (max-width: 768px) {
        font-size: 1rem;
    }
`;

const PassosListaStl = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
`;

const BotaoCopiarChamadoStl = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 9px 18px;
    border-radius: 8px;
    border: 1px solid rgba(108, 164, 197, 0.35);
    background: ${theme.colors.azul.medio};
    color: ${theme.colors.clara.medio};
    font-family: ${theme.fontsFamily.paragrafos};
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

    &:hover {
        background: ${theme.colors.azulMaisClaro.escuro};
        color: #fff;
        transform: translateY(-1px);
    }
`;

const BoxAvaliacaoStl = styled.div`
    width: 100%;
    margin-top: 8px;
    padding: 20px;
    background: rgba(14, 38, 68, 0.55);
    border: 1px dashed rgba(108, 164, 197, 0.35);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    box-sizing: border-box;

    .textoAvaliacao {
        display: flex;
        align-items: center;
        gap: 8px;
        color: ${theme.colors.clara.medio};
        font-family: ${theme.fontsFamily.titulos};
        font-size: 0.98rem;
    }
`;

const BotoesVotoStl = styled.div`
    display: flex;
    gap: 12px;
`;

const BotaoVotoStl = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 8px;
    border: 1px solid ${theme.colors.azulMaisClaro.escuro};
    background: ${theme.colors.azul.escuro};
    color: ${theme.colors.clara.medio};
    font-family: ${theme.fontsFamily.paragrafos};
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: ${theme.colors.azulMaisClaro.escuro};
        color: #fff;
        transform: translateY(-1px);
    }
`;

const MensagemAgradecimentoStl = styled.p`
    color: #10b981;
    font-size: 0.9rem;
    font-family: ${theme.fontsFamily.paragrafos};
    text-align: center;
    line-height: 1.4;
`;
