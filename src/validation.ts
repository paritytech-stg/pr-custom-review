import Joi from "joi"

import { Configuration, Rule, RuleCriteria } from "./types"

const ruleCriteria = function ({
  isMinApprovalsOptional,
}: {
  isMinApprovalsOptional: boolean
}) {
  let minApprovals = Joi.number().min(1)
  if (isMinApprovalsOptional) {
    minApprovals = minApprovals.optional().allow(null)
  }
  return {
    min_approvals: minApprovals,
    users: Joi.array().items(Joi.string()).optional().allow(null),
    teams: Joi.array().items(Joi.string()).optional().allow(null),
  }
}

const includeConditionSchema = Joi.string().required()
const excludeConditionSchema = Joi.string().required()
const ruleSchema = Joi.object<Rule>().keys({
  name: Joi.string().required(),
  condition: Joi.alternatives([
    includeConditionSchema,
    Joi.object().keys({ include: includeConditionSchema }),
    Joi.object().keys({ exclude: excludeConditionSchema }),
    Joi.object().keys({
      include: includeConditionSchema,
      exclude: excludeConditionSchema,
    }),
  ]).required(),
  check_type: Joi.string().valid("diff", "changed_files").required(),
  ...ruleCriteria({ isMinApprovalsOptional: true }),
  all: Joi.array()
    .items(
      Joi.object<RuleCriteria>().keys(
        ruleCriteria({ isMinApprovalsOptional: false }),
      ),
    )
    .optional()
    .allow(null),
  any: Joi.array()
    .items(
      Joi.object<RuleCriteria>().keys(
        ruleCriteria({ isMinApprovalsOptional: false }),
      ),
    )
    .optional()
    .allow(null),
})

export const configurationSchema = Joi.object<Configuration>().keys({
  rules: Joi.array().items(ruleSchema).required(),
})
