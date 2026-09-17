// CF Pages Function: POST /api/log-search
// 搜索查询原文落库（PRD §9.3）。需要 KV 绑定 SEARCH_LOG。
// 本地开发（astro dev/preview）无 Functions，自动 no-op。
export const onRequestPost = async ({ request, env }) => {
  try {
    const { q } = await request.json();
    if (!q || typeof q !== 'string') {
      return new Response('bad request', { status: 400 });
    }
    const query = q.slice(0, 200);
    const day = new Date().toISOString().slice(0, 10);
    if (env?.SEARCH_LOG) {
      const key = `q:${day}:${Buffer.from(query).toString('base64url')}`;
      const existing = await env.SEARCH_LOG.get(key);
      const count = existing ? parseInt(existing, 10) + 1 : 1;
      await env.SEARCH_LOG.put(key, String(count), { expirationTtl: 60 * 60 * 24 * 180 });
    }
    return new Response(null, { status: 204 });
  } catch {
    return new Response(null, { status: 204 });
  }
};
