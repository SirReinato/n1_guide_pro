import Banner from "../../components/patterns/Banner";
import ComoFunciona from "../../components/patterns/ComoFunciona";
import Manuais from "../../components/patterns/Manuais";
import Sobre from "../../components/patterns/Sobre";
import { ConteinerGeral } from "../../theme/theme";
import styled from "styled-components";
import dynamic from "next/dynamic";

export default function HomeScreen({ instalacoesPorCategoria, todosOsItens }) {
    const ModalBuscar = dynamic(
        () => import("../../components/patterns/ModalBuscar"),
        { ssr: false },
    );
    return (
        <ConteinerGeral>
            <ModalBuscar />

            <Banner />

            <MainConteinerStl>
                <ComoFunciona />

                <Manuais
                    instalacoesPorCategoria={instalacoesPorCategoria}
                    todosOsItens={todosOsItens}
                />
            </MainConteinerStl>

            <Sobre />
        </ConteinerGeral>
    );
}

const MainConteinerStl = styled.main`
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
`;
