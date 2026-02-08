import styled from "styled-components";
import { theme } from "../../theme/theme";

const Box = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;

    padding: 12px 16px;
    border-radius: 8px;

    font-family: monospace;
    font-size: 0.95rem;

    background: ${({ $type }) =>
        $type === "url"
            ? theme.colors.azulMaisClaro.claro
            : $type === "command"
              ? "#0f172a"
              : "#1e293b"};

    color: ${({ $type }) =>
        $type === "url" ? theme.colors.azul.escuro : "#e5e7eb"};

    a {
        color: inherit;
        word-break: break-all;
        text-decoration: underline;
    }

    code {
        white-space: pre-wrap;
        word-break: break-word;
    }
`;

export default Box;
