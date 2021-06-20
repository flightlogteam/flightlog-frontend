import { NavigationStore, navigationStore } from "./navigation.store";
import { installRouter } from "pwa-helpers/router";

export class NavigationService {
  constructor(private navigationStore: NavigationStore) {
    installRouter((location) => this.changeNavigation(location));
  }

  private changeNavigation(location: Location): void {
    this.navigationStore.currentRoute = location;
  }
}

export const navigationService = new NavigationService(navigationStore);
