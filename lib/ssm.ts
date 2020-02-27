import * as AWS from 'aws-sdk';
import { IParameterProvider, ParameterResult, Parameter } from './parameters';

const MAX_RESULTS = 10;

export class SSMParameterProvider implements IParameterProvider {

  private ssm: AWS.SSM;

  constructor(region?: string) {
    this.ssm = new AWS.SSM({ region: region || 'us-east-1' });
  }

  get(name: string): Promise<Parameter> {
    return new Promise((resolve, reject) => {
      this.ssm.getParameter({ Name: name }, (error, data) => {
        if (error) {
          return reject(error);
        }
        if (data && data.Parameter) {
          return resolve({
            name: data.Parameter.Name || '',
            value: data.Parameter.Value || ''
          });
        } else {
          return reject(`Parameter ${name} is invalid.`);
        }
      });
    });
  }

  list(path: string, previousToken?: string): Promise<ParameterResult> {
    return new Promise((resolve, reject) => {
      this.ssm.getParametersByPath({ Path: path, MaxResults: MAX_RESULTS, NextToken: previousToken }, (error, data) => {
        if (error) {
          return reject(error);
        }
        let parameters: Array<Parameter> = [];
        let nextToken: string | undefined = data.NextToken;
        if (data && data.Parameters) {
          parameters = data.Parameters
            .filter(p => p.Name && p.Value)
            .map(p => ({ name: p.Name || '', value: p.Value || ''}));
        }
        return resolve({ parameters, nextToken });
      });
    });
  }
}
