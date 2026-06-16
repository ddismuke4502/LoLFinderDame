# LoLFinder

LoLFinder is a React-based League of Legends champion discovery app built to help users browse champions, filter by role and difficulty, view champion details, and explore related champion recommendations.

The project uses Riot’s Data Dragon API for champion metadata, icons, splash art, and ability data. It also links to Khada’s community 3D model viewer so users can inspect champion models externally.

## Live Demo

[Vercel Deployment](https://lo-l-finder-dame.vercel.app)

## Project Purpose

This project was built as a frontend portfolio application to demonstrate practical React development, API integration, client-side routing, responsive UI behavior, and polished visual design.

LoLFinder focuses on turning a familiar gaming interest into a functional, interactive web application with real-world frontend patterns.

## Features

- Browse League of Legends champions
- Filter champions by role
- Filter champions by difficulty
- Search champion names
- Toggle between square champion icons and vertical champion artwork
- View individual champion detail pages
- Display champion lore, stats, passive, and abilities
- Show recommended champions based on shared tags and difficulty proximity
- Link to external 3D champion models through Khada’s model viewer
- Responsive navigation with a mobile hamburger menu
- Skeleton loading states for a smoother user experience
- Custom LoLFinder branding, favicon, and visual theme

## Tech Stack

- React
- JavaScript
- React Router
- HTML
- CSS
- Riot Data Dragon API
- GitHub Pages
- Vercel

## API / Data Sources

### Riot Data Dragon

LoLFinder uses Riot’s Data Dragon API to retrieve champion data, including:

- Champion names
- Champion titles
- Champion roles/tags
- Champion difficulty values
- Champion icons
- Splash/loading artwork
- Passive and ability information

### Khada / Model Viewer

Champion detail pages include external links to Khada’s community model viewer so users can view 3D champion models.

## What I Built

This app includes several frontend patterns that are important in production-style React work:

- Client-side routing with React Router
- Dynamic route-based detail pages
- Data fetching from an external public API
- Reusable UI components
- Component-level state management
- Search and filtering logic
- Loading and skeleton UI states
- Responsive layout behavior
- Mobile navigation
- Custom visual theme and branding
- Deployment-ready build configuration

## Key Components

```txt
src/
  components/
    ChampionCard.jsx
    FilterBar.jsx
    NavBar.jsx
    RecommendedRow.jsx
    ModalShell.jsx
    About.jsx
    Contact.jsx

  pages/
    Home.jsx
    Champions.jsx
    ChampionDetails.jsx

  services/
    ddragon.js

  styles/
    graffiti.css
