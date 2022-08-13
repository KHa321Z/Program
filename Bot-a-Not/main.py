import os
import time
import random
import urllib
import discord
from flask import Flask
from threading import Thread
from discord.ext import commands

class Website():
  def __init__(self):
    self.app = Flask(__name__)

    @self.app.route("/")
    def home():
      return ("Bot-a-Not has Connected to Discord!")

    site_thread = Thread(target=self.site_run)
    ping_thread = Thread(target=self.stay_alive)

    site_thread.start()
    ping_thread.start()
  
  def site_run(self):
    self.app.run(
      host = "0.0.0.0", 
      port = random.randint(2000, 9000)
    )

  def stay_alive(self):
    while True:
      start = time.time()

      while True:
        end = time.time()

        if ((end - start) >= (15 * 60)):
          urllib.request.urlopen("https://bot-a-not.khz.repl.co/")
          urllib.request.urlopen("https://old-bot.wwemonstermonst.repl.co/")
          break

intents = discord.Intents.default()
intents.members = True

bot = commands.Bot(
  command_prefix = ".", 
  intents=intents, 
  help_command = None
)

for filename in os.listdir("./cogs"):
  if filename.endswith(".py"):
    bot.load_extension(f"cogs.{filename[:-3]}")

website = Website()

bot.run(os.environ['DISCORD_TOKEN'])