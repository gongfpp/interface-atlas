import DemoStage, { type DemoMode } from '@/islands/DemoStage';
import MotionPlayer from '@/islands/MotionPlayer';
import { demos } from './registry';

interface Props {
  component: string;
  modes: DemoMode[];
  locale: 'zh' | 'en';
  anatomy?: string[];
  /** motion 条目用播放器包裹（PRD §22） */
  motion?: boolean;
}

export default function DemoMount({ component, modes, locale, anatomy = [], motion = false }: Props) {
  const Demo = demos[component];
  if (!Demo) {
    return (
      <p className="rounded-xl border border-dashed border-line p-6 text-sm text-ink-3">
        demo “{component}” 未注册
      </p>
    );
  }
  if (motion) {
    return <MotionPlayer locale={locale} render={() => <Demo mode="default" locale={locale} />} />;
  }
  return (
    <DemoStage
      component={component}
      modes={modes}
      locale={locale}
      anatomy={anatomy}
      render={(mode) => <Demo mode={mode} locale={locale} />}
    />
  );
}
