import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  LambdaClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../LambdaClient";
import {
  GetFunctionCodeSigningConfigRequest,
  GetFunctionCodeSigningConfigResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface GetFunctionCodeSigningConfigCommandInput
  extends GetFunctionCodeSigningConfigRequest {}
export interface GetFunctionCodeSigningConfigCommandOutput
  extends GetFunctionCodeSigningConfigResponse,
    __MetadataBearer {}
declare const GetFunctionCodeSigningConfigCommand_base: {
  new (
    input: GetFunctionCodeSigningConfigCommandInput
  ): import("@smithy/core/client").CommandImpl<
    GetFunctionCodeSigningConfigCommandInput,
    GetFunctionCodeSigningConfigCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: GetFunctionCodeSigningConfigCommandInput
  ): import("@smithy/core/client").CommandImpl<
    GetFunctionCodeSigningConfigCommandInput,
    GetFunctionCodeSigningConfigCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class GetFunctionCodeSigningConfigCommand extends GetFunctionCodeSigningConfigCommand_base {
  protected static __types: {
    api: {
      input: GetFunctionCodeSigningConfigRequest;
      output: GetFunctionCodeSigningConfigResponse;
    };
    sdk: {
      input: GetFunctionCodeSigningConfigCommandInput;
      output: GetFunctionCodeSigningConfigCommandOutput;
    };
  };
}
