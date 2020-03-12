import { Parameter, IParameterProvider, ReflectiveFieldParameter } from './parameters';
import { PagedResult } from './api';
import { IRegionAvailability, RegionAvailability, RegionAvailabilityResult } from './availability';

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

  service(serviceId: string): Promise<IRegionAvailability>;
  services(previousToken?: string): Promise<RegionAvailabilityResult>;
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

  service(serviceId: string): Promise<IRegionAvailability> {
    let basePath = this.parameter.name.replace('/regions/' + this.id(), '');
    return this.parameters.get([ this.parameter.name, 'services', serviceId ].join('/'))
      .then(parameter => new RegionAvailability(this.parameters, basePath, parameter.value, this.id()));
  }

  services(previousToken?: string): Promise<RegionAvailabilityResult> {
    let basePath = this.parameter.name.replace('/regions/' + this.id(), '');
    return this.parameters.list([ this.parameter.name, 'services' ].join('/'), previousToken)
      .then(result => ({
        items: result.items.map(parameter => new RegionAvailability(this.parameters, basePath, parameter.value, this.id())),
        nextToken: result.nextToken
      }));
  }
}
