# Rick & Morty - IGST

### Intergalactic Government Search Tool

![Application Image](https://i.imgur.com/53IhKLA.png)

The Intergalactic Government Search Tool is a front-end tool to search and track any known character in the TV Series called Rick and Morty. This tool was sponsored by the [Galactic Federation](https://rickandmorty.fandom.com/wiki/Galactic_Federation) and the [Council of Ricks](https://rickandmorty.fandom.com/wiki/Council_of_Ricks).

[Link To Live Project](https://rick-and-morty-igst.vercel.app/)

## Project Goal

- Build an application with (HTML, CSS, Javascript, jQuery)
- Use AJAX to pull data from an API
- Use jQuery to manipulate the DOM
- Deploy the app to (Github Pages, Vercel, Netlify)

### Stretch Goals

- Make app mobile friendly/responsive
- Add some more advanced CSS (custom font-face, animations, etc)
- Use localStorage to track/save characters to your radar

## Technologies Used

- HTML, CSS, Javascript
- [jQuery](https://jquery.com/)
- [fontawesome](https://fontawesome.com/) (Icons)
- [Rick and Morty API](https://rickandmortyapi.com/documentation)
- Git (Version Control)
- [Vercel](https://vercel.com/) (Hosting)

## Installation Guide

To run this application locally or host it your self you can clone this repo to your local machine or fork this repo to deploy on Vercel or Netlify.

#### Run on local machine

- Clone this repo
  - (Option 1) Open in VS Code(Run with Live Server)
  - (Option 2) Open file path in your browser
  - (Option 3) Host on a local server (XAMP, WAMP)

### Deploy to Vercel

- Fork this repo
  - Login/Sign Up for Vercel with your GitHub account
  - Create a new project and select the forked repo
  - Import the repo to Vercel and click deploy.

### Technical Approach

Knowing that the data from the API may contain hundreds of characters Objects. I wanted to create a global Object to store the data from the API to reduce the number of API calls. We also pull all the residents from the same dimension as the currently selected character, so the API calls can stack up quick. I also wanted to use this global Object to store all of the jQuery references to the needed DOM Nodes, this will make manipulating the DOM easier. Another goal was to store your "favorite/most wanted" to your "radar". I achieved this without a backend by using local storage. I can store an Array of character objects, load them and render them to the DOM at a later time.
