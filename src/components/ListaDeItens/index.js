import { theme } from "../../theme/theme";
import styled from "styled-components";
import { Search, BookOpen, CheckCircle } from "react-feather";

const iconMap = {
    Search: Search,
    BookOpen: BookOpen,
    CheckCircle: CheckCircle,
};

export default function ListaDeItens({ nome, descricao, icon, ...props }) {
    const IconComponent = iconMap[icon];
    return (
        <ListaDeItensStl {...props}>
            <ContainerListaIconTituloStl {...props}>
                {IconComponent && (
                    <IconComponent
                        size={60}
                        style={{
                            color: "#F5F0EA",
                            width: "10%",
                        }}
                    />
                )}
                <TituloListaStl>{nome}</TituloListaStl>
            </ContainerListaIconTituloStl>
            <DescricaoListaStl>{descricao}</DescricaoListaStl>
        </ListaDeItensStl>
    );
}

const ListaDeItensStl = styled.li`
    width: 32%;
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
const ContainerListaIconTituloStl = styled.div`
    width: 100%;
    display: flex;

    justify-content: ${(props) =>
        props.$spaceBetween ? "space-around" : "center"};

    align-items: center;
`;

const TituloListaStl = styled.h3`
    width: 85%;
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
