interface AnalyticsConfigInput {
  origin: string;
  legacySrc?: string;
  legacyId?: string;
  edgeOneSrc?: string;
  edgeOneId?: string;
}

/** 共享仓库发布三站时，仅正式 EdgeOne 构建可选择新接收端；其它站原配置不动。 */
export function analyticsScriptConfig(input: AnalyticsConfigInput) {
  const legacy = { src: input.legacySrc, id: input.legacyId, upgraded: false, domains: undefined as string | undefined };
  if (input.origin !== 'https://atlas.gongfpp.icu') return legacy;
  if (!input.edgeOneSrc && !input.edgeOneId) return legacy;
  if (input.edgeOneSrc !== 'https://stats.gongfpp.icu/script.js'
    || !/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(input.edgeOneId || '')) {
    throw Error('EdgeOne 独立统计配置不完整或不是已批准的 stats.gongfpp.icu 接收端');
  }
  return { src: input.edgeOneSrc, id: input.edgeOneId, upgraded: true, domains: 'atlas.gongfpp.icu' };
}
