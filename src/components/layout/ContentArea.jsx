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
    padding: 20px 36px 20px;
    background: transparent;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    @media (min-width: 1401px) {
        padding: 24px 48px 24px;
    }
    @media (max-width: 768px) {
        padding: 16px 16px 24px;
        justify-content: flex-start;
    }
`;

const InnerContentStl = styled.div`
    width: 100%;
    max-width: 1180px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;
