import styled from "styled-components";
import { theme } from "../../theme/theme";

export default function ContentArea({ children }) {
    return <ConteudoStl>{children}</ConteudoStl>;
}

const ConteudoStl = styled.main`
    width: 100%;
    min-width: 0;
    margin-left: 280px;
    padding: 24px 12%;
    overflow-y: auto;
    background: transparent;
    min-height: calc(100vh - 80px);

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
    }
`;
