export interface ParameterResult {
  readonly parameters: Array<Parameter>;
  readonly nextToken: string | undefined;
}

export interface Parameter {
  readonly name: string;
  readonly value: string;
}

export interface IParameterProvider {
  get(name: string): Promise<Parameter>;
  list(path: string, previousToken?: string): Promise<ParameterResult>
}
