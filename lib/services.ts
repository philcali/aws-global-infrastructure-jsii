import { Parameter, IParameterProvider, ReflectiveFieldParameter } from './parameters';
import { PagedResult } from './api';
import { IRegionAvailability, RegionAvailability, RegionAvailabilityResult } from './availability';

export interface ServiceResult extends PagedResult {
  readonly items: Array<IService>;
}

export interface IServiceProvider {
  services(previousToken?: string): Promise<ServiceResult>
  service(serviceId: string): Promise<IService>
}

export interface IService {
  id(): string;
  longName(): Promise<string>;
  marketingHomeUrl(): Promise<string>;

  region(regionId: String): Promise<IRegionAvailability>;
  regions(previousToken?: string): Promise<RegionAvailabilityResult>;
}

export class Service extends ReflectiveFieldParameter implements IService {

  constructor(parameter: Parameter, parameters: IParameterProvider) {
    super(parameter, parameters);
  }

  longName() {
    return this.extractField("longName");
  }

  marketingHomeUrl() {
    return this.extractField("marketingHomeURL");
  }

  region(regionId: string): Promise<IRegionAvailability> {
    let basePath = this.parameter.name.replace('/services/' + this.id(), '');
    return this.parameters.get([ this.parameter.name, 'regions', regionId ].join('/'))
      .then(parameter => new RegionAvailability(this.parameters, basePath, this.id(), parameter.value));
  }

  regions(previousToken?: string): Promise<RegionAvailabilityResult> {
    let basePath = this.parameter.name.replace('/services/' + this.id(), '');
    return this.parameters.list([ this.parameter.name, 'regions' ].join('/'), previousToken)
    .then(result => ({
      items: result.items.map(parameter => new RegionAvailability(this.parameters, basePath, this.id(), parameter.value)),
      nextToken: result.nextToken
    }));
  }
}
