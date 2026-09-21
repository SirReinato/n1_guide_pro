import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { MessageCircle, X, Send, Loader, CheckCircle, AlertCircle, FileText, ArrowLeft, Zap } from "react-feather";
import { theme } from "../../../theme/theme";
import Link from "next/link";


const ESTADOS = {
    FECHADO: "fechado",
    INPUT: "input",
    CARREGANDO: "carregando",
    RESULTADO: "resultado",
    SALVANDO: "salvando",
    SALVO: "salvo",
};

const CURIOSIDADES = [
    "O primeiro bug de computador da história foi uma mariposa real encontrada dentro de um relé do computador Harvard Mark II em 1947.",
    "O nome 'Google' nasceu de um erro de digitação da palavra matemática 'Googol' (o número 1 seguido de 100 zeros).",
    "O primeiro mouse de computador foi inventado por Douglas Engelbart em 1964 e era feito inteiramente de madeira.",
    "O primeiro domínio de internet registrado na história foi 'symbolics.com', em 15 de março de 1985.",
    "A senha dos controles de mísseis nucleares dos EUA durante a Guerra Fria foi '00000000' por quase 20 anos.",
    "Mais de 90% de todo o dinheiro do planeta Terra existe exclusivamente em formato digital em bancos e servidores.",
    "O primeiro disco rígido criado pela IBM em 1956 (o RAMAC 305) pesava mais de 1 tonelada e armazenava apenas 5 MB de dados.",
    "O termo 'spam' para e-mails indesejados foi inspirado em uma esquete humorística do grupo britânico Monty Python.",
    "O mascote do Linux, o pinguim Tux, foi escolhido porque o criador do sistema, Linus Torvalds, foi mordido por um pinguim em um zoológico.",
    "Se você dobrar uma folha de papel 42 vezes, a espessura final seria equivalente à distância da Terra até a Lua.",
    "O astronauta Neil Armstrong teve que preencher um relatório de despesas e alfândega ao retornar da Lua trazendo pedras lunares.",
    "A primeira câmera digital foi criada pela Kodak em 1975, pesava 3,6 kg e gravava fotos de 0,01 megapixel em uma fita cassete.",
    "Cerca de 300 mil novos vírus e malwares são criados ou detectados todos os dias no mundo.",
    "O primeiro videogame da história foi o 'Tennis for Two', criado em 1958 em um osciloscópio de laboratório.",
    "O código-fonte do voo Apollo 11 que levou o homem à Lua continha piadas e comentários bem-humorados escritos pelos engenheiros da NASA.",
    "A tecla 'Ctrl + Alt + Del' foi criada por David Bradley como um atalho temporário de testes e nunca deveria ter sido lançada ao público.",
    "Um raio possui energia suficiente para torrar mais de 100.000 fatias de pão de uma única vez.",
    "A internet inteira pesa aproximadamente o mesmo que um morango médio (cerca de 50 gramas de elétrons em movimento).",
    "O primeiro e-mail da história foi enviado por Ray Tomlinson em 1971 — e ele mesmo não se lembra do conteúdo exato da mensagem.",
    "O símbolo '@' foi escolhido para os endereços de e-mail simplesmente porque era um caractere pouco usado e não aparecia em nomes de pessoas.",
    "O primeiro computador a vencer um campeão mundial de xadrez foi o Deep Blue da IBM, em 1997 — mas ele precisava de uma sala inteira para funcionar.",
    "A palavra 'robô' nasceu de uma peça de teatro tcheca de 1920, na qual máquinas se rebelavam contra seus criadores humanos.",
    "Existem mais combinações possíveis no xadrez do que átomos no universo observável.",
    "O primeiro filme a usar efeitos digitais em larga escala foi 'Tron' (1982), mas os produtores foram recusados pela Disney por achar o resultado 'bom demais para ser verdade'.",
    "A linguagem de programação Python não recebeu esse nome por causa da cobra, mas sim como homenagem ao grupo humorístico Monty Python.",
    "O primeiro bug de software 'clássico' levou semanas para ser encontrado em 1945 e era um inseto real — da mesma forma que a mariposa do Mark II.",
    "Um único raio pode alcançar temperaturas de cerca de 30.000 °C, cinco vezes mais quente que a superfície do Sol.",
    "O primeiro pendrive USB chegou ao mercado em 2000, com capacidade de apenas 8 MB — hoje um cartão microSD cabe mais de 100.000 vezes isso.",
    "A câmera do telefone foi inventada em 1997 e o primeiro aparelho com ela tirava fotos de apenas 0,11 megapixel.",
    "O primeiro video-game caseiro lançado comercialmente foi o Magnavox Odyssey (1972), que não tinha som e usava cartuchos 'falsos' — apenas para dar sensação de variedade.",
    "O termo 'Wi-Fi' não significa nada — foi criado por uma agência de marketing para ser mais fácil de lembrar do que o nome técnico original.",
    "O primeiro tweet da história foi publicado por Jack Dorsey em 2006 e dizia apenas 'just setting up my twttr'.",
    "A escala de cores RGB usada em toda tela digital pode criar mais de 16 milhões de cores diferentes — mas o olho humano distingue apenas cerca de 10 milhões.",
    "O primeiro computador portátil, o Osborne 1 (1981), pesava cerca de 11 kg e precisava ser ligado a uma tomada — sua 'bateria' era um mito publicitário.",
    "O código que faz o relógio de um computador continuar contando depois de 2038 pode causar um novo 'bug do milênio', apelidado de 'Problema do Ano 2038'.",
    "A primeira mulher a programar foi Ada Lovelace, em 1843 — mais de um século antes de existir o primeiro computador eletrônico.",
    "O primeiro site da história ainda está no ar desde 1991 e explicava apenas o que era a 'World Wide Web'.",
    "A quantidade de dados gerados pela humanidade nos últimos dois anos é maior do que toda a informação produzida nos 2.000 anos anteriores."
];

export default function AssistenteIA() {
    const [estado, setEstado] = useState(ESTADOS.FECHADO);
    const [problema, setProblema] = useState("");
    const [resultado, setResultado] = useState(null);
    const [erro, setErro] = useState(null);
    const [curiosidadeIndex, setCuriosidadeIndex] = useState(0);

    // Abre o assistente ao receber evento global (ex: do pop-up de novidade)
    useEffect(() => {
        function handleAbrirEvento() {
            setEstado(ESTADOS.INPUT);
            setErro(null);
        }
        window.addEventListener("n1:abrir-ia", handleAbrirEvento);
        return () => window.removeEventListener("n1:abrir-ia", handleAbrirEvento);
    }, []);

    // Rotaciona curiosidades aleatórias a cada 10 segundos durante o loading
    useEffect(() => {
        let interval;
        if (estado === ESTADOS.CARREGANDO) {
            setCuriosidadeIndex(Math.floor(Math.random() * CURIOSIDADES.length));
            interval = setInterval(() => {
                setCuriosidadeIndex((prev) => (prev + 1) % CURIOSIDADES.length);
            }, 10000);
        }
        return () => clearInterval(interval);
    }, [estado]);

    function abrir() {
        setEstado(ESTADOS.INPUT);
        setErro(null);
    }

    function fechar() {
        setEstado(ESTADOS.FECHADO);
        setProblema("");
        setResultado(null);
        setErro(null);
    }

    function voltar() {
        setEstado(ESTADOS.INPUT);
        setResultado(null);
        setErro(null);
    }

    async function enviar(e) {
        e.preventDefault();
        if (!problema.trim()) return;

        setEstado(ESTADOS.CARREGANDO);
        setErro(null);

        try {
            const res = await fetch("/api/ia/diagnostico", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ problema }),
            });

            const data = await res.json();

            if (!res.ok) {
                setErro(data.error || "Erro ao consultar a IA");
                setEstado(ESTADOS.INPUT);
                return;
            }

            setResultado(data);
            setEstado(ESTADOS.RESULTADO);
        } catch {
            setErro("Erro de conexão. Verifique sua internet.");
            setEstado(ESTADOS.INPUT);
        }
    }

    async function salvarManual() {
        if (!resultado || resultado.tipo !== "passo_a_passo") return;

        setEstado(ESTADOS.SALVANDO);

        try {
            const res = await fetch("/api/manuais", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome: resultado.sugestaoNome,
                    descricao: resultado.sugestaoDescricao || problema,
                    categoria: "Gerados por IA",
                    passos: resultado.passos,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setErro(data.error || "Erro ao salvar o manual");
                setEstado(ESTADOS.RESULTADO);
                return;
            }

            setResultado((prev) => ({ ...prev, manualSalvoId: data.id }));
            setEstado(ESTADOS.SALVO);
        } catch {
            setErro("Erro ao salvar. Tente novamente.");
            setEstado(ESTADOS.RESULTADO);
        }
    }

    if (estado === ESTADOS.FECHADO) {
        return (
            <BotaoFlutuanteStl onClick={abrir} aria-label="Abrir assistente de IA">
                <MessageCircle size={24} />
                <span>Assistente IA</span>
            </BotaoFlutuanteStl>
        );
    }

    return (
        <PainelStl>
            {/* Header */}
            <PainelHeaderStl>
                <HeaderEsquerdaStl>
                    {(estado === ESTADOS.RESULTADO || estado === ESTADOS.SALVO) && (
                        <BotaoIconeStl onClick={voltar} title="Voltar">
                            <ArrowLeft size={16} />
                        </BotaoIconeStl>
                    )}
                    <MessageCircle size={18} />
                    <span>Assistente IA — N1</span>
                </HeaderEsquerdaStl>
                <BotaoIconeStl onClick={fechar} aria-label="Fechar">
                    <X size={18} />
                </BotaoIconeStl>
            </PainelHeaderStl>

            {/* Corpo */}
            <PainelCorpoStl>

                {/* Estado: INPUT */}
                {estado === ESTADOS.INPUT && (
                    <form onSubmit={enviar}>
                        <LabelStl>Descreva o problema ou dúvida do chamado:</LabelStl>
                        <TextareaStl
                            value={problema}
                            onChange={(e) => setProblema(e.target.value)}
                            placeholder="Ex: O usuário não consegue abrir o Power BI, aparece uma mensagem de erro de licença..."
                            rows={5}
                            autoFocus
                        />
                        {erro && <ErroStl><AlertCircle size={14} /> {erro}</ErroStl>}
                        <BotaoEnviarStl
                            type="submit"
                            disabled={!problema.trim()}
                        >
                            <Send size={16} /> Consultar Assistente
                        </BotaoEnviarStl>
                    </form>
                )}

                {/* Estado: CARREGANDO (com curiosidades aleatórias) */}
                {estado === ESTADOS.CARREGANDO && (
                    <CarregandoBlocoStl>
                        <div className="topoLoading">
                            <LoaderAnimado size={32} />
                            <p className="loadingTitulo">Consultando o Assistente IA...</p>
                            <p className="loadingSub">Analisando o banco de manuais e gerando a solução.</p>
                        </div>

                        <CuriosidadeBoxStl key={curiosidadeIndex}>
                            <div className="curiosidadeHeader">
                                <Zap size={14} />
                                <span>Curiosidade enquanto espera:</span>
                            </div>
                            <p className="curiosidadeTexto">

                                "{CURIOSIDADES[curiosidadeIndex]}"
                            </p>
                        </CuriosidadeBoxStl>
                    </CarregandoBlocoStl>
                )}

                {/* Estado: RESULTADO — manuais encontrados */}
                {estado === ESTADOS.RESULTADO && resultado?.tipo === "manuais_encontrados" && (
                    <ResultadoStl>
                        <ResultadoTituloStl>
                            <CheckCircle size={18} color={theme.colors.azulMaisClaro.escuro} />
                            Manuais relacionados encontrados!
                        </ResultadoTituloStl>
                        <ResultadoDescStl>
                            Encontrei {resultado.manuais.length} manual(is) no sistema que pode(m) ajudar:
                        </ResultadoDescStl>
                        {resultado.manuais.map((m) => (
                            <CardResultadoStl key={m.id}>
                                <Link href={`/posts/${m.id}`} onClick={fechar}>
                                    <CardResultadoInternoStl>
                                        <FileText size={16} />
                                        <div>
                                            <CardNomeStl>{m.nome}</CardNomeStl>
                                            <CardRelevanciaStl>{m.relevancia}</CardRelevanciaStl>
                                        </div>
                                    </CardResultadoInternoStl>
                                </Link>
                            </CardResultadoStl>
                        ))}
                    </ResultadoStl>
                )}

                {/* Estado: RESULTADO — passo a passo gerado */}
                {estado === ESTADOS.RESULTADO && resultado?.tipo === "passo_a_passo" && (
                    <ResultadoStl>
                        <ResultadoTituloStl>
                            <CheckCircle size={18} color={theme.colors.azulMaisClaro.escuro} />
                            Passo a passo gerado pela IA
                        </ResultadoTituloStl>
                        <ResultadoDescStl>
                            Não havia um manual pronto, então gerei este guia técnico para resolver a situação:
                        </ResultadoDescStl>
                        {resultado.passos.map((p, i) => (
                            <PassoStl key={i}>
                                <PassoNumeroStl>{i + 1}</PassoNumeroStl>
                                <PassoConteudoStl>
                                    <PassoTituloStl>{p.titulo}</PassoTituloStl>
                                    <PassoDescStl>{p.descricao}</PassoDescStl>
                                </PassoConteudoStl>
                            </PassoStl>
                        ))}
                        {erro && <ErroStl><AlertCircle size={14} /> {erro}</ErroStl>}
                        <BotaoSalvarStl onClick={salvarManual}>
                            <FileText size={16} />
                            Salvar como Manual no Site
                        </BotaoSalvarStl>
                    </ResultadoStl>
                )}

                {/* Estado: SALVANDO */}
                {estado === ESTADOS.SALVANDO && (
                    <CentradoStl>
                        <LoaderAnimado size={32} />
                        <p>Enviando manual para o sistema...</p>
                    </CentradoStl>
                )}

                {/* Estado: SALVO (Mensagem com aprovação do SirReinato) */}
                {estado === ESTADOS.SALVO && (
                    <CentradoStl>
                        <CheckCircle size={44} color="#10b981" />
                        <SalvoTituloStl>Manual enviado para moderação!</SalvoTituloStl>
                        <SalvoDescStl>
                            O procedimento foi registrado com sucesso e <strong>será analisado e aprovado pelo SirReinato</strong> antes de ser publicado oficialmente no site.
                        </SalvoDescStl>
                        <BotaoSecundarioStl onClick={fechar}>Entendido</BotaoSecundarioStl>
                    </CentradoStl>
                )}

            </PainelCorpoStl>
        </PainelStl>
    );
}

// ─── Animations ───────────────────────────────────────────────────────────────

const girar = keyframes`from { transform: rotate(0deg); } to { transform: rotate(360deg); }`;
const slideUp = keyframes`from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }`;
const fadeIn = keyframes`from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); }`;

// ─── Styled Components ────────────────────────────────────────────────────────

const BotaoFlutuanteStl = styled.button`
    position: fixed;
    bottom: 28px;
    right: 28px;
    z-index: 9998;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 14px 20px;
    border-radius: 999px;
    border: none;
    background: ${theme.colors.azulMaisClaro.escuro};
    color: ${theme.colors.clara.medio};
    font-family: ${theme.fontsFamily.paragrafos};
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
    transition: all 0.25s ease;
    animation: ${slideUp} 0.4s ease;

    &:hover {
        background: ${theme.colors.azulMaisClaro.medio};
        transform: translateY(-3px);
        box-shadow: 0 10px 24px rgba(0, 0, 0, 0.4);
    }

    @media (max-width: 480px) {
        bottom: 16px;
        right: 16px;
        padding: 12px 16px;
        font-size: 0.9rem;
    }
`;

const PainelStl = styled.aside`
    position: fixed;
    bottom: 28px;
    right: 28px;
    z-index: 9999;
    width: 420px;
    max-height: 82vh;
    display: flex;
    flex-direction: column;
    background: ${theme.colors.azul.medio};
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);
    animation: ${slideUp} 0.3s ease;
    overflow: hidden;

    @media (max-width: 480px) {
        width: calc(100vw - 24px);
        bottom: 12px;
        right: 12px;
        max-height: 88vh;
    }
`;

const PainelHeaderStl = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    background: ${theme.colors.azul.escuro};
    color: ${theme.colors.clara.medio};
    font-family: ${theme.fontsFamily.titulos};
    font-size: 0.95rem;
    letter-spacing: 0.04em;
    border-radius: 16px 16px 0 0;
`;

const HeaderEsquerdaStl = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const BotaoIconeStl = styled.button`
    background: none;
    border: none;
    color: ${theme.colors.clara.medio};
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 4px;
    border-radius: 6px;
    transition: background 0.2s;
    &:hover { background: rgba(255,255,255,0.1); }
`;

const PainelCorpoStl = styled.div`
    padding: 18px;
    overflow-y: auto;
    flex: 1;
`;

const LabelStl = styled.label`
    display: block;
    color: ${theme.colors.clara.medio};
    font-family: ${theme.fontsFamily.paragrafos};
    font-size: 0.9rem;
    margin-bottom: 8px;
`;

const TextareaStl = styled.textarea`
    width: 100%;
    padding: 12px;
    border-radius: 10px;
    border: 1px solid ${theme.colors.azulMaisClaro.escuro};
    background: ${theme.colors.azul.escuro};
    color: ${theme.colors.clara.medio};
    font-family: ${theme.fontsFamily.paragrafos};
    font-size: 0.9rem;
    resize: vertical;
    box-sizing: border-box;
    transition: border 0.2s;
    &:focus {
        outline: none;
        border-color: ${theme.colors.azulMaisClaro.claro};
    }
    &:disabled { opacity: 0.6; }
`;

const BotaoEnviarStl = styled.button`
    margin-top: 14px;
    width: 100%;
    padding: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: none;
    border-radius: 10px;
    background: ${theme.colors.azulMaisClaro.escuro};
    color: ${theme.colors.clara.medio};
    font-family: ${theme.fontsFamily.paragrafos};
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, opacity 0.2s;
    &:hover:not(:disabled) { background: ${theme.colors.azulMaisClaro.medio}; }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const BotaoSalvarStl = styled(BotaoEnviarStl)`
    margin-top: 16px;
    background: ${theme.colors.azul.escuro};
    border: 2px solid ${theme.colors.azulMaisClaro.escuro};
`;

const LoaderAnimado = styled(Loader)`
    animation: ${girar} 1s linear infinite;
`;

const ErroStl = styled.p`
    display: flex;
    align-items: center;
    gap: 6px;
    color: #f87171;
    font-size: 0.85rem;
    margin-top: 8px;
`;

const CarregandoBlocoStl = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px 0;
    gap: 20px;

    .topoLoading {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 8px;
        color: ${theme.colors.clara.medio};
    }

    .loadingTitulo {
        font-family: ${theme.fontsFamily.titulos};
        font-size: 1rem;
        color: ${theme.colors.clara.medio};
    }

    .loadingSub {
        font-family: ${theme.fontsFamily.paragrafos};
        font-size: 0.82rem;
        color: ${theme.colors.azulMaisClaro.claro};
    }
`;

const CuriosidadeBoxStl = styled.div`
    background: ${theme.colors.azul.escuro};
    border: 1px dashed ${theme.colors.azulMaisClaro.escuro};
    border-radius: 12px;
    padding: 14px;
    width: 100%;
    box-sizing: border-box;
    animation: ${fadeIn} 0.4s ease;

    .curiosidadeHeader {
        display: flex;
        align-items: center;
        gap: 6px;
        color: #f59e0b;
        font-size: 0.78rem;
        font-weight: bold;
        letter-spacing: 0.05em;
        margin-bottom: 8px;
        text-transform: uppercase;
    }

    .curiosidadeTexto {
        color: ${theme.colors.clara.medio};
        font-family: ${theme.fontsFamily.paragrafos};
        font-size: 0.86rem;
        line-height: 1.45;
        font-style: italic;
    }
`;

const ResultadoStl = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const ResultadoTituloStl = styled.h3`
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${theme.colors.clara.medio};
    font-family: ${theme.fontsFamily.titulos};
    font-size: 1rem;
`;

const ResultadoDescStl = styled.p`
    color: ${theme.colors.azulMaisClaro.claro};
    font-family: ${theme.fontsFamily.paragrafos};
    font-size: 0.85rem;
`;

const CardResultadoStl = styled.div`
    background: ${theme.colors.azul.escuro};
    border-radius: 10px;
    padding: 12px;
    transition: transform 0.2s;
    &:hover { transform: translateX(4px); }
`;

const CardResultadoInternoStl = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 10px;
    color: ${theme.colors.clara.medio};
`;

const CardNomeStl = styled.p`
    font-family: ${theme.fontsFamily.titulos};
    font-size: 0.9rem;
    color: ${theme.colors.azulMaisClaro.claro};
    margin-bottom: 4px;
`;

const CardRelevanciaStl = styled.p`
    font-family: ${theme.fontsFamily.paragrafos};
    font-size: 0.8rem;
    color: ${theme.colors.azulMaisClaro.medio};
`;

const PassoStl = styled.div`
    display: flex;
    gap: 10px;
    background: ${theme.colors.azul.escuro};
    padding: 10px;
    border-radius: 8px;
`;

const PassoNumeroStl = styled.span`
    min-width: 24px;
    height: 24px;
    border-radius: 50%;
    background: ${theme.colors.azulMaisClaro.escuro};
    color: ${theme.colors.clara.medio};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: bold;
    font-family: ${theme.fontsFamily.titulos};
`;

const PassoConteudoStl = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const PassoTituloStl = styled.h4`
    font-family: ${theme.fontsFamily.titulos};
    font-size: 0.875rem;
    color: ${theme.colors.clara.medio};
`;

const PassoDescStl = styled.p`
    font-family: ${theme.fontsFamily.paragrafos};
    font-size: 0.82rem;
    color: ${theme.colors.azulMaisClaro.claro};
    line-height: 1.5;
`;

const CentradoStl = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    padding: 24px 8px;
    text-align: center;
    color: ${theme.colors.clara.medio};
    font-family: ${theme.fontsFamily.paragrafos};
    font-size: 0.9rem;
`;

const SalvoTituloStl = styled.h3`
    font-family: ${theme.fontsFamily.titulos};
    font-size: 1.15rem;
    color: ${theme.colors.clara.medio};
`;

const SalvoDescStl = styled.p`
    font-family: ${theme.fontsFamily.paragrafos};
    font-size: 0.9rem;
    color: ${theme.colors.azulMaisClaro.claro};
    line-height: 1.5;

    strong {
        color: #fff;
    }
`;

const BotaoSecundarioStl = styled.button`
    padding: 10px 24px;
    border: 1px solid ${theme.colors.azulMaisClaro.escuro};
    border-radius: 8px;
    background: transparent;
    color: ${theme.colors.clara.medio};
    font-family: ${theme.fontsFamily.paragrafos};
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    &:hover { background: rgba(255,255,255,0.08); }
`;
