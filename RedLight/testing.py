import cv2
import numpy as np
import tensorflow as tf

iou_threshold = 0.5
y_offset = 40  

# Load Intersection Detection Model
intersection_model_path = r"C:\Users\User\Downloads\faster_rcnn_inception_v2_coco_2018_01_28\saved_model"
intersection_model = tf.saved_model.load(intersection_model_path)
signature_keys = list(intersection_model.signatures.keys())

# Load the Image
image_path = r'C:\Users\User\Documents\GitHub\my-electron-app\RedLight\intersection.jpg'
image = cv2.imread(image_path)
image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)  # Convert BGR to RGB

# Convert image to float32
image_rgb = image_rgb.astype(np.float32)

# Add an extra dimension to the image tensor
image_tensor = tf.expand_dims(image_rgb, axis=0)

# Preprocess the Image
preprocessed_image = tf.cast(image_tensor, dtype=tf.uint8)

model_signature = intersection_model.signatures['serving_default']
detections = model_signature(preprocessed_image)

# Run Intersection Detection Model
intersection_boxes = []
for box, score, class_id in zip(
    detections['detection_boxes'][0].numpy(),
    detections['detection_scores'][0].numpy(),
    detections['detection_classes'][0].numpy().astype(np.int32)
):
    if score > 0.5 and class_id == 10:  # Class ID for traffic light (change if needed)
        intersection_boxes.append(box)

# Determine Intersection Region
intersection_boxes = np.array(intersection_boxes)
xmin = int(np.min(intersection_boxes[:, 1]) * image.shape[1])
ymin = int(np.min(intersection_boxes[:, 0]) * image.shape[0])
xmax = int(np.max(intersection_boxes[:, 3]) * image.shape[1])
ymax = int(np.max(intersection_boxes[:, 2]) * image.shape[0])

# Adjust Intersection Region
y_adjustment = 60  # Increase this value to move the region lower
ymin += y_adjustment
ymax += y_adjustment

height_increase = 100  # Increase this value to expand the region height

ymin -= height_increase
ymax += height_increase
# Draw Intersection Region Bounding Box
cv2.rectangle(image, (xmin, ymin), (xmax, ymax), (0, 0, 255), 2)

cv2.imshow('Intersection Region', image)
cv2.waitKey(0)
cv2.destroyAllWindows()