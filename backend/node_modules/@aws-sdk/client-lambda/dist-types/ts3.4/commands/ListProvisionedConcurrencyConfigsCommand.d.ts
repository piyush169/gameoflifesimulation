import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  LambdaClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../LambdaClient";
import {
  ListProvisionedConcurrencyConfigsRequest,
  ListProvisionedConcurrencyConfigsResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface ListProvisionedConcurrencyConfigsCommandInput
  extends ListProvisionedConcurrencyConfigsRequest {}
export interface ListProvisionedConcurrencyConfigsCommandOutput
  extends ListProvisionedConcurrencyConfigsResponse,
    __MetadataBearer {}
declare const ListProvisionedConcurrencyConfigsCommand_base: {
  new (
    input: ListProvisionedConcurrencyConfigsCommandInput
  ): import("@smithy/core/client").CommandImpl<
    ListProvisionedConcurrencyConfigsCommandInput,
    ListProvisionedConcurrencyConfigsCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: ListProvisionedConcurrencyConfigsCommandInput
  ): import("@smithy/core/client").CommandImpl<
    ListProvisionedConcurrencyConfigsCommandInput,
    ListProvisionedConcurrencyConfigsCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class ListProvisionedConcurrencyConfigsCommand extends ListProvisionedConcurrencyConfigsCommand_base {
  protected static __types: {
    api: {
      input: ListProvisionedConcurrencyConfigsRequest;
      output: ListProvisionedConcurrencyConfigsResponse;
    };
    sdk: {
      input: ListProvisionedConcurrencyConfigsCommandInput;
      output: ListProvisionedConcurrencyConfigsCommandOutput;
    };
  };
}
