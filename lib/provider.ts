import { IRegion, Region, IRegionProvider, RegionResult } from './regions';
import { IService, Service, IServiceProvider, ServiceResult } from './services';
import { IParameterProvider } from './parameters';
import { SSMParameterProvider } from './ssm';

const BASE_PATH = "/aws/service/global-infrastructure";

export class GlobalInfrastructure implements IRegionProvider, IServiceProvider {
  private parameters: IParameterProvider;

  constructor(parameters?: IParameterProvider) {
    if (parameters) {
      this.parameters = parameters;
    } else {
      this.parameters = new SSMParameterProvider();
    }
  }

  public regions(previousToken?: string): Promise<RegionResult> {
    return this.parameters.list(BASE_PATH + "/regions", previousToken)
      .then(result => ({
        items: result.items.map(parameter => new Region(parameter, this.parameters)),
        nextToken: result.nextToken
      }));
  }

  public services(previousToken?: string): Promise<ServiceResult> {
    return this.parameters.list(BASE_PATH + "/services", previousToken)
      .then(result => ({
        items: result.items.map(parameter => new Service(parameter, this.parameters)),
        nextToken: result.nextToken
      }));
  }

  public region(regionId: string): Promise<IRegion> {
    return this.parameters.get([ BASE_PATH, "regions", regionId ].join('/'))
      .then(parameter => new Region(parameter, this.parameters));
  }

  public service(serviceId: string): Promise<IService> {
    return this.parameters.get([ BASE_PATH, "services", serviceId].join('/'))
      .then(parameter => new Service(parameter, this.parameters));
  }
}
