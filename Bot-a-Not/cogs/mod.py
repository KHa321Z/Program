import asyncio
import discord
from discord.ext import commands

class Mod(commands.Cog):
  def __init__(self, bot):
    self.bot = bot

  @commands.command()
  @commands.has_permissions()
  async def kick(self, ctx, member: discord.Member, *, r = None):
    await member.kick(reason=r)
    await ctx.send(f"**{member}** was Kicked from this Server!")
  
  @commands.command()
  @commands.has_permissions()
  async def ban(self, ctx, member: discord.Member, *, r = None):
    await member.ban(reason=r)
    await ctx.send(f"**{member}** was Banned from this Server!")

  @commands.command()
  @commands.has_permissions(manage_roles=True)
  async def role(self, ctx, role: discord.Role, member: discord.Member = None):
    member = ctx.message.author if not(member) else (member)

    if role in member.roles:
      await member.remove_roles(role)
      await ctx.send(f"The Role **{role}** is Removed from **{member}**!")

    else:
      await member.add_roles(role)
      await ctx.send(f"**{member}** is Assigned the Role **{role}**!")

  @commands.command()
  @commands.has_permissions(manage_channels=True)
  async def cat(self, ctx, category_name):
    existing_category = discord.utils.get(ctx.guild.categories, name=category_name)
    await existing_category.delete()
  
  @commands.command(aliases=["create_text_channel", "create-text-channel", "create_tc", "create-tc"])
  @commands.has_permissions(manage_channels=True)
  async def ctc(self, ctx, channel_name: str, category_name: str = None):
    guild = ctx.message.guild

    if not(category_name):
      await guild.create_text_channel(channel_name)
      await ctx.send(f"Channel named **{channel_name}** was created!")
      return

    existing_category = discord.utils.get(ctx.guild.categories, name=category_name)

    if (existing_category is not None):
      await guild.create_text_channel(channel_name, category=existing_category)
      await ctx.send(f"Channel named **{channel_name}** was created!")
    
    else:
      await ctx.send(f"No Category named **{category_name}** was found!")
      await ctx.send(f"Would you like to make a Category named **{category_name}**?")
      await ctx.send("Reply with y/n:")

      try:
        reply = await self.bot.wait_for("message", timeout=10, check=lambda msg:(msg.author == ctx.author) and (msg.channel == ctx.channel))

        if (reply.content.lower() in ["y", "yes"]):
          new_category = await guild.create_category(category_name)
          await guild.create_text_channel(channel_name, category=new_category)

          await ctx.send(f"Channel named **{channel_name}** was created in a new Category **{category_name}**!")
        
        else:
          await ctx.send("No Channel was created!")
        
      except asyncio.TimeoutError:
        await ctx.send("The above Channel Creating Command has expired!")
  
  @commands.command(aliases=["create_voice_channel", "create-voice-channel", "create_vc", "create-vc"])
  @commands.has_permissions(manage_channels=True)
  async def cvc(self, ctx, channel_name: str, category_name: str = None):
    guild = ctx.message.guild

    if not(category_name):
      await guild.create_voice_channel(channel_name)
      await ctx.send(f"Channel named **{channel_name}** was created!")
      return

    existing_category = discord.utils.get(ctx.guild.categories, name=category_name)

    if (existing_category is not None):
      await guild.create_voice_channel(channel_name, category=existing_category)
      await ctx.send(f"Channel named **{channel_name}** was created!")
    
    else:
      await ctx.send(f"No Category named **{category_name}** was found!")
      await ctx.send(f"Would you like to make a Category named **{category_name}**?")
      await ctx.send("Reply with y/n:")

      try:
        reply = await self.bot.wait_for("message", timeout=10, check=lambda msg:(msg.author == ctx.author) and (msg.channel == ctx.channel))

        if (reply.content.lower() in ["y", "yes"]):
          new_category = await guild.create_category(category_name)
          await guild.create_text_channel(channel_name, category=new_category)

          await ctx.send(f"Channel named **{channel_name}** was created in a new Category **{category_name}**!")
        
        else:
          await ctx.send("No Channel was created!")
        
      except asyncio.TimeoutError:
        await ctx.send("The above Channel Creating Command has expired!")
  
  @commands.command(aliases=["delete_channel", "delete-channel"])
  @commands.has_permissions(manage_channels=True)
  async def dc(self, ctx, channel_name: str, category_name: str = None):
    try:
      existing_channel = discord.utils.get(ctx.guild.channels, id=int(channel_name))

      if (existing_channel is not None):
        await existing_channel.delete()
        await ctx.send(f"Channel of **ID: {channel_name}** was deleted!")
      
      else:
        await ctx.send(f"No Channel named **{channel_name}** was found!")
      
    except ValueError:
      if not(category_name):
        deleting_channel = discord.utils.get(ctx.guild.channels, name=channel_name)
        await deleting_channel.delete()
        await ctx.send(f"Channel named **{channel_name}** was deleted!")
        return

      existing_category = discord.utils.get(ctx.guild.categories, name=category_name)

      if (existing_category is not None):
        for channel in ctx.guild.channels:
          if (channel.name == channel_name) and (channel.category_id == existing_category.id):
            await channel.delete()
            await ctx.send(f"Channel named **{channel_name}** of Category **{category_name}** was deleted!")
            return
        
        await ctx.send(f"No Channel named **{channel_name}** was found!")
      
      else:
        await ctx.send(f"No Category named **{category_name}** was found!")

def setup(bot):
  bot.add_cog(Mod(bot))