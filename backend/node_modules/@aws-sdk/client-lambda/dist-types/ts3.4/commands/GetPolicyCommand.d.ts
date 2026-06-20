import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  LambdaClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../LambdaClient";
import { GetPolicyRequest, GetPolicyResponse } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface GetPolicyCommandInput extends GetPolicyRequest {}
export interface GetPolicyCommandOutput
  extends GetPolicyResponse,
    __MetadataBearer {}
declare const GetPolicyCommand_base: {
  new (input: GetPolicyCommandInput): import("@smithy/core/client").CommandImpl<
    GetPolicyCommandInput,
    GetPolicyCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (input: GetPolicyCommandInput): import("@smithy/core/client").CommandImpl<
    GetPolicyCommandInput,
    GetPolicyCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class GetPolicyCommand extends GetPolicyCommand_base {
  protected static __types: {
    api: {
      input: GetPolicyRequest;
      output: GetPolicyResponse;
    };
    sdk: {
      input: GetPolicyCommandInput;
      output: GetPolicyCommandOutput;
    };
  };
}
