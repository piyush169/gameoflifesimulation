import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  LambdaClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../LambdaClient";
import { RemoveLayerVersionPermissionRequest } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface RemoveLayerVersionPermissionCommandInput
  extends RemoveLayerVersionPermissionRequest {}
export interface RemoveLayerVersionPermissionCommandOutput
  extends __MetadataBearer {}
declare const RemoveLayerVersionPermissionCommand_base: {
  new (
    input: RemoveLayerVersionPermissionCommandInput
  ): import("@smithy/core/client").CommandImpl<
    RemoveLayerVersionPermissionCommandInput,
    RemoveLayerVersionPermissionCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: RemoveLayerVersionPermissionCommandInput
  ): import("@smithy/core/client").CommandImpl<
    RemoveLayerVersionPermissionCommandInput,
    RemoveLayerVersionPermissionCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class RemoveLayerVersionPermissionCommand extends RemoveLayerVersionPermissionCommand_base {
  protected static __types: {
    api: {
      input: RemoveLayerVersionPermissionRequest;
      output: {};
    };
    sdk: {
      input: RemoveLayerVersionPermissionCommandInput;
      output: RemoveLayerVersionPermissionCommandOutput;
    };
  };
}
