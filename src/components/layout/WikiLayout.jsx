import { useState } from "react";
import Sidebar from "./Sidebar";
import ContentArea from "./ContentArea";
import styled from "styled-components";
import { theme } from "../../theme/theme";

export default function WikiLayout({ children }) {
    const [colapsado, setColapsado] = useState(false);

    return (
        <LayoutStl>
            <GridStl>
                <Sidebar
                    colapsado={colapsado}
                    onToggleColapsado={() => setColapsado((prev) => !prev)}
                />
                <ContentArea colapsado={colapsado}>{children}</ContentArea>
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
    align-items: stretch;

    @media (max-width: 768px) {
        flex-direction: column;
        min-height: auto;
    }
`;
