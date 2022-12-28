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
    elementClass: components.PlaceholderElementComponent,
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
    elementClass: components.LayoutElementComponent,
  },
  {
    interfaceClass: widgets.CloneElement,
    elementClass: components.CloneElementComponent,
  },
  {
    interfaceClass: widgets.TextElement,
    elementClass: components.TextElementComponent,
  },
  {
    interfaceClass: widgets.LinkElement,
    elementClass: components.LinkElementComponent,
  },
  {
    interfaceClass: widgets.ImageElement,
    elementClass: components.ImageElementComponent,
  },
  {
    interfaceClass: widgets.ButtonElement,
    elementClass: components.ButtonElementComponent,
  },
  {
    interfaceClass: widgets.TableElement,
    elementClass: components.TableElementComponent,
  },
  {
    interfaceClass: widgets.InputElement,
    dataContainerClass: widgets.InputElementState,
    elementClass: components.InputElementComponent,
  },
  {
    interfaceClass: widgets.SelectElement,
    dataContainerClass: widgets.SelectElementState,
    elementClass: components.SelectElementComponent,
  },
  {
    interfaceClass: widgets.FormElement,
    elementClass: components.FormElementComponent,
  },
  {
    interfaceClass: widgets.FormFieldElement,
    elementClass: components.FormFieldElementComponent,
  },
  {
    interfaceClass: widgets.InfiniteScrollElement,
    dataContainerClass: widgets.InfiniteScrollElementState,
    elementClass: components.InfiniteScrollElementComponent,
  },
]);

export * from "./interfaceRegistry";
export * from "./elementRegistry";
