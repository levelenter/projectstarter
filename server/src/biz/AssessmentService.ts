import { PoolConnection } from "mysql2/promise";
import { Rest } from "./generated/@Rest";
import { Transactional } from "./generated/@Transactional";
import { Response } from "./generated/Response";
import { AssessmentDao } from "../dao/AssesmentDao";
import { Assessment } from "../generated/dto/Assessment";

export class AssessmentService {
  connection!: PoolConnection;

  @Rest("/v1/AssessmentService/save", "post")
  @Transactional("connection")
  async save(value: Assessment): Promise<Response<any>> {
    console.log(value);
    const dao = new AssessmentDao(this.connection);
    const result = await dao.insertOrUpdate(value);
    return new Response<any>(result);
  }
}
