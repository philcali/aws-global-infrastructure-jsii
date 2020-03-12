import { IRegionAvailability } from './availability';
import { IParameterProvider } from './parameters';

export interface IReachability {
  availability(): IRegionAvailability;
  endpoint(): Promise<string>;
  protocols(): Promise<Array<string>>;
}

export class Reachability implements IReachability {
  private regional: IRegionAvailability;
  private parameters: IParameterProvider;
  private basePath: string;

  constructor(parameters: IParameterProvider, basePath: string, regional: IRegionAvailability) {
    this.parameters = parameters;
    this.basePath = basePath;
    this.regional = regional;
  }

  public availability() {
    return this.regional;
  }

  public endpoint() {
    return this.parameters.get(this.basePath + '/endpoint')
      .then(parameter => parameter.value);
  }

  public protocols() {
    return this.parameters.get(this.basePath + '/protocols')
      .then(parameter => parameter.value.split(/\s*,\s*/));
  }
}
