// FunciÃ³n para leer el archivo CSV
function readCSV(file, callback) {
    fetch(file)
        .then(response => response.text())
        .then(text => {
            const parsedData = Papa.parse(text, { header: true, skipEmptyLines: true });
            console.log('Datos parseados:', parsedData);
            callback(parsedData.data);
        })
        .catch(error => {
            console.error('Error al obtener o analizar el archivo CSV:', error);
        });
}

// FunciÃ³n para crear el HTML de las noticias
function createNewsHTML(data) {
    console.log('Datos recibidos en createNewsHTML:', data);
    const newsCarousel = document.getElementById('newsCarousel');
    newsCarousel.innerHTML = '';

    data.forEach(item => {
        console.log('Item actual:', item);
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item'; 
        newsItem.innerHTML = `
            <div class="news-card">
                <img src="${item.imagePath}" alt="${item.imageAlt}" class="news-image">
                <div class="news-content">
                    <h2 class="news-title">
                        <a class="a_index" target="_blank" href="${item.link}">${item.title}</a>
                    </h2>
                    <p class="news-date">${item.date}</p>
                    <p class="news-description">${item.description}</p>
                </div>
            </div>
        `;
        newsCarousel.appendChild(newsItem);
    });

    // Inicializar el carrusel despuÃ©s de crear los elementos
    initializeCarousel();
}

// Cargar y procesar el CSV
document.addEventListener('DOMContentLoaded', (event) => {
    readCSV('../pcpuma.csv', createNewsHTML);
});


// Carousel code
function initializeCarousel() {
    const carousel = document.querySelector('.news-carousel');
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    let newsItems = document.querySelectorAll('.news-item');
    let currentIndex = 0;
    let itemsPerView = 1;
    let autoScrollInterval;
    const autoScrollDelay = 3000; // Reduced to 3 seconds

    function updateItemsPerView() {
        if (window.innerWidth >= 1024) {
            itemsPerView = 4;
        } else if (window.innerWidth >= 768) {
            itemsPerView = 2;
        } else {
            itemsPerView = 1;
        }
    }

    function cloneItems() {
        const originalItems = Array.from(newsItems);
        const totalItems = originalItems.length;
        const totalClones = totalItems * 3;

        // Clear carousel and create clones
        carousel.innerHTML = '';
        for (let i = 0; i < totalClones; i++) {
            const clone = originalItems[i % totalItems].cloneNode(true);
            carousel.appendChild(clone);
        }

        // Update newsItems to include cloned items
        newsItems = carousel.querySelectorAll('.news-item');
    }

    function showNews(index) {
        const itemWidth = 100 / itemsPerView;
        const offset = itemWidth * index;
        carousel.style.transform = `translateX(-${offset}%)`;
    }

    function nextNews() {
        currentIndex++;
        carousel.style.transition = 'transform 0.3s ease';
        showNews(currentIndex);
        checkBoundary();
    }

    function prevNews() {
        currentIndex--;
        carousel.style.transition = 'transform 0.3s ease';
        showNews(currentIndex);
        checkBoundary();
    }

    function checkBoundary() {
        const totalItems = newsItems.length / 3;
        
        if (currentIndex >= totalItems * 2) {
            setTimeout(() => {
                carousel.style.transition = 'none';
                currentIndex = totalItems;
                showNews(currentIndex);
                setTimeout(() => {
                    carousel.style.transition = 'transform 0.3s ease';
                }, 10);
            }, 300);
        } else if (currentIndex < totalItems) {
            setTimeout(() => {
                carousel.style.transition = 'none';
                currentIndex = totalItems;
                showNews(currentIndex);
                setTimeout(() => {
                    carousel.style.transition = 'transform 0.3s ease';
                }, 10);
            }, 300);
        }
    }

    function handleResize() {
        updateItemsPerView();
        // Re-initialize carousel on resize
        currentIndex = newsItems.length / 3;
        showNews(currentIndex);
    }

    function startAutoScroll() {
        autoScrollInterval = setInterval(nextNews, autoScrollDelay);
    }

    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }

    function resetAutoScroll() {
        stopAutoScroll();
        startAutoScroll();
    }

    nextButton.addEventListener('click', () => {
        nextNews();
        resetAutoScroll();
    });

    prevButton.addEventListener('click', () => {
        prevNews();
        resetAutoScroll();
    });

    carousel.addEventListener('mouseenter', stopAutoScroll);
    carousel.addEventListener('mouseleave', startAutoScroll);

    window.addEventListener('resize', handleResize);

    carousel.addEventListener('transitionend', () => {
        checkBoundary();
    });

    // Initial setup
    updateItemsPerView();
    cloneItems();
    currentIndex = newsItems.length / 3;
    showNews(currentIndex);
    startAutoScroll();
}

//Carrusel videos
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    const items = carousel.querySelectorAll('.carousel-item');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    let currentIndex = 0;
    let interval;

    function showItem(index) {
        carousel.style.transform = `translateX(-${index * 100}%)`;
        items.forEach((item, i) => {
            const video = item.querySelector('video');
            if (i === index) {
                video.play();
            } else {
                video.pause();
                video.currentTime = 0;
            }
        });
    }

    function nextItem() {
        currentIndex = (currentIndex + 1) % items.length;
        showItem(currentIndex);
    }

    function prevItem() {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        showItem(currentIndex);
    }

    function startAutoPlay() {
        clearInterval(interval);
        interval = setInterval(nextItem, 30000); // 30 seconds
    }

    nextButton.addEventListener('click', () => {
        nextItem();
        startAutoPlay();
    });

    prevButton.addEventListener('click', () => {
        prevItem();
        startAutoPlay();
    });

    items.forEach(item => {
        const video = item.querySelector('video');
        video.addEventListener('ended', () => {
            nextItem();
            startAutoPlay();
        });
    });

    showItem(currentIndex);
    startAutoPlay();

    // Iniciar reproducciÃ³n del primer video
    items[0].querySelector('video').play();
});