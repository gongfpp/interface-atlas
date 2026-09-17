/**
 * 搜索核心（PRD §9）：关键词加权 + embedding 余弦融合。
 * 浏览器（搜索弹窗）与 Node（黄金测试集回归）共用本模块。
 */

function normalize(s) {
  return String(s ?? '').toLowerCase().trim();
}

/** 分词：拉丁按空格，CJK 取整串 + 2-gram */
function tokenize(query) {
  const q = normalize(query);
  const tokens = new Set();
  for (const part of q.split(/[\s,，。.、;；!！?？/\\]+/)) {
    if (!part) continue;
    tokens.add(part);
    if (/[\u4e00-\u9fff]/.test(part) && part.length > 2) {
      for (let i = 0; i < part.length - 1; i++) tokens.add(part.slice(i, i + 2));
    }
  }
  return [...tokens].filter((t) => t.length >= 2 || /[a-z0-9]/i.test(t));
}

/**
 * @param {string} query
 * @param {{id:string,type:string,name:{zh:string,en:string},aliases:string[],tags:string[],category:string[],text:{zh:string,en:string}}} doc
 */
export function keywordScore(query, doc) {
  const tokens = tokenize(query);
  if (tokens.length === 0) return 0;

  const aliases = doc.aliases.map(normalize);
  const nameZh = normalize(doc.name.zh);
  const nameEn = normalize(doc.name.en);
  const tags = doc.tags.map(normalize);
  const category = doc.category.map(normalize);
  const textZh = normalize(doc.text.zh);
  const textEn = normalize(doc.text.en);

  let best = 0;
  for (const tok of tokens) {
    let s = 0;
    if (aliases.includes(tok)) s = Math.max(s, 100);
    else if (aliases.some((a) => a.includes(tok))) s = Math.max(s, 60);
    if (nameZh === tok || nameEn === tok) s = Math.max(s, 95);
    else if (nameZh.includes(tok) || nameEn.includes(tok)) s = Math.max(s, 55);
    if (tags.some((x) => x.includes(tok))) s = Math.max(s, 35);
    if (category.some((x) => x.includes(tok))) s = Math.max(s, 30);
    if (textZh.includes(tok) || textEn.includes(tok)) s = Math.max(s, 20);
    best = Math.max(best, s);
  }

  // 多 token 同时命中的小加分
  const hits = tokens.filter((tok) =>
    aliases.some((a) => a.includes(tok)) ||
    nameZh.includes(tok) || nameEn.includes(tok) ||
    tags.some((x) => x.includes(tok)) ||
    textZh.includes(tok) || textEn.includes(tok),
  ).length;
  return best + Math.min(hits - 1, 4) * 5;
}

export function cosine(a, b) {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}

/**
 * @param {string} query
 * @param {Array} docs
 * @param {number[][] | null} vectors 与 docs 对齐的 embedding；null 时纯关键词
 * @param {number[] | null} queryVector
 */
export function search(query, docs, vectors = null, queryVector = null) {
  const scored = docs.map((doc, i) => {
    const kw = keywordScore(query, doc);
    const sim = vectors && queryVector ? cosine(queryVector, vectors[i]) : 0;
    return { doc, score: kw + 40 * sim, kw, sim };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored;
}
