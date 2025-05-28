import { create } from "zustand";

// Function to update the data-theme attribute on the html element
const applyThemeToHtml = (theme) => {
    const html = document.documentElement;
    html.setAttribute('data-theme', theme);

};

const storeTheme = (theme) => {
    localStorage.setItem('theme', theme);
};

const getTheme = () => {
    const storedTheme = localStorage.getItem('theme');
    return storedTheme || 'dark';
};

const usePreferenceStore = create((set) => ({
    particle: true,
    theme: getTheme(),
    toggleParticle: () => {
        set((state) => {
            return { particle: !state.particle }
        })
    },

    setTheme: (newTheme) => {
        set({ theme: newTheme })
        storeTheme(newTheme);
        applyThemeToHtml(newTheme);
    },

    initTheme: () => {
        const theme = getTheme();
        applyThemeToHtml(theme);
    }

}));

export default usePreferenceStore;
