import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, QueryCtx } from "./_generated/server";
import { auth } from "./auth";

const getMember = async (ctx: QueryCtx, workspaceId: Id<"workspaces">, userId: Id<"users">) => {
  return ctx.db.query("members").
    withIndex("by_workspace_id_user_id", 
      (q) => q.eq("workspaceId", workspaceId).eq("userId", userId)).unique();
}


export const update = mutation({
  args:{
    value: v.string(),
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx)
    if(!userId) {
      throw new Error("Not authenticated")
    }

    const message = await ctx.db.get(args.messageId);
    if(!message) {
      throw new Error("Message not found")
    }


    const member = await getMember(ctx, message.workspaceId, userId);

    if(!member) {
      throw new Error("Not a member of the workspace")
    }

    const existingReaction = await ctx.db.query("reactions").filter((q) =>
      q.and(
        q.eq(q.field("messageId"), message._id),
        q.eq(q.field("memberId"), member._id),
        q.eq(q.field("value"), args.value)
      )
    ).first();

    if(existingReaction) {
      await ctx.db.delete(existingReaction._id);
      return existingReaction._id

    } else {
      const reactionId = await ctx.db.insert("reactions", {
        workspaceId: message.workspaceId,
        messageId: message._id,
        memberId: member._id,
        value: args.value,
      });
      return reactionId;
    }
  }
})