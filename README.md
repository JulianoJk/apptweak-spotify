# Apptweak Spotify

## Table of Contents

1. [Project Overview](#project-overview)
   - [Features](#features)
   - [Purpose](#purpose)
2. [Installation and Setup](#installation-and-setup)
3. [Usage](#usage)
4. [Challenges Faced](#challenges-faced)
5. [Dependencies](#dependencies)
   - [Frontend](#frontend)
6. [Notes](#notes)

---

## Project Overview

A responsive Spotify playlist manager built with ReactJS, Typescript, functional
components, Redux Toolkit, Redux-Saga, and Mantine UI.

### Features

- Create a new playlist with a name and optional description
- View your own playlists as well as saved/collaborative ones
- Search for tracks using the Spotify API
- Add search results to playlists you own or can edit
- Remove tracks from playlists (if owned/collaborated)
- Edit playlist name and description
- Sort tracks in playlists by name, album, or release date
- Light and dark theme toggle available at all times
- Fully responsive for desktop and mobile views
- Conditional rendering of edit and delete features based on playlist ownership/collaboration status

## Installation and Setup

```
yarn install
yarn start
```

> Note: You will need a valid Spotify developer token or authorization flow implemented.

## Usage

- Use the header to search for tracks globally.
- When tracks are selected from search results, a modal will appear allowing you to add them to playlists you own or collaborate on.
- Click a playlist to see its tracks and details.
  - If editable, options to remove tracks or edit metadata appear.
  - Tracks can be sorted using header controls.
  - Tracks already in the playlist will appear selected in the search modal.
- Create new playlists using the modal from the header.
- Toggle between dark and light themes.

---

## Challenges Faced

- **Redux and Redux-Saga**: While I had basic Redux experience, this was my first project using Redux-Saga. I explored generator functions, effects, and coordination with async flows.
- **Spotify API behavior**: Updates to playlist metadata (like name or description) aren't reflected immediately due to caching. I had to work around this with user notifications and delayed refreshes.
- **UI Framework Shift**: I initially started with MUI but switched to Mantine UI due to its open-source nature, better customization, and ease of use.

---

## Dependencies

Extra tools and libraries I used in this project:

- [Mantine UI](https://mantine.dev/)
- [Tabler Icons for React](https://tabler.io/docs/icons/react)

For a full list of frontend dependencies, refer to the `package.json` file.

---

## Notes

If anything doesn't work correctly, feel free to reach out. I'll fix it as soon as possible.

---

### Demo Video

- [Demo Loom video](https://www.loom.com/share/c60d9988bab44af8b1bfbd5eef86165f)
