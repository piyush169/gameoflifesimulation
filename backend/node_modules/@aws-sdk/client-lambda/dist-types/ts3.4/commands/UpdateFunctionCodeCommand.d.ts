import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  LambdaClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../LambdaClient";
import {
  FunctionConfiguration,
  UpdateFunctionCodeRequest,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface UpdateFunctionCodeCommandInput
  extends UpdateFunctionCodeRequest {}
export interface UpdateFunctionCodeCommandOutput
  extends FunctionConfiguration,
    __MetadataBearer {}
declare const UpdateFunctionCodeCommand_base: {
  new (
    input: UpdateFunctionCodeCommandInput
  ): import("@smithy/core/client").CommandImpl<
    UpdateFunctionCodeCommandInput,
    UpdateFunctionCodeCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: UpdateFunctionCodeCommandInput
  ): import("@smithy/core/client").CommandImpl<
    UpdateFunctionCodeCommandInput,
    UpdateFunctionCodeCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class UpdateFunctionCodeCommand extends UpdateFunctionCodeCommand_base {
  protected static __types: {
    api: {
      input: UpdateFunctionCodeRequest;
      output: FunctionConfiguration;
    };
    sdk: {
      input: UpdateFunctionCodeCommandInput;
      output: UpdateFunctionCodeCommandOutput;
    };
  };
}
