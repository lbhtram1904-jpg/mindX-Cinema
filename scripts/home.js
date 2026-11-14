document.addEventListener('DOMContentLoaded', () => {
  const movieGrid = document.getElementById('movieGrid');
  const featuredMovie = document.getElementById('featuredMovie');
  const signOutBtn = document.getElementById('signOutBtn');
  const loadingText = document.getElementById('loadingText');
  const profileBtn = document.getElementById('profileBtn');
  const userAvatar = document.getElementById('userAvatar');

  if (signOutBtn) {
    signOutBtn.addEventListener('click', () => {
      localStorage.removeItem('mindx_current_user');
      window.location.href = 'login.html';
    });
  }

  if (profileBtn) {
    profileBtn.addEventListener('click', () => {
      window.location.href = 'profile.html';
    });
  }

  if (!movieGrid) return;

  function stripHtml(value) {
    return value ? value.replace(/<[^>]+>/g, '') : 'No description available.';
  }

  function normalizeMovie(movie) {
    return {
      id: movie.id,
      name: movie.title || movie.name || 'Untitled Movie',
      title: movie.title || movie.name || 'Untitled Movie',
      year: movie.release_date ? movie.release_date.slice(0, 4) : 'N/A',
      summary: movie.overview || 'No description available.',
      image: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '',
      genres: Array.isArray(movie.genre_ids) ? movie.genre_ids : [],
      rating: movie.vote_average ?? null,
      trailer: ''
    };
  }

  function renderFeaturedMovie(movie) {
    if (!featuredMovie || !movie) return;

    const title = movie.name || movie.title || 'Untitled Movie';
    const summary = stripHtml(movie.summary).slice(0, 220);
    const poster = movie.image || '../assets/no-image.svg';

    featuredMovie.innerHTML = `
      <div class="featured-content">
        <h1 class="featured-title">${title}</h1>
        <p class="featured-summary">${summary}</p>
        <div class="featured-actions">
          <button class="primary-btn" data-id="${movie.id}">▶ Watch Now</button>
          <button class="secondary-btn" data-id="${movie.id}">ⓘ View Info</button>
        </div>
      </div>
      <div class="poster-box">
        <div class="poster-card">
          <img src="${poster}" alt="${title}" style="width:100%; height:100%; object-fit:cover; border-radius:22px;" />
        </div>
      </div>
    `;

    featuredMovie.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', () => {
        const selectedMovie = {
          id: movie.id,
          name: title,
          title,
          year: movie.year || 'N/A',
          summary: stripHtml(movie.summary),
          image: movie.image || '',
          genres: movie.genres || [],
          rating: movie.rating || null,
          trailer: movie.trailer || ''
        };

        localStorage.setItem(window.MindxCinema.STORAGE_KEYS.selectedMovie, JSON.stringify(selectedMovie));
        window.location.href = button.textContent.includes('Watch') ? 'watch.html' : 'info.html';
      });
    });
  }

  function renderMovies(movies) {
    movieGrid.innerHTML = '';

    if (!Array.isArray(movies) || movies.length === 0) {
      movieGrid.innerHTML = '<p>No movies available right now.</p>';
      return;
    }

    const list = movies.slice(1, 12);

    list.forEach((movie) => {
      const card = document.createElement('article');
      card.className = 'movie-card';

      const title = movie.name || movie.title || 'Untitled Movie';
      const summary = stripHtml(movie.summary).slice(0, 110);
      const poster = movie.image || '../assets/no-image.svg';

      card.innerHTML = `
        <div class="movie-poster-wrap">
          <img src="${poster}" alt="${title}" />
        </div>
        <div>
          <h3>${title}</h3>
          <p>${summary}</p>
        </div>
        <button class="movie-button" data-id="${movie.id}">View detail</button>
      `;

      card.querySelector('.movie-button').addEventListener('click', () => {
        const selectedMovie = {
          id: movie.id,
          name: title,
          title,
          year: movie.year || 'N/A',
          summary: stripHtml(movie.summary),
          image: movie.image || '',
          genres: movie.genres || [],
          rating: movie.rating || null,
          trailer: movie.trailer || ''
        };

        localStorage.setItem(window.MindxCinema.STORAGE_KEYS.selectedMovie, JSON.stringify(selectedMovie));
        window.location.href = 'info.html';
      });

      movieGrid.appendChild(card);
    });
  }

  function getCurrentUser() {
    const current = localStorage.getItem('mindx_current_user');
    try {
      return current ? JSON.parse(current) : null;
    } catch {
      return null;
    }
  }

  function getUserFavoriteGenres() {
    const currentUser = getCurrentUser();
    if (!currentUser) return [];

    const users = localStorage.getItem('mindx_users');
    try {
      const parsed = users ? JSON.parse(users) : [];
      const user = parsed.find((item) => item.username.toLowerCase() === currentUser.username.toLowerCase());
      return user && Array.isArray(user.favoriteGenres) ? user.favoriteGenres : [];
    } catch {
      return [];
    }
  }

  function getRecommendedMovies(list, favoriteGenres) {
    if (!favoriteGenres.length) return list;

    const normalized = favoriteGenres.map((genre) => genre.toLowerCase());
    const recommended = list.filter((movie) => {
      const movieGenres = Array.isArray(movie.genres) ? movie.genres : [];
      return movieGenres.some((genre) => normalized.includes(String(genre).toLowerCase()));
    });

    return recommended.length ? recommended : list;
  }

  fetch(window.MindxCinema.MOVIE_API_URL)
    .then((response) => {
      if (!response.ok) throw new Error('API request failed');
      return response.json();
    })
    .then((data) => {
      const list = Array.isArray(data.results) ? data.results.map(normalizeMovie) : [];
      const favoriteGenres = getUserFavoriteGenres();
      const recommendedList = getRecommendedMovies(list, favoriteGenres);

      if (recommendedList.length > 0) {
        renderFeaturedMovie(recommendedList[0]);
        renderMovies(recommendedList);
      }
    })
    .catch(() => {
      if (featuredMovie) {
        featuredMovie.innerHTML = '<div class="featured-content"><h1 class="featured-title">No movies</h1><p class="featured-summary">Unable to load movies from the API.</p></div>';
      }
      if (movieGrid) {
        movieGrid.innerHTML = '<p>No movies available right now.</p>';
      }
    })
    .finally(() => {
      if (loadingText) {
        loadingText.style.display = 'none';
      }
    });
});
