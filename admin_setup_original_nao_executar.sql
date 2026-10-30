-- EXECUTAR NO SQL EDITOR DO MESMO PROJETO SUPABASE APÓS CONFERIR A ESTRUTURA.
-- Exige tabela public.agendamentos com id uuid, nome, servico, profissional, data, horario.
-- NÃO executa migração destrutiva. Se o esquema diferir, adapte antes de executar.
DO $$ BEGIN
 IF to_regclass('public.agendamentos') IS NULL THEN RAISE EXCEPTION 'Tabela public.agendamentos não encontrada'; END IF;
 IF EXISTS (SELECT 1 FROM (VALUES ('id'),('nome'),('servico'),('profissional'),('data'),('horario')) v(c)
    WHERE NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='agendamentos' AND column_name=v.c)) THEN
    RAISE EXCEPTION 'Colunas esperadas ausentes em public.agendamentos. Confira o esquema.';
 END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.reis_admins (
 user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);
ALTER TABLE public.reis_admins ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.reis_admins FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.admin_eh_autorizado() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
 SELECT EXISTS (SELECT 1 FROM public.reis_admins a WHERE a.user_id = (SELECT auth.uid()));
$$;
REVOKE ALL ON FUNCTION public.admin_eh_autorizado() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_eh_autorizado() TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_listar_agendamentos() RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE resultado jsonb;
BEGIN
 IF NOT public.admin_eh_autorizado() THEN RAISE EXCEPTION 'Acesso negado' USING ERRCODE='42501'; END IF;
 SELECT COALESCE(jsonb_agg(jsonb_build_object('id', a.id, 'nome', a.nome,
   'servico', a.servico, 'profissional', a.profissional, 'data', a.data,
   'horario', a.horario) ORDER BY a.data DESC, a.horario DESC),'[]'::jsonb)
 INTO resultado FROM public.agendamentos a;
 RETURN resultado;
END;
$$;
REVOKE ALL ON FUNCTION public.admin_listar_agendamentos() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_listar_agendamentos() TO authenticated;

-- Se id não for UUID, altere o tipo de p_id para o tipo real da coluna.
CREATE OR REPLACE FUNCTION public.admin_excluir_agendamento(p_id uuid) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE linhas integer;
BEGIN
 IF NOT public.admin_eh_autorizado() THEN RAISE EXCEPTION 'Acesso negado' USING ERRCODE='42501'; END IF;
 DELETE FROM public.agendamentos WHERE id = p_id;
 GET DIAGNOSTICS linhas = ROW_COUNT;
 RETURN linhas > 0;
END;
$$;
REVOKE ALL ON FUNCTION public.admin_excluir_agendamento(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_excluir_agendamento(uuid) TO authenticated;

-- IMPORTANTE: as funções SECURITY DEFINER devem ser criadas por um proprietário confiável
-- (SQL Editor). Revise políticas/grants existentes da tabela agendamentos:
-- elas podem permitir acesso direto independentemente das funções acima.
-- Para conceder acesso, crie um usuário em Authentication > Users e execute:
-- INSERT INTO public.reis_admins(user_id) VALUES ('UUID-DO-USUARIO-AQUI');
-- Nunca coloque senhas ou chaves service_role no HTML/JS.
