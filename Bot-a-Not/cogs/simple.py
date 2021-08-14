import random
import urllib
import asyncio
import discord
from discord.ext import commands

class Simple(commands.Cog):
  def __init__(self, bot):
    self.bot = bot
  
  @commands.command()
  async def ping(self, ctx):
    #urllib.request.urlopen("https://bot-a-not.khz.repl.co/")
    urllib.request.urlopen("https://Old-Bot.wwemonstermonst.repl.co")
    await ctx.send(f"pong! The ping is {round(self.bot.latency * 1000)}ms⁻¹")

  @commands.command()
  async def pic(self, ctx, member: discord.Member = None):
    user = member if (member) else ctx.message.author
    await ctx.send(user.avatar_url)
  
  @commands.command(name="-_-")
  async def surprised(self, ctx):
    emojis = ["w(ﾟДﾟ)w", "┗|｀O′|┛", "(＃°Д°)", "\\（〇_ｏ）／", "(⊙ˍ⊙)", "(⊙_⊙)？", "¯\\(°_o)/¯", "(+_+)?", ".______.", "^_____^"]
    await ctx.send(random.choice(emojis))
  
  @commands.command()
  async def peek(self, ctx):
    await ctx.send("┬┴┬┴┤ ͜ʖ ͡°) ├┬┴┬┴┬")

  @commands.command()
  async def flip(self, ctx):
    await ctx.send("（╯°□°）╯︵(\\ .o.)\\")

  @commands.command()
  async def bob(self, ctx):
    await ctx.send(
      """This Is BOB
░░░░░▄▄▄░░▄██▄░░░‬
‪░░░░░▐▀█▀▌░░░░▀█▄░░░‬
‪░░░░░▐█▄█▌░░░░░░▀█▄░░‬
‪░░░░░░▀▄▀░░░▄▄▄▄▄▀▀░░‬
‪░░░░▄▄▄██▀▀▀▀░░░░░░░‬
‪░░░█▀▄▄▄█░▀▀░░‬
‪░░░▌░▄▄▄▐▌▀▀▀░░
‪▄░▐░░░▄▄░█░▀▀ ░░‬
‪▀█▌░░░▄░▀█▀░▀ ░░ Copy And Paste Him In Every chat‬
‪░░░░░░░▄▄▐▌▄▄░░░ So, He Can Take‬
‪░░░░░░░▀███▀█░▄░░ Over The Chat‬
‪░░░░░░▐▌▀▄▀▄▀▐▄░░ (dont spam him tho)‬
‪░░░░░░▐▀░░░░░░▐▌░░‬
‪░░░░░░█░░░░░░░░█░"""
    )

  @commands.command()
  async def typing(self, ctx):
    async with ctx.typing():
      await asyncio.sleep(2.5)

    await ctx.send("I was typing bro!!!")
    await ctx.send("Can I continue writing bro -_-")

    try:
      reply = await self.bot.wait_for("message", timeout=5, check=lambda msg:(msg.author == ctx.author) and (msg.channel == ctx.channel))

      if (reply.content.lower() in ("y", "yes")):
        await ctx.send("Thank you bro!")
      
      else:
        await ctx.send("**-_-**")
    
    except asyncio.TimeoutError:
      await ctx.send("You should have atleast Replied!")
    
  @commands.command()
  async def info(self, ctx, member: discord.Member = None):
    member = ctx.message.author if (member == None) else (member)
    roles = [role for role in member.roles]

    em = discord.Embed(
      colour = discord.Colour.red(), 
      timestamp = ctx.message.created_at,
      title = f"User - {member}"
    )

    em.set_thumbnail(url=member.avatar_url)
    em.set_footer(
      icon_url = ctx.author.avatar_url, 
      text=f"Requested by {ctx.author}"
    )

    em.add_field(name="ID:", value=member.id)
    em.add_field(name="Nickname:", value=member.display_name)

    em.add_field(
      name="Created Account On:", 
      value=member.created_at.strftime("%a, %#d %B %Y, %I:%M %p")
    )
    em.add_field(
      name="Joined Server On:", 
      value=member.joined_at.strftime("%a, %#d %B %Y, %I:%M %p")
    )

    em.add_field(name="Roles:", value="".join([role.mention for role in roles]))
    em.add_field(name="Highest Role:", value=member.top_role.mention)

    await ctx.send(embed=em)
  
def setup(bot):
  bot.add_cog(Simple(bot))