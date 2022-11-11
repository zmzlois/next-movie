export const genreLabelMap: Record<string, string> = {
  action: 'Action',
  adventure: 'Adventure',
  animation: 'Animation',
  biography: 'Biography',
  comedy: 'Comedy',
  crime: 'Crime',
  documentary: 'Documentary',
  drama: 'Drama',
  family: 'Family',
  fantasy: 'Fantasy',
  filmnoir: 'Film Noir',
  gameshow: 'Game Show',
  history: 'History',
  horror: 'Horror',
  music: 'Music',
  musical: 'Musical',
  mystery: 'Mystery',
  news: 'News',
  realitytv: 'Reality TV',
  romance: 'Romance',
  scifi: 'Science Fiction',
  sport: 'Sports',
  'stand up': 'Stand Up',
  talkshow: 'Talk Show',
  thriller: 'Thriller',
  'tv movie': 'TV Movie',
  war: 'War',
  western: 'Western'
}

export const genres = Object.keys(genreLabelMap)

export function encodeGenre(genre: string) {
  return genre.replace(/ /g, '-')
}

export function decodeGenre(genre: string) {
  return genre?.replace(/-/g, ' ').toLowerCase().trim()
}
