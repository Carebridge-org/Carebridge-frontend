// src/ThemeContext.js
import {
    createContext,
    useState,
    useEffect
}

from "react";

export const ThemeContext=createContext();

export const ThemeProvider=({
    children

})=> {
    const [theme,
    setTheme]=useState("dark"); // default dark

    useEffect(()=> {
            document.body.className=theme==="dark" ? "bg-dark text-light" : "bg-light text-dark";
        }

        , [theme]);

    const toggleTheme=()=> {
        setTheme((prev)=> (prev==="dark" ? "light" : "dark"));
    }

    ;

    return (<ThemeContext.Provider value= {
                {
                theme, toggleTheme
            }
        }

        > {
            children
        }

        </ThemeContext.Provider>);
}

;