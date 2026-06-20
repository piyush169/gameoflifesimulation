import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  LambdaClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../LambdaClient";
import {
  GetLayerVersionPolicyRequest,
  GetLayerVersionPolicyResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface GetLayerVersionPolicyCommandInput
  extends GetLayerVersionPolicyRequest {}
export interface GetLayerVersionPolicyCommandOutput
  extends GetLayerVersionPolicyResponse,
    __MetadataBearer {}
declare const GetLayerVersionPolicyCommand_base: {
  new (
    input: GetLayerVersionPolicyCommandInput
  ): import("@smithy/core/client").CommandImpl<
    GetLayerVersionPolicyCommandInput,
    GetLayerVersionPolicyCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: GetLayerVersionPolicyCommandInput
  ): import("@smithy/core/client").CommandImpl<
    GetLayerVersionPolicyCommandInput,
    GetLayerVersionPolicyCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class GetLayerVersionPolicyCommand extends GetLayerVersionPolicyCommand_base {
  protected static __types: {
    api: {
      input: GetLayerVersionPolicyRequest;
      output: GetLayerVersionPolicyResponse;
    };
    sdk: {
      input: GetLayerVersionPolicyCommandInput;
      output: GetLayerVersionPolicyCommandOutput;
    };
  };
}
