import { EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { createNavigation, Navigation, Route } from "./navigation.model";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface NavigationState extends EntityState<Navigation> {}

@StoreConfig({
  name: "navigation",
})
export class NavigationStore extends EntityStore<NavigationState> {
  constructor() {
    super(createNavigation());
  }

  set currentRoute(location: Location) {
    this.update((state) => ({
      routes: state.routes,
      currentRoute: this.findMatchingRoute(location),
    }));
  }

  private findMatchingRoute(location: Location): Route {
    const routes = this.getValue().routes as Route[];
    for (const item of routes) {
      if (item.route === location.pathname) {
        return item;
      }
    }

    const notFound = (this.getValue().routes as Route[]).find(
      (item) => item.route === "/404"
    );
    return notFound;
  }
}

export const navigationStore = new NavigationStore();
