import { GeneratedBizBase } from "../GeneratedBizBase";

import type { Response } from "../Response";

import type { Assessment } from "../../dto/Assessment";
export class AssessmentService extends GeneratedBizBase {
  async save(value: Assessment): Promise<Response<any>> {
    console.log(arguments);
    return super.restCall<Response<any>>(
      "post",
      GeneratedBizBase.getApiHost() + "/v1/AssessmentService/save",
      arguments
    );
  }
}
