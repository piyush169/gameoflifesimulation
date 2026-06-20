import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  LambdaClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../LambdaClient";
import {
  GetAccountSettingsRequest,
  GetAccountSettingsResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface GetAccountSettingsCommandInput
  extends GetAccountSettingsRequest {}
export interface GetAccountSettingsCommandOutput
  extends GetAccountSettingsResponse,
    __MetadataBearer {}
declare const GetAccountSettingsCommand_base: {
  new (
    input: GetAccountSettingsCommandInput
  ): import("@smithy/core/client").CommandImpl<
    GetAccountSettingsCommandInput,
    GetAccountSettingsCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [GetAccountSettingsCommandInput]
  ): import("@smithy/core/client").CommandImpl<
    GetAccountSettingsCommandInput,
    GetAccountSettingsCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class GetAccountSettingsCommand extends GetAccountSettingsCommand_base {
  protected static __types: {
    api: {
      input: {};
      output: GetAccountSettingsResponse;
    };
    sdk: {
      input: GetAccountSettingsCommandInput;
      output: GetAccountSettingsCommandOutput;
    };
  };
}
