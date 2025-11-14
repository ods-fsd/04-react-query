
import axios from 'axios';
import type { Movie } from '../types/movie';

export interface TMDBSearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

const TMDB = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
});

const token = import.meta.env.VITE_TMDB_TOKEN as string;

export async function fetchMovies(query: string, page: number): Promise<TMDBSearchResponse> {
  if (!token) {
    throw new Error('VITE_TMDB_TOKEN is missing');
  }

  const { data } = await TMDB.get<TMDBSearchResponse>('/search/movie', {
    params: {
      query,
      include_adult: false,
      language: 'en-US',
      page,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}