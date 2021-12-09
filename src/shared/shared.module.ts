import { ContainerComponent } from "./components/container/container.component";
import { Icon } from "./components/icon";
import { LocationSearch } from "./components/location-search/location-search.component";

export default class SharedModule {
  elements: object[] = [Icon, LocationSearch, ContainerComponent];
}
