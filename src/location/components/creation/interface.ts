import { TemplateResult } from 'lit';

export interface CreationComponent {
  isValidated(): boolean;
  tabIcon(): string;
  tabName(): string;
  render(): TemplateResult;
}
