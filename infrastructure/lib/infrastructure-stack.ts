import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export class CartAppCdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create Lambda function
    const cartLambda = new NodejsFunction(this, 'cartLambda', {
      functionName: 'cartLambdaFn',
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'handler',
      entry: path.join(__dirname, '../../src/lambda.ts'),
      depsLockFilePath: path.join(__dirname, '../../package-lock.json'),
      bundling: {
        minify: true,
        sourceMap: true,
        externalModules: ['@aws-sdk/*', 'aws-sdk'],
        target: 'node18',
        nodeModules: [
          '@nestjs/core',
          '@nestjs/common',
          '@nestjs/platform-express',
          'reflect-metadata',
        ],
      },
      environment: {
        DB_HOST: process.env.DB_HOST!,
        DB_PORT: process.env.DB_PORT!,
        DB_USER: process.env.DB_USERNAME!,
        DB_PASSWORD: process.env.DB_PASSWORD!,
        DB_NAME: process.env.DB_NAME!
      },
      timeout: cdk.Duration.seconds(30),
      memorySize: 512,
    });

    // Create API Gateway
    const api = new apigateway.RestApi(this, 'CartApi', {
      restApiName: 'Cart Service',
      description: 'Cart Gateway',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
        allowCredentials: true,
      },
    });

    // Add proxy resource to handle all routes
    api.root.addProxy({
      defaultIntegration: new apigateway.LambdaIntegration(cartLambda),
      anyMethod: true,
    });
  }
}
