# Computer Vision - Practical Guide

## Table of Contents
1. [Setting Up Computer Vision Environment](#setting-up-computer-vision-environment)
2. [Basic Image Processing](#basic-image-processing)
3. [Object Detection in Real-Time](#object-detection-in-real-time)
4. [Face Detection and Recognition](#face-detection-and-recognition)
5. [Image Classification Project](#image-classification-project)
6. [Image Segmentation](#image-segmentation)
7. [Style Transfer](#style-transfer)
8. [Real-World Applications](#real-world-applications)

---

## Setting Up Computer Vision Environment

### Installation

```bash
# Core libraries
pip install opencv-python opencv-contrib-python
pip install pillow scikit-image
pip install tensorflow torch torchvision
pip install matplotlib numpy pandas
pip install ultralytics  # For YOLO
```

---

## Basic Image Processing

### Loading and Displaying Images

```python
import cv2
import numpy as np
import matplotlib.pyplot as plt
from PIL import Image

# Method 1: Using OpenCV
img_cv = cv2.imread('image.jpg')
img_cv = cv2.cvtColor(img_cv, cv2.COLOR_BGR2RGB)  # OpenCV uses BGR

# Method 2: Using PIL
img_pil = Image.open('image.jpg')
img_pil = np.array(img_pil)

# Display
plt.figure(figsize=(10, 5))
plt.subplot(1, 2, 1)
plt.imshow(img_cv)
plt.title('OpenCV Image')
plt.axis('off')

plt.subplot(1, 2, 2)
plt.imshow(img_pil)
plt.title('PIL Image')
plt.axis('off')
plt.tight_layout()
plt.show()
```

### Image Transformations

```python
# Resize
resized = cv2.resize(img_cv, (224, 224))

# Rotate
(h, w) = img_cv.shape[:2]
center = (w // 2, h // 2)
M = cv2.getRotationMatrix2D(center, 45, 1.0)
rotated = cv2.warpAffine(img_cv, M, (w, h))

# Flip
flipped_horizontal = cv2.flip(img_cv, 1)
flipped_vertical = cv2.flip(img_cv, 0)

# Crop
cropped = img_cv[100:300, 200:400]

# Brightness and Contrast
alpha = 1.5  # Contrast
beta = 30    # Brightness
adjusted = cv2.convertScaleAbs(img_cv, alpha=alpha, beta=beta)
```

### Edge Detection

```python
# Convert to grayscale
gray = cv2.cvtColor(img_cv, cv2.COLOR_RGB2GRAY)

# Canny edge detection
edges = cv2.Canny(gray, 100, 200)

# Sobel edges
sobelx = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
sobely = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)
sobel_combined = np.sqrt(sobelx**2 + sobely**2)

plt.figure(figsize=(15, 5))
plt.subplot(1, 3, 1)
plt.imshow(gray, cmap='gray')
plt.title('Original Grayscale')
plt.axis('off')

plt.subplot(1, 3, 2)
plt.imshow(edges, cmap='gray')
plt.title('Canny Edges')
plt.axis('off')

plt.subplot(1, 3, 3)
plt.imshow(sobel_combined, cmap='gray')
plt.title('Sobel Edges')
plt.axis('off')
plt.tight_layout()
plt.show()
```

### Feature Detection

```python
# Harris Corner Detection
gray_float = np.float32(gray)
corners = cv2.cornerHarris(gray_float, 2, 3, 0.04)
corners = cv2.dilate(corners, None)
img_corners = img_cv.copy()
img_corners[corners > 0.01 * corners.max()] = [255, 0, 0]

# SIFT Features
sift = cv2.SIFT_create()
keypoints, descriptors = sift.detectAndCompute(gray, None)

# Draw keypoints
img_keypoints = cv2.drawKeypoints(img_cv, keypoints, None, 
                                 flags=cv2.DRAW_MATCHES_FLAGS_DRAW_RICH_KEYPOINTS)

plt.figure(figsize=(15, 5))
plt.subplot(1, 3, 1)
plt.imshow(img_corners)
plt.title('Harris Corners')
plt.axis('off')

plt.subplot(1, 3, 2)
plt.imshow(img_keypoints)
plt.title(f'SIFT Keypoints ({len(keypoints)})')
plt.axis('off')
plt.tight_layout()
plt.show()
```

---

## Object Detection in Real-Time

### Using YOLO (You Only Look Once)

```python
from ultralytics import YOLO
import cv2

# Load YOLO model
model = YOLO('yolov8n.pt')  # nano version (fastest)

# Detect objects in image
results = model('image.jpg')

# Display results
for result in results:
    # Draw bounding boxes
    annotated_image = result.plot()
    cv2.imshow('Detection', annotated_image)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
    
    # Print detected objects
    for box in result.boxes:
        class_id = int(box.cls[0])
        confidence = float(box.conf[0])
        class_name = model.names[class_id]
        print(f"{class_name}: {confidence:.2f}")
```

### Real-Time Video Detection

```python
# Open webcam
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break
    
    # Run detection
    results = model(frame)
    
    # Draw results
    annotated_frame = results[0].plot()
    
    # Display
    cv2.imshow('Real-Time Detection', annotated_frame)
    
    # Press 'q' to quit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
```

### Custom Object Detection Training

```python
from ultralytics import YOLO

# Load pre-trained model
model = YOLO('yolov8n.pt')

# Train on custom dataset
# Dataset format: YOLO format (images + labels)
model.train(
    data='custom_dataset.yaml',  # Dataset config file
    epochs=100,
    imgsz=640,
    batch=16,
    name='custom_detector'
)

# Use trained model
trained_model = YOLO('runs/detect/custom_detector/weights/best.pt')
results = trained_model('test_image.jpg')
```

---

## Face Detection and Recognition

### Face Detection with OpenCV

```python
# Load face cascade
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
)

# Load image
img = cv2.imread('photo.jpg')
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Detect faces
faces = face_cascade.detectMultiScale(
    gray,
    scaleFactor=1.1,
    minNeighbors=5,
    minSize=(30, 30)
)

# Draw rectangles around faces
for (x, y, w, h) in faces:
    cv2.rectangle(img, (x, y), (x+w, y+h), (255, 0, 0), 2)

# Display
plt.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
plt.axis('off')
plt.title(f'Detected {len(faces)} faces')
plt.show()
```

### Face Recognition with face_recognition Library

```python
import face_recognition
from PIL import Image, ImageDraw

# Load images
known_image = face_recognition.load_image_file("known_person.jpg")
unknown_image = face_recognition.load_image_file("unknown_person.jpg")

# Get face encodings
known_encoding = face_recognition.face_encodings(known_image)[0]
unknown_encodings = face_recognition.face_encodings(unknown_image)

# Compare faces
for unknown_encoding in unknown_encodings:
    results = face_recognition.compare_faces([known_encoding], unknown_encoding)
    distance = face_recognition.face_distance([known_encoding], unknown_encoding)
    
    print(f"Match: {results[0]}")
    print(f"Distance: {distance[0]:.4f}")
```

### Real-Time Face Recognition

```python
import face_recognition
import cv2

# Load known faces
known_face_encodings = []
known_face_names = []

# Load and encode known faces
person1_image = face_recognition.load_image_file("person1.jpg")
person1_encoding = face_recognition.face_encodings(person1_image)[0]
known_face_encodings.append(person1_encoding)
known_face_names.append("Person 1")

# Initialize video capture
video_capture = cv2.VideoCapture(0)

while True:
    ret, frame = video_capture.read()
    rgb_frame = frame[:, :, ::-1]  # Convert BGR to RGB
    
    # Find faces
    face_locations = face_recognition.face_locations(rgb_frame)
    face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)
    
    # Recognize faces
    for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
        matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
        name = "Unknown"
        
        if True in matches:
            first_match_index = matches.index(True)
            name = known_face_names[first_match_index]
        
        # Draw box and label
        cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
        cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (0, 255, 0), cv2.FILLED)
        cv2.putText(frame, name, (left + 6, bottom - 6), 
                   cv2.FONT_HERSHEY_DUPLEX, 0.6, (255, 255, 255), 1)
    
    cv2.imshow('Video', frame)
    
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

video_capture.release()
cv2.destroyAllWindows()
```

---

## Image Classification Project

### Problem Statement
Classify images into categories (e.g., cats vs dogs, or custom categories).

### Step 1: Prepare Dataset

```python
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import matplotlib.pyplot as plt

# Data directories
train_dir = 'data/train'
validation_dir = 'data/validation'

# Data augmentation
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=40,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    fill_mode='nearest'
)

validation_datagen = ImageDataGenerator(rescale=1./255)

# Create generators
train_generator = train_datagen.flow_from_directory(
    train_dir,
    target_size=(150, 150),
    batch_size=32,
    class_mode='binary'
)

validation_generator = validation_datagen.flow_from_directory(
    validation_dir,
    target_size=(150, 150),
    batch_size=32,
    class_mode='binary'
)
```

### Step 2: Build CNN Model

**What We're Trying to Achieve:**
- Create a CNN that can distinguish between cats and dogs in images
- The model learns to detect visual features (fur patterns, ear shapes, etc.)
- Output a probability: how likely the image is a dog (or cat)

**Why This Architecture?**
- **Convolutional layers**: Detect visual patterns (edges, textures, shapes)
- **Pooling**: Reduce image size, make detection position-invariant
- **Dense layers**: Combine detected features for final classification
- **Dropout**: Prevent overfitting to training images

```python
from tensorflow.keras import layers, models

# Sequential model: layers process data in order
model = models.Sequential([
    # First Conv layer: Detects basic patterns (edges, colors)
    # 32 filters: Each learns different pattern (vertical lines, horizontal, curves, etc.)
    # (3, 3): 3x3 pixel filter size - standard size, good balance
    # input_shape=(150, 150, 3): Images resized to 150x150, 3 color channels (RGB)
    layers.Conv2D(32, (3, 3), activation='relu', input_shape=(150, 150, 3)),
    # Output: (148, 148, 32) - slightly smaller, 32 feature maps
    
    # MaxPooling: Reduces size by taking max in 2x2 regions
    # (148, 148) → (74, 74) - halves dimensions, reduces computation
    # Makes model robust to small shifts/rotations
    layers.MaxPooling2D((2, 2)),
    
    # Second Conv layer: Detects more complex patterns
    # 64 filters: More patterns = better feature detection
    # Takes 32 feature maps from previous layer as input
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),  # (74, 74) → (37, 37)
    
    # Third Conv layer: Detects high-level features
    # 128 filters: Even more complex patterns (faces, body shapes)
    layers.Conv2D(128, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),  # (37, 37) → (18, 18)
    
    # Fourth Conv layer: Very high-level features
    layers.Conv2D(128, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),  # (18, 18) → (9, 9)
    
    # Flatten: Convert 2D feature maps to 1D vector
    # (9, 9, 128) → (10368,) - one long vector
    # Needed for dense layers which require 1D input
    layers.Flatten(),
    
    # Dropout: Randomly disable 50% of neurons during training
    # Prevents overfitting: forces model to not rely on specific neurons
    # During prediction, all neurons active
    layers.Dropout(0.5),
    
    # Dense layer: Combines all detected features
    # 512 neurons: Processes the 10,368 flattened features
    # Learns which feature combinations indicate cat vs dog
    layers.Dense(512, activation='relu'),
    
    # Output layer: Single neuron with sigmoid activation
    # Sigmoid outputs probability between 0 and 1
    # 0.0-0.5 = cat, 0.5-1.0 = dog (or vice versa, depends on labeling)
    layers.Dense(1, activation='sigmoid')
])

# Compile: Configure training
model.compile(
    optimizer='adam',  # Adam optimizer: adaptive, works well
    loss='binary_crossentropy',  # Loss for binary classification (2 classes)
    # Measures difference between predicted probability and true label (0 or 1)
    metrics=['accuracy']  # Track percentage of correct predictions
)

# Display architecture
model.summary()
# Shows: each layer, output shapes, number of parameters
# Helps verify model structure is correct
```

### Step 3: Train Model

```python
history = model.fit(
    train_generator,
    steps_per_epoch=100,
    epochs=30,
    validation_data=validation_generator,
    validation_steps=50
)

# Save model
model.save('image_classifier.h5')
```

### Step 4: Use Transfer Learning

```python
from tensorflow.keras.applications import VGG16

# Load pre-trained VGG16
base_model = VGG16(
    weights='imagenet',
    include_top=False,
    input_shape=(150, 150, 3)
)

# Freeze base model
base_model.trainable = False

# Add custom head
model = models.Sequential([
    base_model,
    layers.Flatten(),
    layers.Dense(256, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(1, activation='sigmoid')
])

model.compile(
    optimizer='adam',
    loss='binary_crossentropy',
    metrics=['accuracy']
)

# Train
history = model.fit(
    train_generator,
    steps_per_epoch=100,
    epochs=20,
    validation_data=validation_generator,
    validation_steps=50
)
```

---

## Image Segmentation

### Semantic Segmentation

```python
import tensorflow as tf
from tensorflow import keras
import numpy as np

# Using pre-trained segmentation model
# You can use models like DeepLab, U-Net, etc.

# Example: Simple segmentation with U-Net architecture
def build_unet(input_shape=(256, 256, 3)):
    inputs = keras.Input(shape=input_shape)
    
    # Encoder
    c1 = layers.Conv2D(64, (3, 3), activation='relu', padding='same')(inputs)
    c1 = layers.Conv2D(64, (3, 3), activation='relu', padding='same')(c1)
    p1 = layers.MaxPooling2D((2, 2))(c1)
    
    c2 = layers.Conv2D(128, (3, 3), activation='relu', padding='same')(p1)
    c2 = layers.Conv2D(128, (3, 3), activation='relu', padding='same')(c2)
    p2 = layers.MaxPooling2D((2, 2))(c2)
    
    # Bottleneck
    c3 = layers.Conv2D(256, (3, 3), activation='relu', padding='same')(p2)
    c3 = layers.Conv2D(256, (3, 3), activation='relu', padding='same')(c3)
    
    # Decoder
    u1 = layers.UpSampling2D((2, 2))(c3)
    u1 = layers.Conv2D(128, (2, 2), activation='relu', padding='same')(u1)
    u1 = layers.concatenate([u1, c2])
    u1 = layers.Conv2D(128, (3, 3), activation='relu', padding='same')(u1)
    
    u2 = layers.UpSampling2D((2, 2))(u1)
    u2 = layers.Conv2D(64, (2, 2), activation='relu', padding='same')(u2)
    u2 = layers.concatenate([u2, c1])
    u2 = layers.Conv2D(64, (3, 3), activation='relu', padding='same')(u2)
    
    outputs = layers.Conv2D(1, (1, 1), activation='sigmoid')(u2)
    
    model = keras.Model(inputs, outputs)
    return model

# Build model
model = build_unet()
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
```

### Instance Segmentation with Mask R-CNN

```python
# Using detectron2 or similar library
# This is a complex model, here's a simplified example

import cv2
import numpy as np

# For production, use pre-trained models like:
# - Mask R-CNN from TensorFlow Model Zoo
# - Detectron2 from Facebook
# - YOLO with segmentation

# Example using YOLO segmentation
from ultralytics import YOLO

# Load segmentation model
model = YOLO('yolov8n-seg.pt')  # Segmentation version

# Run segmentation
results = model('image.jpg')

# Get masks
for result in results:
    masks = result.masks  # Segmentation masks
    boxes = result.boxes   # Bounding boxes
    
    # Visualize
    annotated = result.plot()
    cv2.imshow('Segmentation', annotated)
    cv2.waitKey(0)
```

---

## Style Transfer

### Neural Style Transfer

```python
import tensorflow as tf
import numpy as np
from tensorflow.keras.applications import vgg19
from PIL import Image
import matplotlib.pyplot as plt

def load_and_preprocess_image(image_path, max_dim=512):
    img = tf.io.read_file(image_path)
    img = tf.image.decode_image(img, channels=3)
    img = tf.image.convert_image_dtype(img, tf.float32)
    
    shape = tf.cast(tf.shape(img)[:-1], tf.float32)
    long_dim = max(shape)
    scale = max_dim / long_dim
    
    new_shape = tf.cast(shape * scale, tf.int32)
    img = tf.image.resize(img, new_shape)
    img = img[tf.newaxis, :]
    return img

def deprocess_image(img):
    img = 255 * (img + 1.0) / 2.0
    return tf.cast(img, tf.uint8)

# Load images
content_image = load_and_preprocess_image('content.jpg')
style_image = load_and_preprocess_image('style.jpg')

# Load VGG19
vgg = vgg19.VGG19(include_top=False, weights='imagenet')
vgg.trainable = False

# Define style and content layers
content_layers = ['block5_conv2']
style_layers = [
    'block1_conv1',
    'block2_conv1',
    'block3_conv1',
    'block4_conv1',
    'block5_conv1'
]

# Extract features
def get_model():
    outputs = [vgg.get_layer(name).output for name in (style_layers + content_layers)]
    model = tf.keras.Model([vgg.input], outputs)
    return model

# Style transfer function (simplified - full implementation is more complex)
# This requires iterative optimization
```

### Using Pre-trained Style Transfer

```python
# Use existing implementations like:
# - TensorFlow Hub models
# - PyTorch style transfer models
# - Online APIs

import tensorflow_hub as hub

# Load style transfer model
hub_model = hub.load('https://tfhub.dev/google/magenta/arbitrary-image-stylization-v1-256/2')

# Apply style transfer
stylized_image = hub_model(tf.constant(content_image), 
                           tf.constant(style_image))[0]

# Display
plt.figure(figsize=(12, 4))
plt.subplot(1, 3, 1)
plt.imshow(content_image[0])
plt.title('Content Image')
plt.axis('off')

plt.subplot(1, 3, 2)
plt.imshow(style_image[0])
plt.title('Style Image')
plt.axis('off')

plt.subplot(1, 3, 3)
plt.imshow(stylized_image[0])
plt.title('Stylized Image')
plt.axis('off')
plt.tight_layout()
plt.show()
```

---

## Real-World Applications

### Application 1: License Plate Recognition

```python
import cv2
import pytesseract

# Load image
img = cv2.imread('car.jpg')
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Detect license plate region (simplified)
# In practice, use object detection or template matching
plate_region = gray[100:200, 200:400]  # Example region

# OCR to read text
text = pytesseract.image_to_string(plate_region, 
                                   config='--psm 8 -c tessedit_char_whitelist=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ')
print(f"License Plate: {text.strip()}")
```

### Application 2: Document Scanner

```python
import cv2
import numpy as np

def detect_document(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Edge detection
    edges = cv2.Canny(gray, 75, 200)
    
    # Find contours
    contours, _ = cv2.findContours(edges, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    contours = sorted(contours, key=cv2.contourArea, reverse=True)[:5]
    
    # Find document contour
    for contour in contours:
        peri = cv2.arcLength(contour, True)
        approx = cv2.approxPolyDP(contour, 0.02 * peri, True)
        
        if len(approx) == 4:
            doc_contour = approx
            break
    
    # Perspective transform
    pts = doc_contour.reshape(4, 2)
    rect = order_points(pts)
    (tl, tr, br, bl) = rect
    
    widthA = np.sqrt(((br[0] - bl[0]) ** 2) + ((br[1] - bl[1]) ** 2))
    widthB = np.sqrt(((tr[0] - tl[0]) ** 2) + ((tr[1] - tl[1]) ** 2))
    maxWidth = max(int(widthA), int(widthB))
    
    heightA = np.sqrt(((tr[0] - br[0]) ** 2) + ((tr[1] - br[1]) ** 2))
    heightB = np.sqrt(((tl[0] - bl[0]) ** 2) + ((tl[1] - bl[1]) ** 2))
    maxHeight = max(int(heightA), int(heightB))
    
    dst = np.array([
        [0, 0],
        [maxWidth - 1, 0],
        [maxWidth - 1, maxHeight - 1],
        [0, maxHeight - 1]], dtype="float32")
    
    M = cv2.getPerspectiveTransform(rect, dst)
    warped = cv2.warpPerspective(image, M, (maxWidth, maxHeight))
    
    return warped

# Usage
img = cv2.imread('document.jpg')
scanned = detect_document(img)
cv2.imshow('Scanned Document', scanned)
cv2.waitKey(0)
```

### Application 3: Motion Detection

```python
import cv2

# Initialize video capture
cap = cv2.VideoCapture(0)

# Background subtractor
fgbg = cv2.createBackgroundSubtractorMOG2()

while True:
    ret, frame = cap.read()
    if not ret:
        break
    
    # Apply background subtraction
    fgmask = fgbg.apply(frame)
    
    # Find contours
    contours, _ = cv2.findContours(fgmask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Draw bounding boxes
    for contour in contours:
        if cv2.contourArea(contour) > 500:  # Filter small contours
            x, y, w, h = cv2.boundingRect(contour)
            cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
    
    cv2.imshow('Motion Detection', frame)
    cv2.imshow('Foreground Mask', fgmask)
    
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
```

---

## Best Practices

1. **Preprocess images** consistently (resize, normalize)
2. **Use data augmentation** to improve generalization
3. **Start with pre-trained models** (transfer learning)
4. **Monitor training** with validation data
5. **Handle edge cases** (different image sizes, formats)
6. **Optimize for deployment** (model quantization, pruning)
7. **Test on diverse data** to ensure robustness

---

## Next Steps

1. Practice with real-world datasets
2. Experiment with different architectures
3. Learn about advanced techniques (attention, transformers for vision)
4. Explore video processing
5. Study 3D computer vision
6. Build end-to-end applications

---

*Practice with real images and videos to master computer vision!*

