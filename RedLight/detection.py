import cv2
import numpy as np
import pytesseract
from keras.models import load_model

input_width = 224
input_height = 224
# faster_rcnn_model_path = r"C:\Users\User\Downloads\faster_rcnn_inception_v2_coco_2018_01_28\saved_model"

# # Load the Faster R-CNN model
# faster_rcnn_model = load_model(faster_rcnn_model_path)

# Load YOLOv4 model
yolov4_config_path = r'C:\Users\User\Documents\GitHub\my-electron-app\RedLight\yolov4_new.cfg'
yolov4_weights_path = r'C:\Users\User\Documents\GitHub\my-electron-app\RedLight\yolov4.weights'
net = cv2.dnn.readNet(yolov4_weights_path, yolov4_config_path)

# Set up Tesseract OCR
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Function to check if a car is crossing the line
def is_crossing_line(car_bbox, line_start, line_end):
    car_x_min, car_y_min, car_x_max, car_y_max = car_bbox
    line_x1, line_y1 = line_start
    line_x2, line_y2 = line_end

    line_slope = (line_y2 - line_y1) / (line_x2 - line_x1)
    line_y_at_x_min = line_slope * (car_x_min - line_x1) + line_y1

    if car_y_min < line_y_at_x_min and car_y_max > line_y_at_x_min:
        return True

    return False

# Function for preprocessing the car plate region
def preprocess_image(car_region):
    # Convert to grayscale
    grayscale_image = cv2.cvtColor(car_region, cv2.COLOR_BGR2GRAY)

    # Apply image enhancement or other preprocessing techniques as required

    return grayscale_image

# Create a VideoCapture object to read video frames
video_path = r'C:\Users\User\Documents\GitHub\my-electron-app\RedLight\video.mp4'  # Replace with the actual path to your video file
cap = cv2.VideoCapture(video_path)

# Check if the video capture is successfully opened
if not cap.isOpened():
    print("Error opening video file!")
    exit()

# Read the first frame to determine the line position
ret, frame = cap.read()
if not ret:
    print("Error reading video frame!")
    exit()

# Define the line position
line_y = frame.shape[0] // 2 + 100 # y-coordinate for the line (horizontal position)
line_length = 700  # Length of the line


# Define the line start and end points
line_start = (frame.shape[1] // 2 - line_length // 2, line_y)  # Starting point of the line (x-coordinate, y-coordinate)
line_end = (frame.shape[1] // 2 + line_length // 2, line_y)  # Ending point of the line (x-coordinate, y-coordinate)

# Process video frames
while True:
    # Read a frame from the video
    ret, frame = cap.read()

    # Check if a frame was successfully read
    if not ret:
        break
    # Perform car detection on the frame
    blob = cv2.dnn.blobFromImage(frame, 1/255.0, (416, 416), swapRB=True, crop=False)
    net.setInput(blob)
    layer_names = net.getLayerNames()
    output_layers = [layer_names[i - 1] for i in net.getUnconnectedOutLayers()]

    outputs = net.forward(output_layers)

  # Filter for car detections
    cars_on_line = []
    class_ids = []
    confidences = []
    boxes = []
    for output in outputs:
        for detection in output:
            scores = detection[5:]
            class_id = np.argmax(scores)
            confidence = scores[class_id]
            if confidence > 0.1 and class_id == 2:  # Adjust the confidence threshold and class ID for cars
                center_x = int(detection[0] * frame.shape[1])
                center_y = int(detection[1] * frame.shape[0])
                width = int(detection[2] * frame.shape[1])
                height = int(detection[3] * frame.shape[0])
                x_min = int(center_x - width / 2)
                y_min = int(center_y - height / 2)
                x_max = int(center_x + width / 2)
                y_max = int(center_y + height / 2)
                if is_crossing_line((x_min, y_min, x_max, y_max), line_start, line_end):
                    cars_on_line.append((x_min, y_min, x_max, y_max))
                    class_ids.append(class_id)
                    confidences.append(confidence)
                    boxes.append([x_min, y_min, x_max, y_max])

    # Check if cars are detected
    if len(cars_on_line) > 0:
        print("Cars detected!")

    # Apply non-maxima suppression to eliminate overlapping bounding boxes
    indices = cv2.dnn.NMSBoxes(boxes, confidences, 0.5, 0.4)
    # Draw bounding boxes and annotations on the cars passing the line
    if len(indices) > 0:
        for i in indices.flatten():
            x_min, y_min, x_max, y_max = boxes[i]
            cv2.rectangle(frame, (x_min, y_min), (x_max, y_max), (0, 255, 0), 2)
            # Additional annotations or processing can be performed here


    # Draw the line on the frame
    cv2.line(frame, line_start, line_end, (0, 0, 255), 2)

    # Display the frame
    cv2.imshow('Frame', frame)

    # Exit loop if 'q' is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the VideoCapture object and close windows
cap.release()
cv2.destroyAllWindows()