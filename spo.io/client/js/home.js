function openTab(tabId) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));

    const tabButtons = document.querySelectorAll('.tab-buttons button');
    tabButtons.forEach(button => button.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');

    event.currentTarget.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    const recommendBtn = document.getElementById('recommendArtistBtn');
    const recommendationModal = document.getElementById('recommendationModal');
    const span = document.getElementsByClassName('close')[0];
    const findAnotherArtistBtn = document.getElementById('findAnotherArtistBtn'); 
  
    recommendBtn.addEventListener('click', () => {
      recommendationModal.style.display = 'block';
      loadArtist(); 
    });
  
    span.addEventListener('click', () => {
      recommendationModal.style.display = 'none';
    });
  
    window.addEventListener('click', (event) => {
      if (event.target === recommendationModal) {
        recommendationModal.style.display = 'none';
      }
    });
  
    function loadArtist() {
      document.getElementById('loadingScreen').style.display = 'flex';
      document.getElementById('artistContent').style.display = 'none';
  
      fetch('/artists')
        .then(response => response.json())
        .then(data => {
          const randomIndex = Math.floor(Math.random() * data.length);
          const artist = data[randomIndex];
  
          setTimeout(() => {
            document.getElementById('artistName').innerText = artist.name;
            document.getElementById('artistDescription').innerText = artist.description;
            document.getElementById('artistImage').src = artist.image;
  
            const songsList = document.getElementById('artistSongs');
            songsList.innerHTML = '';
            artist.songs.forEach(song => {
              const li = document.createElement('li');
              li.innerText = song;
              songsList.appendChild(li);
            });
  
            document.getElementById('loadingScreen').style.display = 'none';
            document.getElementById('artistContent').style.display = 'block';
          }, 2000); 
        })
        .catch(error => {
          console.error('Erro ao carregar os dados do artista:', error);
          document.getElementById('loadingScreen').style.display = 'none';
        });
    }
  
    findAnotherArtistBtn.addEventListener('click', () => {
      loadArtist(); 
    });
});     

document.addEventListener('DOMContentLoaded', () => {
    const recommendBtn = document.getElementById('recommendPodcastBtn');
    const recommendationModal = document.getElementById('podcastRecommendationModal');
    const closeBtn = document.querySelector('.close');
    const findAnotherPodcastBtn = document.getElementById('findAnotherPodcastBtn');

    recommendBtn.addEventListener('click', () => {
        recommendationModal.style.display = 'block';
        loadPodcast();
    });

    closeBtn.addEventListener('click', () => {
        recommendationModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === recommendationModal) {
            recommendationModal.style.display = 'none';
        }
    });

    function loadPodcast() {
        document.getElementById('LoadingScreen').style.display = 'flex';
        document.getElementById('podcastContent').style.display = 'none';

        fetch('/podcasts')
            .then(response => response.json())
            .then(data => {
                const randomIndex = Math.floor(Math.random() * data.length);
                const podcast = data[randomIndex];

                setTimeout(() => {
                    document.getElementById('podcastTitle').innerText = podcast.title;
                    document.getElementById('podcastDescription').innerText = podcast.description;
                    document.getElementById('podcastImage').src = podcast.image;

                    const episodesList = document.getElementById('podcastEpisodes');
                    episodesList.innerHTML = '';
                    podcast.episodes.forEach(episode => {
                        const li = document.createElement('li');
                        li.innerText = episode;
                        episodesList.appendChild(li);
                    });

                    document.getElementById('LoadingScreen').style.display = 'none';
                    document.getElementById('podcastContent').style.display = 'block';
                }, 2000);
            })
            .catch(error => {
                console.error('Erro ao carregar os dados do podcast:', error);
                document.getElementById('LoadingScreen').style.display = 'none';
            });
    }

    findAnotherPodcastBtn.addEventListener('click', () => {
        loadPodcast();
    });
});