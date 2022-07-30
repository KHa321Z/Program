execute at @e[tag=Speedrunner] run setworldspawn ~ ~ ~
execute if entity @a[name="KHaZ", tag=!Speedrunner, nbt=!{Inventory:[{id:"minecraft:compass"}]}] run give KHaZ minecraft:compass
execute if entity @a[name="RayChiha", tag=!Speedrunner, nbt=!{Inventory:[{id:"minecraft:compass"}]}] run give RayChiha minecraft:compass
execute if entity @a[name="sam", tag=!Speedrunner, nbt=!{Inventory:[{id:"minecraft:compass"}]}] run give sam minecraft:compass