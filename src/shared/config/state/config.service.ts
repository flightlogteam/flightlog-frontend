import { ConfigState } from '.';
import { ConfigStore, configStore } from './config.store';

export class ConfigService {
  constructor(private configStore: ConfigStore) {
    this.fetchConfiguration();
  }

  async fetchConfiguration(): Promise<void> {
    return fetch('config.json').then(data => data.json()).then((config: ConfigState) => {
      this.configStore.setConfiguration(config);
    });
  }

}

export const configService = new ConfigService(configStore);
