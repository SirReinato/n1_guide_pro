import styled from "styled-components";
import { theme } from "../../theme/theme";

export default function ContentArea({ colapsado, children }) {
    return <ConteudoStl $colapsado={colapsado}>{children}</ConteudoStl>;
}

const ConteudoStl = styled.main`
    flex: 1;
    min-width: 0;
    width: 100%;
    padding: 24px 5%;
    background: transparent;
    min-height: calc(100vh - 80px);
    box-sizing: border-box;

    @media (min-width: 1401px) {
        padding: 32px 8%;
    }
    @media (max-width: 768px) {
        padding: 16px 4%;
        min-height: auto;
    }
`;
