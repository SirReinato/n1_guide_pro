import styled from "styled-components";
import { theme, TitulosSecundariosStl } from "../../../theme/theme";

export default function Footer() {
    return (
        <ConteinerFooterStl>
            <TitulosSecundariosStl className="ajustesTitlo">
                Todos os direitos reservados © 2024 | By Renato França -
                SirReinato
            </TitulosSecundariosStl>
        </ConteinerFooterStl>
    );
}

const ConteinerFooterStl = styled.footer`
    width: 100%;
    margin-top: 32px;
    display: flex;
    align-items: center;
    padding: 8px 0;
    justify-content: center;
    background: #1a3a5f;
    .ajustesTitlo {
        color: ${theme.colors.clara.claro};
        font-size: 0.8rem;
    }
`;
