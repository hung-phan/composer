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
  core.Element,
  core.InvokeExternalMethod,
  core.UpdateStateMethod,
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
    interfaceClass: core.Placeholder,
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
    interfaceClass: widgets.Layout,
    elementClass: components.LayoutComponent,
  },
  {
    interfaceClass: widgets.Clone,
    elementClass: components.CloneComponent,
  },
  {
    interfaceClass: widgets.Text,
    elementClass: components.TextComponent,
  },
  {
    interfaceClass: widgets.Link,
    elementClass: components.LinkComponent,
  },
  {
    interfaceClass: widgets.Image,
    elementClass: components.ImageComponent,
  },
  {
    interfaceClass: widgets.Button,
    elementClass: components.ButtonComponent,
  },
  {
    interfaceClass: widgets.Table,
    elementClass: components.TableComponent,
  },
  {
    interfaceClass: widgets.Input,
    dataContainerClass: widgets.InputState,
    elementClass: components.InputComponent,
  },
  {
    interfaceClass: widgets.Select,
    dataContainerClass: widgets.SelectState,
    elementClass: components.SelectComponent,
  },
  {
    interfaceClass: widgets.Form,
    elementClass: components.FormComponent,
  },
  {
    interfaceClass: widgets.FormField,
    elementClass: components.FormFieldComponent,
  },
  {
    interfaceClass: widgets.InfiniteScroll,
    dataContainerClass: widgets.InfiniteScrollState,
    elementClass: components.InfiniteScrollComponent,
  },
]);

export * from "./interfaceRegistry";
export * from "./elementRegistry";
