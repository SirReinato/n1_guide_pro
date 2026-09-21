import Link from "next/link";
import styled from "styled-components";
import {
    TitulosPrincipaisStl,
    TitulosSecundariosStl,
    theme,
} from "../../theme/theme";
import Banner from "../../components/patterns/Banner";
import PassoAPasso from "../../components/passo_a_passo";
import dynamic from "next/dynamic";

import { useState, useEffect } from "react";
import { Copy, Check, ThumbsUp, ThumbsDown } from "react-feather";

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
        <>
            <ConteinerPostStl>
                <ModalBuscar />

                <TitulosPrincipaisStl>{nome}</TitulosPrincipaisStl>

                <TitulosSecundariosStl $primary>
                    {descricao}
                </TitulosSecundariosStl>

                {/* Botão de Cópia Rápida para Chamado N1 */}
                <BotaoCopiarChamadoStl onClick={copiarParaChamado} title="Copiar procedimento formatado para colar em chamado ou ticket">
                    {copiado ? <Check size={17} color="#10b981" /> : <Copy size={17} />}
                    <span>{copiado ? "Copiado para o Chamado! ✅" : "Copiar para o Chamado"}</span>
                </BotaoCopiarChamadoStl>

                {passo_a_passo.map((dados) => (
                    <PassoAPasso
                        key={`${dados.passo}-${dados.titulo}`}
                        passo={dados.passo}
                        titulo={dados.titulo}
                        paragrafo={dados.descricao}
                        img={dados.imagem || null}
                    />
                ))}

                {/* Bloco de Avaliação de Utilidade */}
                <BoxAvaliacaoStl>
                    <div className="textoAvaliacao">
                        <ThumbsUp size={18} color="#f59e0b" />
                        <span>Este procedimento ajudou a resolver o problema?</span>
                    </div>

                    {votoRegistrado ? (
                        <MensagemAgradecimentoStl>
                            ✅ Obrigado pelo seu feedback! Isso ajuda a aprimorar a base de conhecimento.
                        </MensagemAgradecimentoStl>
                    ) : (
                        <BotoesVotoStl>
                            <BotaoVotoStl onClick={() => votar("positivo")} title="Sim, resolveu">
                                <ThumbsUp size={15} /> Sim, ajudou
                            </BotaoVotoStl>
                            <BotaoVotoStl onClick={() => votar("negativo")} title="Não resolveu">
                                <ThumbsDown size={15} /> Não ajudou
                            </BotaoVotoStl>
                        </BotoesVotoStl>
                    )}
                </BoxAvaliacaoStl>
            </ConteinerPostStl>
            <Link href="/">
                <BotaoFlutuante>← Home</BotaoFlutuante>
            </Link>
            <Banner />
        </>
    );
}

const BotaoCopiarChamadoStl = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border-radius: 999px;
    border: 1px solid ${theme.colors.azulMaisClaro.escuro};
    background: ${theme.colors.azul.medio};
    color: ${theme.colors.clara.medio};
    font-family: ${theme.fontsFamily.paragrafos};
    font-size: ${theme.fontSize.paragrafos.m};
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

    &:hover {
        background: ${theme.colors.azulMaisClaro.escuro};
        color: #fff;
        transform: translateY(-2px);
    }
`;

const ConteinerPostStl = styled.div`
    width: 80%;
    display: flex;
    align-items: center;
    flex-direction: column;
    box-sizing: border-box;
    padding: 32px 2%;
    margin: 64px 0;
    gap: 32px;
    border: 2px solid ${theme.colors.azulMaisClaro.escuro};
    border-radius: 16px;
    @media (min-width: 1401px) {
    }
    @media (min-width: 768px) and (max-width: 1200px) {
        width: 90%;
    }
    @media (min-width: 481px) and (max-width: 767px) {
        width: 100%;
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

const BoxAvaliacaoStl = styled.div`
    width: 100%;
    margin-top: 24px;
    padding: 20px;
    background: rgba(30, 58, 95, 0.4);
    border: 1px dashed ${theme.colors.azulMaisClaro.escuro};
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
        font-size: 0.95rem;
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
