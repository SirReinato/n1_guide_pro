import { ParagrafosStl } from "../../theme/theme";
import styled from "styled-components";

export default function ListaDeItens({ nome, posicao }) {
    return (
        <ListaDeItensStl>
            <ParagrafosStl>
                {posicao} - {nome}
            </ParagrafosStl>
        </ListaDeItensStl>
    );
}

const ListaDeItensStl = styled.li`
    min-width: 290px;
    display: flex;
    align-items: center;
    @media (max-width: 431px) {
        width: 100%;
        justify-content: center;
    }
`;
