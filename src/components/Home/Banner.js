import React, { useEffect, useState } from "react";
import "../../Styles/Banner.css";
import { truncate } from "../../util";
import { instance } from "../../lib/axios";
import { requests } from "../../lib/requests";
function Banner() {
  useEffect(() => {
    let sub = true;
    if (sub) {
      async function fetchData() {
        const request = await instance.get(requests.fetchNetflixOriginals);
        setMovie(
          request.data.results[
            Math.floor(Math.random() * request.data.results.length - 1)
          ]
        );
        return request;
      }
      fetchData();
    }
    return () => (sub = false);
  }, []);
  const [movie, setMovie] = useState([]);
  return (
    <header
      className="banner"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundImage: `url(${
          movie?.backdrop_path
            ? "https://image.tmdb.org/t/p/original/" + movie?.backdrop_path
            : movie?.poster_path
            ? "https://image.tmdb.org/t/p/original/" + movie?.poster_path
            : "images/netflix_fallBack.jfif"
        }) `,
      }}
    >
      <div className="banner__contents">
        <h1 className="banner__title">
          {movie?.title || movie?.name || movie?.original_name}
        </h1>
        <div className="banner__buttons">
          <button type="button" className="banner__button">
            Play
          </button>
          <button type="button" className="banner__button">
            My List
          </button>
        </div>
        <h1 className="banner__description">
          {truncate(movie?.overview, 150)}
        </h1>
      </div>
      <div className="banner--fadeBottom" />
    </header>
  );
}

export default Banner;
