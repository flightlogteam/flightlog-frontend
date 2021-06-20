export interface Route {
  name: string;
  route: string;
  icon?: string;
  navigation?: boolean;
}

export interface Navigation {
  activeRoute: Route;
  routes: Route[];
}

export function createNavigation() {
  return {
    activeRoute: {
      name: "dashboard",
      route: "",
      icon: "dashboard",
    },
    routes: [
      {
        name: "Dashboard",
        icon: "dashboard",
        route: "",
        navigation: true,
      },
      {
        name: "New Flight",
        icon: "add_circle",
        route: "flights/new",
        navigation: true,
      },
      {
        name: "Flights",
        icon: "flight_takeoff",
        route: "flights",
        navigation: true,
      },
      {
        name: "Unauthorized",
        route: "401",
        icon: "401",
      },
      {
        name: "Not found",
        route: "404",
        icon: "404",
      },
    ],
  } as Navigation;
}
