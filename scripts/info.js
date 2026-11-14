document.addEventListener('DOMContentLoaded', () => {
  const detailContainer = document.getElementById('movieDetail');

  if (!detailContainer) return;

  const movieJson = localStorage.getItem(window.MindxCinema.STORAGE_KEYS.selectedMovie);

  if (!movieJson) {
    detailContainer.innerHTML = '<p>No movie selected.</p>';
    return;
  }

  const movie = JSON.parse(movieJson);
  const genres = Array.isArray(movie.genres) && movie.genres.length ? movie.genres.join(', ') : 'N/A';
  const image = movie.image || '';

  detailContainer.innerHTML = `
    <div class="movie-detail-card">
      ${image ? `<img src="${image}" alt="${movie.name || movie.title}" />` : ''}
      <div class="movie-detail-content">
        <h1>${movie.name || movie.title}</h1>
        <div class="meta">
          <span>${movie.year || 'N/A'}</span>
          <span>${genres}</span>
          <span>${movie.rating ? '⭐ ' + movie.rating : '⭐ N/A'}</span>
        </div>
        <p>${movie.summary || 'No description available.'}</p>
        <button class="watch-button">Watch info</button>
      </div>
    </div>
  `;

  detailContainer.querySelector('.watch-button').addEventListener('click', () => {
    window.location.href = 'watch.html';
  });
});
