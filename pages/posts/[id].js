import PostScreen from "../../src/screens/PostScreen";
import {
    getAllPostIds,
    getPostById,
} from "../../src/service/instalacoesService";

export async function getStaticPaths() {
    return {
        paths: await getAllPostIds(),
        fallback: false,
    };
}

export async function getStaticProps({ params }) {
    const post = await getPostById(params.id);

    if (!post) {
        return { notFound: true };
    }

    return {
        props: {
            nome: post.nome,
            descricao: post.descricao,
            passo_a_passo: post.passo_passo,
        },
    };
}

export default PostScreen;
