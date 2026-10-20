import styled from "styled-components";
import { theme } from "../../theme/theme";

export default function ContentArea({ children }) {
    return <ConteudoStl>{children}</ConteudoStl>;
}

const ConteudoStl = styled.main`
    width: 100%;
    min-width: 0;
    flex: 1;
    margin-left: 280px;
    padding: 24px 12%;
    overflow-y: auto;
    background: transparent;
    min-height: calc(100vh - 80px);
    box-sizing: border-box;
    transition: margin-left 0.25s ease, padding 0.25s ease;

    /* Quando a sidebar está colapsada (desktop, largura média) */
    @media (min-width: 769px) and (max-width: 1024px) {
        margin-left: 220px;
    }

    /* Quando a sidebar está colapsada (desktop, larga) */
    @media (min-width: 1025px) {
        margin-left: 72px;
    }

    @media (min-width: 1401px) {
        padding: 32px 16%;
    }
    @media (min-width: 768px) and (max-width: 1200px) {
        padding: 24px 6%;
    }
    @media (max-width: 768px) {
        margin-left: 0;
        padding: 16px 4%;
        min-height: auto;
        flex: none;
    }
`;
