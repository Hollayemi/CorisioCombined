/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        inputBg: '#F2F3F9',
        inputBorder: '#C5C5C5',
        inputText: '#424242',
        labelText: '#7C7C7C',
        yellow: {
          50: '#FEF3C7',
        },
      }
    }
  },
  plugins: [],
}