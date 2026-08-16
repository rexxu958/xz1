module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#ef4444',
        accent: '#f97316',
        bg: '#07090d',
        surface: '#111827',
        skull: '#f5e7dc',
        ember: '#ff5a36'
      },
      boxShadow: {
        skull: '0 0 0 1px rgba(255,255,255,0.08), 0 25px 80px rgba(239,68,68,0.25)'
      }
    }
  },
  plugins: []
}
