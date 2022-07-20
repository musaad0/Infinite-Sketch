// /** @type {import('tailwindcss').Config} */
const { neutral } = require('tailwindcss/colors')


module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    colors: {
      'primary': {
        DEFAULT: '#1e40af',
        dark: '#1e3a8a',
      },
      neutral,
      'bgColor':neutral[800],
      'secondary':neutral[200],
    },
     fontFamily:{
      sans: ['Source Sans Pro','sans-serif'],
    },
  },
  plugins: [],
}
