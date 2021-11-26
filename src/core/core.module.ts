import { FooterNavigationComponent } from "./footer/footer.component";
import { CoreIconComponent } from "./icon/icon.component";
import { LoginComponent } from "./login-component";
import { ToolbarComponent } from "./toolbar/toolbar-component";

export default class CoreModule {
  elements: object[] = [
    ToolbarComponent,
    LoginComponent,
    CoreIconComponent,
    FooterNavigationComponent,
  ];
}
