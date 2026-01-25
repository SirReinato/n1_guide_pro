import InputPesquisa from "../../../components/InputPesquisa";
import ItensMenu from "../../../components/ItensMenu";
import { ConteinerGeral } from "../../../theme/theme";
import Link from "next/link";
import styled from "styled-components";
import instalacoes from "../../../data/instalacao.json";
import slugify from "../../../utils/slogify";

export default function Header() {
    const itensDoMenu = Object.keys(instalacoes);

    return (
        <ConteinerGeral $primary>
            <ConteinerHeaderStl>
                <Link href={"/"}>
                    <img
                        className="logosHeader"
                        src="/assets/img/logoDeskop.png"
                        alt="Logo do site"
                    />
                </Link>
                <InputPesquisa placeholder={"Pesquise aqui"} />
                <Link href={"https://github.com/SirReinato"} target="_blank">
                    <img
                        className="logosHeader mobile"
                        src="/assets/img/theBestDesktop.png"
                        alt="Logo do site"
                    />
                </Link>
            </ConteinerHeaderStl>
            <MenuNavStl>
                <ul className="conteinerMenu">
                    {itensDoMenu.map((nome) => (
                        <li key={nome}>
                            <Link href={`/#${slugify(nome)}`}>
                                <ItensMenu>{nome}</ItensMenu>
                            </Link>
                        </li>
                    ))}
                </ul>
            </MenuNavStl>
        </ConteinerGeral>
    );
}

const ConteinerHeaderStl = styled.header`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 12%;
    .logosHeader {
        width: 180px;
        height: 50px;
    }
    @media (min-width: 1401px) {
        padding: 16px 16%;
    }
    @media (min-width: 768px) and (max-width: 1200px) {
        padding: 16px 6%;
        .logosHeader {
            width: 110px;
            height: 40px;
        }
    }
    @media (min-width: 481px) and (max-width: 767px) {
        padding: 16px 10%;
    }
    @media (max-width: 480px) {
        flex-direction: column;
        gap: 8px;
        padding: 16px 2%;
        .logosHeader {
            width: 100%;
        }
        .mobile {
            display: none;
        }
    }
`;

const MenuNavStl = styled.nav`
    width: 100%;
    padding: 16px 14%;
    .conteinerMenu {
        width: 100%;
        display: flex;
        justify-content: space-between;
        gap: 32px;
    }

    @media (min-width: 1401px) {
        padding: 16px 18%;
    }
    @media (min-width: 768px) and (max-width: 1200px) {
        padding: 16px 6%;
        .conteinerMenu {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-evenly;
            gap: 16px;
        }
    }
    @media (min-width: 481px) and (max-width: 767px) {
        padding: 16px 10%;
    }
    @media (max-width: 480px) {
        padding: 16px 2%;
        .conteinerMenu {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            gap: 32px;
        }
    }
`;
