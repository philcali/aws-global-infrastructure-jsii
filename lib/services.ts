import { Parameter, IParameterProvider, ReflectiveFieldParameter } from './parameters';
import { PagedResult } from './api';

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
}
