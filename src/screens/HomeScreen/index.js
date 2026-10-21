import Banner from "../../components/patterns/Banner";
import ComoFunciona from "../../components/patterns/ComoFunciona";
import styled from "styled-components";
import dynamic from "next/dynamic";

// dynamic() fora do componente para evitar recriação a cada render
const ModalBuscar = dynamic(
    () => import("../../components/patterns/ModalBuscar"),
    { ssr: false },
);

export default function HomeScreen() {
    return (
        <HomeWrapperStl>
            <ModalBuscar />

            <Banner />

            <MainConteinerStl>
                <ComoFunciona />
            </MainConteinerStl>
        </HomeWrapperStl>
    );
}

const HomeWrapperStl = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 24px;
`;

const MainConteinerStl = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
`;
