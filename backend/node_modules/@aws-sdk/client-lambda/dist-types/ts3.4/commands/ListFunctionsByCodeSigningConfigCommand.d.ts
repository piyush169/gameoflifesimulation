import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  LambdaClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../LambdaClient";
import {
  ListFunctionsByCodeSigningConfigRequest,
  ListFunctionsByCodeSigningConfigResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface ListFunctionsByCodeSigningConfigCommandInput
  extends ListFunctionsByCodeSigningConfigRequest {}
export interface ListFunctionsByCodeSigningConfigCommandOutput
  extends ListFunctionsByCodeSigningConfigResponse,
    __MetadataBearer {}
declare const ListFunctionsByCodeSigningConfigCommand_base: {
  new (
    input: ListFunctionsByCodeSigningConfigCommandInput
  ): import("@smithy/core/client").CommandImpl<
    ListFunctionsByCodeSigningConfigCommandInput,
    ListFunctionsByCodeSigningConfigCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: ListFunctionsByCodeSigningConfigCommandInput
  ): import("@smithy/core/client").CommandImpl<
    ListFunctionsByCodeSigningConfigCommandInput,
    ListFunctionsByCodeSigningConfigCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class ListFunctionsByCodeSigningConfigCommand extends ListFunctionsByCodeSigningConfigCommand_base {
  protected static __types: {
    api: {
      input: ListFunctionsByCodeSigningConfigRequest;
      output: ListFunctionsByCodeSigningConfigResponse;
    };
    sdk: {
      input: ListFunctionsByCodeSigningConfigCommandInput;
      output: ListFunctionsByCodeSigningConfigCommandOutput;
    };
  };
}
