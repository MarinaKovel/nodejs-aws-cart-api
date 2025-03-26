import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class LambdaStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'NestJsVPC', {
      maxAzs: 2,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
      ],
      natGateways: 1,
    });

    const lambdaSG = new ec2.SecurityGroup(this, 'LambdaSG', {
      vpc,
      description: 'Security group for Lambda function',
      allowAllOutbound: true,
    });

    // Create Lambda function using NodejsFunction
    const handler = new NodejsFunction(this, 'NestJsLambda', {
      functionName: 'cartLambda',
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'handler',
      entry: path.join(__dirname, '../../src/lambda.ts'),
      depsLockFilePath: path.join(__dirname, '../../package-lock.json'),
      timeout: cdk.Duration.seconds(30),
      environment: {
        NODE_ENV: 'production',
      },
      reservedConcurrentExecutions: 1,
      bundling: {
        minify: true,
        sourceMap: true,
        target: 'node18',
        nodeModules: [
          '@nestjs/core',
          '@nestjs/common',
          '@nestjs/platform-express',
          'reflect-metadata',
          '@vendia/serverless-express',
        ],
        externalModules: ['@aws-sdk/*', 'aws-sdk'],
      },
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      securityGroups: [lambdaSG],
      memorySize: 512,
    });

    // Create API Gateway
    const api = new apigateway.RestApi(this, 'NestJsApi', {
      restApiName: 'Nest.js API Service',
      description: 'This is the Nest.js API service',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
      deployOptions: {
        throttlingRateLimit: 1,
        throttlingBurstLimit: 1,
      },
    });

    // Add proxy integration
    const integration = new apigateway.LambdaIntegration(handler, {
      proxy: true,
    });

    api.root.addProxy({
      defaultIntegration: integration,
      anyMethod: true,
    });

    // Output the API URL
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'API Gateway URL',
    });
  }
}
