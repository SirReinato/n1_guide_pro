import styled, { keyframes } from "styled-components";
import { theme } from "../../theme/theme";

export default function LetreiroHeader() {
    return (
        <LetreiroWrapper>
            <Texto>
                📘 Consulte os manuais antes de abrir chamado • ⚠️ Procedimentos
                de VPN atualizados • 🛠️ Base interna N1 GuidePro
            </Texto>
        </LetreiroWrapper>
    );
}

const animacao = keyframes`
    0% {
        transform: translateX(100%);
    }
    100% {
        transform: translateX(-100%);
    }
`;

const LetreiroWrapper = styled.div`
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
    max-width: 420px;

    background: ${theme.colors.azulMaisClaro.claro};
    border-radius: 8px;
    padding: 8px 0;

    @media (max-width: 768px) {
        max-width: 100%;
    }
`;

const Texto = styled.div`
    display: inline-block;
    padding-left: 100%;
    animation: ${animacao} 25s linear infinite;

    font-size: ${theme.fontSize.paragrafos.pp};
    font-family: ${theme.fontsFamily.paragrafos};
    color: ${theme.colors.azul.escuro};
`;
