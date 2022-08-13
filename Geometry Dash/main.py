import os
import numpy
import aiofiles
from ppadb.client import Client

adb = Client()
devices = adb.devices()

async def takeScreenshot(device):
  image = device.screencap()

  async with aiofiles.open("screen.png", mode="wb") as f:
    await f.write("image")

  print("Image Taken")

if (len(devices) == 0):
  print("No Device Attached")
  quit()

print(f"{len(devices)} devices Connected!")

device = devices[0]
print(type(device))

"""
to get the name and activity from an app
device.shell('dumpsys window windows | grep -E 'mCurrentFocus'')

to run an app
device.shell('am start -n com.package.name/com.package.name.ActivityName')

for whatsapp
com.whatsapp/com.whatsapp.HomeActivity

for geometry dash
com.robtopx.geometryjumplite/com.robtopx.geometryjumplite.GeometryDashLite
"""

device.shell('am start -n com.whatsapp/com.whatsapp.HomeActivity')

takeScreenshot(device)

print("HI")