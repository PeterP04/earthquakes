# Earthquake Dashboard Map

## Overview

This project is an **interactive web map** that visualizes **earthquakes** from the past month using data from the **USGS Earthquake GeoJSON feed**. The map is built with **Mapbox GL JS** and displays earthquake points with clustering, magnitude-based sizing, and popups containing detailed earthquake information.

---

## Features

- **Interactive Map:** Pan and zoom to explore earthquakes worldwide.  
- **Clustering:** Groups nearby earthquakes for a cleaner view at lower zoom levels.  
- **Magnitude-Based Styling:** Circle size and color reflect earthquake magnitude.  
- **Informative Popups:** Clicking on an earthquake shows:
  - Location (`place`)
  - Magnitude (`mag`)
  - Time in **user’s local timezone**
  - Significance (`sig`)
  - Community Intensity Index (`cdi`)
  - Alert level (`alert`)
  - Link to the **USGS event page**
- **Automatic Updates:** The map pulls the latest earthquake data from USGS on page load (and optionally refreshes periodically).

---

## Technologies Used

- **Mapbox GL JS** – Interactive mapping library  
- **JavaScript** – Map logic and popups  
- **HTML & CSS** – Layout and styling  
- **USGS GeoJSON Feed** – Live earthquake data
