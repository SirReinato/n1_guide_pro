import Banner from "../../components/patterns/Banner";
import ComoFunciona from "../../components/patterns/ComoFunciona";
import Manuais from "../../components/patterns/Manuais";
import ModalBuscar from "../../components/patterns/ModalBuscar";
import Principais from "../../components/patterns/Principais";
import Sobre from "../../components/patterns/Sobre";
import { ConteinerGeral } from "../../theme/theme";
import styled from "styled-components";

export default function HomeScreen() {
    return (
        <ConteinerGeral>
            <ModalBuscar />
            <Banner />
            <MainConteinerStl>
                {/* <Principais /> */}
                <ComoFunciona />
                <Manuais />
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
