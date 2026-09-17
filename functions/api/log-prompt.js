// CF Pages Function: POST /api/log-prompt
// Prompt 复制事件（PRD §27a）。需要 KV 绑定 SEARCH_LOG（复用同一命名空间）。
export const onRequestPost = async ({ request, env }) => {
  try {
    const { concept, layer } = await request.json();
    if (!concept || !layer) return new Response(null, { status: 204 });
    const day = new Date().toISOString().slice(0, 10);
    if (env?.SEARCH_LOG) {
      const key = `p:${day}:${String(concept).slice(0, 80)}:${String(layer).slice(0, 20)}`;
      const existing = await env.SEARCH_LOG.get(key);
      const count = existing ? parseInt(existing, 10) + 1 : 1;
      await env.SEARCH_LOG.put(key, String(count), { expirationTtl: 60 * 60 * 24 * 180 });
    }
    return new Response(null, { status: 204 });
  } catch {
    return new Response(null, { status: 204 });
  }
};
