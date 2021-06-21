import { NavigationStore, navigationStore } from "./navigation.store";
import { updateMetadata } from "pwa-helpers/metadata";

export class NavigationService {
  constructor(private navigationStore: NavigationStore) {
    this.changeNavigation(window.location);
  }

  private changeNavigation(location: Location): void {
    this.navigationStore.currentRoute = location;
  }

  /**
   * Navigate pushes to hi(story. That history-push will later be picked up by the routing service
   *
   * @param path - example /flights will go to https://domain.com/flights
   * @param state
   */
  navigate(path: string, state: object) {
    history.replaceState(state, "", path);
    this.changeNavigation(window.location);
  }
}

export const navigationService = new NavigationService(navigationStore);
