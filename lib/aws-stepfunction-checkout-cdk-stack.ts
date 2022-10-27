import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import lambda = require('aws-cdk-lib/aws-lambda');
import sfn = require('aws-cdk-lib/aws-stepfunctions');
import tasks = require('aws-cdk-lib/aws-stepfunctions-tasks');
import * as cdk from 'aws-cdk-lib';
import apigw = require('aws-cdk-lib/aws-apigateway');

export class AwsStepfunctionCheckoutCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const fetchCustomerDetailsLambda = this.createLambda(
      this,
      'fetchCustomerDetailsLambdaHandler',
      'fetchCustomerDetails.handler'
    );

    const fetchPriceLambda = this.createLambda(
      this,
      'fetchPriceLambdaHandler',
      'fetchPrice.handler'
    );

    const takePaymentLambda = this.createLambda(
      this,
      'takePaymentLambdaHandler',
      'takePayment.handler'
    );

    const completeOrderLambda = this.createLambda(
      this,
      'completeOrderLambdaHandler',
      'completeOrder.handler'
    );

    const orderFailed = new sfn.Fail(
      this,
      "Sorry, We Couldn't make the order!",
      {}
    );

    const orderSucceeded = new sfn.Succeed(
      this,
      'We have completed your order!'
    );

    console.log('Create fetchCustomerDetails Task');

    const fetchCustomerDetails = new tasks.LambdaInvoke(
      this,
      'FetchCustomerDetails',
      {
        lambdaFunction: fetchCustomerDetailsLambda,
        resultPath: '$.FetchCustomerDetailsResult',
      }
    )
      .addRetry({ maxAttempts: 3 }) // retry this task a max of 3 times if it fails
      .addCatch(orderFailed);

    console.log('Create fetchPrice Task');

    const fetchPrice = new tasks.LambdaInvoke(this, 'FetchPrice', {
      lambdaFunction: fetchPriceLambda,
      resultPath: '$.FetchPriceResult',
    })
      .addRetry({ maxAttempts: 3 }) // retry this task a max of 3 times if it fails
      .addCatch(orderFailed);

    console.log('Create takePayment Task');

    const takePayment = new tasks.LambdaInvoke(this, 'TakePayment', {
      lambdaFunction: takePaymentLambda,
      resultPath: '$.TakePayment',
    })
      .addRetry({ maxAttempts: 3 }) // retry this task a max of 3 times if it fails
      .addCatch(orderFailed);

    console.log('Create completeOrder Task');

    const completeOrder = new tasks.LambdaInvoke(this, 'CompleteOrder', {
      lambdaFunction: completeOrderLambda,
      resultPath: '$.CompleteOrder',
    })
      .addRetry({ maxAttempts: 3 }) // retry this task a max of 3 times if it fails
      .addCatch(orderFailed);

    /// Step function definition

    const definition = sfn.Chain.start(fetchCustomerDetails)
      .next(fetchPrice)
      .next(takePayment)
      .next(completeOrder)
      .next(orderSucceeded);

    const saga = new sfn.StateMachine(this, 'CheckoutSaga', {
      definition,
      timeout: cdk.Duration.minutes(5),
    });

    /// defines an AWS Lambda resource to connect to our API Gateway and kick
    /// off our step function

    console.log('Create holidayBookingLambda Lambda');

    const checkOutLambda = new lambda.Function(this, 'sagaLambdaHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'sagaLambda.handler',
      environment: {
        statemachine_arn: saga.stateMachineArn,
      },
    });

    saga.grantStartExecution(checkOutLambda);

    /// Simple API Gateway proxy integration
    /// defines an API Gateway REST API resource backed by our "stateMachineLambda" function.

    new apigw.LambdaRestApi(this, 'CheckOut', {
      handler: checkOutLambda,
    });
  }

  /**
   * Helper function to shorten Lambda boilerplate code
   * @param scope
   * @param id
   * @param handler
   */
  createLambda(scope: Stack, id: string, handler: string) {
    console.log('createLambda', handler);

    const name = id.replace('LambdaHandler', '');

    const func = new lambda.Function(scope, id, {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: handler,
      functionName: name,
      description: name,
    });

    console.log('createLambda complete');

    return func;
  }
}
