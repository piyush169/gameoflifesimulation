import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  LambdaClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../LambdaClient";
import { AliasConfiguration, GetAliasRequest } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface GetAliasCommandInput extends GetAliasRequest {}
export interface GetAliasCommandOutput
  extends AliasConfiguration,
    __MetadataBearer {}
declare const GetAliasCommand_base: {
  new (input: GetAliasCommandInput): import("@smithy/core/client").CommandImpl<
    GetAliasCommandInput,
    GetAliasCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (input: GetAliasCommandInput): import("@smithy/core/client").CommandImpl<
    GetAliasCommandInput,
    GetAliasCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class GetAliasCommand extends GetAliasCommand_base {
  protected static __types: {
    api: {
      input: GetAliasRequest;
      output: AliasConfiguration;
    };
    sdk: {
      input: GetAliasCommandInput;
      output: GetAliasCommandOutput;
    };
  };
}
