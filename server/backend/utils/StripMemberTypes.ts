/**
 * A utility type that strips the types of all members of a given type `T` and replaces them with `any`.
 *
 * @template T - The type whose member types are to be stripped.
 */
export type StripMemberTypes<T> = {
  [K in keyof T]: any;
};
