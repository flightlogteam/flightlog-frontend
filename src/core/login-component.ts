import { html, LitElement, TemplateResult } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { authenticationService } from "../shared/authentication/state";

@customElement("flightlog-login")
export class LoginComponent extends LitElement {
  @property({ attribute: false })
  username = "";

  @property({ attribute: false })
  password = "";

  @query("#username")
  usernameInput: HTMLInputElement;

  @query("#password")
  passwordInput: HTMLInputElement;

  render(): TemplateResult {
    return html`
      <input
        @input="${this.userNameChanged}"
        id="username"
        .value="${this.username}"
      />
      <input
        @input="${this.passwordChanged}"
        id="password"
        type="password"
        .value="${this.password}"
      />
      <button @click="${this.submit}" ?disabled="${this.submitDisabled}">
        Login ${this.username}
      </button>
    `;
  }

  submit(): void {
    authenticationService.login(this.username, this.password);
  }

  userNameChanged(): void {
    this.username = this.usernameInput?.value || "";
  }

  passwordChanged(): void {
    this.password = this.passwordInput?.value || "";
  }

  @property({ attribute: false })
  get submitDisabled(): boolean {
    return this.password.length < 6 && this.username.length == 0;
  }
}
