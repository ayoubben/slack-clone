import { v } from "convex/values";
import { mutation, QueryCtx } from "./_generated/server";
import { auth } from "./auth";
import { Id } from "./_generated/dataModel";

const getMemberId = async (ctx: QueryCtx, workspaceId: Id<"workspaces">, userId: Id<"users">) => {
  return ctx.db.query("members").
    withIndex("by_workspace_id_user_id", 
      (q) => q.eq("workspaceId", workspaceId).eq("userId", userId)).unique();

}

export const create = mutation({
  args: {
    body: v.string(),
    image: v.optional(v.id("_storage")),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    parentMessageId: v.optional(v.id("messages")),
    conversationId: v.optional(v.id("conversations")),
  },
  handler: async (ctx, args) => {

    const userId = await auth.getUserId(ctx)

    if(!userId) {
      throw new Error("Not authenticated")
    }

    const member = await getMemberId(ctx, args.workspaceId, userId);

    if(!member) {
      throw new Error("Not a member of the workspace")
    }

    let _conversationId = args.conversationId;

    // only possible if we are replying in a  a 1:1 conversation
    if(!args.conversationId && !args.channelId && args.parentMessageId) {
      const parentMessage = await ctx.db.get(args.parentMessageId);
      if(!parentMessage) {
        throw new Error("Parent message not found")
      }

      _conversationId = parentMessage.conversationId;
    }

    const messageId = await ctx.db.insert("messages", {
      memberId: member._id,
      body: args.body,
      image: args.image,
      channelId: args.channelId,
      workspaceId: args.workspaceId,
      parentMessageId: args.parentMessageId,
      conversationId: _conversationId,
      updateAt: Date.now()
    });

    return messageId;
  }
})