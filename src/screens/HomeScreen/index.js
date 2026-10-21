import Banner from "../../components/patterns/Banner";
import ComoFunciona from "../../components/patterns/ComoFunciona";
import styled from "styled-components";

export default function HomeScreen() {
    return (
        <HomeWrapperStl>
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
