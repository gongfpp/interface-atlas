import { recipe, type RecipeStyleId } from './styleRecipe';
import type { StyleVariantSet, VariantSampleProps } from '../style-variants/types';

export type SampleComponent = 'button' | 'input' | 'card' | 'select' | 'checkbox' | 'switch';

function StyleSample({ component, style, locale }: VariantSampleProps & { component: SampleComponent; style: RecipeStyleId }) {
  const r = recipe(style);
  const zh = locale === 'zh';
  const label = zh ? '保存更改' : 'Save changes';

  return (
    <div data-style-sample={style} data-sample-component={component} aria-hidden="true" className={`grid min-h-[5.5rem] w-full min-w-0 place-items-center overflow-hidden [overflow-wrap:anywhere] ${r.frame} !p-3`}>
      {component === 'button' && (
        <span className={`inline-flex min-h-11 min-w-20 max-w-full items-center justify-center ${r.control} motion-safe:transition-transform motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0.5`}>{label}</span>
      )}
      {component === 'input' && (
        <span className="block w-full min-w-0">
          <span className={`mb-1 block text-[10px] ${r.muted}`}>{zh ? '邮箱地址' : 'Email address'}</span>
          <span className={`flex min-h-11 min-w-0 items-center px-3 text-xs ${r.field}`}>hello@example.com</span>
        </span>
      )}
      {component === 'card' && (
        <span className={`block w-full min-w-0 text-left ${r.item}`}>
          <span className={`block text-xs font-semibold ${r.title}`}>{zh ? '项目更新' : 'Project update'}</span>
          <span className={`mt-1 block text-[10px] leading-relaxed ${r.muted}`}>{zh ? '状态与下一步' : 'Status and next step'}</span>
          <span className={`mt-2 inline-flex min-h-11 items-center ${r.control}`}>{zh ? '查看' : 'Open'}</span>
        </span>
      )}
      {component === 'select' && (
        <span className={`flex min-h-11 w-full min-w-0 items-center justify-between gap-2 px-3 text-xs ${r.field}`}>
          <span className="truncate">{zh ? '选择项目' : 'Choose a project'}</span>
          <span className="shrink-0" aria-hidden="true">⌄</span>
        </span>
      )}
      {component === 'checkbox' && (
        <span className={`flex min-h-11 w-full min-w-0 items-center gap-2 px-2 text-xs ${r.item}`}>
          <span className={`grid h-5 w-5 shrink-0 place-items-center border border-current text-[10px] ${r.active}`}>✓</span>
          <span className="min-w-0">{zh ? '接收产品更新' : 'Receive product updates'}</span>
        </span>
      )}
      {component === 'switch' && (
        <span className={`flex min-h-11 w-full min-w-0 items-center justify-between gap-2 px-2 text-xs ${r.item}`}>
          <span>{zh ? '通知' : 'Notifications'}</span>
          <span className={`relative inline-flex h-7 w-14 shrink-0 items-center rounded-full border border-current p-1 ${r.secondary}`}>
            <span className="ml-auto h-4 w-4 rounded-full bg-current" />
          </span>
        </span>
      )}
    </div>
  );
}

/**
 * Add compact, non-interactive swatches that use the same style recipe tokens
 * as their corresponding full demos. Selection remains owned by SolutionLab.
 */
export function withStyleSamples(component: SampleComponent, styles: StyleVariantSet): StyleVariantSet {
  return styles.map((variant) => ({
    ...variant,
    Sample: ({ locale }: VariantSampleProps) => (
      <StyleSample component={component} style={variant.style as RecipeStyleId} locale={locale} />
    ),
  }));
}
