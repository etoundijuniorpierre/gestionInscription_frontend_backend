/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", // For Vite, also scan index.html directly
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1A3B66", // A custom dark blue for buttons, text, etc.
        secondary: "#E0E7FF", // A lighter blue for accents or backgrounds
        accent: "#F0F3F7", // A very light grey for subtle backgrounds
        darkgray: "#333333",
        lightgray: "#A0AEC0",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Assuming 'Inter' or a similar modern sans-serif font
        serif: ['Merriweather', 'serif'], // Example serif font if needed
      },
      height: {
        'hero-lg': '600px', // Custom height for hero section on large screens
      },
    },
  },
  plugins: [],
}