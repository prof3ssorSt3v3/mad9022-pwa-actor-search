import { FormError } from './errors.js';

const NAV = {
  actorPage: 'actors.html',
  knownPage: 'shows.html',
  goActors: () => {
    //load the actors results page with #keyword in URL
    //get the value from the search form text input
    let search = document.getElementById('txtSearch');
    let keyword = search.value.trim();
    if (keyword) {
      //if already on the actorPage this will not reload
      let curr = window.location.href;
      window.location = `${NAV.actorPage}#${keyword}`;
      console.log(curr);
      console.log(curr.indexOf(NAV.actorPage));

      if (curr.indexOf(NAV.actorPage) > -1) {
        console.log('reload');
        location.reload();
      }
    } else {
      //tell the user to complete the form
      throw new FormError('You must provide a search keyword.', search);
    }
  },
  goKnown: (pid, name) => {
    //load the known for page with #actor_id in URL
    //get the person id from the li.tile data-id
    if (pid) {
      let curr = window.location.href;
      window.location = `${NAV.knownPage}#${pid}|${name}`;
      if (curr.indexOf(NAV.knownPage) > -1) {
        console.log('reload');
        location.reload();
      }
    } else {
      //missing the pid...
      throw new Error('WTF? Where is the person id?');
    }
  },
};

export default NAV;
