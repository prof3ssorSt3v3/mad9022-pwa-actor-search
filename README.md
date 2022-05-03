# Acting Out PWA

## Starter App

This is a functional web app that uses the TMDB API to do searches for Actors and display their most known shows and movies. It contains all the needed CSS and JS for the app to work while online.

The Starter version is hosted on Netlify here: [https://sample-actor-search.netlify.app/](https://sample-actor-search.netlify.app/). The code is available through this Repo [mad9022-pwa-actor-search](https://github.com/prof3ssorSt3v3/mad9022-pwa-actor-search).

## Objective

The Goal of this project is to convert this web app into a Progressive Web App. It needs to function while offline. It needs a service worker that manages all the requests that come from the web app. The service worker will save all the starter files in a static Cache.

All the functionality in the starter version of the app should work when the user is offline. If the user does a search for an actor or a list of shows for an actor and the app is offline then check the cache and return the results if they are there. If the user is offline and a new search is attempted, send them to a 404 page and display information about what happened. If they are online or offline and they try to navigate to a page that does not exist, then they should be sent to the 404 page and information about what happened gets displayed.

As the user runs searches in the web app, the resulting JSON and images will be saved in different Caches by the service worker.

**Cache List**

- **App Cache** - for all the starter files in the app when it loads
- **Dynamic Image Cache** - for any images fetched from TMDB API
- **Dynamic Data Cache** - for any JSON files fetched from TMDB API

So, if the browser is offline the service worker can pull files from the Caches so that the app will still work, as long as the user repeats previous searches.

If static type files, like CSS or fonts, are not in the cache then they can be saved in the App Cache.

If the user requests a webpage that does not exist or runs a search that was not previously completed then the service worker will direct them to a special 404 page that will tell the user that they are currently offline but provide a list of possible searches.

## Additional Files Needed

To make this work you will need to add a variety of files.

- The favicon and the other mobile icons that you can create [here](https://realfavicongenerator.net/).
- Create your own icon for your app that you will use with the favicon generator.
- A web manifest file.
- A service worker.
- A 404 page.

## Additional Tags in the HTML

In all your HTML files you will need to add the missing `link` and `meta` tags in the `head`. See the course website section 5.1 for details.

You will also have to add the links to the service worker and the web manifest to every page.

## Lighthouse Test

In the Chrome Dev Tools your site will have to pass the Lighthouse PWA test.

## References

See the course website content for weeks 4 - 6 for more information on all the needed code.

## Hosting and Submission

You will need to create a Private Github repo and invite Steve to it.

You will also need to create a Netlify site where your app will run. The Netlify site will be linked to your github repo. Each time an update is pushed to the Github repo, the Netlify site will be updated.
