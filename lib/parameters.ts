import { PagedResult } from './api';

export interface ParameterResult extends PagedResult {
  readonly parameters: Array<Parameter>;
}

export interface Parameter {
  readonly name: string;
  readonly value: string;
}

export interface IParameterProvider {
  get(name: string): Promise<Parameter>;
  list(path: string, previousToken?: string): Promise<ParameterResult>
}

export class ReflectiveFieldParameter {
  protected parameter: Parameter
  protected parameters: IParameterProvider

  constructor(parameter: Parameter, parameters: IParameterProvider) {
    this.parameter = parameter;
    this.parameters = parameters;
  }

  protected extractField(field: string) {
    return this.parameters.get(this.parameter.name + '/' + field)
      .then(paramter => paramter.value);
  }

  id() {
    return this.parameter.value;
  }
}
