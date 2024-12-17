import { Image } from "@nextui-org/react";
import { InferAttributes } from "sequelize";

import { Thumbnail } from "@/db";

/**
 * DbThumbnail component renders an image with the provided source and additional properties.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {InferAttributes<Thumbnail>} props.src - The source attributes for the thumbnail image.
 * @param {string} props.src.alt - The alt text for the image.
 * @param {string} props.src.src - The source URL for the image.
 * @returns {JSX.Element} The rendered Image component.
 */
export const DbThumbnail = ({
  src,
  ...props
}: {
  src: InferAttributes<Thumbnail>;
}) => <Image alt={src.alt} src={src.src} {...props} />;
