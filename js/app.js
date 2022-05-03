import NAV from './nav.js';
import API from './api.js';
import { NetworkError, FormError } from './errors.js';

const APP = {
  actors: [],
  shows: [],
  init: () => {
    APP.addListeners();
    APP.registerSW();
  },
  registerSW: () => {
    //TODO: register your service worker
  },
  addListeners: () => {
    document
      .getElementById('btnSearch')
      .addEventListener('click', APP.submitActor);
    document
      .getElementById('formSearch')
      .addEventListener('submit', APP.submitActor);
    window.addEventListener('pageshow', APP.pageLoaded);
    let tiles = document.querySelector('.tiles');
    if (tiles) tiles.addEventListener('click', APP.submitKnown);
    document.querySelector('header h1').addEventListener('click', () => {
      location = 'index.html';
    });
    //TODO: Add the listener for online and offline
    //TODO: pass the online offline state to the service worker when the state changes.
  },
  submitActor: (ev) => {
    ev.preventDefault();
    try {
      NAV.goActors();
    } catch (err) {
      console.warn({ err });
      if (err instanceof FormError) {
        APP.showMessage(err.message, 'error', 3000);
        console.log(err.field);
        if (err.field) {
          err.field.classList.add('error');
          err.field.addEventListener(
            'focus',
            (ev) => {
              err.field.classList.remove('error');
            },
            { once: true }
          );
        }
      } else {
        //generic error
        APP.showMessage(err.message, 'error', 2000);
      }
    }
  },
  submitKnown: (ev) => {
    ev.preventDefault();
    //navigate to the known for page passing in the id of the actor.
    let target = ev.target;
    let tile = target.closest('.tile');
    if (!tile) return;
    let pid = tile.getAttribute('data-id');
    let name = tile.getAttribute('data-name');
    NAV.goKnown(pid, name);
  },
  showMessage: (message, type = 'info', delay = 2000) => {
    //display a toast-like that self removes
    //type will be info | success | error
    //default to 2000 for removal but can be changed
    console.log(`show the ${type} message`);
    let div = document.createElement('div');
    div.className = 'message';
    div.classList.add(type);
    div.textContent = message;
    document.body.append(div);
    setTimeout(() => {
      div.remove();
    }, delay);
  },
  pageLoaded: (ev) => {
    //when any page loads `pageshow` event fires after onload
    console.log('APP.pageLoaded');
    let url = new URL(window.location.href);
    let hash;
    let id = document.body.id;
    switch (id) {
      case 'home':
        //custom scripts for home page
        break;
      case 'actors':
        //custom scripts for the actors page
        hash = url.hash;
        if (!hash) {
          //send the user back to the home screen
          window.location('./index.html');
        }
        hash = hash.replaceAll('#', '');
        try {
          //API.getPeople returns a Promise and .then
          API.getPeople(hash).then((resp) => {
            //resp is the Object from the JSON string returned by the API
            // console.log(resp);
            APP.buildTiles(resp, hash);
          });
        } catch (err) {
          if (err instanceof NetworkError) {
            APP.showMessage(err.message, 'error', 2000);
          } else {
            //generic error
            APP.showMessage(err.message, 'error', 2000);
          }
        }
        break;
      case 'shows':
        //custom scripts for the known for shows page
        hash = url.hash;
        if (!hash) {
          //send the user back to the home screen
          window.location('./index.html');
        }
        hash = hash.replaceAll('#', '');
        let [pid, nm] = hash.split('|');
        // console.log(`Get shows for ${pid} ${name}`);
        try {
          API.getShows(pid).then((resp) => {
            //resp is the Object from the JSON string returned by the API
            APP.buildCards(resp, nm);
          });
        } catch (err) {
          if (err instanceof NetworkError) {
            APP.showMessage(err.message, 'error', 2000);
          } else {
            //generic error
            APP.showMessage(err.message, 'error', 2000);
          }
        }
        break;
      default:
      //404 or empty
    }
  },
  buildTiles: (resp, keyword) => {
    APP.actors = resp.results.filter((a) => a.known_for_department == 'Acting');
    if (APP.actors.length > 0) {
      let html = APP.actors
        .map((act) => {
          let known = act.known_for[0];
          let title = known ? (known.title ? known.title : known.name) : '';
          let img = act.profile_path;
          let renderimg = img
            ? `${API.IMGBASE}/w300${img}`
            : `./img/default-user-avatar.png`;
          return `<li class="tile" data-id="${act.id}" data-name="${act.name}">
          <img class="avatar" src="${renderimg}" alt="${act.name}" />
          <div class="details">
            <h3>${act.name}</h3>
            <p>Known for: ${title}</p>
          </div>
          <span class="pop">${parseInt(act.popularity)}</span>
        </li>`;
        })
        .join('');
      document.querySelector('.tiles').innerHTML = html;
    } else {
      //no matches
      let msg = `<li class="tile" data-id="0" data-name=" ">
          <div class="details">
            <h3>No Matches for ${decodeURIComponent(keyword)}</h3>
          </div>
        </li>`;
      document.querySelector('.tiles').innerHTML = msg;
    }
    document.querySelector('.container h2 .highlight').textContent =
      decodeURIComponent(keyword);
  },
  buildCards: (resp, name) => {
    if (resp.cast.length > 0) {
      let html = resp.cast
        .map((show) => {
          let title = show.title ? show.title : show.name;
          let date = show.release_date
            ? show.release_date
            : show.first_air_date;
          let img = show.backdrop_path;
          img = img
            ? `${API.IMGBASE}/w300${img}`
            : './img/default-show-poster.png';
          return `<li class="card" data-id="${show.id}">
            <img class="poster" src="${img}" alt="${title} poster" />
            <h3 class="title">${title}</h3>
            <p class="char">${show.character}</p>
            <p class="release">${date}</p>
            <p class="desc">${show.overview}</p>
            </li>`;
        })
        .join('');
      document.querySelector('.cards').innerHTML = html;
    } else {
      //no matches message
      let msg = `<li class="card" data-id="0">
            <h3 class="title">No Matches for</h3>
            <p class="char">${decodeURIComponent(name)}</p>
            </li>`;
      document.querySelector('.cards').innerHTML = msg;
    }
    document.querySelector('.container h2 .highlight').textContent =
      decodeURIComponent(name);
  },
};

document.addEventListener('DOMContentLoaded', APP.init);
