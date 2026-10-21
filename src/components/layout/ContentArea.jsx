import styled from "styled-components";

export default function ContentArea({ colapsado, children }) {
    return (
        <ConteudoStl $colapsado={colapsado}>
            <InnerContentStl>{children}</InnerContentStl>
        </ConteudoStl>
    );
}

const ConteudoStl = styled.main`
    flex: 1;
    min-width: 0;
    width: 100%;
    padding: 32px 40px 48px;
    background: transparent;
    min-height: calc(100vh - 120px);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;

    @media (min-width: 1401px) {
        padding: 40px 56px 64px;
    }
    @media (max-width: 768px) {
        padding: 20px 16px 40px;
        min-height: auto;
    }
`;

const InnerContentStl = styled.div`
    width: 100%;
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;
