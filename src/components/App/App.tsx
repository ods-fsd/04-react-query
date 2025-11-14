import { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
import css from './App.module.css';
import SearchBar from '../SearchBar/SearchBar.tsx';
import MovieGrid from '../MovieGrid/MovieGrid.tsx';
import Loader from '../Loader/Loader.tsx';
import ErrorMessage from '../ErrorMessage/ErrorMessage.tsx';
import MovieModal from '../MovieModal/MovieModal.tsx';
import toast from 'react-hot-toast';
import { fetchMovies, type TMDBSearchResponse } from '../../services/movieService.ts';
import type { Movie } from '../../types/movie.ts';

export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = useCallback((newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
    setSelectedMovie(null);
  }, []);

  const {
    data,
    isLoading,
    isError,
    isFetching,
  } = useQuery<TMDBSearchResponse>({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: Boolean(query),
    retry: 1,
  });

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

 
  useEffect(() => {
    if (!query) return;
    if (isLoading || isFetching) return;
    if (data && movies.length === 0 && !isError) {
      toast('No movies found for your request.');
    }
  }, [query, data, movies.length, isLoading, isFetching, isError]);

  const canShowGrid = !isLoading && !isError && movies.length > 0;

  const handleSelectMovie = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {canShowGrid && (
        <>
          {totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}

          <MovieGrid movies={movies} onSelect={handleSelectMovie} />
        </>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}