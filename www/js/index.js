/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!
 
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    //document.getElementById('deviceready').classList.add('ready');
}

// init Materialize
M.AutoInit();

document.addEventListener('DOMContentLoaded', function () {
    M.Sidenav.init(document.querySelectorAll('.sidenav'));
    M.Tabs.init(document.querySelectorAll('.tabs'));

    document.getElementById('artistBtn').addEventListener('click', searchArtists);
    document.getElementById('songBtn').addEventListener('click', searchSongs);

    loadFeaturedArtists();
    loadFeaturedSongs();
});

/* ======================
   ARTISTES DESTACATS
====================== */
function loadFeaturedArtists() {
    const list = document.getElementById('featuredArtists');
    list.innerHTML = '';

    const url =
        'https://musicbrainz.org/ws/2/artist/?query=rock&fmt=json&limit=5';

    fetch(url, {
        headers: { 'User-Agent': 'MusicBrainz-Student-App/1.0' }
    })
        .then(response => response.json())
        .then(data => {
            data.artists.forEach(artist => {
                const li = document.createElement('li');
                li.className = 'collection-item';
                li.textContent = artist.name;
                list.appendChild(li);
            });
        });
}

/* ======================
   CANÇONS DESTACADES
====================== */
function loadFeaturedSongs() {
    const list = document.getElementById('featuredSongs');
    list.innerHTML = '';

    const url =
        'https://musicbrainz.org/ws/2/recording/?query=love&fmt=json&limit=5';

    fetch(url, {
        headers: { 'User-Agent': 'MusicBrainz-Student-App/1.0' }
    })
        .then(response => response.json())
        .then(data => {
            data.recordings.forEach(song => {
                const li = document.createElement('li');
                li.className = 'collection-item';
                li.textContent = song.title;
                list.appendChild(li);
            });
        });
}

/* ======================
   CERCA MANUAL
====================== */
function searchArtists() {
    const query = document.getElementById('queryInput').value;
    const list = document.getElementById('results');
    list.innerHTML = '';
    if (query === '') return;

    fetch(
        'https://musicbrainz.org/ws/2/artist/?query=' +
        encodeURIComponent(query) +
        '&fmt=json',
        { headers: { 'User-Agent': 'MusicBrainz-Student-App/1.0' } }
    )
        .then(res => res.json())
        .then(data => {
            data.artists.slice(0, 10).forEach(artist => {
                const li = document.createElement('li');
                li.className = 'collection-item';
                li.textContent = artist.name;
                list.appendChild(li);
            });
        });
}

function searchSongs() {
    const query = document.getElementById('queryInput').value;
    const list = document.getElementById('results');
    list.innerHTML = '';
    if (query === '') return;

    fetch(
        'https://musicbrainz.org/ws/2/recording/?query=' +
        encodeURIComponent(query) +
        '&fmt=json',
        { headers: { 'User-Agent': 'MusicBrainz-Student-App/1.0' } }
    )
        .then(res => res.json())
        .then(data => {
            data.recordings.slice(0, 10).forEach(song => {
                const li = document.createElement('li');
                li.className = 'collection-item';
                li.textContent = song.title;
                list.appendChild(li);
            });
        });
}
