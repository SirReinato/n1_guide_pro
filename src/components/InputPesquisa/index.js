import { theme } from "../../theme/theme";
import styled from "styled-components";

export default function InputPesquisa({ placeholder }) {
    return <InputPesquisaStl placeholder={placeholder} />;
}

const InputPesquisaStl = styled.input`
    width: 437px;
    border-radius: 8px;
    padding: 14px 16px;
    border: none;
    background: ${theme.colors.clara.medio};
    &::placeholder {
        font: 1.125rem;
        color: ${theme.colors.azul.escuro};
    }
    @media (min-width: 1400px) {
    }
    @media (min-width: 432px) and (max-width: 780px) {
    }
    @media (max-width: 431px) {
        width: 80%;
        padding: 12px;
    }
`;
