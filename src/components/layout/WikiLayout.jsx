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
    flex: 1;
    display: flex;
    flex-direction: column;
    background: radial-gradient(
            circle at 55% 0%,
            rgba(26, 58, 95, 0.35) 0%,
            rgba(7, 22, 41, 0) 65%
        ),
        ${theme.colors.clara.bgGeral};
`;

const GridStl = styled.div`
    display: flex;
    flex: 1;
    width: 100%;
    min-height: calc(100vh - 64px);
    align-items: stretch;

    @media (max-width: 768px) {
        flex-direction: column;
        min-height: auto;
    }
`;
