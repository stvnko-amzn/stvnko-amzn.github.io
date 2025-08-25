/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amazon: {
          orange: '#FF9900',
          blue: '#232F3E',
          light: '#F3F3F3',
          dark: '#131A22'
        },
        cloudscape: {
          // Primary colors
          'blue-600': '#0972d3',
          'blue-500': '#2196f3',
          'blue-400': '#539fe5',
          'blue-300': '#85c5f7',
          'blue-200': '#b6e2ff',
          'blue-100': '#e7f5ff',
          'blue-50': '#f5fbff',
          
          // Success colors
          'green-600': '#037f0c',
          'green-500': '#0d8043',
          'green-400': '#4d9f5d',
          'green-300': '#7fbf7f',
          'green-200': '#b1dfb1',
          'green-100': '#e3f3e3',
          'green-50': '#f1f9f1',
          
          // Warning colors
          'orange-600': '#b7740f',
          'orange-500': '#d18b1c',
          'orange-400': '#e6a429',
          'orange-300': '#f0bd36',
          'orange-200': '#f9d643',
          'orange-100': '#fdf0c7',
          'orange-50': '#fef8e3',
          
          // Error colors
          'red-600': '#d91515',
          'red-500': '#e53e3e',
          'red-400': '#f56565',
          'red-300': '#fc8181',
          'red-200': '#feb2b2',
          'red-100': '#fed7d7',
          'red-50': '#fef5f5',
          
          // Neutral colors
          'gray-900': '#16191f',
          'gray-800': '#232f3e',
          'gray-700': '#414d5c',
          'gray-600': '#687078',
          'gray-500': '#879596',
          'gray-400': '#aab7b8',
          'gray-300': '#d5dbdb',
          'gray-200': '#e9eced',
          'gray-100': '#f2f3f3',
          'gray-50': '#fafafa',
          
          // Background colors
          'bg-primary': '#ffffff',
          'bg-secondary': '#fafafa',
          'bg-tertiary': '#f2f3f3'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
