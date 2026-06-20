import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  LambdaClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../LambdaClient";
import {
  PutFunctionCodeSigningConfigRequest,
  PutFunctionCodeSigningConfigResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface PutFunctionCodeSigningConfigCommandInput
  extends PutFunctionCodeSigningConfigRequest {}
export interface PutFunctionCodeSigningConfigCommandOutput
  extends PutFunctionCodeSigningConfigResponse,
    __MetadataBearer {}
declare const PutFunctionCodeSigningConfigCommand_base: {
  new (
    input: PutFunctionCodeSigningConfigCommandInput
  ): import("@smithy/core/client").CommandImpl<
    PutFunctionCodeSigningConfigCommandInput,
    PutFunctionCodeSigningConfigCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: PutFunctionCodeSigningConfigCommandInput
  ): import("@smithy/core/client").CommandImpl<
    PutFunctionCodeSigningConfigCommandInput,
    PutFunctionCodeSigningConfigCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class PutFunctionCodeSigningConfigCommand extends PutFunctionCodeSigningConfigCommand_base {
  protected static __types: {
    api: {
      input: PutFunctionCodeSigningConfigRequest;
      output: PutFunctionCodeSigningConfigResponse;
    };
    sdk: {
      input: PutFunctionCodeSigningConfigCommandInput;
      output: PutFunctionCodeSigningConfigCommandOutput;
    };
  };
}
