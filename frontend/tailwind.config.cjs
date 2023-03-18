/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        grey: "#2B2C37",
        "light-grey": "#828FA3",
        light: "#EFEFF9",
        night: "#20212C",
        day: "#f2f2fa",
        "day-btn": "#D8D7F1",
        "night-btn": "#39395B",
        purple: "#635FC7",
        // "purple": "rgb(76, 29, 149)",
        "light-purple": "#A8A4FF",
        red: "#EA5555",
        "light-red": "#F9D6D6",
      },
      textColor: {
        dark: "#000112",
        grey: "#828FA3",
        red: "#EA5555",
      },
      borderColor: {
        night: "#3E3F4E",
        day: "#E4EBFA",
      },
      backgroundColor: {
        "light-blue": "#EAF0FA",
        "light-purple": "#A8A4FF",
        "lighter-purple": "#EFEFF9",
        red: "#EA5555",
        "hollow-grey": "#d5cfcb83",
      },
      boxShadow: {
        "inner-md": "inset 5px 5px 38px -24px rgba(255,255,255,1)",
      },
      backgroundImage: {
        "purple-gradient":
          "linear-gradient(to right, rgb(107, 33, 168), rgb(76, 29, 149), rgb(107, 33, 168))",
      },
      minHeight: {
        20: "5rem",
      },
      maxHeight: {

        20: "5rem",
        35: "8.75rem",
      },
      minWidth: {
        8: "2rem",
      
        16: "4rem",
        20: "5rem",
        64: "16rem",
      },
      maxWidth: {
       125: "31.25rem",
      },
    },
  },
  plugins: [],
};

//background: rgb(53,50,103);
// background: linear-gradient(90deg, rgba(53,50,103,1) 0%, rgba(99,95,199,1) 50%, rgba(53,50,103,1) 100%);
// bg-gradient-to-r from-purple-800 via-violet-900 to-purple-800

// linear-gradient(to right, rgb(107, 33, 168), rgb(76, 29, 149), rgb(107, 33, 168))

// bg-gradient-to-r from-purple-800 via-violet-900 to-purple-800
