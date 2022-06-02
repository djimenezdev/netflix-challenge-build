import React, { useState, useEffect } from "react";
import { instance } from "../../lib/axios";
import "../../Styles/Row.css";

function Row({ title, fetchUrl, isLarge }) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    let sub = true;
    if (sub) {
      async function fetchData() {
        const request = await instance.get(fetchUrl);
        setMovies(request.data.results);
        return request;
      }
      fetchData();
    }
    return () => (sub = false);
  }, [fetchUrl]);
  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row__posters">
        {movies.map((movie) => (
          <img
            key={movie.id}
            className={`row__poster ${isLarge && "row__posterLarge"}`}
            src={
              movie?.backdrop_path !== null && !isLarge
                ? "https://image.tmdb.org/t/p/original/" + movie?.backdrop_path
                : movie?.poster_path !== null && isLarge
                ? "https://image.tmdb.org/t/p/original/" + movie?.poster_path
                : "images/netflix_fallBack.jfif"
            }
            alt={movie?.title || movie?.name || movie?.original_name}
          />
        ))}
      </div>
    </div>
  );
}

export default Row;
