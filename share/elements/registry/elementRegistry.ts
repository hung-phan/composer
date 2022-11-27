import { ComponentClass, FunctionComponent } from "react";

import { Clazz } from "../../../../fuzzy/src/packages/webapp/@types";
import { DataContainer, Element } from "../../domain/interfaces";
import { DataContainerComponent } from "../components";
import { getInterfaceByName, registerInterfaces } from "./interfaceRegistry";

export interface EngineComponentProps {
  elementId: string;
  parentElementId?: string;
}

export interface FuzzyComponentPassedByProps<T> extends EngineComponentProps {
  parentProps: T;
}

export type ComponentType =
  | ComponentClass<EngineComponentProps>
  | FunctionComponent<EngineComponentProps>
  | ComponentClass<FuzzyComponentPassedByProps<unknown>>
  | FunctionComponent<FuzzyComponentPassedByProps<unknown>>;

const ELEMENT_REGISTRY = new Map<Clazz<Element>, ComponentType>();

export function registerElements(
  dataContainerInterfaces: Array<Clazz<DataContainer>>,
  data: Array<{
    interfaceClass: Clazz<Element>;
    elementClass: ComponentType;
  }>
): void {
  registerInterfaces(dataContainerInterfaces);

  for (const interfaceClass of dataContainerInterfaces) {
    ELEMENT_REGISTRY.set(interfaceClass, DataContainerComponent);
  }

  for (const { interfaceClass, elementClass } of data) {
    registerInterfaces([interfaceClass]);

    ELEMENT_REGISTRY.set(interfaceClass, elementClass);
  }
}

export function getComponentClass(element: Element): ComponentType {
  const Component: ComponentType | undefined = ELEMENT_REGISTRY.get(
    getInterfaceByName<never>(element.interfaceName)
  );

  if (Component === undefined) {
    throw new Error(`Cannot find component for: ${element.interfaceName}`);
  }

  return Component;
}
