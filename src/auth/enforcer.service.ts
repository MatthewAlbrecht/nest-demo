/**
 * EnforcerService class
 * - Queries user attributes and policies from the database
 * - Evaluates policy conditions against those attributes
 */
import { Inject, Injectable } from '@nestjs/common';
import { policies, Policy, userAttributes } from '../database/db/db.schema';
import { and, eq } from 'drizzle-orm/expressions';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from 'src/database/db/db.schema';

@Injectable()
export class EnforcerService {
  constructor(@Inject('DB') private db: PostgresJsDatabase<typeof schema>) {}

  async fetchUserAttributes(userId: number): Promise<Record<string, string>> {
    const rows = await this.db
      .select()
      .from(userAttributes)
      .where(eq(userAttributes.userId, userId));
    const attributes: Record<string, string> = {};
    rows.forEach((row) => {
      attributes[row.attributeKey] = row.attributeValue;
    });
    return attributes;
  }

  async fetchPolicies(resource: string, action: string): Promise<Policy[]> {
    // Query policies matching the specific resource and action
    const policyRows = await this.db
      .select()
      .from(policies)
      .where(and(eq(policies.resource, resource), eq(policies.action, action)));
    return policyRows;
  }

  evaluateCondition(
    condition: string | null,
    attributes: Record<string, string>,
  ): boolean {
    if (!condition) return true;
    const andGroups = condition.split('|').map((group) => group.trim());
    return andGroups.some((group) => {
      const predicates = group.split('&').map((pred) => pred.trim());
      return predicates.every((predicate) => {
        const [key, value] = predicate.split('=').map((part) => part.trim());
        return attributes[key] === value;
      });
    });
  }

  async enforce(
    userId: number,
    resource: string,
    action: string,
  ): Promise<boolean> {
    const attributes = await this.fetchUserAttributes(userId);
    const policiesList = await this.fetchPolicies(resource, action);
    if (policiesList.length === 0) return false;
    // If any policy with a matching condition explicitly denies, deny the request.
    // Alternatively, if a policy explicitly allows, permit the request.
    for (const policy of policiesList) {
      if (this.evaluateCondition(policy.condition, attributes)) {
        if (policy.effect === 'deny') return false;
        if (policy.effect === 'allow') return true;
      }
    }
    return false;
  }
}
