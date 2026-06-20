import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  LambdaClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../LambdaClient";
import {
  GetRuntimeManagementConfigRequest,
  GetRuntimeManagementConfigResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface GetRuntimeManagementConfigCommandInput
  extends GetRuntimeManagementConfigRequest {}
export interface GetRuntimeManagementConfigCommandOutput
  extends GetRuntimeManagementConfigResponse,
    __MetadataBearer {}
declare const GetRuntimeManagementConfigCommand_base: {
  new (
    input: GetRuntimeManagementConfigCommandInput
  ): import("@smithy/core/client").CommandImpl<
    GetRuntimeManagementConfigCommandInput,
    GetRuntimeManagementConfigCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: GetRuntimeManagementConfigCommandInput
  ): import("@smithy/core/client").CommandImpl<
    GetRuntimeManagementConfigCommandInput,
    GetRuntimeManagementConfigCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class GetRuntimeManagementConfigCommand extends GetRuntimeManagementConfigCommand_base {
  protected static __types: {
    api: {
      input: GetRuntimeManagementConfigRequest;
      output: GetRuntimeManagementConfigResponse;
    };
    sdk: {
      input: GetRuntimeManagementConfigCommandInput;
      output: GetRuntimeManagementConfigCommandOutput;
    };
  };
}
