/** 只有实际支持独立形式选择的演示导出此能力，ids 与演示的选项表一致。 */
export interface PreviewVariants {
  ids: readonly string[];
  default: string;
  modes?: readonly string[];
  defaults?: Record<string, string>;
}

export interface SolutionForm {
  id: string;
  name: string;
  note: string;
}
export type VariantScope = 'preview' | 'requirement';

/** 将真正生效的预览与用户提出、但演示尚未实现的要求分开。 */
export function resolveSolutionVariant({ forms, requested, previewRequested, mode, styled, capability }: {
  forms: SolutionForm[];
  requested: string;
  previewRequested?: string;
  mode: string;
  styled: boolean;
  capability?: PreviewVariants;
}) {
  const active = !styled && (capability?.modes ?? ['default', 'dark']).includes(mode)
    ? capability : undefined;
  const supported = forms.filter(form => active?.ids.includes(form.id));
  const selected = forms.find(form => form.id === requested);
  const preview = supported.find(form => form.id === selected?.id)
    ?? supported.find(form => form.id === previewRequested)
    ?? supported.find(form => form.id === (active?.defaults?.[mode] ?? active?.default));
  const variant = selected ?? preview;
  return {
    preview,
    variant,
    scope: variant ? (supported.includes(variant) ? 'preview' : 'requirement') as VariantScope : undefined,
    supported,
    additional: forms.filter(form => !supported.includes(form)),
  };
}

/** 新要求沿用当前实际预览，包括仅带 form 参数恢复的旧链接。 */
export function selectSolutionVariant(current: ReturnType<typeof resolveSolutionVariant>, requested: string) {
  return {
    requested,
    previewRequested: current.supported.find(form => form.id === requested)?.id ?? current.preview?.id ?? '',
  };
}

export function solutionVariantLabel(scope: VariantScope | undefined, locale: 'zh' | 'en') {
  if (scope === 'preview') return locale === 'zh' ? '已预览形式' : 'Previewed variant';
  if (scope === 'requirement') return locale === 'zh' ? '附加形式（未预览）' : 'Additional variant (not previewed)';
  return locale === 'zh' ? '形式' : 'Variant';
}

/** 复制、保存与导出的正文共用这个边界，避免把要求误写成已验证的效果。 */
export function solutionVariantBrief(selection: {
  variantName: string;
  variantNote: string;
  variantScope?: VariantScope;
  previewVariantName?: string;
}, locale: 'zh' | 'en'): string[] {
  const zh = locale === 'zh';
  if (!selection.variantName) return [];
  if (selection.variantScope !== 'requirement') return [
    `${solutionVariantLabel(selection.variantScope, locale)}：${selection.variantName}。${selection.variantNote}`,
  ];
  return [
    selection.previewVariantName
      ? `${zh ? '实际预览形式' : 'Actual preview variant'}：${selection.previewVariantName}` : '',
    `${solutionVariantLabel('requirement', locale)}：${selection.variantName}。${selection.variantNote}`,
    zh
      ? '在参考预览的基础上实现这项调整；若附加形式与预览描述冲突，以附加形式要求为准。这项变化尚未在预览中实现，完成后需单独验证。'
      : 'Adapt the reference preview to this additional variant. If it conflicts with the preview description, the additional variant takes precedence. This change is not implemented in the preview and must be verified separately.',
  ].filter(Boolean);
}
