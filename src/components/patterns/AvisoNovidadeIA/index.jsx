import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { X, Zap, ArrowRight } from "react-feather";
import { theme } from "../../../theme/theme";


export default function AvisoNovidadeIA() {
    const [visivel, setVisivel] = useState(false);

    useEffect(() => {
        // Verifica se o usuário já fechou ou interagiu com o aviso antes
        const jaVisto = localStorage.getItem("n1_aviso_ia_visto");
        if (jaVisto) return;

        // Aguarda 4 segundos antes de exibir o pop-up
        const timer = setTimeout(() => {
            setVisivel(true);
        }, 4000);

        return () => clearTimeout(timer);
    }, []);

    function fecharAviso() {
        setVisivel(false);
        localStorage.setItem("n1_aviso_ia_visto", "true");
    }

    function experimentarAgora() {
        fecharAviso();
        // Dispara evento global para abrir o Assistente de IA
        window.dispatchEvent(new CustomEvent("n1:abrir-ia"));
    }

    if (!visivel) return null;

    return (
        <AvisoContainerStl role="dialog" aria-label="Aviso de novidade do Assistente IA">
            <BotaoFecharAvisoStl onClick={fecharAviso} aria-label="Fechar aviso">
                <X size={16} />
            </BotaoFecharAvisoStl>

            <AvisoHeaderStl>
                <IconeSparkleStl>
                    <Zap size={18} />
                </IconeSparkleStl>
                <AvisoTagStl>NOVIDADE</AvisoTagStl>
            </AvisoHeaderStl>


            <AvisoTituloStl>Assistente de IA do N1 GuidePro</AvisoTituloStl>
            <AvisoTextoStl>
                Está com algum problema técnico ou chamado difícil? Agora você pode descrever a situação e nossa IA
                localiza o manual certo ou gera um procedimento passo a passo!
            </AvisoTextoStl>

            <AvisoAcoesStl>
                <BotaoExperimentarStl onClick={experimentarAgora}>
                    Experimentar agora <ArrowRight size={14} />
                </BotaoExperimentarStl>
                <BotaoDispensarStl onClick={fecharAviso}>
                    Mais tarde
                </BotaoDispensarStl>
            </AvisoAcoesStl>
        </AvisoContainerStl>
    );
}

// ─── Styled Components ────────────────────────────────────────────────────────

const slideUpBounce = keyframes`
    0% {
        opacity: 0;
        transform: translateY(40px) scale(0.95);
    }
    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
`;

const AvisoContainerStl = styled.aside`
    position: fixed;
    bottom: 95px;
    right: 28px;
    z-index: 9997;
    width: 340px;
    background: ${theme.colors.azul.medio};
    border: 1px solid ${theme.colors.azulMaisClaro.escuro};
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.45);
    animation: ${slideUpBounce} 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;

    @media (max-width: 480px) {
        width: calc(100vw - 32px);
        right: 16px;
        bottom: 80px;
        padding: 16px;
    }
`;

const BotaoFecharAvisoStl = styled.button`
    position: absolute;
    top: 12px;
    right: 12px;
    background: none;
    border: none;
    color: ${theme.colors.azulMaisClaro.claro};
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    transition: all 0.2s;
    &:hover { color: #fff; background: rgba(255, 255, 255, 0.1); }
`;

const AvisoHeaderStl = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
`;

const IconeSparkleStl = styled.div`
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: ${theme.colors.azulMaisClaro.escuro};
    color: ${theme.colors.clara.medio};
    display: flex;
    align-items: center;
    justify-content: center;
`;

const AvisoTagStl = styled.span`
    font-family: ${theme.fontsFamily.titulos};
    font-size: 0.75rem;
    font-weight: bold;
    color: ${theme.colors.azulMaisClaro.claro};
    letter-spacing: 0.08em;
`;

const AvisoTituloStl = styled.h4`
    font-family: ${theme.fontsFamily.titulos};
    font-size: 1.05rem;
    color: ${theme.colors.clara.medio};
    margin-bottom: 8px;
    padding-right: 20px;
`;

const AvisoTextoStl = styled.p`
    font-family: ${theme.fontsFamily.paragrafos};
    font-size: 0.88rem;
    line-height: 1.45;
    color: ${theme.colors.azulMaisClaro.claro};
    margin-bottom: 16px;
`;

const AvisoAcoesStl = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const BotaoExperimentarStl = styled.button`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 9px 14px;
    border-radius: 8px;
    border: none;
    background: ${theme.colors.azulMaisClaro.escuro};
    color: #fff;
    font-family: ${theme.fontsFamily.paragrafos};
    font-size: 0.85rem;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
        background: ${theme.colors.azulMaisClaro.medio};
    }
`;

const BotaoDispensarStl = styled.button`
    padding: 9px 12px;
    background: transparent;
    border: none;
    color: ${theme.colors.azulMaisClaro.medio};
    font-size: 0.85rem;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
        color: ${theme.colors.clara.medio};
    }
`;
