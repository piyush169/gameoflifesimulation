import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  LambdaClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../LambdaClient";
import {
  UpdateFunctionUrlConfigRequest,
  UpdateFunctionUrlConfigResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface UpdateFunctionUrlConfigCommandInput
  extends UpdateFunctionUrlConfigRequest {}
export interface UpdateFunctionUrlConfigCommandOutput
  extends UpdateFunctionUrlConfigResponse,
    __MetadataBearer {}
declare const UpdateFunctionUrlConfigCommand_base: {
  new (
    input: UpdateFunctionUrlConfigCommandInput
  ): import("@smithy/core/client").CommandImpl<
    UpdateFunctionUrlConfigCommandInput,
    UpdateFunctionUrlConfigCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: UpdateFunctionUrlConfigCommandInput
  ): import("@smithy/core/client").CommandImpl<
    UpdateFunctionUrlConfigCommandInput,
    UpdateFunctionUrlConfigCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class UpdateFunctionUrlConfigCommand extends UpdateFunctionUrlConfigCommand_base {
  protected static __types: {
    api: {
      input: UpdateFunctionUrlConfigRequest;
      output: UpdateFunctionUrlConfigResponse;
    };
    sdk: {
      input: UpdateFunctionUrlConfigCommandInput;
      output: UpdateFunctionUrlConfigCommandOutput;
    };
  };
}
