import { theme } from "../../theme/theme";
import Link from "next/link";
import styled from "styled-components";

export default function ItensMenu({ children }) {
    return (
        <ItensMenuStl>
            <Link href={""} className="itens">
                {children}
            </Link>
        </ItensMenuStl>
    );
}

const ItensMenuStl = styled.span`
    .itens {
        font-size: 0.875rem;
        color: ${theme.colors.azul.escuro};
        font-weight: bold;
        font-family: ${theme.fontsFamily.paragrafos};
        letter-spacing: 0.1em;
        &:hover {
            color: ${theme.colors.clara.claro};
            text-decoration: underline;
            cursor: pointer;
            transition: color 0.3s ease;
            opacity: 0.9;
        }
    }
`;
