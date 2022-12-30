import * as core from "../../domain/interfaces/core";
import * as components from "../components";
import * as widgets from "../components/widgets";
import * as templateComponents from "../templateComponents";
import * as templates from "../templateComponents/templates";
import { registerElements } from "./elementRegistry";
import { registerInterfaces } from "./interfaceRegistry";

registerInterfaces([
  core.Method,
  core.Node,
  core.InvokeExternalMethod,
  core.Element,
  core.RenderElementMethod,
  core.BatchRenderElementMethod,
  core.UpdateElementMethod,
  core.UpdateInListElementMethod,
  core.HttpMethod,
  core.NavigateMethod,
  core.Response,
]);

registerElements([
  {
    interfaceClass: core.DataContainer,
    elementClass: components.DataContainerComponent,
  },
  {
    interfaceClass: core.PlaceholderElement,
    elementClass: components.PlaceholderComponent,
  },
  {
    interfaceClass: templates.DefaultTemplate,
    elementClass: templateComponents.DefaultTemplateElement,
  },
  {
    interfaceClass: templates.PeriodicTemplate,
    elementClass: templateComponents.PeriodicTemplateElement,
  },
  {
    interfaceClass: widgets.LayoutElement,
    elementClass: components.LayoutComponent,
  },
  {
    interfaceClass: widgets.CloneElement,
    elementClass: components.CloneComponent,
  },
  {
    interfaceClass: widgets.TextElement,
    elementClass: components.TextComponent,
  },
  {
    interfaceClass: widgets.LinkElement,
    elementClass: components.LinkComponent,
  },
  {
    interfaceClass: widgets.ImageElement,
    elementClass: components.ImageComponent,
  },
  {
    interfaceClass: widgets.ButtonElement,
    elementClass: components.ButtonComponent,
  },
  {
    interfaceClass: widgets.TableElement,
    elementClass: components.TableComponent,
  },
  {
    interfaceClass: widgets.InputElement,
    dataContainerClass: widgets.InputElementState,
    elementClass: components.InputComponent,
  },
  {
    interfaceClass: widgets.SelectElement,
    dataContainerClass: widgets.SelectElementState,
    elementClass: components.SelectComponent,
  },
  {
    interfaceClass: widgets.FormElement,
    elementClass: components.FormComponent,
  },
  {
    interfaceClass: widgets.FormFieldElement,
    elementClass: components.FormFieldComponent,
  },
  {
    interfaceClass: widgets.InfiniteScrollElement,
    dataContainerClass: widgets.InfiniteScrollElementState,
    elementClass: components.InfiniteScrollComponent,
  },
]);

export * from "./interfaceRegistry";
export * from "./elementRegistry";
