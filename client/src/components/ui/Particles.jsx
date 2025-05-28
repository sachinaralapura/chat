import { memo, useEffect, useMemo, useState } from "react";
import { THEMES_WITH_COLORS } from "../../contants/themes";

import Particles, { initParticlesEngine } from "@tsparticles/react";
// import { loadAll } from "@tsparticles/all"; // if you are going to use `loadAll`, install the "@tsparticles/all" package too.
// import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from "@tsparticles/slim"; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.
import usePreference from "../../store/usePreference";
// import { loadBasic } from "@tsparticles/basic"; // if you are going to use `loadBasic`, install the "@tsparticles/basic" package too.

function Parti() {
    const [init, setInit] = useState(false);
    const theme = usePreference((state) => state.theme);
    // this should be run only once per application lifetime
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
            // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
            // starting from v2 you can add only the features you need reducing the bundle size
            //await loadAll(engine);
            //await loadFull(engine);
            await loadSlim(engine);
            //await loadBasic(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const particlesLoaded = (container) => {
        // console.log(container);
    };

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

    const options = useMemo(
        () => ({
            background: {
                color: {
                    value: colors.base,
                },
            },
            fpsLimit: 120,

            interactivity: {
                events: {
                    onClick: {
                        enable: true,
                        mode: "repulse",
                    },
                    onHover: {
                        enable: true,
                        mode: "grab",
                    },
                },
                modes: {
                    push: {
                        quantity: 4,
                    },
                    repulse: {
                        distance: 200,
                        duration: 0.4,
                    },
                    grab: {
                        distance: 200,
                        links: {
                            opacity: 0.5,
                        },
                    },
                },
            },

            particles: {
                color: {
                    value: colors.primary,
                },
                links: {
                    color: colors.secondary,
                    distance: 150,
                    enable: true,
                    opacity: 0.5,
                    width: 1,
                },
                move: {
                    direction: "none",
                    enable: true,
                    outModes: {
                        default: "bounce",
                    },
                    random: false,
                    speed: 4,
                    straight: false,
                },
                number: {
                    density: {
                        enable: true,
                    },
                    value: 100,
                },
                opacity: {
                    value: 0.5,
                },
                shape: {
                    type: "circle",
                },
                size: {
                    value: { min: 1, max: 5 },
                },
            },
            detectRetina: true,
        }),
        [theme]
    );

    if (init) {
        return (
            <Particles
                id="tsparticles"
                particlesLoaded={particlesLoaded}
                options={options}
                style={{
                    zIndex: -1, // Or a very low value like -99 to be behind everything
                }}
            />
        );
    }

    return <></>;
}
export default memo(Parti);
