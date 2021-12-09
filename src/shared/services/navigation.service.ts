import { Observable, of, ReplaySubject, Subject } from "rxjs";

export interface ImportResult {
  [key: string]: object;
}

export interface Route {
  name: string;
  route: string;
  icon?: string;
  navigation?: boolean;
  import?: string;
  action?: () => Promise<ImportResult>;
}

export interface Navigation {
  activeRoute: Route;
  routes: Route[];
}

export function createNavigation(): Route[] {
  return [
    {
      name: "Dashboard",
      icon: "dashboard",
      route: "/",
      navigation: true,
      action: () => {
        return import("../../views/dashboard");
      },
    },
    {
      name: "Pilots",
      icon: "people",
      route: "/users",
      navigation: true,
      action: () => {
        return import("../../views/users");
      },
    },
    {
      name: "New flight",
      icon: "add_circle",
      route: "/flights/new",
      navigation: false,
      action: () => {
        return import("../../views/flights/newflight");
      },
    },
    {
      name: "Flights",
      icon: "flight_takeoff",
      route: "/flights",
      navigation: true,
      action: () => {
        return import("../../views/flights/flights");
      },
    },
    {
      name: "Locations",
      icon: "place",
      route: "/locations",
      navigation: true,
      action: () => {
        return import("../../views/locations/locations");
      },
    },
    {
      name: "Create Location",
      icon: "place",
      route: "/locations/create",
      action: () => {
        return import(
          "../../views/locations/create-location/create-location.component"
        );
      },
    },
    {
      name: "Unauthorized",
      route: "/401",
      icon: "401",
      action: () => {
        return import("../../views/401");
      },
    },
    {
      name: "Not found",
      route: "/404",
      icon: "404",
      action: () => {
        return import("../../views/404");
      },
    },
    {
      name: "Callback",
      route: "/callback",
      icon: "404",
      action: () => {
        return import("../../views/callback");
      },
    },
  ];
}

export class NavigationService {
  routes = createNavigation();

  private _currentRoute: Route;

  private routeSubject: Subject<Route> = new ReplaySubject(1);

  constructor() {
    const initialPath = window.location.pathname;

    const initialRoute = this.routes.find(
      (route) => route.route === initialPath
    );

    if (initialRoute) {
      this._currentRoute = initialRoute;
    } else {
      const route = this.routes.find((item) => item.route === "/");
      if (route === null) {
        throw new Error("Unable to find default route");
      }
      this._currentRoute = route;
    }

    this.currentRoute$.subscribe((route) => {
      this._currentRoute = route;
    });
  }

  /**
   * Only for edge cases. Use the observable as often as possible
   * */
  get currentRoute(): Route {
    return this._currentRoute;
  }

  get currentRoute$(): Observable<Route> {
    return this.routeSubject;
  }

  get mainNavigation$(): Observable<Route[]> {
    return of(this.routes.filter((route) => route.navigation === true));
  }

  setCurrentRoute(path: string, state: any = null) {
    history.replaceState(state, "", path);
    this.changeNavigation(window.location);
  }

  private changeNavigation(location: Location): void {
    const view = this.findMatchingRoute(location);
    this.routeSubject.next(view);
  }

  private findMatchingRoute(location: Location): Route {
    for (const item of this.routes) {
      if (item.route === location.pathname) {
        return item;
      }
    }

    const notFound = (this.routes as Route[]).find(
      (item) => item.route === "/404"
    );
    return notFound;
  }
}

export const navigationService = new NavigationService();
