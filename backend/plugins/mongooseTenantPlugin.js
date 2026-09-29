import mongoose from "mongoose";
import { getTenantStoreIdFromContext, isTenantBypassed } from "../utils/tenantContext.js";

/**
 * Global Mongoose Plugin for Automatic Tenant Scoping.
 * Injects storeId filter automatically into all Mongoose queries and documents
 * based on the active AsyncLocalStorage context.
 */
export const mongooseTenantPlugin = (schema) => {
  // Only apply plugin if the schema explicitly includes a storeId field
  if (!schema.path("storeId")) {
    return;
  }

  const applyTenantFilter = function (next) {
    if (isTenantBypassed()) {
      if (typeof next === "function") next();
      return;
    }

    const storeId = getTenantStoreIdFromContext();
    if (!storeId) {
      if (typeof next === "function") next();
      return;
    }

    const options = this.getOptions ? this.getOptions() : {};
    if (options && options.skipTenantFilter) {
      if (typeof next === "function") next();
      return;
    }

    const filter = this.getFilter ? this.getFilter() : null;
    if (filter) {
      if (filter.storeId === undefined) {
        this.where({ storeId });
      } else {
        filter.storeId = storeId;
      }
    }

    if (typeof next === "function") next();
  };

  const queryOps = [
    "find",
    "findOne",
    "findOneAndUpdate",
    "findOneAndDelete",
    "findOneAndReplace",
    "updateOne",
    "updateMany",
    "deleteOne",
    "deleteMany",
    "countDocuments",
    "count",
    "replaceOne",
    "distinct"
  ];

  queryOps.forEach((op) => {
    schema.pre(op, applyTenantFilter);
  });

  // Pre-aggregate hook
  schema.pre("aggregate", function (next) {
    if (isTenantBypassed()) {
      if (typeof next === "function") next();
      return;
    }

    const storeId = getTenantStoreIdFromContext();
    if (!storeId) {
      if (typeof next === "function") next();
      return;
    }

    const options = this.options || {};
    if (options.skipTenantFilter) {
      if (typeof next === "function") next();
      return;
    }

    const pipeline = this.pipeline();
    if (pipeline.length > 0 && pipeline[0].$match) {
      pipeline[0].$match.storeId = storeId;
    } else {
      pipeline.unshift({ $match: { storeId } });
    }
    if (typeof next === "function") next();
  });

  // Pre-save document hook: automatically assign storeId on creation
  schema.pre("save", function (next) {
    if (!isTenantBypassed()) {
      const storeId = getTenantStoreIdFromContext();
      if (storeId && !this.storeId) {
        this.storeId = storeId;
      }
    }
    if (typeof next === "function") next();
  });

  // Pre-insertMany hook
  schema.pre("insertMany", function (next, docs) {
    let actualDocs = docs;
    if (Array.isArray(next)) {
      actualDocs = next;
    }
    if (!isTenantBypassed()) {
      const storeId = getTenantStoreIdFromContext();
      if (storeId && Array.isArray(actualDocs)) {
        actualDocs.forEach((doc) => {
          if (doc && !doc.storeId) {
            doc.storeId = storeId;
          }
        });
      }
    }
    if (typeof next === "function") next();
  });
};

// Register plugin globally with Mongoose so all newly compiled schemas inherit tenant isolation
mongoose.plugin(mongooseTenantPlugin);
