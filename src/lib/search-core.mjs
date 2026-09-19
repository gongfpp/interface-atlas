/**
 * 搜索核心（PRD §9）：中英名称 + Alias + Tags + Category + 正文的加权关键词匹配。
 * 浏览器（搜索框）与 Node（黄金测试集回归）共用本模块。
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

/**
 * @param {string} query
 * @param {Array} docs
 * @returns {Array<{doc: object, kw: number}>} 按关键词得分降序
 */
export function search(query, docs) {
  return docs
    .map((doc) => ({ doc, kw: keywordScore(query, doc) }))
    .sort((a, b) => b.kw - a.kw);
}
