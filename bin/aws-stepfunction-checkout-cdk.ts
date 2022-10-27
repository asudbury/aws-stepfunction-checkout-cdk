#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsStepfunctionCheckoutCdkStack } from '../lib/aws-stepfunction-checkout-cdk-stack';

const app = new cdk.App();
new AwsStepfunctionCheckoutCdkStack(app, 'AwsStepfunctionCheckoutCdkStack', {});
