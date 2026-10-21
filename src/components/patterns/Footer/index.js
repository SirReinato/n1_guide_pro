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
    display: flex;
    align-items: center;
    padding: 16px 24px;
    justify-content: center;
    background: rgba(8, 26, 48, 0.9);
    border-top: 1px solid rgba(108, 164, 197, 0.14);
    box-sizing: border-box;

    .ajustesTitlo {
        color: ${theme.colors.azulMaisClaro.medio};
        font-size: 0.8rem;
        font-family: ${theme.fontsFamily.paragrafos};
        letter-spacing: 0.03em;
    }
`;
