import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  Audio,
  interpolate,
  spring,
} from 'remotion';

// ============================================================================
// 主组件：AtlasPromo
// ============================================================================

const BRAND_GREEN = '#10B981';
const BRAND_DARK = '#1F2937';

// 镜头 1：痛点文字 - ScrambleDecode
const Shot1_PainPoint: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const text = '和 A I 说 不 清 需 求';
  const chars = text.split('');
  const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  const mulberry32 = (seed: number) => {
    return () => {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) >>> 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) >>> 0;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  const decodeStart = 20;

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: BRAND_DARK }}>
      <div style={{
        display: 'flex',
        gap: '6px',
        fontFamily: 'SF Mono, Monaco, monospace',
        fontSize: 72,
        fontWeight: 700,
        color: BRAND_GREEN,
        textShadow: `0 0 20px ${BRAND_GREEN}66`,
      }}>
        {chars.map((char, i) => {
          const rng = mulberry32(i * 101 + 13);
          let displayChar = char;
          let opacity = 1;

          if (frame < decodeStart) {
            displayChar = CHARSET[Math.floor(rng() * CHARSET.length)];
          } else if (frame < decodeStart + i * 6) {
            displayChar = CHARSET[Math.floor(rng() * CHARSET.length)];
          } else {
            displayChar = char;
            opacity = frame > decodeStart + i * 6 + 2 ? 1 : 0.5;
          }

          return (
            <span key={i} style={{ opacity, display: 'inline-block' }}>
              {displayChar}
            </span>
          );
        })}
      </div>

      <div style={{
        position: 'absolute',
        top: '55%',
        display: 'flex',
        gap: '24px',
        fontSize: 56,
        color: '#EF4444',
        opacity: interpolate(frame, [50, 70], [0, 1]),
      }}>
        <span>×</span>
        <span>×</span>
      </div>
    </AbsoluteFill>
  );
};

// 镜头 2：搜索框
const Shot2_Search: React.FC<{ searchText: string }> = ({ searchText }) => {
  const frame = useCurrentFrame();

  const boxScale = interpolate(frame, [0, 25], [0.8, 1], { extrapolateLeft: 'clamp' });
  const boxOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: 'clamp' });
  const inputProgress = Math.max(0, Math.min(1, (frame - 35) / 65));
  const visibleChars = Math.floor(inputProgress * searchText.length);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: BRAND_DARK }}>
      <div style={{
        width: 700,
        padding: '24px 32px',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        border: `2px solid ${BRAND_GREEN}`,
        borderRadius: 14,
        fontSize: 40,
        color: '#FFFFFF',
        fontFamily: '-apple-system, BlinkMacSystemFont',
        transform: `scale(${boxScale})`,
        opacity: boxOpacity,
        boxShadow: `0 0 32px ${BRAND_GREEN}40`,
      }}>
        🔍 {searchText.slice(0, visibleChars)}
        {frame > 35 && frame < 100 && <span style={{ animation: 'blink 0.6s infinite' }}>|</span>}
      </div>

      <div style={{
        position: 'absolute',
        top: '58%',
        fontSize: 24,
        color: BRAND_GREEN,
        opacity: interpolate(frame, [75, 115], [0, 1]),
      }}>
        ✓ Skeleton Loading
      </div>

      <style>{`
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>
    </AbsoluteFill>
  );
};

// 镜头 3：结果堆叠
const Shot3_Results: React.FC = () => {
  const frame = useCurrentFrame();
  const results = ['Skeleton Loading', 'Skeleton Screen', 'Loading State', 'Placeholder'];

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'flex-start', paddingTop: 120, background: BRAND_DARK }}>
      {results.map((title, i) => {
        const delay = i * 15;
        const itemFrame = frame - delay;
        const itemOpacity = interpolate(itemFrame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
        const itemY = interpolate(itemFrame, [0, 20], [60, 0], { extrapolateRight: 'clamp' });

        return (
          <div key={i} style={{
            width: 720,
            padding: '20px 24px',
            marginBottom: 16,
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            border: `1px solid ${BRAND_GREEN}40`,
            borderRadius: 10,
            fontSize: 28,
            color: BRAND_GREEN,
            fontWeight: 600,
            opacity: itemOpacity,
            transform: `translateY(${itemY}px)`,
          }}>
            {title}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 镜头 4：详情页
const Shot4_DetailPage: React.FC = () => {
  const frame = useCurrentFrame();

  const transitionProgress = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: BRAND_DARK }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        padding: 40,
        opacity: transitionProgress,
        transform: `translateX(${(1 - transitionProgress) * 100}px)`,
      }}>
        <h1 style={{ fontSize: 52, color: BRAND_GREEN, marginBottom: 20 }}>
          Skeleton Loading
        </h1>
        <p style={{ fontSize: 24, color: '#D1D5DB', lineHeight: 1.6 }}>
          一种加载状态的设计模式，通过展示内容的灰色占位符来提示用户数据正在加载。
        </p>
        <div style={{
          marginTop: 40,
          padding: 20,
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderRadius: 10,
          fontSize: 20,
          color: BRAND_GREEN,
        }}>
          ▶ Live Demo
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 镜头 5：风格变体
const Shot5_StyleVariants: React.FC<{ styleCount: number }> = ({ styleCount = 4 }) => {
  const frame = useCurrentFrame();
  const styles = ['极简', '粗野', '玻璃', '赛博朋克'];

  const currentStyle = Math.floor(frame / 30) % styleCount;
  const styleProgress = (frame % 30) / 30;

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: BRAND_DARK }}>
      <div style={{
        position: 'absolute',
        top: 120,
        fontSize: 32,
        color: '#9CA3AF',
      }}>
        同一个组件 · 5 种风格
      </div>

      <div style={{
        width: 480,
        height: 280,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        border: `2px solid ${BRAND_GREEN}`,
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 1 - Math.abs(styleProgress - 0.5) * 2,
      }}>
        <div style={{ fontSize: 48, color: BRAND_GREEN, fontWeight: 700 }}>
          {styles[currentStyle]}
        </div>
      </div>

      <div style={{
        position: 'absolute',
        bottom: 80,
        fontSize: 20,
        color: '#6B7280',
      }}>
        {currentStyle + 1} / {styleCount}
      </div>
    </AbsoluteFill>
  );
};

// 镜头 6：Prompt 复制
const Shot6_CopyPrompt: React.FC = () => {
  const frame = useCurrentFrame();
  const buttonClickFrame = 15;

  const isClicked = frame > buttonClickFrame;
  const particleOpacity = isClicked ? interpolate(frame - buttonClickFrame, [0, 30], [1, 0]) : 0;

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: BRAND_DARK }}>
      <div style={{
        padding: '16px 32px',
        backgroundColor: BRAND_GREEN,
        color: '#000000',
        borderRadius: 8,
        fontSize: 28,
        fontWeight: 600,
        cursor: 'pointer',
        boxShadow: `0 8px 24px ${BRAND_GREEN}60`,
        opacity: isClicked ? 0.7 : 1,
      }}>
        使用当前方案
      </div>

      {/* 粒子效果 */}
      <div style={{
        position: 'absolute',
        width: 40,
        height: 40,
        backgroundColor: BRAND_GREEN,
        borderRadius: '50%',
        opacity: particleOpacity,
        transform: `translate(120px, -120px) scale(${1 - particleOpacity})`,
      }} />
      <div style={{
        position: 'absolute',
        width: 30,
        height: 30,
        backgroundColor: BRAND_GREEN,
        borderRadius: '50%',
        opacity: particleOpacity,
        transform: `translate(-100px, 100px) scale(${1 - particleOpacity})`,
      }} />

      {/* 确认勾选 */}
      <div style={{
        position: 'absolute',
        bottom: 120,
        fontSize: 80,
        color: BRAND_GREEN,
        opacity: interpolate(frame - buttonClickFrame - 20, [0, 15], [0, 1], { extrapolateLeft: 'clamp' }),
      }}>
        ✓
      </div>
    </AbsoluteFill>
  );
};

// 镜头 7：结尾
const Shot7_Outro: React.FC<{ url: string }> = ({ url = 'gongfpp.github.io/interface-atlas-web' }) => {
  const frame = useCurrentFrame();

  const logoScale = interpolate(frame, [0, 30], [0.5, 1]);
  const logoOpacity = interpolate(frame, [0, 20], [0, 1]);
  const urlOpacity = interpolate(frame, [40, 60], [0, 1]);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: BRAND_DARK }}>
      {/* Logo */}
      <div style={{
        fontSize: 120,
        fontWeight: 700,
        color: BRAND_GREEN,
        opacity: logoOpacity,
        transform: `scale(${logoScale})`,
        marginBottom: 60,
      }}>
        ⚡
      </div>

      {/* 文案 */}
      <h1 style={{
        fontSize: 48,
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 40,
        fontWeight: 600,
      }}>
        用同一套词汇和 AI 合作
      </h1>

      {/* 网址 */}
      <div style={{
        fontSize: 32,
        color: BRAND_GREEN,
        fontFamily: 'SF Mono, Monaco',
        opacity: urlOpacity,
        transform: `translateX(${(1 - urlOpacity) * -50}px)`,
      }}>
        {url}
      </div>

      {/* 二维码占位 */}
      <div style={{
        position: 'absolute',
        bottom: 60,
        width: 180,
        height: 180,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        border: `2px solid ${BRAND_GREEN}`,
        opacity: interpolate(frame, [80, 100], [0, 1]),
      }} />
    </AbsoluteFill>
  );
};

// ============================================================================
// 主组件：AtlasPromo
// ============================================================================

interface AtlasPromoProps {
  bgm?: boolean;
}

export const AtlasPromo: React.FC<AtlasPromoProps> = ({ bgm = true }) => {
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill>
      {/* 镜头 1: 0-90f (0-3s) */}
      <Sequence from={0} durationInFrames={90}>
        <Shot1_PainPoint />
      </Sequence>

      {/* 镜头 2: 90-210f (3-7s) */}
      <Sequence from={90} durationInFrames={120}>
        <Shot2_Search searchText="骨架屏" />
      </Sequence>

      {/* 镜头 3: 210-315f (7-10.5s) */}
      <Sequence from={210} durationInFrames={105}>
        <Shot3_Results />
      </Sequence>

      {/* 镜头 4: 315-420f (10.5-14s) */}
      <Sequence from={315} durationInFrames={105}>
        <Shot4_DetailPage />
      </Sequence>

      {/* 镜头 5: 420-555f (14-18.5s) */}
      <Sequence from={420} durationInFrames={135}>
        <Shot5_StyleVariants styleCount={4} />
      </Sequence>

      {/* 镜头 6: 555-630f (18.5-21s) */}
      <Sequence from={555} durationInFrames={75}>
        <Shot6_CopyPrompt />
      </Sequence>

      {/* 镜头 7: 630-900f (21-30s) */}
      <Sequence from={630} durationInFrames={270}>
        <Shot7_Outro url="gongfpp.github.io/interface-atlas-web" />
      </Sequence>

      {/* BGM 控制 */}
      {bgm && (
        <Audio src={require('./assets/audio/bgm.mp3')} volume={0.3} />
      )}
    </AbsoluteFill>
  );
};

export default AtlasPromo;
