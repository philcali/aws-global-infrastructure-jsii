import { Parameter, IParameterProvider, ReflectiveFieldParameter } from './parameters';
import { PagedResult } from './api';

export interface RegionResult extends PagedResult {
  readonly items: Array<IRegion>;
}

export interface IRegionProvider {
  regions(previousToken?: string): Promise<RegionResult>
  region(regionId: string): Promise<IRegion>
}

export interface IRegion {
  id(): string;
  partition(): Promise<string>;
  longName(): Promise<string>;
  domain(): Promise<string>;
  geolocationRegion(): Promise<string>;
  geolocationCountry(): Promise<string>;
}

export class Region extends ReflectiveFieldParameter implements IRegion {

  constructor(parameter: Parameter, parameters: IParameterProvider) {
    super(parameter, parameters);
  }

  longName() {
    return this.extractField("longName");
  }

  partition() {
    return this.extractField('partition');
  }

  domain() {
    return this.extractField('domain');
  }

  geolocationRegion() {
    return this.extractField('geolocationRegion');
  }

  geolocationCountry() {
    return this.extractField('geolocationCountry');
  }
}
