import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { getAuthUserId } from '@convex-dev/auth/server'

export const save = mutation({
  args: {
    text: v.string(),
    language: v.optional(v.string()),
    duration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Récupère l'ID sécurisé de l'utilisateur connecté via la session
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      throw new Error(
        'Vous devez être connecté pour sauvegarder une transcription.',
      )
    }

    return await ctx.db.insert('transcriptions', {
      userId,
      text: args.text,
      language: args.language,
      duration: args.duration,
      createdAt: Date.now(),
    })
  },
})

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return [] // Si non connecté, on ne retourne rien

    // On récupère uniquement les transcriptions appartenant à cet utilisateur
    return await ctx.db
      .query('transcriptions')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .order('desc')
      .take(50)
  },
})
