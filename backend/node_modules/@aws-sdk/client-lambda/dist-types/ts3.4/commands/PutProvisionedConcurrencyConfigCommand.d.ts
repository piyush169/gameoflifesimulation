import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  LambdaClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../LambdaClient";
import {
  PutProvisionedConcurrencyConfigRequest,
  PutProvisionedConcurrencyConfigResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface PutProvisionedConcurrencyConfigCommandInput
  extends PutProvisionedConcurrencyConfigRequest {}
export interface PutProvisionedConcurrencyConfigCommandOutput
  extends PutProvisionedConcurrencyConfigResponse,
    __MetadataBearer {}
declare const PutProvisionedConcurrencyConfigCommand_base: {
  new (
    input: PutProvisionedConcurrencyConfigCommandInput
  ): import("@smithy/core/client").CommandImpl<
    PutProvisionedConcurrencyConfigCommandInput,
    PutProvisionedConcurrencyConfigCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: PutProvisionedConcurrencyConfigCommandInput
  ): import("@smithy/core/client").CommandImpl<
    PutProvisionedConcurrencyConfigCommandInput,
    PutProvisionedConcurrencyConfigCommandOutput,
    LambdaClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class PutProvisionedConcurrencyConfigCommand extends PutProvisionedConcurrencyConfigCommand_base {
  protected static __types: {
    api: {
      input: PutProvisionedConcurrencyConfigRequest;
      output: PutProvisionedConcurrencyConfigResponse;
    };
    sdk: {
      input: PutProvisionedConcurrencyConfigCommandInput;
      output: PutProvisionedConcurrencyConfigCommandOutput;
    };
  };
}
