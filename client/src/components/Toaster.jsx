import { Toaster } from "react-hot-toast";
import { THEMES_WITH_COLORS } from "../contants/themes";
import { useMemo } from "react";
import { usePreferenceStore } from "../store";

function MyToaster() {
    const theme = usePreferenceStore((state) => state.theme);

    const colors = useMemo(
        () => ({
            base: THEMES_WITH_COLORS.find((item) => item.name === theme)?.colors.base,
            primary: THEMES_WITH_COLORS.find((item) => item.name === theme)?.colors.primary,
            secondary: THEMES_WITH_COLORS.find((item) => item.name === theme)?.colors.secondary,
            accent: THEMES_WITH_COLORS.find((item) => item.name === theme)?.colors.accent,
            neutral: THEMES_WITH_COLORS.find((item) => item.name === theme)?.colors.neutral,
        }),
        [theme]
    );

    return (
        <>
            <Toaster
                position="bottom-right"
                toastOptions={{
                    duration: 1000,
                    style: { backgroundColor: colors.primary, color: colors.base },
                }}
                reverseOrder={true}
            />
        </>
    );
}

export default MyToaster;
