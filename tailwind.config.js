/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
 safelist: [
    'bg-red-500',
    'bg-green-500',
  ],
theme: {
    extend: {
      colors: {
        primary: "#16a34a",      // money green
        secondary: "#15803d",   // darker green
        background: "#f8fafc",  // clean light bg
        card: "#ffffff",
        text: "#0f172a",
        muted: "#64748b",
        danger: "#dc2626",      // utang overdue
        warning: "#f59e0b",
        success: "#22c55e",
        border: "#e2e8f0",
      },
      fontFamily: {
        regular: ["Poppins_400Regular"],
        semibold: ["Poppins_600SemiBold"],
        bold: ["Poppins_700Bold"],
        extrabold: ["Poppins_800ExtraBold"],
      },
      borderRadius: {
        xl: "16px",
        "2xl": "24px",
      },
    },
  },

  plugins: [],
}