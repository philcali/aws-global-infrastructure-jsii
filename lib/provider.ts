import { IRegion, Region, IRegionProvider, RegionResult } from './regions';
import { IParameterProvider } from './parameters';
import { SSMParameterProvider } from './ssm';

const BASE_PATH = "/aws/service/global-infrastructure/";

export class GlobalInfrastructure implements IRegionProvider {
  private parameters: IParameterProvider;

  constructor(parameters?: IParameterProvider) {
    if (parameters) {
      this.parameters = parameters;
    } else {
      this.parameters = new SSMParameterProvider();
    }
  }

  public regions(previousToken?: string): Promise<RegionResult> {
    return this.parameters.list(BASE_PATH + "regions", previousToken)
      .then(result => ({
        regions: result.parameters.map(parameter => new Region(parameter, this.parameters)),
        nextToken: result.nextToken
      }));
  }

  public region(regionId: string): Promise<IRegion> {
    let path = [ BASE_PATH, "regions", regionId ].join('/');
    return this.parameters.get(path)
      .then(parameter => new Region(parameter, this.parameters));
  }
}
