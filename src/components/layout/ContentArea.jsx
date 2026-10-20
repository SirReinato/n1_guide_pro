import styled from "styled-components";
import { theme } from "../../theme/theme";

export default function ContentArea({ colapsado, children }) {
    return <ConteudoStl $colapsado={colapsado}>{children}</ConteudoStl>;
}

const ConteudoStl = styled.main`
    width: calc(100% - 280px);
    min-width: 0;
    margin-left: 280px;
    padding: 24px 12%;
    overflow-y: auto;
    background: transparent;
    min-height: calc(100vh - 80px);
    box-sizing: border-box;
    transition: margin-left 0.25s ease, width 0.25s ease, padding 0.25s ease;

    ${(props) =>
        props.$colapsado &&
        `
        width: calc(100% - 72px);
        margin-left: 72px;
    `}

    @media (min-width: 1401px) {
        padding: 32px 16%;
    }
    @media (min-width: 768px) and (max-width: 1200px) {
        padding: 24px 6%;
    }
    @media (max-width: 768px) {
        width: 100%;
        margin-left: 0;
        padding: 16px 4%;
        min-height: auto;
    }
`;
