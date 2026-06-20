import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  LambdaClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../LambdaClient";
import {
  GetLayerVersionRequest,
  GetLayerVersionResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface GetLayerVersionCommandInput extends GetLayerVersionRequest {}
export interface GetLayerVersionCommandOutput
  extends GetLayerVersionResponse,
    __MetadataBearer {}
declare const GetLayerVersionCommand_base: {
  new (
    input: GetLayerVersionCommandInput
  ): import("@smithy/core/client").CommandImpl<
    GetLayerVersionCommandInput,
    GetLayerVersionCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: GetLayerVersionCommandInput
  ): import("@smithy/core/client").CommandImpl<
    GetLayerVersionCommandInput,
    GetLayerVersionCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class GetLayerVersionCommand extends GetLayerVersionCommand_base {
  protected static __types: {
    api: {
      input: GetLayerVersionRequest;
      output: GetLayerVersionResponse;
    };
    sdk: {
      input: GetLayerVersionCommandInput;
      output: GetLayerVersionCommandOutput;
    };
  };
}
