import Sidebar from "./Sidebar";
import ContentArea from "./ContentArea";
import styled from "styled-components";
import { theme } from "../../theme/theme";

export default function WikiLayout({ children }) {
    return (
        <LayoutStl>
            <GridStl>
                <Sidebar />
                <ContentArea>{children}</ContentArea>
            </GridStl>
        </LayoutStl>
    );
}

const LayoutStl = styled.div`
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: ${theme.colors.clara.bgGeral};
`;

const GridStl = styled.div`
    display: flex;
    flex: 1;
    width: 100%;
    min-height: calc(100vh - 80px);

    @media (max-width: 768px) {
        flex-direction: column;
        min-height: auto;
    }
`;
