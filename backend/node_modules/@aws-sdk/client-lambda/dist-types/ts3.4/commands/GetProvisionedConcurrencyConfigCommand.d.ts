import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  LambdaClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../LambdaClient";
import {
  GetProvisionedConcurrencyConfigRequest,
  GetProvisionedConcurrencyConfigResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface GetProvisionedConcurrencyConfigCommandInput
  extends GetProvisionedConcurrencyConfigRequest {}
export interface GetProvisionedConcurrencyConfigCommandOutput
  extends GetProvisionedConcurrencyConfigResponse,
    __MetadataBearer {}
declare const GetProvisionedConcurrencyConfigCommand_base: {
  new (
    input: GetProvisionedConcurrencyConfigCommandInput
  ): import("@smithy/core/client").CommandImpl<
    GetProvisionedConcurrencyConfigCommandInput,
    GetProvisionedConcurrencyConfigCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: GetProvisionedConcurrencyConfigCommandInput
  ): import("@smithy/core/client").CommandImpl<
    GetProvisionedConcurrencyConfigCommandInput,
    GetProvisionedConcurrencyConfigCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class GetProvisionedConcurrencyConfigCommand extends GetProvisionedConcurrencyConfigCommand_base {
  protected static __types: {
    api: {
      input: GetProvisionedConcurrencyConfigRequest;
      output: GetProvisionedConcurrencyConfigResponse;
    };
    sdk: {
      input: GetProvisionedConcurrencyConfigCommandInput;
      output: GetProvisionedConcurrencyConfigCommandOutput;
    };
  };
}
