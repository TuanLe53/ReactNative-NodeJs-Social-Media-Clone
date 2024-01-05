import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";

const ThemeContext = createContext();
export default ThemeContext;

export const ThemeProvider = ({ children }) => {
    let [theme, setTheme] = useState('light');

    const toggleTheme = (newTheme) => {
        setTheme(newTheme);
        AsyncStorage.setItem('theme', newTheme)
    };

    const contextData = {theme, toggleTheme};
    
    useEffect(() => {
        const getTheme = async () => {
            try {                
                const savedTheme = await AsyncStorage.getItem('theme');
                if (savedTheme) {
                    setTheme(savedTheme)
                }
            } catch (err) {
                console.log(err)
            }
        }

        getTheme()
    }, [])
    
    return (
        <ThemeContext.Provider value={contextData}>
            {children}
        </ThemeContext.Provider>
    )
}