document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    
    // Init Materialize
    M.AutoInit();

    // Inicializar tabs y añadir evento de cambio
    const tabsEl = document.querySelector('.tabs');
    const tabsInstance = M.Tabs.init(tabsEl, {
        onShow: function(tab) {
            const id = tab.id; // 'tab-articles', 'tab-blogs', 'tab-reports'
            const type = id.replace('tab-', ''); // 'articles', 'blogs', 'reports'
            loadNews(type);
        }
    });

    // Cargar la primera tab al arrancar
    loadNews('articles');
}

// ── AJAX ──────────────────────────────────────────────────────────────────────

const BASE_URL = 'https://api.spaceflightnewsapi.net/v4/';
const LIMIT = 10;

// Guarda qué tabs ya han cargado para no repetir peticiones
const loaded = {
    articles: false,
    blogs: false,
    reports: false
};

function loadNews(type) {
    // Si ya está cargado, no repetimos la petición
    if (loaded[type]) return;

    const container = document.getElementById(type + '-container');
    container.innerHTML = '<div class="center" style="padding:2rem;"><div class="preloader-wrapper active"><div class="spinner-layer spinner-blue-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div></div>';

    const xhr = new XMLHttpRequest();
    xhr.open('GET', BASE_URL + type + '/?limit=' + LIMIT + '&ordering=-published_at', true);

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            renderNews(type, data.results);
            loaded[type] = true;
        } else {
            showError(container, xhr.status);
        }
    };

    xhr.onerror = function () {
        showError(container, 'Network error');
    };

    xhr.send();
}

// ── RENDER ────────────────────────────────────────────────────────────────────

function renderNews(type, items) {
    const container = document.getElementById(type + '-container');

    if (!items || items.length === 0) {
        container.innerHTML = '<p class="center grey-text">No results found.</p>';
        return;
    }

    let html = '';

    items.forEach(function(item) {
        const image = item.image_url
            ? '<img src="' + item.image_url + '" alt="thumbnail" class="news-img">'
            : '<div class="news-img-placeholder blue darken-3"><i class="material-icons white-text">rocket_launch</i></div>';

        const date = item.published_at
            ? new Date(item.published_at).toLocaleDateString()
            : '';

        html += `
        <div class="col s12 m6 l4">
            <div class="card news-card">
                <div class="card-image">
                    ${image}
                </div>
                <div class="card-content">
                    <span class="card-title news-title">${item.title}</span>
                    <p class="news-summary">${item.summary || ''}</p>
                    <p class="grey-text news-date"><i class="material-icons tiny">schedule</i> ${date} · ${item.news_site || ''}</p>
                </div>
                <div class="card-action">
                    <a href="${item.url}" target="_blank" class="blue-text">Read more</a>
                </div>
            </div>
        </div>`;
    });

    container.innerHTML = html;
}

// ── ERROR ─────────────────────────────────────────────────────────────────────

function showError(container, status) {
    container.innerHTML = `
        <div class="center" style="padding:2rem;">
            <i class="material-icons large red-text">error_outline</i>
            <p class="red-text">Error loading content (${status})</p>
        </div>`;
}