// CF Pages Function: POST /api/log-search
// 搜索查询原文落库（PRD §9.3）。需要 KV 绑定 SEARCH_LOG。
// 隐私约定：客户端只上报无结果/弱命中查询并已做 PII 清洗；服务端再次清洗，原文仅保留 30 天。
export const onRequestPost = async ({ request, env }) => {
  try {
    const { q } = await request.json();
    if (!q || typeof q !== 'string') {
      return new Response('bad request', { status: 400 });
    }
    const query = q
      .replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, '[email]')
      .replace(/\d{6,}/g, '[digits]')
      .slice(0, 120);
    if (!query.trim()) return new Response(null, { status: 204 });
    const day = new Date().toISOString().slice(0, 10);
    if (env?.SEARCH_LOG) {
      const key = `q:${day}:${Buffer.from(query).toString('base64url')}`;
      const existing = await env.SEARCH_LOG.get(key);
      const count = existing ? parseInt(existing, 10) + 1 : 1;
      await env.SEARCH_LOG.put(key, String(count), { expirationTtl: 60 * 60 * 24 * 30 });
    }
    return new Response(null, { status: 204 });
  } catch {
    return new Response(null, { status: 204 });
  }
};
