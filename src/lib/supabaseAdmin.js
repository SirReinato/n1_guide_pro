import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Chave de serviço dá acesso completo para gravação no servidor (ignora RLS)
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const adminClient =
    supabaseUrl && serviceKey
        ? createClient(supabaseUrl, serviceKey, {
              auth: {
                  persistSession: false,
                  autoRefreshToken: false,
              },
          })
        : null;

/**
 * Registra log de telemetria da IA ou de buscas e mantém apenas os 10 mais recentes (rolling buffer / FIFO).
 * Economiza espaço no banco de dados Supabase e mantém o Dashboard sempre com dados atuais e relevantes.
 */
export async function registrarLogConsulta({ termo, origem = "ia", encontrouManual = false }) {
    if (!adminClient || !termo || !termo.trim()) return;

    try {
        // 1. Insere o novo log no banco
        await adminClient.from("logs_consultas").insert({
            termo: termo.trim(),
            origem,
            encontrou_manual: Boolean(encontrouManual),
        });

        // 2. Economia de banco: busca os registros que estão além dos 10 mais recentes
        const { data: antigos } = await adminClient
            .from("logs_consultas")
            .select("id")
            .order("id", { ascending: false })
            .range(10, 100);

        // 3. Se houver mais de 10 registros, remove os mais antigos automaticamente
        if (antigos && antigos.length > 0) {
            const idsParaExcluir = antigos.map((item) => item.id);
            await adminClient.from("logs_consultas").delete().in("id", idsParaExcluir);
        }
    } catch (err) {
        console.warn("Aviso: Falha ao registrar log de telemetria:", err?.message || err);
    }
}
