import os
import bpy
import math

object_name='Sphere'
texture_name='SphereTexture'

image_file = os.getenv('blender_texture')
if not image_file:
    raise NameError("No Texture specified")
output_path = os.getenv('blender_output')
if not output_path:
    raise NameError("No resolution specified")
resolution = int(os.getenv('blender_resolution'))
if not output_path:
    raise NameError("No steps count specified")
steps = int(os.getenv('blender_steps'))
if not steps:
    raise NameError("No step count specified")
initial = float(os.getenv('blender_initial'))
if not initial:
    initial = 0

bpy.ops.object.mode_set(mode='OBJECT')
bpy.ops.object.select_all(action='DESELECT')
bpy.data.objects[object_name].select = True
bpy.context.scene.objects.active = bpy.data.objects[object_name]

image_path = bpy.path.abspath("//%s" % image_file)
try:
    image = bpy.data.images.load(image_path)
except:
    raise NameError("Cannot load image %s" % image_path)

texture = bpy.data.textures.get(texture_name)
texture.image = image

bpy.ops.transform.rotate(value=initial)

scn = bpy.context.scene
scn.frame_start = 1
scn.frame_end = steps

bpy.context.user_preferences.edit.keyframe_new_interpolation_type ='LINEAR'

scn.frame_set(frame = 1);
bpy.context.active_object.keyframe_insert(data_path="rotation_euler")

for step in range(2,steps+1):
    scn.frame_set(frame = step)
    rotation=(1/steps)*math.pi*2
    bpy.ops.transform.rotate(value=-rotation)
    bpy.context.active_object.keyframe_insert(data_path="rotation_euler")

filepath=output_path+'/icon'
bpy.context.scene.render.filepath=filepath
bpy.context.scene.render.resolution_x = resolution
bpy.context.scene.render.resolution_y = resolution
