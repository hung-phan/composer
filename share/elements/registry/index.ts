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

registerElements(
  [
    widgets.InputElementState,
    widgets.SelectElementState,
    widgets.InfiniteScrollElementState,
  ],
  [
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
      interfaceClass: widgets.DataElement,
      elementClass: components.DataElementComponent,
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
      elementClass: components.InputElementComponent,
    },
    {
      interfaceClass: widgets.SelectElement,
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
      elementClass: components.InfiniteScrollElementComponent,
    },
  ]
);

export * from "./interfaceRegistry";
export * from "./elementRegistry";
