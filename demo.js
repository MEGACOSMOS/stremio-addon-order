// Uma lista de extensões inventada (mas com extensões reais) para o exemplo:
// oficiais e de terceiros, misturadas.

const cat = (id, nome, pesquisa = false) => ({
  type: 'movie', id, name: nome, extra: pesquisa ? [{ name: 'search', isRequired: false }] : [],
});

const ext = (url, manifest, oficial = false) => ({
  transportUrl: url, transportName: 'http', manifest: { types: ['movie', 'series'], resources: [], catalogs: [], ...manifest },
  flags: { official: oficial, protected: false },
});

export const DEMO = [
  ext('https://torrentio.strem.fun/manifest.json', {
    id: 'com.stremio.torrentio.addon', version: '0.0.15', name: 'Torrentio',
    description: 'Provides torrent streams from scraped torrent providers.',
  }),
  ext('https://tmdb.elfhosted.com/manifest.json', {
    id: 'tmdb-addon', version: '3.1.6', name: 'The Movie Database Addon',
    description: 'Metadata provided by TMDB, with catalogs in your language.',
    catalogs: [cat('tmdb.top', 'Popular', true), cat('tmdb.trending', 'Trending')],
  }),
  ext('https://stremiostats.stream/demo/manifest.json', {
    id: 'community.estatisticas.filmes', version: '1.2.0', name: 'Stremio Stats',
    description: 'Statistics for every movie you’ve watched on Stremio.',
    logo: 'https://stremiostats.stream/logo.png',
    catalogs: [cat('mv-estatisticas', 'My statistics'), cat('mv-vistos', 'Movies I’ve watched')],
  }),
  ext('https://v3-cinemeta.strem.io/manifest.json', {
    id: 'com.linvo.cinemeta', version: '3.0.13', name: 'Cinemeta',
    description: 'The official addon for movie and series catalogs.',
    catalogs: [cat('top', 'Popular', true), cat('year', 'New'), cat('imdbRating', 'Featured')],
  }, true),
  ext('https://v3-channels.strem.io/manifest.json', {
    id: 'com.linvo.stremiochannels', version: '1.0.6', name: 'YouTube',
    description: 'Watch YouTube channels and videos in Stremio.',
    catalogs: [{ type: 'channel', id: 'channels', name: 'YouTube', extra: [{ name: 'search' }] }],
  }, true),
  ext('https://watchhub.strem.io/manifest.json', {
    id: 'org.stremio.watchhub', version: '1.3.0', name: 'WatchHub',
    description: 'Find where to stream your favourite movies and shows.',
  }, true),
  ext('https://opensubtitles-v3.strem.io/manifest.json', {
    id: 'org.stremio.opensubtitlesv3', version: '1.0.0', name: 'OpenSubtitles v3',
    description: 'OpenSubtitles v3 subtitles addon.',
  }, true),
  ext('http://127.0.0.1:11470/local-addon/manifest.json', {
    id: 'org.stremio.local', version: '1.10.0', name: 'Local Files',
    description: 'Local add-on to find playable files: .torrent, .mp4, .mkv and .avi.',
  }, true),
];
