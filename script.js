const searchBtn = document.querySelector("#search-btn");
const searchInput = document.querySelector("#search-input");

const mapContainer = document.querySelector("#map-container");
const mapElement = document.querySelector("#map");
const fallbackImg = document.querySelector("#fallback-img");
let mapUrl = ``;

searchBtn.addEventListener("click", () => {
  const place = searchInput.value.trim();
  if (place) {
    fetchPlaceDetails(place);
    fetchPhotos(place);
  }
});

const fetchPlaceDetails = (place) => {
  mapElement.innerHTML = "";
  fallbackImg.style.display = "none";
  fetch(
    `https://nominatim.openstreetmap.org/search?q=${place}&format=json&limit=1`
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.length > 0) {
        const placeDetails = data[0];
        displayPlaceDetails(placeDetails);
        loadMap([placeDetails.lat, placeDetails.lon]);
      } else {
        displayFallbackImage();
      }
    })
    .catch((error) => {
      displayFallbackImage();
    });
};

const displayPlaceDetails = (details) => {
  const placeDetailsDiv = document.querySelector("#place-details");
  placeDetailsDiv.innerHTML = `
  <h2>${details.display_name}</h2>
  <p>Latitude: ${details.lat}</p>
  <p>Longitude: ${details.lon}</p>
  `;
};

const loadMap = (coordinates) => {
  const map = L.map("map").setView(coordinates, 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href = "https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  L.marker(coordinates).addTo(map);
};
const fetchPhotos = (place) => {
  const apiKey = "YOUR_API_KEY";
  const url = `https://api.unsplash.com/search/photos?query=${place}&client_id=${apiKey}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const photosContainer = document.getElementById("photos");

      photosContainer.innerHTML = "";
      data.results.forEach((photo) => {
        const photoElement = document.createElement("div");
        photoElement.className = "photo";
        photoElement.innerHTML = `<img src = "${photo.urls.small}" alt = "${photo.alt_description}" />`;
        photosContainer.appendChild(photoElement);
      });
    })
    .catch((error) => console.log("error fetching photos:", error));
};

const displayFallbackImage = () => {
  mapElement.innerHTML = "";
  fallbackImg.style.display = "block";
};
