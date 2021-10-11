import { Query } from '@datorama/akita';
import { filter } from 'rxjs';
import { ConfigStore, ConfigState, configStore } from './config.store';

export class ConfigQuery extends Query<ConfigState> {

  constructor(protected store: ConfigStore) {
    super(store);
  }

  authConfig = this.select(data => data.authConfig).pipe(filter(data => data.clientId !== undefined));
}

export const configQuery = new ConfigQuery(configStore);
