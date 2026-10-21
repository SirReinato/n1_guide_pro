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
                    <IconBadgeStl>
                        <IconComponent size={20} />
                    </IconBadgeStl>
                )}
                <TituloListaStl>{nome}</TituloListaStl>
            </ContainerListaIconTituloStl>
            <DescricaoListaStl>{descricao}</DescricaoListaStl>
        </ListaDeItensStl>
    );
}

const ListaDeItensStl = styled.li`
    width: 100%;
    min-height: 130px;
    border-radius: 12px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
    background: ${(props) =>
        props.$primary
            ? `${theme.colors.azulMaisClaro.escuro}`
            : `rgba(14, 38, 68, 0.75)`};
    border: 1px solid rgba(108, 164, 197, 0.16);
    padding: 20px;
    gap: 12px;
    box-sizing: border-box;
    transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;

    &:hover {
        transform: translateY(-2px);
        border-color: rgba(154, 195, 219, 0.35);
        background: rgba(20, 48, 84, 0.85);
    }
`;

const ContainerListaIconTituloStl = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
`;

const IconBadgeStl = styled.span`
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: rgba(68, 140, 182, 0.2);
    border: 1px solid rgba(108, 164, 197, 0.25);
    color: ${theme.colors.azulMaisClaro.claro};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`;

const TituloListaStl = styled.h3`
    font-size: 1.15rem;
    font-family: ${theme.fontsFamily.titulos};
    font-weight: 400;
    color: ${theme.colors.clara.medio};
    line-height: 1.3;
`;

const DescricaoListaStl = styled.p`
    font-size: 0.88rem;
    font-family: ${theme.fontsFamily.paragrafos};
    color: ${theme.colors.azulMaisClaro.claro};
    line-height: 1.5;
    opacity: 0.9;
`;
