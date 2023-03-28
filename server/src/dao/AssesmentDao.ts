import { AssessmentDaoGen } from "../generated/dao/AssessmentDaoGen";
import { Assessment } from "../generated/dto/Assessment";
import { RecoverableError } from "../biz/generated/RecoverableError";

/**
 * アセスメントDAO
 */
export class AssessmentDao extends AssessmentDaoGen {
  async selectByUserId(
    user_id: string
  ): Promise<Assessment | RecoverableError> {
    const results = await this.db.query<Assessment>(
      "SELECT * FROM assessment WHERE user_id = ?",
      [user_id]
    );
    if (results == null || results.length === 0) {
      return new RecoverableError(
        "No assessment found for user_id: " + user_id
      );
    }
    return results[0];
  }
}
