import { QueryEntity } from "@datorama/akita";
import { Route } from ".";
import {
  NavigationStore,
  NavigationState,
  navigationStore,
} from "./navigation.store";

export class NavigationQuery extends QueryEntity<NavigationState> {
  constructor(protected store: NavigationStore) {
    super(store);
  }

  currentRoute = this.select((item) => item.currentRoute);

  mainNavigation = this.select<Route[]>((data) => {
    const routes = data.routes as Route[];
    return routes.filter((item) => item?.navigation);
  });

  get route(): Route {
    return this.getValue().currentRoute;
  }
}

export const navigationQuery = new NavigationQuery(navigationStore);
