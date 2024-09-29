
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

const generateCode = () => {
  const code = Array.from(
      { length: 6 },
      () => "0123456789abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 36)]
  ).join("");
  
  return code;
};

export const newJoinCode = mutation({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if(userId === null) {
      throw new Error("Not authenticated");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", args.workspaceId).eq("userId", userId))
      .unique();

    if(!member || member.role !== "admin") {
      throw new Error("Not authorized");
    }

    const joinCode = generateCode();

    const workspaceId = await ctx.db.patch(args.workspaceId, { joinCode });

    return workspaceId;
  },
});


export const get = query({
  args: {},
  handler: async (ctx) => {
  
    const userId = await auth.getUserId(ctx);

    if(userId === null) {
      return [];
    }

    const members = await ctx.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();
    const workspaceIds = members.map((m) => m.workspaceId);
    
    const workspaces = [];
    for(const workspaceId of workspaceIds) {
      const workspace = await ctx.db.get(workspaceId);
      workspaces.push(workspace);
    }

    return workspaces;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if(userId === null) {
      throw new Error("Not authenticated");
    }

    const workspaceId = await ctx.db.insert("workspaces", {
      name: args.name,
      userId,
      joinCode: generateCode(),
    });

    await ctx.db.insert("members", {
      userId,
      workspaceId,
      role: "admin",
    });

    await ctx.db.insert("channels", {
      name: "general",
      workspaceId,
    });

    return workspaceId;
  },
});

export const update = mutation({
  args: {
    id: v.id("workspaces"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if(userId === null) {
      throw new Error("Not authenticated");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", args.id).eq("userId", userId))
      .unique();

    if(!member || member.role !== "admin") {
      throw new Error("Not authorized");
    }

    await ctx.db.patch(args.id, {name: args.name});

    return args.id;
  },
});


export const remove = mutation({
  args: {
    id: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if(userId === null) {
      throw new Error("Not authenticated");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", args.id).eq("userId", userId))
      .unique();

    if(!member || member.role !== "admin") {
      throw new Error("Not authorized");
    }

    const [members] = await Promise.all([
      ctx.db
        .query("members")
        .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.id))
        .collect()
    ]);

    for(const member of members) {
      await ctx.db.delete(member._id);
    }

    await ctx.db.delete(args.id);

    return args.id;
  },
});

export const getById = query({
  args: {
    id: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if(userId === null) {
      throw new Error("Not authenticated");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", args.id).eq("userId", userId))
      .unique();

    if(!member) {
      return null;
    }

    const workspace = await ctx.db.get(member.workspaceId);

    return workspace;
  },
});