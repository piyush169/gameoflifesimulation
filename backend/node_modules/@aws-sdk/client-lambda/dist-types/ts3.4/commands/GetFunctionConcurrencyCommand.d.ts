import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  LambdaClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../LambdaClient";
import {
  GetFunctionConcurrencyRequest,
  GetFunctionConcurrencyResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface GetFunctionConcurrencyCommandInput
  extends GetFunctionConcurrencyRequest {}
export interface GetFunctionConcurrencyCommandOutput
  extends GetFunctionConcurrencyResponse,
    __MetadataBearer {}
declare const GetFunctionConcurrencyCommand_base: {
  new (
    input: GetFunctionConcurrencyCommandInput
  ): import("@smithy/core/client").CommandImpl<
    GetFunctionConcurrencyCommandInput,
    GetFunctionConcurrencyCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: GetFunctionConcurrencyCommandInput
  ): import("@smithy/core/client").CommandImpl<
    GetFunctionConcurrencyCommandInput,
    GetFunctionConcurrencyCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class GetFunctionConcurrencyCommand extends GetFunctionConcurrencyCommand_base {
  protected static __types: {
    api: {
      input: GetFunctionConcurrencyRequest;
      output: GetFunctionConcurrencyResponse;
    };
    sdk: {
      input: GetFunctionConcurrencyCommandInput;
      output: GetFunctionConcurrencyCommandOutput;
    };
  };
}
