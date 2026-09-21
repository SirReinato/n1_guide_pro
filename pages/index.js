import HomeScreen from "../src/screens/HomeScreen";
import {
    getInstalacoesPorCategoria,
    getTodosOsItens,
} from "../src/service/instalacoesService";
export async function getServerSideProps() {
    const instalacoesPorCategoria = await getInstalacoesPorCategoria();
    const todosOsItens = await getTodosOsItens();

    return {
        props: {
            instalacoesPorCategoria,
            todosOsItens,
        },
    };
}


export default function Home(props) {
    return <HomeScreen {...props} />;
}
