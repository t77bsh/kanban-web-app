// import React, { createContext, useContext, useState } from "react";

// const ThemeContext = createContext({
//   dayMode: true,
//   toggleDayMode: () => {},
// });

// // Props config
// interface Props {
//   children: React.ReactNode;
// }

// export default function ThemeProvider(props: Props) {
//   const [dayMode, setDayMode] = useState(true);

//   const toggleDayMode = () => {
//     setDayMode(prevDayMode => !prevDayMode);
//   };

//   return (
//     <ThemeContext.Provider value={{ dayMode, toggleDayMode }}>
//         {props.children} 
//     </ThemeContext.Provider>
//   );
// }

// export function useTheme() {
//   return useContext(ThemeContext);
// };





import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext<{
  dayMode: boolean;
  toggleDayMode: () => void;
}>({
  dayMode: JSON.parse(localStorage.getItem('dayMode') || "true"),
  toggleDayMode: () => {},
});

// Props config
interface Props {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: Props) {
  const [dayMode, setDayMode] = useState<boolean>(
    JSON.parse(localStorage.getItem('dayMode') || "true")
  );

  const toggleDayMode = () => {
    setDayMode((prevDayMode) => {
      const newDayMode = !prevDayMode;
      localStorage.setItem('dayMode', JSON.stringify(newDayMode));
      return newDayMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ dayMode, toggleDayMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
};

