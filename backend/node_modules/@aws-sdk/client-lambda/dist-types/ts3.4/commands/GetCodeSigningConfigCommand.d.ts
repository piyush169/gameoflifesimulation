import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  LambdaClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../LambdaClient";
import {
  GetCodeSigningConfigRequest,
  GetCodeSigningConfigResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface GetCodeSigningConfigCommandInput
  extends GetCodeSigningConfigRequest {}
export interface GetCodeSigningConfigCommandOutput
  extends GetCodeSigningConfigResponse,
    __MetadataBearer {}
declare const GetCodeSigningConfigCommand_base: {
  new (
    input: GetCodeSigningConfigCommandInput
  ): import("@smithy/core/client").CommandImpl<
    GetCodeSigningConfigCommandInput,
    GetCodeSigningConfigCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: GetCodeSigningConfigCommandInput
  ): import("@smithy/core/client").CommandImpl<
    GetCodeSigningConfigCommandInput,
    GetCodeSigningConfigCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class GetCodeSigningConfigCommand extends GetCodeSigningConfigCommand_base {
  protected static __types: {
    api: {
      input: GetCodeSigningConfigRequest;
      output: GetCodeSigningConfigResponse;
    };
    sdk: {
      input: GetCodeSigningConfigCommandInput;
      output: GetCodeSigningConfigCommandOutput;
    };
  };
}
