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

  static page404(): Route {
    return {
      name: "Not found",
      route: "404",
      icon: "404",
    };
  }

  private findMatchingRoute(location: Location): Route {
    console.log(this.getValue());
    const routes = this.getValue().routes as Route[];
    for (const item of routes) {
      if (item.route === location.pathname) {
        return item;
      }
    }
    return NavigationStore.page404();
  }
}

export const navigationStore = new NavigationStore();
