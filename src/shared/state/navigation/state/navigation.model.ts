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

export function createNavigation() {
  return {
    activeRoute: {
      name: "dashboard",
      route: "/",
      icon: "dashboard",
    },
    routes: [
      {
        name: "Dashboard",
        icon: "dashboard",
        route: "/",
        navigation: true,
        action: () => {
          return import("../../../../views/dashboard");
        },
      },
      {
        name: "New Flight",
        icon: "add_circle",
        route: "/flights/new",
        navigation: true,
        action: () => {
          return import("../../../../views/flights/newflight");
        },
      },
      {
        name: "Flights",
        icon: "flight_takeoff",
        route: "/flights",
        navigation: true,
        action: () => {
          return import("../../../../views/flights/flights");
        },
      },
      {
        name: "Unauthorized",
        route: "/401",
        icon: "401",
        action: () => {
          return import("../../../../views/401");
        },
      },
      {
        name: "Not found",
        route: "/404",
        icon: "404",
        action: () => {
          return import("../../../../views/404");
        },
      },
    ],
  } as Navigation;
}
