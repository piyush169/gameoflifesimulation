import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  LambdaClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../LambdaClient";
import { Concurrency, PutFunctionConcurrencyRequest } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface PutFunctionConcurrencyCommandInput
  extends PutFunctionConcurrencyRequest {}
export interface PutFunctionConcurrencyCommandOutput
  extends Concurrency,
    __MetadataBearer {}
declare const PutFunctionConcurrencyCommand_base: {
  new (
    input: PutFunctionConcurrencyCommandInput
  ): import("@smithy/core/client").CommandImpl<
    PutFunctionConcurrencyCommandInput,
    PutFunctionConcurrencyCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: PutFunctionConcurrencyCommandInput
  ): import("@smithy/core/client").CommandImpl<
    PutFunctionConcurrencyCommandInput,
    PutFunctionConcurrencyCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class PutFunctionConcurrencyCommand extends PutFunctionConcurrencyCommand_base {
  protected static __types: {
    api: {
      input: PutFunctionConcurrencyRequest;
      output: Concurrency;
    };
    sdk: {
      input: PutFunctionConcurrencyCommandInput;
      output: PutFunctionConcurrencyCommandOutput;
    };
  };
}
