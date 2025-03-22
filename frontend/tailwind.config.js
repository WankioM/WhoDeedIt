module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        'gradient-x': 'gradient-x 10s ease infinite',
      },
      colors: {
       
        'milk': '#F9F7F0',
        'lightstone': '#DBD2C2',
        'desertclay': '#B17457',
        'graphite': '#4A4947',
        'rustyred': '#d43545',
      },
      fontFamily: {
        'helvetica-regular': ['Helvetica-Regular', 'sans-serif'],
        'helvetica-light': ['Helvetica Light-Regular', 'sans-serif'],
        'florsoutline': ['florsoutline', 'sans-serif'], 
      'florssolid':['florssolid','sans-serif']  
       },
       keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-position': '0% 0%',
          },
          '50%': {
            'background-position': '100% 0%',
          },
        },
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
}