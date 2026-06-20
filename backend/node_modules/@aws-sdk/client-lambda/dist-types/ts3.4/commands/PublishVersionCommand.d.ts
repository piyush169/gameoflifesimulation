import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  LambdaClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../LambdaClient";
import {
  FunctionConfiguration,
  PublishVersionRequest,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface PublishVersionCommandInput extends PublishVersionRequest {}
export interface PublishVersionCommandOutput
  extends FunctionConfiguration,
    __MetadataBearer {}
declare const PublishVersionCommand_base: {
  new (
    input: PublishVersionCommandInput
  ): import("@smithy/core/client").CommandImpl<
    PublishVersionCommandInput,
    PublishVersionCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: PublishVersionCommandInput
  ): import("@smithy/core/client").CommandImpl<
    PublishVersionCommandInput,
    PublishVersionCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class PublishVersionCommand extends PublishVersionCommand_base {
  protected static __types: {
    api: {
      input: PublishVersionRequest;
      output: FunctionConfiguration;
    };
    sdk: {
      input: PublishVersionCommandInput;
      output: PublishVersionCommandOutput;
    };
  };
}
