import * as AWS from 'aws-sdk';
import { IParameterProvider, ParameterResult, Parameter } from './parameters';

const ssm = new AWS.SSM();

export class SSMParameterProvider implements IParameterProvider {
  get(name: string): Promise<Parameter> {
    return new Promise((resolve, reject) => {
      ssm.getParameter({ Name: name }, (error, data) => {
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
      ssm.getParametersByPath({ Path: path, NextToken: previousToken }, (error, data) => {
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
