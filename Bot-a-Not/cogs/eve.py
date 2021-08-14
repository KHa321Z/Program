import discord
from discord.ext import commands

class Events(commands.Cog):
  def __init__(self, bot):
    self.bot = bot

  @commands.Cog.listener()
  async def on_ready(self):
    print (f"{self.bot.user.name} has Connected to Discord!")
    await self.bot.change_presence(activity=discord.Game(name="Among Us! | .help"))
    #await self.bot.change_presence(status=discord.Status.invisible)
  
  @commands.Cog.listener()
  async def on_command_error(self, ctx, error):
    if isinstance(error, commands.CommandNotFound):
      await ctx.send(f"The Command **{ctx.message.content}** does not Exist! :expressionless:")
      await ctx.send("Plz check the help command `.help` for the list of commands!")
      return

    if isinstance(error, commands.MissingPermissions):
      await ctx.send(f"{ctx.author.name} is missing Permissions to use the Command! {ctx.message.content}")
      return
    
    if isinstance(error, commands.BotMissingPermissions):
      await ctx.send(f"{self.bot.user.name} is missing permissions to use the Command {ctx.message.content}!")
      return
    
    raise (error)
  
  @commands.Cog.listener()
  async def on_message(self, ctx):
    greeting = ["aoa", "assalam-u-alaikum", "assalam u alaikum", "assalam o alaikum", "assalam-o-alaikum"]

    if (ctx.author == self.bot.user):
      return
    
    if any(i in ctx.content.lower().split() for i in greeting):
      await ctx.channel.send("WS")

def setup(bot):
  bot.add_cog(Events(bot))