interface AnalyticsConfigInput {
  origin: string;
}

/** 三个已发布站点统一使用既有自建实例；站点 ID 是公开采集配置，不是凭据。 */
export function analyticsScriptConfig(input: AnalyticsConfigInput) {
  const domains: Record<string, string> = {
    'https://atlas.gongfpp.icu': 'atlas.gongfpp.icu',
    'https://gongfpp.github.io': 'gongfpp.github.io',
    'https://interface-atlas-9po.pages.dev': 'interface-atlas-9po.pages.dev',
  };
  if (!domains[input.origin]) return { src: undefined, id: undefined, upgraded: false, domains: undefined };
  return {
    src: 'https://stats.gongfpp.icu/script.js',
    id: '8a45a53d-1a44-40a1-886f-21a7a06e8c4c',
    upgraded: true,
    domains: domains[input.origin],
  };
}
