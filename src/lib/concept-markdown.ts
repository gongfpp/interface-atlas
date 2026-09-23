import type { Concept } from '@/lib/content';
import { TYPE_LABELS, RELATION_LABELS, dimensionLabel, type Locale } from '@/lib/i18n';

/** 生成条目的 Markdown 镜像（`/<type>/<id>.md`），供 Coding Agent 直接消费。 */
export function conceptToMarkdown(concept: Concept, locale: Locale): string {
  const d = concept.data;
  const other = locale === 'zh' ? 'en' : 'zh';
  const lines: string[] = [];

  lines.push(`# ${d.name[locale]} / ${d.name[other]}`);
  lines.push('');
  lines.push(`> ${TYPE_LABELS[concept.conceptType]?.[locale] ?? concept.conceptType} · \`id: ${concept.id}\``);
  lines.push('');
  lines.push(d.description[locale]);
  lines.push('');

  if (d.aliases.length) {
    lines.push(`**${locale === 'zh' ? '别名' : 'Aliases'}:** ${d.aliases.join(' · ')}`);
    lines.push('');
  }
  if (d.category.length) {
    lines.push(`**${locale === 'zh' ? '分类' : 'Category'}:** ${d.category.join(' / ')}`);
    lines.push('');
  }
  if (d.disambiguation) {
    lines.push(`## ${locale === 'zh' ? '名词辨析' : 'Name disambiguation'}`);
    lines.push('');
    lines.push(d.disambiguation[locale]);
    lines.push('');
  }

  lines.push(`## ${locale === 'zh' ? '适用场景' : 'When to use'}`);
  lines.push('');
  for (const u of d.use_when) lines.push(`- ${u[locale]}`);
  lines.push('');
  lines.push(`## ${locale === 'zh' ? '不适用场景' : 'When not to use'}`);
  lines.push('');
  for (const u of d.avoid_when) lines.push(`- ${u[locale]}`);
  lines.push('');

  if (d.variants.length) {
    lines.push(`## ${locale === 'zh' ? '常见形式' : 'Variants'}`);
    lines.push('');
    for (const v of d.variants) {
      lines.push(`- **${v.name[locale]}** (${v.name[other]})${v.note ? ` — ${v.note[locale]}` : ''}`);
    }
    lines.push('');
  }

  if (d.structure?.length) {
    lines.push(`## ${locale === 'zh' ? '页面结构' : 'Page structure'}`);
    lines.push('');
    d.structure.forEach((s, i) => {
      lines.push(`${i + 1}. **${s.part[locale]}** — ${s.note[locale]}`);
    });
    lines.push('');
  }

  if (d.style_spec) {
    lines.push(`## ${locale === 'zh' ? '开发规格' : 'Design spec'}`);
    lines.push('');
    for (const [k, v] of Object.entries(d.style_spec)) {
      lines.push(`- **${k}:** ${v[locale]}`);
    }
    lines.push('');
  }

  if (d.api.length) {
    lines.push('## Platform API');
    lines.push('');
    for (const sym of d.api) lines.push(`- \`${sym}\``);
    lines.push('');
  }

  if (d.framework_names.length) {
    lines.push(`## ${locale === 'zh' ? '代码里叫什么' : 'In code'}`);
    lines.push('');
    lines.push(`| ${locale === 'zh' ? '体系' : 'Framework'} | ${locale === 'zh' ? '名称' : 'Name'} |`);
    lines.push('| --- | --- |');
    for (const f of d.framework_names) {
      const label = f.url ? `[${f.name}](${f.url})` : f.name;
      lines.push(`| ${f.framework} | ${label}${f.note ? ` — ${f.note[locale]}` : ''} |`);
    }
    lines.push('');
  }

  if (d.implementation) {
    lines.push(`## ${locale === 'zh' ? '实现要点' : 'Implementation'}`);
    lines.push('');
    lines.push(`**CSS:** ${d.implementation.css.map((c) => `\`${c}\``).join(' ')}`);
    lines.push('');
    lines.push(d.implementation.notes[locale]);
    lines.push('');
  }

  if (d.compare) {
    lines.push(`## ${locale === 'zh' ? '横向对比维度' : 'Compare dimensions'} (\`${d.compare.group}\`)`);
    lines.push('');
    for (const [k, v] of Object.entries(d.compare.dimensions)) {
      lines.push(`- **${dimensionLabel(k, locale)}:** ${v[locale]}`);
    }
    lines.push('');
  }

  lines.push(`## ${locale === 'zh' ? '交给 Agent 的任务 Prompt' : 'Agent task prompt'}`);
  lines.push('');
  lines.push('```text');
  lines.push(d.prompts.agent[locale]);
  lines.push('```');
  lines.push('');

  if (d.prompts.basic[locale] || d.prompts.design[locale] || d.prompts.implementation[locale]) {
    lines.push(`### ${locale === 'zh' ? '其余层级 Prompt' : 'Other prompt layers'}`);
    lines.push('');
    lines.push(`**Basic:** ${d.prompts.basic[locale]}`);
    lines.push('');
    lines.push(`**Design:** ${d.prompts.design[locale]}`);
    lines.push('');
    lines.push(`**Implementation:** ${d.prompts.implementation[locale]}`);
    lines.push('');
  }

  if (d.related.length) {
    lines.push(`## ${locale === 'zh' ? '相关概念' : 'Related'}`);
    lines.push('');
    for (const r of d.related) {
      const label = RELATION_LABELS[r.relation]?.[locale] ?? r.relation;
      lines.push(`- [${r.id}](/${concept.conceptType}/${r.id}) — ${label}`);
    }
    lines.push('');
  }

  if (d.confusable.length) {
    lines.push(`## ${locale === 'zh' ? '容易混淆' : 'Confusable'}`);
    lines.push('');
    for (const c of d.confusable) {
      lines.push(`- [${c.id}](/${concept.conceptType}/${c.id}) — ${c.note[locale]}`);
    }
    lines.push('');
  }

  if (d.applicable_styles.length) {
    lines.push(`## ${locale === 'zh' ? '可搭配的风格' : 'Applicable styles'}`);
    lines.push('');
    lines.push(d.applicable_styles.map((s) => `\`${s}\``).join(' '));
    lines.push('');
  }

  if (d.sources.length) {
    lines.push('## Sources');
    lines.push('');
    for (const s of d.sources) lines.push(`- [${s.name}](${s.url})`);
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push(
    locale === 'zh'
      ? `JSON: \`/api/concept/${concept.conceptType}/${concept.id}.json\` · 站点: /${concept.conceptType}/${concept.id}`
      : `JSON: \`/api/concept/${concept.conceptType}/${concept.id}.json\` · Site: /en/${concept.conceptType}/${concept.id}`,
  );
  lines.push('');

  return lines.join('\n');
}
