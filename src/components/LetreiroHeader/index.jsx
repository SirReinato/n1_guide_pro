import styled, { keyframes } from "styled-components";
import { theme } from "../../theme/theme";

export default function LetreiroHeader() {
    return (
        <LetreiroWrapper>
            <LetreiroTrack>
                <Texto>
                    📘 Consulte os manuais antes de abrir chamado • ⚠️
                    Procedimentos de VPN atualizados • 🛠️ Base interna N1
                    GuidePro •
                </Texto>
                <Texto>
                    📘 Consulte os manuais antes de abrir chamado • ⚠️
                    Procedimentos de VPN atualizados • 🛠️ Base interna N1
                    GuidePro •
                </Texto>
            </LetreiroTrack>
        </LetreiroWrapper>
    );
}
const animacao = keyframes`
    from {
        transform: translateX(0);
    }
    to {
        transform: translateX(-50%);
    }
`;
const LetreiroWrapper = styled.div`
    overflow: hidden;
    width: 100%;
    max-width: 420px;

    background: ${theme.colors.azulMaisClaro.claro};
    border-radius: 8px;
    padding: 8px 0;

    @media (max-width: 768px) {
        max-width: 100%;
    }
`;

const LetreiroTrack = styled.div`
    display: flex;
    width: max-content;
    animation: ${animacao} 15s linear infinite;

    &:hover {
        animation-play-state: paused;
    }
`;

const Texto = styled.span`
    white-space: nowrap;
    padding-right: 32px;

    font-size: ${theme.fontSize.paragrafos.pp};
    font-family: ${theme.fontsFamily.paragrafos};
    color: ${theme.colors.azul.escuro};
`;
