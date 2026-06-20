import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  LambdaClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../LambdaClient";
import {
  FunctionConfiguration,
  GetFunctionConfigurationRequest,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface GetFunctionConfigurationCommandInput
  extends GetFunctionConfigurationRequest {}
export interface GetFunctionConfigurationCommandOutput
  extends FunctionConfiguration,
    __MetadataBearer {}
declare const GetFunctionConfigurationCommand_base: {
  new (
    input: GetFunctionConfigurationCommandInput
  ): import("@smithy/core/client").CommandImpl<
    GetFunctionConfigurationCommandInput,
    GetFunctionConfigurationCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: GetFunctionConfigurationCommandInput
  ): import("@smithy/core/client").CommandImpl<
    GetFunctionConfigurationCommandInput,
    GetFunctionConfigurationCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class GetFunctionConfigurationCommand extends GetFunctionConfigurationCommand_base {
  protected static __types: {
    api: {
      input: GetFunctionConfigurationRequest;
      output: FunctionConfiguration;
    };
    sdk: {
      input: GetFunctionConfigurationCommandInput;
      output: GetFunctionConfigurationCommandOutput;
    };
  };
}
