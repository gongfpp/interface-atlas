import { useEffect, useState } from 'react';
import DemoStage, { type DemoComponent, type DemoMode } from '@/islands/DemoStage';
import MotionPlayer, { type MotionControl } from '@/islands/MotionPlayer';

/**
 * 演示岛按需加载：import.meta.glob 为每个 demo 生成独立 chunk，
 * 页面只需下载当前条目的演示，而不是把全部 164 个 demo 打进一个包。
 * 服务端缩略图（ConceptCard）仍走静态 registry，不影响客户端包体。
 */
const modules = import.meta.glob('./*.tsx');

interface Props {
  component: string;
  modes: DemoMode[];
  locale: 'zh' | 'en';
  anatomy?: string[];
  /** motion 条目用播放器包裹（PRD §22） */
  motion?: boolean;
  /** motion 条目生效的播放器控件（缺省全部） */
  motionControls?: MotionControl[];
}

export default function DemoMount({
  component,
  modes,
  locale,
  anatomy = [],
  motion = false,
  motionControls,
}: Props) {
  const loader = modules[`./${component}.tsx`];
  const [Demo, setDemo] = useState<DemoComponent | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!loader) return;
    let alive = true;
    loader()
      .then((mod) => {
        const resolved = (mod as { default: DemoComponent }).default;
        // 延迟到下一个宏任务，避免 effect 内同步 setState 触发级联渲染
        setTimeout(() => {
          if (alive) setDemo(() => resolved);
        }, 0);
      })
      .catch(() => {
        setTimeout(() => {
          if (alive) setFailed(true);
        }, 0);
      });
    return () => {
      alive = false;
    };
  }, [loader]);

  if (!loader) {
    return (
      <p className="rounded-xl border border-dashed border-line p-6 text-sm text-ink-3">
        demo “{component}” 未注册
      </p>
    );
  }
  if (failed) {
    return (
      <p role="alert" className="rounded-xl border border-dashed border-line p-6 text-sm text-ink-3">
        {locale === 'zh' ? '演示加载失败，请刷新重试。' : 'The demo failed to load. Please refresh and retry.'}
      </p>
    );
  }
  if (!Demo) {
    return (
      <p role="status" className="rounded-xl border border-dashed border-line p-6 text-sm text-ink-3">
        {locale === 'zh' ? '正在加载演示…' : 'Loading demo…'}
      </p>
    );
  }

  if (motion) {
    return (
      <MotionPlayer
        locale={locale}
        modes={modes}
        anatomy={anatomy}
        controls={motionControls}
        render={(mode) => <Demo mode={mode} locale={locale} />}
      />
    );
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
