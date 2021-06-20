import { LoginComponent } from "./login-component";
import { ToolbarComponent } from "./toolbar/toolbar-component";

export default class CoreModule {
  elements: object[] = [ToolbarComponent, LoginComponent];
}
