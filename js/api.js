import { NetworkError } from './errors.js';

const API = {
  IMGBASE: 'https://image.tmdb.org/t/p',
  BASEURL: 'https://api.themoviedb.org',
  ACTORS: '3/search/person', //find all the people matching keyword
  CREDITS: '3/person/{person_id}/combined_credits', // all movie and tv show credits for a person
  APIKEY: 'bf3074b58363ba76a390b891e97de01d', // Needs To Be Your Own Key
  DEFAULTSHOWIMG: './img/default-movie.jpg',
  DEFAULTPERSONIMG: './img/default-person.jpg',
  getPeople: (keyword) => {
    //find all the people matching the keyword
    //returns recordset or throws error
    let url = new URL(API.ACTORS, API.BASEURL);
    url.search = `?api_key=${API.APIKEY}&query=${keyword}`;
    return fetch(url).then((resp) => {
      if (!resp.ok) throw new NetworkError(resp.statusText, resp.status, url);
      return resp.json();
    });
  },
  getShows: (pid) => {
    //find all the shows for a person
    //returns recordset or throws error
    let endpoint = API.CREDITS.replace('{person_id}', pid);
    let url = new URL(endpoint, API.BASEURL);
    url.search = `?api_key=${API.APIKEY}`;
    // console.log(url);
    return fetch(url).then((resp) => {
      if (!resp.ok) throw new NetworkError(resp.statusText, resp.status, url);
      return resp.json();
    });
  },
};

export default API;
