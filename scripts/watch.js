document.addEventListener('DOMContentLoaded', () => {
  const watchContainer = document.getElementById('watchMovie');

  if (!watchContainer) return;

  const movieJson = localStorage.getItem(window.MindxCinema.STORAGE_KEYS.selectedMovie);

  if (!movieJson) {
    watchContainer.innerHTML = '<p>No movie selected.</p>';
    return;
  }

  const movie = JSON.parse(movieJson);
  const trailerUrl = movie.trailer || '';

  if (!trailerUrl) {
    watchContainer.innerHTML = `
      <h1>${movie.name || movie.title}</h1>
      <p>No trailer link available for this movie from the API.</p>
    `;
    return;
  }

  watchContainer.innerHTML = `
    <h1>${movie.name || movie.title}</h1>
    <div class="video-wrapper">
      <iframe
        src="${trailerUrl}"
        title="${movie.name || movie.title}"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
      </iframe>
    </div>
  `;
});
