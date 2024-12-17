"use client";

import { SwitchProps, useSwitch } from "@nextui-org/switch";
import { useIsSSR } from "@react-aria/ssr";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { FC } from "react";

import { SunFilledIcon, MoonFilledIcon } from "@/components/icons";

export interface ThemeSwitchProps {
  className?: string;
  classNames?: SwitchProps["classNames"];
}

/**
 * ThemeSwitch component allows users to toggle between light and dark themes.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.className - Additional class names for the component.
 * @param {Object} props.classNames - Object containing class names for different parts of the component.
 *
 * @returns {JSX.Element} The rendered ThemeSwitch component.
 *
 * @component
 *
 * @example
 * // Example usage:
 * <ThemeSwitch className="custom-class" classNames={{ base: "base-class", wrapper: "wrapper-class" }} />
 *
 * @remarks
 * This component uses the `useTheme` hook to get and set the current theme.
 * It also uses the `useIsSSR` hook to check if the component is being rendered on the server side.
 * The `useSwitch` hook is used to manage the switch state and provide necessary props for the switch elements.
 *
 * The component renders a visually hidden input element for accessibility purposes.
 * Depending on the current theme and SSR state, it conditionally renders either a SunFilledIcon or MoonFilledIcon.
 */
export const ThemeSwitch: FC<ThemeSwitchProps> = ({
  className,
  classNames,
}) => {
  const { theme, setTheme } = useTheme();
  const isSSR = useIsSSR();

  const onChange = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };

  const {
    Component,
    slots,
    isSelected,
    getBaseProps,
    getInputProps,
    getWrapperProps,
  } = useSwitch({
    isSelected: theme === "light" || isSSR,
    "aria-label": `Switch to ${theme === "light" || isSSR ? "dark" : "light"} mode`,
    onChange,
  });

  return (
    <Component
      {...getBaseProps({
        className: clsx(
          "px-px transition-opacity hover:opacity-80 cursor-pointer",
          className,
          classNames?.base,
        ),
      })}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <div
        {...getWrapperProps()}
        className={slots.wrapper({
          class: clsx(
            [
              "w-auto h-auto",
              "bg-transparent",
              "rounded-lg",
              "flex items-center justify-center",
              "group-data-[selected=true]:bg-transparent",
              "!text-default-500",
              "pt-px",
              "px-0",
              "mx-0",
            ],
            classNames?.wrapper,
          ),
        })}
      >
        {!isSelected || isSSR ? (
          <SunFilledIcon size={22} />
        ) : (
          <MoonFilledIcon size={22} />
        )}
      </div>
    </Component>
  );
};
