import discord
from discord.ext import commands

description = {
  "Ping": "Shows the Ping of the Bot", 
  "Act": "Changes Activity of the Bot", 
  "Id": "Shows Description about a Specific Member or Channel", 
  "-_-": "Shows a Random Surprised ASCII Emoji", 
  "Peek": "The Bot Peeks at You", 
  "Bob": "Spawns a Bob so He can take over the Chat"
}

emojis = ["⬅️", "➡️", "❌"]

class Help(commands.Cog):
  def __init__(self, bot):
    self.bot = bot

  @commands.group(invoke_without_command=True)
  async def help(self, ctx):
    em = discord.Embed(
      title = "Help", 
      description = "The Prefix of this Bot is ` . ` \nListing all top-level Commands. \nSpecify a Command to see Extended Information in the following Format: \n` .help <cmd> `", 
      color = discord.Color.red()
    )
    em.set_footer(
      icon_url = ctx.author.avatar_url, 
      text = f"Requested by {ctx.author}"
    )

    for cmd in description:
      em.add_field(
        name = cmd, 
        value = description[cmd], 
        inline = True
      )

    message = await ctx.send(embed=em)

    for emoji in emojis:
      await message.add_reaction(emoji)
  
  @help.command(aliases=[".ping", "ping"])
  async def Ping(self, ctx):
    em = discord.Embed(
      title = "Ping", 
      description = description["ping"], 
      color = discord.Color.red()
    )

    await ctx.send(embed=em)
  
  @help.command(aliases=[".act", "act"])
  async def Act(self, ctx):
    em = discord.Embed(
      title = "Act", 
      description = description["act"], 
      color = discord.Color.red()
    )

    await ctx.send(embed=em)
  
  @help.command(aliases=[".id", "id", "ID"])
  async def Id(self, ctx):
    em = discord.Embed(
      title = "ID", 
      description = description["id"], 
      color = discord.Color.red()
    )

    await ctx.send(embed=em)
  
  @help.command(name="-_-", aliases=[".-_-"])
  async def Surprised(self, ctx):
    em = discord.Embed(
      title = "-_-", 
      description = description["-_-"], 
      color = discord.Color.red()
    )

    await ctx.send(embed=em)
  
  @help.command(aliases=[".peek", "peek"])
  async def Peek(self, ctx):
    em = discord.Embed(
      title = "Peek", 
      description = description["peek"], 
      color = discord.Color.red()
    )

    await ctx.send(embed=em)
  
  @help.command(aliases=[".bob", "bob"])
  async def Bob(self, ctx):
    em = discord.Embed(
      title = "Bob", 
      description = description["bob"], 
      color = discord.Color.red()
    )

    await ctx.send(embed=em)

def setup(bot):
  bot.add_cog(Help(bot))