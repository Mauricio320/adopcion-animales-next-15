/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
      extend: {
        colors: {
          'custom-teal': '#7BC9C8',
        },
        fontFamily: {
          nunito: ['Nunito', 'sans-serif'],
          inter: ['Inter', 'sans-serif'],
          poppins: ['Poppins', 'sans-serif'],
          quicksand: ['Quicksand', 'sans-serif'],
          'open-sans': ['Open Sans', 'sans-serif'],
        },
      },
  },
  plugins: [],
}
