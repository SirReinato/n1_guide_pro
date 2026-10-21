import Link from "next/link";
import styled from "styled-components";
import { theme } from "../../../theme/theme";
import LetreiroHeader from "../../../components/LetreiroHeader";

export default function Header() {
    return (
        <HeaderWrapperStl>
            <ConteinerHeaderStl>
                <BrandAreaStl>
                    <Link href={"/"}>
                        <img
                            className="logosHeader"
                            src="/assets/img/logoDeskop.png"
                            alt="Logo N1 GuidePro"
                        />
                    </Link>
                </BrandAreaStl>

                <CenterAreaStl>
                    <LetreiroHeader />
                </CenterAreaStl>

                <RightAreaStl>
                    <Link href={"https://github.com/SirReinato"} target="_blank">
                        <img
                            className="logosHeader mobile"
                            src="/assets/img/theBestDesktop.png"
                            alt="TheBest - SirReinato"
                        />
                    </Link>
                </RightAreaStl>
            </ConteinerHeaderStl>
        </HeaderWrapperStl>
    );
}

const HeaderWrapperStl = styled.header`
    width: 100%;
    position: sticky;
    top: 0;
    z-index: 40;
    background: rgba(8, 29, 53, 0.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(108, 164, 197, 0.16);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
`;

const ConteinerHeaderStl = styled.div`
    width: 100%;
    min-height: 64px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 24px;
    box-sizing: border-box;

    .logosHeader {
        height: 40px;
        width: auto;
        display: block;
        object-fit: contain;
        transition: opacity 0.2s ease, transform 0.2s ease;

        &:hover {
            opacity: 0.9;
            transform: translateY(-1px);
        }
    }

    @media (max-width: 768px) {
        padding: 8px 16px;
        .logosHeader {
            height: 34px;
        }
    }

    @media (max-width: 480px) {
        flex-direction: column;
        gap: 8px;
        padding: 10px 12px;
        .mobile {
            display: none;
        }
    }
`;

const BrandAreaStl = styled.div`
    display: flex;
    align-items: center;
    min-width: 240px;

    @media (max-width: 768px) {
        min-width: auto;
    }
`;

const CenterAreaStl = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 16px;
    min-width: 0;
`;

const RightAreaStl = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-width: 180px;

    @media (max-width: 768px) {
        min-width: auto;
    }
`;
