import css from './MovieGrid.module.css';
import type { Movie } from '../../types/movie.ts'; 

export interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

const IMAGE_BASE = 'https://image.tmdb.org/t/p';
const PLACEHOLDER_URL = '/placeholder.svg';

export default function MovieGrid({ movies, onSelect }: MovieGridProps) {

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = PLACEHOLDER_URL;
  };

  return (
    <ul className={css.grid}>
      {movies.map(movie => {
        const imageUrl = movie.poster_path
          ? `${IMAGE_BASE}/w500${movie.poster_path}`
          : PLACEHOLDER_URL;

        return (
          <li key={movie.id}>
            <div
              className={css.card}
              onClick={() => onSelect(movie)}
              role="button"
              tabIndex={0}
            >
              <img
                className={css.image}
                src={imageUrl}
                alt={movie.title}
                loading="lazy"
                onError={handleImageError} 
              />
              <h2 className={css.title}>{movie.title}</h2>
            </div>
          </li>
        );
      })}
    </ul>
  );
}