module.exports = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
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
        'florssolid': ['florssolid', 'sans-serif']  
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
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "float-slow": {
          "0%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-15px) rotate(5deg)" },
          "100%": { transform: "translateY(0px) rotate(0deg)" },
        },
        "bounce-x": {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(3px)" },
        }
      },
      animation: {
        'gradient-x': 'gradient-x 10s ease infinite',
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float-slow 8s ease-in-out infinite",
        "bounce-x": "bounce-x 1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Consider setting this to true unless you have a reason to disable it
  },
}