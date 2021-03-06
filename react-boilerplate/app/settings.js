export const googleAdClientToken = 'ca-pub-7445097696449097';
export const googleAnalyticsTrackingID = 'UA-117095987-1';

export const googleAdInfo = {
  textAd: {
    slot: '8869334804',
    format: 'auto',
  },
  infieldAd: {
    slot: '7269312674',
    format: 'fluid',
    layoutKey: '-gw-3+1f-3d+2z',
  },
  inarticleAd: {
    slot: '9365889137',
    format: 'fluid',
    layout: 'in-article',
    wrapperDivStyle: {
      overflow: 'hidden',
      textAlign: 'center',
    },
  },
  relativeAd: {
    slot: '7721634979',
    format: 'autorelaxed',
  },
};

export const maxDazedDaysByGenre = [
  7, // Classic
  14, // Twenty Questions
  14, // Little Albat
  28, // Others
];
export const maxDazedDaysLongtermYami = 28;
export const getMaxDazedDays = (puzzle) =>
  puzzle.yami === 2
    ? maxDazedDaysLongtermYami
    : maxDazedDaysByGenre[puzzle.genre];

export const MIN_CONTENT_SAFE_CREDIT = 1000;

const domainRegex = new RegExp(
  /^(https?:\/\/)?(www\.)?(cindythink\.com)?\/(ja\/|en\/)?(puzzle|profile|rules|dashboard|wiki)/,
);
export const domainFilter = (url) => {
  const selfDomain = domainRegex.test(url);
  if (!selfDomain) {
    return { selfDomain, url };
  }

  return {
    selfDomain,
    url: url.replace(domainRegex, '/$5'),
  };
};

export const DEFAULT_TIMEZONE = 9;
