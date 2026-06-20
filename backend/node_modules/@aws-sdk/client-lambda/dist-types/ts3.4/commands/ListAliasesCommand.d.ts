import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  LambdaClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../LambdaClient";
import { ListAliasesRequest, ListAliasesResponse } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface ListAliasesCommandInput extends ListAliasesRequest {}
export interface ListAliasesCommandOutput
  extends ListAliasesResponse,
    __MetadataBearer {}
declare const ListAliasesCommand_base: {
  new (
    input: ListAliasesCommandInput
  ): import("@smithy/core/client").CommandImpl<
    ListAliasesCommandInput,
    ListAliasesCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: ListAliasesCommandInput
  ): import("@smithy/core/client").CommandImpl<
    ListAliasesCommandInput,
    ListAliasesCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class ListAliasesCommand extends ListAliasesCommand_base {
  protected static __types: {
    api: {
      input: ListAliasesRequest;
      output: ListAliasesResponse;
    };
    sdk: {
      input: ListAliasesCommandInput;
      output: ListAliasesCommandOutput;
    };
  };
}
