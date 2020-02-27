import { Parameter, IParameterProvider } from './parameters';

export interface RegionResult {
  readonly regions: Array<IRegion>;
  readonly nextToken: string | undefined;
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

export class Region implements IRegion {
  private parameter: Parameter
  private parameters: IParameterProvider

  constructor(parameter: Parameter, parameters: IParameterProvider) {
    this.parameter = parameter;
    this.parameters = parameters;
  }

  private extractField(field: string) {
    return this.parameters.get(this.parameter.name + '/' + field)
      .then(paramter => paramter.value);
  }

  id() {
    return this.parameter.value;
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
