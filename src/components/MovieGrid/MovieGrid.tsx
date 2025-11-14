import css from './MovieGrid.module.css';
import type { Movie } from '../../types/movie';

export interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

const IMAGE_BASE = 'https://image.tmdb.org/t/p';

export default function MovieGrid({ movies, onSelect }: MovieGridProps) {
  return (
    <ul className={css.grid}>
      {movies.map(movie => (
        <li key={movie.id}>
          <div
            className={css.card}
            onClick={() => onSelect(movie)}
            role="button"
            tabIndex={0}
          >
            <img
              className={css.image}
              src={`${IMAGE_BASE}/w500${movie.poster_path}`}
              alt={movie.title}
              loading="lazy"
            />
            <h2 className={css.title}>{movie.title}</h2>
          </div>
        </li>
      ))}
    </ul>
  );
}