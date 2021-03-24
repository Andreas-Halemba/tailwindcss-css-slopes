const plugin = require("tailwindcss/plugin");

module.exports = plugin.withOptions(function (options) {
    return function ({ e, addUtilities, theme }) {
        const colors = theme("colors");
        const fillFollowing = options.fillFollowing ?? false
        const slopeHeight = options.slopeHeight
            ? theme(`height.${options.slopeHeight}`)
            : theme("height.10");
        const slopeSpacing = options.slopeHeight
            ? theme(`spacing.${options.slopeHeight}`)
            : theme("spacing.10");
        const slopeRules = {
            borderStyle: "solid",
            content: '""',
            height: slopeHeight,
            left: 0,
            position: "absolute",
            width: theme("width.screen"),
            zIndex: 10,
        };
        let classes = [
            {
                [`[class*="slope-tr-"], [class*="slope-tl-"]`]: {
                    marginTop: slopeSpacing,
                    "&::before": {
                        top: `-${slopeSpacing}`,
                        ...slopeRules,
                    },
                },
                [`[class*="slope-br-"], [class*="slope-bl-"]`]: {
                    marginBlockEnd: slopeSpacing,
                    "&::after": {
                        ...slopeRules,
                    },
                },
                [`[class*="slope-"]`]: {
                    position: "sticky",
                    "&:first-of-type": {
                        marginTop: 0,
                        "&::before": {
                            top: 0,
                        },
                    },
                    "&:last-of-type": {
                        // marginBottom: slopeSpacing,
                    },
                },
                [`[class*="slope-t"]`]: {
                    "&:first-of-type": {
                        paddingTop: slopeSpacing,
                    },
                },
            },
        ];
        const slopeClasses = Object.keys(colors).reduce((acc, colorName) => {
            if (typeof colors[colorName] == "object") {
                for (const [colorNumber, colorValue] of Object.entries(
                    colors[colorName]
                )) {
                    if (colorName !== "transparent") {
                        let colorString = "";
                        if (colorNumber === "default") {
                            colorString = `${colorName}`;
                        } else {
                            colorString = `${colorName}-${colorNumber}`;
                        }
                        classes.push({
                            [`.slope-tr-${colorString}, 
                                .slope-tl-${colorString},
                                .slope-br-${colorString},
                                .slope-bl-${colorString}`]: {
                                "& > div": {
                                    backgroundColor: colorValue,
                                },
                            },
                            [`.slope-tr-${colorString}, 
                                .slope-tl-${colorString}`]: {
                                [`& + section:not([class*="slope-bl-"]), 
                                    & + section:not([class*="slope-bl-"])`]: {
                                    backgroundColor: colorValue,
                                },
                            },
                            [`.slope-bl-${colorString}`]: {
                                borderColor: colorValue,
                                [`& + section:not([class*="slope-tr-"])`]: {
                                    "::before": {
                                        ...slopeRules,
                                    },
                                },
                            },
                            [`.slope-tr-${colorString}::before`]: {
                                borderRightWidth: theme("width.screen"),
                                borderTopWidth: slopeHeight,
                                borderRightColor: colorValue,
                                clipPath: "polygon(100% 0, 0% 100%, 100% 100%)",
                            },
                            [`.slope-tl-${colorString}::before`]: {
                                borderLeftWidth: theme("width.screen"),
                                borderTopWidth: slopeHeight,
                                borderLeftColor: colorValue,
                                clipPath: "polygon(0 0%, 0% 100%, 100% 100%)",
                            },
                            [`.slope-br-${colorString}::after`]: {
                                borderRightWidth: theme("width.screen"),
                                borderBottomWidth: slopeHeight,
                                borderRightColor: colorValue,
                                clipPath: "polygon(100% 0, 0 0, 100% 100%)",
                            },
                            [`.slope-bl-${colorString}::after`]: {
                                borderLeftWidth: theme("width.screen"),
                                borderBottomWidth: slopeHeight,
                                borderLeftColor: colorValue,
                                clipPath: "polygon(100% 0, 0 0, 0 100%)",
                            },
                        });
                        if (fillFollowing) {
                            classes.push({
                                [`:where([class*="slope-bl"] + section[class="slope-br-${colorString}"])::before,
                                :where([class*="slope-bl"] + section[class="slope-bl-${colorString}"])::before`]: {
                                    borderColor: `transparent ${colorValue}`,
                                    borderRightWidth: theme("width.screen"),
                                    top: `-${slopeSpacing}`,
                                    borderTopWidth: slopeHeight,
                                    ...slopeRules,
                                },
                                [`:where([class*="slope-br"] + section[class="slope-bl-${colorString}"])::before,
                                :where([class*="slope-br"] + section[class="slope-br-${colorString}"])::before`]: {
                                    borderColor: `transparent ${colorValue}`,
                                    borderLeftWidth: theme("width.screen"),
                                    borderTopWidth: slopeHeight,
                                    top: `-${slopeSpacing}`,
                                    ...slopeRules,
                                },
                                [`:where(.slope-tr-${colorString} + section[class*="slope-tl"])::before,
                                :where(.slope-tl-${colorString} + section[class*="slope-tr"])::before`]: {
                                    borderTopColor: colorValue,
                                    clipPath: "none !important",
                                },
                            });
                        }
                    }
                }
            }
            return classes;
        });
        addUtilities(slopeClasses);
    };
});
