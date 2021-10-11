import { Store, StoreConfig } from '@datorama/akita';

export interface AuthenticationConfig {
  serverUrl: string, // your Casdoor URL, like the official one: https://door.casbin.com
  clientId: string, // your Casdoor OAuth Client ID
  appName: string, // your Casdoor application name, like: "app-built-in"
  organizationName: string // your Casdoor organization name, like: "built-in"
}

export interface ConfigState {
  authConfig: AuthenticationConfig;
}

export function createInitialState(): ConfigState {
  return {
    authConfig: {
      serverUrl: 'http://localhost:8080',
      clientId: '',
      appName: 'flightlog-frontend',
      organizationName: 'flightlog'
    }
  };
}

@StoreConfig({ name: 'config' })
export class ConfigStore extends Store<ConfigState> {

  constructor() {
    super(createInitialState());
  }

  setConfiguration(config: ConfigState) {
    this.update(() => ({
      ...config
    }));
  }

}

export const configStore = new ConfigStore();
