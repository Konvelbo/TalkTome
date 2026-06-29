import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'
import { authTables } from '@convex-dev/auth/server'

export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    image: v.optional(v.string()),
    isAnonymous: v.optional(v.boolean()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),

    role: v.optional(v.string()),
  }).index('email', ['email']),

  transcriptions: defineTable({
    userId: v.string(),
    text: v.string(),
    language: v.optional(v.string()),
    duration: v.optional(v.number()),
    createdAt: v.number(),
  }).index('by_user', ['userId']),
})
