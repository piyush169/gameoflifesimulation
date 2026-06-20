import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  LambdaClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../LambdaClient";
import {
  EventSourceMappingConfiguration,
  GetEventSourceMappingRequest,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface GetEventSourceMappingCommandInput
  extends GetEventSourceMappingRequest {}
export interface GetEventSourceMappingCommandOutput
  extends EventSourceMappingConfiguration,
    __MetadataBearer {}
declare const GetEventSourceMappingCommand_base: {
  new (
    input: GetEventSourceMappingCommandInput
  ): import("@smithy/core/client").CommandImpl<
    GetEventSourceMappingCommandInput,
    GetEventSourceMappingCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: GetEventSourceMappingCommandInput
  ): import("@smithy/core/client").CommandImpl<
    GetEventSourceMappingCommandInput,
    GetEventSourceMappingCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class GetEventSourceMappingCommand extends GetEventSourceMappingCommand_base {
  protected static __types: {
    api: {
      input: GetEventSourceMappingRequest;
      output: EventSourceMappingConfiguration;
    };
    sdk: {
      input: GetEventSourceMappingCommandInput;
      output: GetEventSourceMappingCommandOutput;
    };
  };
}
