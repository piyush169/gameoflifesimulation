import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  LambdaClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../LambdaClient";
import {
  PublishLayerVersionRequest,
  PublishLayerVersionResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface PublishLayerVersionCommandInput
  extends PublishLayerVersionRequest {}
export interface PublishLayerVersionCommandOutput
  extends PublishLayerVersionResponse,
    __MetadataBearer {}
declare const PublishLayerVersionCommand_base: {
  new (
    input: PublishLayerVersionCommandInput
  ): import("@smithy/core/client").CommandImpl<
    PublishLayerVersionCommandInput,
    PublishLayerVersionCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: PublishLayerVersionCommandInput
  ): import("@smithy/core/client").CommandImpl<
    PublishLayerVersionCommandInput,
    PublishLayerVersionCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class PublishLayerVersionCommand extends PublishLayerVersionCommand_base {
  protected static __types: {
    api: {
      input: PublishLayerVersionRequest;
      output: PublishLayerVersionResponse;
    };
    sdk: {
      input: PublishLayerVersionCommandInput;
      output: PublishLayerVersionCommandOutput;
    };
  };
}
