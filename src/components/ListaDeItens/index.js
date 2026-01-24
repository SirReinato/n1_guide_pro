import { ParagrafosStl, theme } from "../../theme/theme";
import styled from "styled-components";

export default function ListaDeItens({ nome, descricao, ...props }) {
    return (
        <ListaDeItensStl {...props}>
            <TituloListaStl>{nome}</TituloListaStl>
            <DescricaoListaStl>{descricao}</DescricaoListaStl>
        </ListaDeItensStl>
    );
}

const ListaDeItensStl = styled.li`
    width: 310px;
    min-width: 290px;
    min-height: 150px;
    border-radius: 8px;
    display: flex;
    justify-content: start;
    align-items: center;
    flex-direction: column;
    background: ${(props) =>
        props.$primary
            ? `${theme.colors.azulMaisClaro.escuro}`
            : `${theme.colors.azul.escuro}`};
    padding: 16px;
    gap: 16px;
`;
const TituloListaStl = styled.h3`
    font-size: ${theme.fontSize.paragrafos.gg};
    font-family: ${theme.fontsFamily.titulos};
    font-weight: 500;
    color: ${theme.colors.clara.medio};
    margin-bottom: 8px;
`;
const DescricaoListaStl = styled.p`
    font-size: ${theme.fontSize.paragrafos.pp};
    font-family: ${theme.fontsFamily.paragrafos};
    color: ${theme.colors.clara.medio};
    line-height: 20px;
`;
