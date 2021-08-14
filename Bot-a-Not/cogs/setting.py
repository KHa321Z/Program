import os
import discord
from discord.ext import commands

"""
Setting `Playing ` status
await bot.change_presence(activity=discord.Game(name="a game"))

Setting `Streaming ` status
await bot.change_presence(activity=discord.Streaming(name="My Stream", url=my_twitch_url))

Setting `Listening ` status
await bot.change_presence(activity=discord.Activity(type=discord.ActivityType.listening, name="a song"))

Setting `Watching ` status
await bot.change_presence(activity=discord.Activity(type=discord.ActivityType.watching, name="a movie"))
"""

class Settings(commands.Cog):
  def __init__(self, bot):
    self.bot = bot

  @commands.command()
  @commands.is_owner()
  async def clear(self, ctx):
    os.system("clear")

  @commands.command()
  @commands.is_owner()
  async def cogs(self, ctx):
    await ctx.send("List of Cogs:")
    ind = 1

    for filename in os.listdir("./cogs"):
      if (filename.endswith(".py")):
        await ctx.send(f"{ind}. {filename[:-3]}")
        ind += 1
  
  # cog reloader command, unload then load extenion
  @commands.command()
  @commands.is_owner()
  async def reload(self, ctx, *, extension):
    self.bot.unload_extension(f'cogs.{extension}')
    self.bot.load_extension(f'cogs.{extension}')
    await ctx.send(f'{extension} re-loaded')

  # cog unloader command
  @commands.command()
  @commands.is_owner()
  async def unload(self, ctx, *, extension):
    self.bot.unload_extension(f'cogs.{extension}')
    await ctx.send(f'{extension} unloaded')

  # cog loader command
  @commands.command()
  @commands.is_owner()
  async def load(self, ctx, *, extension):
    self.bot.load_extension(f'cogs.{extension}')
    await ctx.send(f'{extension} loaded')
  
  @commands.command()
  @commands.is_owner()
  async def act(self, ctx, activity, *, doing):
    help_cmd = " | .help"

    if (activity == "game"):
      await self.bot.change_presence(activity=discord.Game(name=(doing + help_cmd)))
    
    elif (activity == "movie"):
      await self.bot.change_presence(activity=discord.Activity(type=discord.ActivityType.watching, name=(doing + help_cmd)))
    
    elif (activity == "stream"):
      await self.bot.change_presence(activity=discord.Streaming(name=(doing + help_cmd), url="none"))
    
    elif (activity == "music"):
      await self.bot.change_presence(activity=discord.Activity(type=discord.ActivityType.listening, name=(doing + help_cmd)))
    
    else:
      await ctx.send("Your Command is Invalid!")
    
def setup(bot):
  bot.add_cog(Settings(bot))