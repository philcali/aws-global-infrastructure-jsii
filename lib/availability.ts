import { Parameter, IParameterProvider } from './parameters';
import { PagedResult } from './api';
import { IRegion, Region } from './regions';
import { IService, Service } from './services';

export interface RegionAvailabilityResult extends PagedResult {
  readonly items: Array<IRegionAvailability>;
}

export interface IRegionAvailability {
  service(): IService;
  region(): IRegion;
}

export class RegionAvailability implements IRegionAvailability {
  private parameters: IParameterProvider;
  private serviceId: string;
  private regionId: string;
  private basePath: string;

  constructor(parameters: IParameterProvider, basePath: string, serviceId: string, regionId: string) {
    this.parameters = parameters;
    this.basePath = basePath;
    this.serviceId = serviceId;
    this.regionId = regionId;
  }

  public service(): IService {
    let parameter: Parameter = {
      name: [ this.basePath, 'services', this.serviceId ].join('/'),
      value: this.serviceId
    };
    return new Service(parameter, this.parameters);
  }

  public region(): IRegion {
    let parameter: Parameter = {
      name: [ this.basePath, 'regions', this.regionId ].join('/'),
      value: this.regionId
    };
    return new Region(parameter, this.parameters);
  }
}
