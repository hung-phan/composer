import { Element } from "../domain/interfaces";

export function getElementClassName(
  element: Element,
  className: string
): string {
  if (element.class) {
    return `${className} ${element.class}`;
  }
  return className;
}
