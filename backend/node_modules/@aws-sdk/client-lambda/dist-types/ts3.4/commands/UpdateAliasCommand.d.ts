import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  LambdaClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../LambdaClient";
import { AliasConfiguration, UpdateAliasRequest } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface UpdateAliasCommandInput extends UpdateAliasRequest {}
export interface UpdateAliasCommandOutput
  extends AliasConfiguration,
    __MetadataBearer {}
declare const UpdateAliasCommand_base: {
  new (
    input: UpdateAliasCommandInput
  ): import("@smithy/core/client").CommandImpl<
    UpdateAliasCommandInput,
    UpdateAliasCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: UpdateAliasCommandInput
  ): import("@smithy/core/client").CommandImpl<
    UpdateAliasCommandInput,
    UpdateAliasCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class UpdateAliasCommand extends UpdateAliasCommand_base {
  protected static __types: {
    api: {
      input: UpdateAliasRequest;
      output: AliasConfiguration;
    };
    sdk: {
      input: UpdateAliasCommandInput;
      output: UpdateAliasCommandOutput;
    };
  };
}
