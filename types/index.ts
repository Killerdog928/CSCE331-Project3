/**
 * Props for an SVG icon component.
 * @typedef {Object} IconSvgProps
 * @property {number} [size] - The size of the icon.
 */
import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};
