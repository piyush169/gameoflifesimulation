import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  LambdaClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../LambdaClient";
import {
  FunctionEventInvokeConfig,
  GetFunctionEventInvokeConfigRequest,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface GetFunctionEventInvokeConfigCommandInput
  extends GetFunctionEventInvokeConfigRequest {}
export interface GetFunctionEventInvokeConfigCommandOutput
  extends FunctionEventInvokeConfig,
    __MetadataBearer {}
declare const GetFunctionEventInvokeConfigCommand_base: {
  new (
    input: GetFunctionEventInvokeConfigCommandInput
  ): import("@smithy/core/client").CommandImpl<
    GetFunctionEventInvokeConfigCommandInput,
    GetFunctionEventInvokeConfigCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: GetFunctionEventInvokeConfigCommandInput
  ): import("@smithy/core/client").CommandImpl<
    GetFunctionEventInvokeConfigCommandInput,
    GetFunctionEventInvokeConfigCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class GetFunctionEventInvokeConfigCommand extends GetFunctionEventInvokeConfigCommand_base {
  protected static __types: {
    api: {
      input: GetFunctionEventInvokeConfigRequest;
      output: FunctionEventInvokeConfig;
    };
    sdk: {
      input: GetFunctionEventInvokeConfigCommandInput;
      output: GetFunctionEventInvokeConfigCommandOutput;
    };
  };
}
