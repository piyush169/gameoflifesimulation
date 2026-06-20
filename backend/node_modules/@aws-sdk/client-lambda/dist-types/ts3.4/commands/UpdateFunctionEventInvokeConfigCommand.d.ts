import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  LambdaClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../LambdaClient";
import {
  FunctionEventInvokeConfig,
  UpdateFunctionEventInvokeConfigRequest,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface UpdateFunctionEventInvokeConfigCommandInput
  extends UpdateFunctionEventInvokeConfigRequest {}
export interface UpdateFunctionEventInvokeConfigCommandOutput
  extends FunctionEventInvokeConfig,
    __MetadataBearer {}
declare const UpdateFunctionEventInvokeConfigCommand_base: {
  new (
    input: UpdateFunctionEventInvokeConfigCommandInput
  ): import("@smithy/core/client").CommandImpl<
    UpdateFunctionEventInvokeConfigCommandInput,
    UpdateFunctionEventInvokeConfigCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: UpdateFunctionEventInvokeConfigCommandInput
  ): import("@smithy/core/client").CommandImpl<
    UpdateFunctionEventInvokeConfigCommandInput,
    UpdateFunctionEventInvokeConfigCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class UpdateFunctionEventInvokeConfigCommand extends UpdateFunctionEventInvokeConfigCommand_base {
  protected static __types: {
    api: {
      input: UpdateFunctionEventInvokeConfigRequest;
      output: FunctionEventInvokeConfig;
    };
    sdk: {
      input: UpdateFunctionEventInvokeConfigCommandInput;
      output: UpdateFunctionEventInvokeConfigCommandOutput;
    };
  };
}
