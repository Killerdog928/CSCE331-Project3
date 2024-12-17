import { tv } from "tailwind-variants";

/**
 * Title component styles configuration using `tv` function.
 *
 * @constant
 * @type {object}
 *
 * @property {string} base - Base styles for the title component.
 * @property {object} variants - Variants for the title component.
 * @property {object} variants.color - Color variants for the title component.
 * @property {string} variants.color.violet - Violet gradient color.
 * @property {string} variants.color.yellow - Yellow gradient color.
 * @property {string} variants.color.blue - Blue gradient color.
 * @property {string} variants.color.cyan - Cyan gradient color.
 * @property {string} variants.color.green - Green gradient color.
 * @property {string} variants.color.pink - Pink gradient color.
 * @property {string} variants.color.foreground - Foreground gradient color for dark mode.
 * @property {object} variants.size - Size variants for the title component.
 * @property {string} variants.size.sm - Small size variant.
 * @property {string} variants.size.md - Medium size variant.
 * @property {string} variants.size.lg - Large size variant.
 * @property {object} variants.fullWidth - Full width variant for the title component.
 * @property {string} variants.fullWidth.true - Full width style.
 * @property {object} defaultVariants - Default variants for the title component.
 * @property {string} defaultVariants.size - Default size variant.
 * @property {Array<object>} compoundVariants - Compound variants for the title component.
 * @property {Array<string>} compoundVariants.color - Colors that apply the compound variant.
 * @property {string} compoundVariants.class - Class to apply for the compound variant.
 */
export const title = tv({
  base: "tracking-tight inline font-semibold",
  variants: {
    color: {
      violet: "from-[#FF1CF7] to-[#b249f8]",
      yellow: "from-[#FF705B] to-[#FFB457]",
      blue: "from-[#5EA2EF] to-[#0072F5]",
      cyan: "from-[#00b7fa] to-[#01cfea]",
      green: "from-[#6FEE8D] to-[#17c964]",
      pink: "from-[#FF72E1] to-[#F54C7A]",
      foreground: "dark:from-[#FFFFFF] dark:to-[#4B4B4B]",
    },
    size: {
      sm: "text-3xl lg:text-4xl",
      md: "text-[2.3rem] lg:text-5xl leading-9",
      lg: "text-4xl lg:text-6xl",
    },
    fullWidth: {
      true: "w-full block",
    },
  },
  defaultVariants: {
    size: "md",
  },
  compoundVariants: [
    {
      color: [
        "violet",
        "yellow",
        "blue",
        "cyan",
        "green",
        "pink",
        "foreground",
      ],
      class: "bg-clip-text text-transparent bg-gradient-to-b",
    },
  ],
});

export const subtitle = tv({
  base: "w-full md:w-1/2 my-2 text-lg lg:text-xl text-default-600 block max-w-full",
  variants: {
    fullWidth: {
      true: "!w-full",
    },
  },
  defaultVariants: {
    fullWidth: true,
  },
});
