project-root/
├── public/                   # Allmänna tillgångar som inte hanteras av Webpack
│   ├── index.html            # HTML-mallen
│   ├── favicon.ico           # Favicon för sidan
│   └── assets/               # Statisk media (bilder, ikoner, etc.)
│       ├── images/
│       ├── logos/
│       └── fonts/
├── src/                      # Huvudkällkod för projektet
│   ├── components/           # Återanvändbara UI-komponenter
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Calendar.jsx
│   │   └── SearchBar.jsx
│   ├── features/             # Modulär uppdelning för större funktioner
│   │   ├── auth/             # Hantering av autentisering
│   │   │   ├── Login.jsx
│   │   │   ├── LogoutButton.jsx
│   │   │   ├── Register.jsx
│   │   │   └── authSlice.js
│   │   ├── bookings/         # Hantering av bokningar
│   │   │   ├── BookingForm.jsx
│   │   │   ├── BookingList.jsx
│   │   │   └── bookingSlice.js
│   │   ├── venues/           # Hantering av venues
│   │   │   ├── VenueList.jsx
│   │   │   ├── VenueDetails.jsx
│   │   │   ├── VenueForm.jsx
│   │   │   ├── VenueSearch.jsx
│   │   │   └── venueSlice.js
│   │   └── profile/          # Användarprofil
│   │       ├── ProfileForm.jsx
│   │       └── profileSlice.js
│   ├── layouts/              # Layoutkomponenter
│   │   ├── AdminLayout.jsx
│   │   ├── MainLayout.jsx
│   │   └── AuthLayout.jsx
│   ├── pages/                # Sidkomponenter för routing
│   │   ├── Home.jsx
│   │   ├── Venues.jsx
│   │   ├── VenueDetails.jsx
│   │   ├── Profile.jsx
│   │   ├── Dashboard.jsx
│   │   └── NotFound.jsx
│   ├── services/             # API-tjänster och datalogik
│   │   ├── apiClient.js      # Grundläggande API-klient
│   │   ├── authService.js    # API-anrop för autentisering
│   │   ├── bookingService.js # API-anrop för bokningar
│   │   └── venueApi.js       # API-anrop för venues
│   ├── styles/               # Globala och modulära stilmallar
│   │   ├── variables.scss    # Anpassade SCSS-variabler för Bootstrap
│   │   ├── mixins.scss       # Återanvändbara SCSS-mixins
│   │   ├── global.scss       # Globala anpassningar av Bootstrap-stilar
│   │   └── components/       # Modulbaserade stilar
│   │       ├── Navbar.scss
│   │       ├── Footer.scss
│   │       └── SearchBar.scss
│   ├── utils/                # Hjälpfunktioner och valideringar
│   │   ├── formValidators.js # Formulärvalideringar
│   │   ├── dateHelpers.js    # Datumhantering
│   │   └── apiHelpers.js     # Generella API-hjälpfunktioner
│   ├── App.jsx               # Huvudapplikationskomponenten med routing
│   ├── index.js              # Startpunkt för React (renderar App.jsx)
│   ├── store.js              # Redux Store-konfiguration
│   └── routes.js             # Definiera applikationens routing
├── .env                      # Miljövariabler
├── .gitignore                # Ignorera specifika filer för Git
├── package.json              # Projektets beroenden och skript
├── README.md                 # Projektbeskrivning och dokumentation
└── bootstrap.custom.scss     # Bootstrap-konfiguration för anpassning

[text](dist) [text](node_modules) [text](public) [text](src) [text](src/components) [text](src/components/booking) [text](src/components/booking/bookingService.js) [text](src/components/BookingComponent.jsx) [text](src/components/CalendarComponent.jsx) [text](src/components/Footer.jsx) [text](src/components/Layout.jsx) [text](src/components/Navbar.jsx) [text](src/components/PrivateRoute.jsx) [text](src/components/SearchBar.jsx) [text](src/components/VenueManager.jsx) [text](src/features) [text](src/features/auth) [text](src/features/auth/AuthContainer.jsx) [text](src/features/auth/authService.js) [text](src/features/auth/authSlice.js) [text](src/features/auth/Login.jsx) [text](src/features/auth/LogoutButton.jsx) [text](src/features/auth/Register.jsx) [text](src/features/bookings) [text](src/features/bookings/bookingCard.jsx) [text](src/features/profile) [text](src/features/profile/avatarService.jsx) [text](src/features/profile/CreateVenueForm.jsx) [text](src/features/profile/ProfileDetails.jsx) [text](src/features/profile/profileSlice.js) [text](src/hooks) [text](src/hooks/useAuth.js) [text](src/hooks/useUserBookings.js) [text](src/pages) [text](src/pages/Auth.jsx) [text](src/pages/Home.jsx) [text](src/pages/NotFound.jsx) [text](src/pages/Profile.jsx) [text](src/pages/Venue.jsx) [text](src/styles) [text](src/styles/components) [text](src/styles/global.scss) [text](src/venues) [text](src/venues/VenueCard.jsx) [text](src/venues/VenueDetails.jsx) [text](src/App.jsx) [text](src/constants.js) [text](src/main.jsx) [text](src/store.js) [text](.eslintrc) [text](.gitignore) [text](eslint.config.js) [text](index.html) [text](package-lock.json) [text](package.json) [text](README.md) [text](vite.config.js)
