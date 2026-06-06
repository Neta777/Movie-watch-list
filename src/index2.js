const movieContainer = document.querySelector(".container-of-Movies");
document.addEventListener("DOMContentLoaded", () => {
  const listHeader = document.getElementById("myList");

  if (!listHeader) {
    return;
  }
  const movieList = getSavedMovies();
  if (movieList.length === 0) {
    movieContainer.textContent = "there are no movies in the list";
  } else {
    addRemoveClasses();
    movieList.forEach((movie) => {
      renderMovieCard(movie, "remove");
    });
  }
});
function getSavedMovies() {
  return JSON.parse(localStorage.getItem("savedList")) || [];
}
function moviesToSave(item) {
  return localStorage.setItem("savedList", JSON.stringify(item));
}
const findMovie = document.getElementById("find");
const inputEl = document.getElementById("enterMovie");

if (findMovie) {
  findMovie.addEventListener("click", search);
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      search();
    }
  });
}
const API_KEY = "6a0298cd";
async function search() {
  const inputMovie = inputEl.value.trim();

  if (!inputMovie) {
    return;
  }

  try {
    const res = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=${inputMovie}`,
    );
    const data = await res.json();

    if (data.Search) {
      movieContainer.textContent = "";
      movieContainer.classList.remove("not-found");
      addRemoveClasses();
      data.Search.forEach((movie) => {
        renderMovieCard(movie, "search");
      });
    } else {
      movieContainer.classList.remove("filled");
      movieContainer.classList.remove("empty");
      movieContainer.classList.add("not-found");
    }
  } catch (error) {
    movieContainer.textContent = "Something went wrong";
  }
}
async function renderMovieCard(movie, mode) {
  const cardContainer = document.createElement("div");
  cardContainer.classList.add("movie-card");
  const movieImage = document.createElement("img");
  movieImage.src =
    movie.Poster === "N/A" ? "../images/no-data-initial.png" : movie.Poster;
  movieImage.classList.add("poster-image");
  movieImage.alt = "No image";
  const movieTitle = document.createElement("h2");
  movieTitle.textContent = `${movie.Title}`;
  const addBtn = document.createElement("button");
  addBtn.classList.add("add-movie");
  if (mode === "search") {
    addBtn.innerHTML = `<img src="../images/plus.png"> Watchlist`;
    addBtn.addEventListener("click", () => {
      const movieList = getSavedMovies();
      const movieExists = movieList.some(
        (savedMovie) => savedMovie.imdbID === movie.imdbID,
      );
      if (movieExists) {
        return;
      }
      movieList.push(movie);
      moviesToSave(movieList);
    });
  }
 else {
    addBtn.textContent = "- Remove movie";
    addBtn.addEventListener("click", () => {
      const movieList = getSavedMovies();

      const movieToDelete = movieList.filter((savedMovie) => {
        return savedMovie.imdbID !== movie.imdbID;
      });

      moviesToSave(movieToDelete);
      cardContainer.remove();
      if (movieToDelete.length === 0) {
        movieContainer.textContent = "There are no movies in the list.";
        movieContainer.classList.remove("filled");
      }
    });
  }

  const res = await fetch(
    `https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`,
  );
  const data = await res.json();

  const movieCardContent = document.createElement("div");
  movieCardContent.classList.add("card-content");
  const movieYear = document.createElement("span");
  movieYear.classList.add("movie-year");
  movieYear.textContent = data.Year;
  const titlePlusRating = document.createElement("div");
  titlePlusRating.classList.add("title-rating");
  const restContent = document.createElement("div");
  restContent.classList.add("rest-content");
  const movieRuntime = document.createElement("span");
  movieRuntime.classList.add("movie-runtime");
  movieRuntime.textContent = data.Runtime;
  const movieRating = document.createElement("span");
  const movieGenre = document.createElement("span");
  movieGenre.classList.add("movie-genre");
  const moviePlot = document.createElement("p");
  moviePlot.classList.add("movie-plot");
  moviePlot.textContent = data.Plot;
  movieGenre.textContent = data.Genre;
  movieRating.classList.add("rating");
  movieRating.innerHTML = `<img src="../images/Icon.png">${data.imdbRating}`;
  titlePlusRating.append(movieTitle, movieYear, movieRating);
  restContent.append(movieRuntime, movieGenre, addBtn);
  movieCardContent.append(titlePlusRating, restContent, moviePlot);

  cardContainer.append(movieImage, movieCardContent);
  movieContainer.appendChild(cardContainer);
}
function addRemoveClasses() {
  movieContainer.classList.remove("empty");
  movieContainer.classList.add("filled");
}
