'''
texture image path are relative to the blend file directory. run from command line like this:
 
blender_texture='erect.jpg' blender_output='/dir' blender_steps='180' blender_initial='0.33' blender -b sphere.blend --python render_preview.py -F PNG -s 1 -e 180 -j 1 -t 0 -a
'''
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
    raise NameError("No output path specified")
steps = int(os.getenv('blender_steps'))
if not steps:
    raise NameError("No step count specified")
initial = float(os.getenv('blender_initial'))
if not initial:
    initial = 0

bpy.ops.object.select_all(action = 'DESELECT')
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
