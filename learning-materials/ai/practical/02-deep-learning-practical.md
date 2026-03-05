# Deep Learning - Practical Guide

## Table of Contents
1. [Setting Up Deep Learning Environment](#setting-up-deep-learning-environment)
2. [Your First Neural Network: Handwritten Digit Recognition](#your-first-neural-network-handwritten-digit-recognition)
3. [Image Classification with CNNs](#image-classification-with-cnns)
4. [Text Classification with Neural Networks](#text-classification-with-neural-networks)
5. [Transfer Learning: Using Pre-trained Models](#transfer-learning-using-pre-trained-models)
6. [Building a Custom CNN for Custom Dataset](#building-a-custom-cnn-for-custom-dataset)
7. [Hyperparameter Tuning](#hyperparameter-tuning)
8. [Deploying Deep Learning Models](#deploying-deep-learning-models)

---

## Setting Up Deep Learning Environment

### Installation

```bash
# Install TensorFlow
pip install tensorflow

# Or install PyTorch (choose based on your preference)
pip install torch torchvision torchaudio

# Additional useful packages
pip install matplotlib seaborn pandas numpy scikit-learn jupyter
```

### Verify GPU (Optional but Recommended)

```python
import tensorflow as tf

# Check if GPU is available
print("GPU Available: ", tf.config.list_physical_devices('GPU'))
print("TensorFlow version: ", tf.__version__)

# If using PyTorch
import torch
print("PyTorch version: ", torch.__version__)
print("CUDA available: ", torch.cuda.is_available())
```

---

## Your First Neural Network: Handwritten Digit Recognition

### Problem Statement
Classify handwritten digits (0-9) using a simple neural network.

### Step 1: Load and Explore Data

```python
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np
import matplotlib.pyplot as plt

# Load MNIST dataset
(x_train, y_train), (x_test, y_test) = keras.datasets.mnist.load_data()

print(f"Training data shape: {x_train.shape}")
print(f"Test data shape: {x_test.shape}")
print(f"Labels shape: {y_train.shape}")
print(f"Pixel value range: {x_train.min()} to {x_train.max()}")

# Visualize some samples
fig, axes = plt.subplots(2, 5, figsize=(12, 5))
for i, ax in enumerate(axes.flat):
    ax.imshow(x_train[i], cmap='gray')
    ax.set_title(f'Label: {y_train[i]}')
    ax.axis('off')
plt.tight_layout()
plt.show()
```

### Step 2: Preprocess Data

```python
# Normalize pixel values to [0, 1]
x_train = x_train.astype('float32') / 255.0
x_test = x_test.astype('float32') / 255.0

# Reshape: Flatten 28x28 images to 784 pixels
x_train = x_train.reshape(x_train.shape[0], 784)
x_test = x_test.reshape(x_test.shape[0], 784)

# One-hot encode labels
y_train = keras.utils.to_categorical(y_train, 10)
y_test = keras.utils.to_categorical(y_test, 10)

print(f"Training shape after reshape: {x_train.shape}")
print(f"Labels shape after encoding: {y_train.shape}")
```

### Step 3: Build Neural Network

**What We're Trying to Achieve:**
- Create a neural network architecture that can learn to recognize handwritten digits
- Design layers that progressively extract features from pixel data
- Configure the network to output probabilities for each digit (0-9)

**Why This Architecture?**
- **Dense layers**: Fully connected layers that learn complex patterns
- **ReLU activation**: Introduces non-linearity, helps learn complex relationships
- **Dropout**: Prevents overfitting by randomly disabling neurons during training
- **Softmax output**: Converts raw scores to probabilities (sums to 1)

```python
# Create Sequential model - layers are stacked one after another
# Sequential is simplest model type: data flows from input → layer1 → layer2 → output
model = keras.Sequential([
    # First hidden layer: 128 neurons
    # Input shape: (784,) means 784 input features (28x28 pixels flattened)
    # ReLU activation: f(x) = max(0, x) - only passes positive values
    # This layer learns to detect basic patterns (edges, curves)
    layers.Dense(128, activation='relu', input_shape=(784,)),
    
    # Dropout: Randomly sets 20% of neurons to 0 during training
    # Why? Prevents model from memorizing training data (overfitting)
    # During prediction, all neurons are active
    layers.Dropout(0.2),
    
    # Second hidden layer: 64 neurons
    # Takes output from first layer (128 values) as input
    # Learns more complex patterns by combining features from first layer
    layers.Dense(64, activation='relu'),
    
    # Another dropout layer for regularization
    layers.Dropout(0.2),
    
    # Output layer: 10 neurons (one for each digit: 0-9)
    # Softmax activation: Converts 10 raw scores to probabilities
    # Example output: [0.1, 0.05, 0.7, 0.05, ...] means 70% chance it's digit "2"
    # All probabilities sum to 1.0
    layers.Dense(10, activation='softmax')
])

# Compile model: Configure how model will be trained
model.compile(
    optimizer='adam',  # Adam optimizer: adaptive learning rate, works well in practice
    # Adam automatically adjusts learning rate for each parameter
    # Better than basic gradient descent
    
    loss='categorical_crossentropy',  # Loss function for multi-class classification
    # Measures difference between predicted probabilities and true labels
    # Lower loss = better predictions
    # Categorical because we have multiple classes (10 digits)
    
    metrics=['accuracy']  # Track accuracy during training
    # Accuracy = (correct predictions) / (total predictions)
    # Easy to interpret: 0.95 = 95% correct
)

# Display model architecture
# Shows: layer types, output shapes, number of parameters
# Helps verify architecture is correct
model.summary()
# Example output shows:
# - Layer 1: 128 neurons, 100,480 parameters (784*128 + 128 biases)
# - Layer 2: 64 neurons, 8,256 parameters
# - Output: 10 neurons, 650 parameters
# Total: ~109,000 trainable parameters
```

### Step 4: Train Model

**What We're Trying to Achieve:**
- Train the neural network to recognize handwritten digits
- The model will learn from examples, adjusting its weights to minimize prediction errors
- Track training progress to see if model is learning correctly

**Key Concepts:**
- **Epoch**: One complete pass through all training data
- **Batch**: Group of samples processed together (for efficiency)
- **Validation**: Test on held-out data to check generalization

```python
# Train the model
# This is where the actual learning happens!
history = model.fit(
    x_train, y_train,  # Training data: images and their correct labels
    # Model will see these examples and learn patterns
    
    batch_size=128,  # Process 128 images at a time
    # Why batches? More efficient than one-by-one
    # Larger batches = faster but need more memory
    # Smaller batches = slower but can be more accurate
    
    epochs=10,  # Train for 10 complete passes through training data
    # Each epoch: model sees all training examples once
    # More epochs = more learning, but risk of overfitting
    # Start with 10, increase if needed
    
    validation_split=0.2,  # Use 20% of training data for validation
    # Validation set: test model during training (not used for learning)
    # Helps detect overfitting: if validation accuracy stops improving, stop training
    # Model never sees validation labels during training
    
    verbose=1  # Show progress: 0=silent, 1=progress bar, 2=one line per epoch
)

# history object contains training metrics
# history.history['accuracy'] - training accuracy per epoch
# history.history['val_accuracy'] - validation accuracy per epoch
# history.history['loss'] - training loss per epoch
# history.history['val_loss'] - validation loss per epoch

# What to watch for:
# - Training accuracy should increase
# - Validation accuracy should also increase
# - If validation accuracy plateaus or decreases: model is overfitting
# - If both increase steadily: model is learning well
```

### Step 5: Evaluate Model

```python
# Evaluate on test set
test_loss, test_accuracy = model.evaluate(x_test, y_test, verbose=0)
print(f"Test accuracy: {test_accuracy:.4f}")

# Make predictions
predictions = model.predict(x_test)
predicted_classes = np.argmax(predictions, axis=1)
true_classes = np.argmax(y_test, axis=1)

# Visualize predictions
fig, axes = plt.subplots(2, 5, figsize=(12, 5))
for i, ax in enumerate(axes.flat):
    ax.imshow(x_test[i].reshape(28, 28), cmap='gray')
    ax.set_title(f'True: {true_classes[i]}, Pred: {predicted_classes[i]}')
    ax.axis('off')
plt.tight_layout()
plt.show()

# Plot training history
plt.figure(figsize=(12, 4))

plt.subplot(1, 2, 1)
plt.plot(history.history['accuracy'], label='Training Accuracy')
plt.plot(history.history['val_accuracy'], label='Validation Accuracy')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.legend()
plt.title('Model Accuracy')

plt.subplot(1, 2, 2)
plt.plot(history.history['loss'], label='Training Loss')
plt.plot(history.history['val_loss'], label='Validation Loss')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend()
plt.title('Model Loss')

plt.tight_layout()
plt.show()
```

---

## Image Classification with CNNs

### Problem Statement
Classify images using Convolutional Neural Networks (better for images than fully connected networks).

### Step 1: Load CIFAR-10 Dataset

```python
from tensorflow.keras.datasets import cifar10
from tensorflow.keras.utils import to_categorical

# Load CIFAR-10 (32x32 color images, 10 classes)
(x_train, y_train), (x_test, y_test) = cifar10.load_data()

# Class names
class_names = ['airplane', 'automobile', 'bird', 'cat', 'deer',
               'dog', 'frog', 'horse', 'ship', 'truck']

print(f"Training data shape: {x_train.shape}")
print(f"Test data shape: {x_test.shape}")

# Visualize samples
fig, axes = plt.subplots(2, 5, figsize=(12, 5))
for i, ax in enumerate(axes.flat):
    ax.imshow(x_train[i])
    ax.set_title(class_names[y_train[i][0]])
    ax.axis('off')
plt.tight_layout()
plt.show()
```

### Step 2: Preprocess Data

```python
# Normalize pixel values
x_train = x_train.astype('float32') / 255.0
x_test = x_test.astype('float32') / 255.0

# One-hot encode labels
y_train = to_categorical(y_train, 10)
y_test = to_categorical(y_test, 10)

# Note: For CNNs, we keep images as 2D (or 3D for color)
# Shape: (samples, height, width, channels)
print(f"Training shape: {x_train.shape}")
```

### Step 3: Build CNN Model

```python
from tensorflow.keras import layers, models

# Create CNN model
model = models.Sequential([
    # First convolutional block
    layers.Conv2D(32, (3, 3), activation='relu', input_shape=(32, 32, 3)),
    layers.MaxPooling2D((2, 2)),
    
    # Second convolutional block
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    
    # Third convolutional block
    layers.Conv2D(64, (3, 3), activation='relu'),
    
    # Flatten and dense layers
    layers.Flatten(),
    layers.Dense(64, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(10, activation='softmax')
])

# Compile
model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

model.summary()
```

### Step 4: Train with Data Augmentation

```python
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# Data augmentation
datagen = ImageDataGenerator(
    rotation_range=15,
    width_shift_range=0.1,
    height_shift_range=0.1,
    horizontal_flip=True,
    zoom_range=0.1
)

# Fit generator on training data
datagen.fit(x_train)

# Train model
history = model.fit(
    datagen.flow(x_train, y_train, batch_size=32),
    steps_per_epoch=len(x_train) / 32,
    epochs=20,
    validation_data=(x_test, y_test),
    verbose=1
)
```

### Step 5: Evaluate and Visualize

```python
# Evaluate
test_loss, test_accuracy = model.evaluate(x_test, y_test, verbose=0)
print(f"Test accuracy: {test_accuracy:.4f}")

# Predictions
predictions = model.predict(x_test)
predicted_classes = np.argmax(predictions, axis=1)
true_classes = np.argmax(y_test, axis=1)

# Visualize some predictions
fig, axes = plt.subplots(3, 5, figsize=(15, 9))
for i, ax in enumerate(axes.flat):
    ax.imshow(x_test[i])
    true_label = class_names[true_classes[i]]
    pred_label = class_names[predicted_classes[i]]
    color = 'green' if true_classes[i] == predicted_classes[i] else 'red'
    ax.set_title(f'True: {true_label}\nPred: {pred_label}', color=color)
    ax.axis('off')
plt.tight_layout()
plt.show()
```

---

## Text Classification with Neural Networks

### Problem Statement
Classify text (e.g., sentiment analysis) using neural networks.

### Step 1: Load and Preprocess Text Data

```python
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, LSTM, Dense, Dropout

# Sample text data (in practice, use real dataset)
texts = [
    "I love this product! It's amazing.",
    "This is terrible. Worst purchase ever.",
    "Great quality, highly recommend.",
    "Poor quality, not worth the money.",
    "Excellent service and fast delivery.",
    "Very disappointed with this product.",
    "Best purchase I've made this year!",
    "Not as described, very misleading.",
    "Perfect! Exactly what I needed.",
    "Waste of money, don't buy this."
]

labels = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0]  # 1 = positive, 0 = negative

# Tokenize text
tokenizer = Tokenizer(num_words=1000, oov_token="<OOV>")
tokenizer.fit_on_texts(texts)
word_index = tokenizer.word_index

# Convert texts to sequences
sequences = tokenizer.texts_to_sequences(texts)

# Pad sequences to same length
max_length = 20
padded_sequences = pad_sequences(sequences, maxlen=max_length, padding='post')

print(f"Vocabulary size: {len(word_index)}")
print(f"Padded sequences shape: {padded_sequences.shape}")
```

### Step 2: Build LSTM Model

```python
# Build model
model = Sequential([
    Embedding(input_dim=1000, output_dim=64, input_length=max_length),
    LSTM(64, dropout=0.2, recurrent_dropout=0.2),
    Dense(32, activation='relu'),
    Dropout(0.5),
    Dense(1, activation='sigmoid')
])

model.compile(
    optimizer='adam',
    loss='binary_crossentropy',
    metrics=['accuracy']
)

model.summary()
```

### Step 3: Train Model

```python
# Convert labels to numpy array
labels = np.array(labels)

# Train
history = model.fit(
    padded_sequences, labels,
    epochs=20,
    batch_size=2,
    validation_split=0.2,
    verbose=1
)
```

### Step 4: Test on New Text

```python
# New text to classify
new_text = "This product is fantastic and works perfectly!"

# Preprocess
new_sequence = tokenizer.texts_to_sequences([new_text])
new_padded = pad_sequences(new_sequence, maxlen=max_length, padding='post')

# Predict
prediction = model.predict(new_padded)[0][0]
sentiment = "Positive" if prediction > 0.5 else "Negative"

print(f"Text: {new_text}")
print(f"Sentiment: {sentiment} (Confidence: {prediction:.4f})")
```

---

## Transfer Learning: Using Pre-trained Models

### Problem Statement
Use pre-trained models to solve your problem with less data and training time.

### Example 1: Image Classification with VGG16

```python
from tensorflow.keras.applications import VGG16
from tensorflow.keras.applications.vgg16 import preprocess_input
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D

# Load pre-trained VGG16 (without top layer)
base_model = VGG16(
    weights='imagenet',
    include_top=False,
    input_shape=(224, 224, 3)
)

# Freeze base model layers
base_model.trainable = False

# Add custom classification head
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(128, activation='relu')(x)
x = Dense(64, activation='relu')(x)
predictions = Dense(10, activation='softmax')(x)  # 10 classes

# Create model
model = Model(inputs=base_model.input, outputs=predictions)

# Compile
model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

model.summary()
```

### Example 2: Fine-tuning Pre-trained Model

```python
# After training with frozen layers, unfreeze some layers for fine-tuning
base_model.trainable = True

# Freeze early layers, fine-tune later layers
for layer in base_model.layers[:-4]:
    layer.trainable = False

# Recompile with lower learning rate
model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=1e-5),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)
```

### Example 3: Using MobileNet (Lightweight)

```python
from tensorflow.keras.applications import MobileNetV2

# MobileNet is smaller and faster
base_model = MobileNetV2(
    weights='imagenet',
    include_top=False,
    input_shape=(224, 224, 3)
)

# Similar approach as above
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(128, activation='relu')(x)
predictions = Dense(10, activation='softmax')(x)

model = Model(inputs=base_model.input, outputs=predictions)
```

---

## Building a Custom CNN for Custom Dataset

### Problem Statement
Build a CNN to classify your own images (e.g., cats vs dogs).

### Step 1: Organize Data

```
data/
  train/
    cats/
      cat1.jpg
      cat2.jpg
      ...
    dogs/
      dog1.jpg
      dog2.jpg
      ...
  validation/
    cats/
      ...
    dogs/
      ...
```

### Step 2: Load Data with ImageDataGenerator

```python
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# Data directories
train_dir = 'data/train'
validation_dir = 'data/validation'

# Data augmentation for training
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

# Only rescale for validation (no augmentation)
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

### Step 3: Build Model

```python
model = models.Sequential([
    layers.Conv2D(32, (3, 3), activation='relu', input_shape=(150, 150, 3)),
    layers.MaxPooling2D((2, 2)),
    
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    
    layers.Conv2D(128, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    
    layers.Conv2D(128, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    
    layers.Flatten(),
    layers.Dropout(0.5),
    layers.Dense(512, activation='relu'),
    layers.Dense(1, activation='sigmoid')  # Binary classification
])

model.compile(
    optimizer='adam',
    loss='binary_crossentropy',
    metrics=['accuracy']
)
```

### Step 4: Train Model

```python
history = model.fit(
    train_generator,
    steps_per_epoch=100,  # Adjust based on your data
    epochs=30,
    validation_data=validation_generator,
    validation_steps=50
)
```

### Step 5: Save and Load Model

```python
# Save model
model.save('cat_dog_classifier.h5')

# Load model
from tensorflow.keras.models import load_model
loaded_model = load_model('cat_dog_classifier.h5')

# Make prediction on new image
from tensorflow.keras.preprocessing import image
import numpy as np

img_path = 'test_image.jpg'
img = image.load_img(img_path, target_size=(150, 150))
img_array = image.img_to_array(img)
img_array = np.expand_dims(img_array, axis=0)
img_array /= 255.0

prediction = loaded_model.predict(img_array)[0][0]
if prediction > 0.5:
    print("Dog")
else:
    print("Cat")
```

---

## Hyperparameter Tuning

### What We're Trying to Achieve

**Goal**: Automatically find the best hyperparameters (learning rate, number of layers, neurons per layer, dropout rate) for our neural network to achieve the highest validation accuracy.

**Why It Matters**: 
- Manual hyperparameter tuning is time-consuming
- Different problems require different architectures
- Optimal hyperparameters can significantly improve model performance
- Saves time by automating the search process

### Using Keras Tuner

**What is Keras Tuner?**
Keras Tuner is a library that helps you find the optimal hyperparameters for your model. It automatically tests different combinations and selects the best one.

```python
import kerastuner as kt

# Define a function that builds a model with hyperparameters to tune
def build_model(hp):
    """
    This function creates a model with hyperparameters that will be tuned.
    'hp' is a HyperParameters object that provides methods to define search space.
    """
    model = keras.Sequential()
    
    # Tune number of layers: Try models with 2, 3, or 4 hidden layers
    # hp.Int() creates an integer hyperparameter to search over
    num_layers = hp.Int('num_layers', min_value=2, max_value=4)
    # This will try: 2 layers, 3 layers, or 4 layers
    
    for i in range(num_layers):
        # For each layer, tune the number of units (neurons)
        # Try values: 32, 64, 96, 128, ..., up to 512 (in steps of 32)
        units = hp.Int(f'units_{i}', min_value=32, max_value=512, step=32)
        model.add(layers.Dense(
            units=units,  # Number of neurons in this layer
            activation='relu'  # ReLU activation function
        ))
        
        # Tune dropout rate for each layer
        # Try values: 0.0, 0.1, 0.2, 0.3, 0.4, 0.5
        # Dropout helps prevent overfitting by randomly setting some neurons to 0
        dropout_rate = hp.Float(f'dropout_{i}', min_value=0.0, max_value=0.5, step=0.1)
        model.add(layers.Dropout(dropout_rate))
    
    # Output layer: 10 classes for MNIST (digits 0-9)
    model.add(layers.Dense(10, activation='softmax'))
    # Softmax converts raw scores to probabilities that sum to 1
    
    # Tune learning rate: Try 0.01, 0.001, or 0.0001
    # Learning rate controls how big steps the optimizer takes
    # Too high: might overshoot optimal solution
    # Too low: training takes too long or gets stuck
    learning_rate = hp.Choice('learning_rate', values=[1e-2, 1e-3, 1e-4])
    
    # Compile model with tuned learning rate
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=learning_rate),
        # Adam optimizer adapts learning rate during training
        loss='categorical_crossentropy',  # Loss function for multi-class classification
        metrics=['accuracy']  # Track accuracy during training
    )
    
    return model

# Create Hyperband tuner
# Hyperband is an efficient search algorithm that:
# 1. Starts with many random configurations
# 2. Trains them for a few epochs
# 3. Keeps only the best ones
# 4. Trains those for longer
# This saves time compared to training all configurations fully
tuner = kt.Hyperband(
    build_model,  # Function that builds models with different hyperparameters
    objective='val_accuracy',  # What to optimize (validation accuracy)
    max_epochs=10,  # Maximum epochs to train each configuration
    directory='tuning',  # Where to save tuning results
    project_name='mnist_tuning'  # Name of this tuning project
)

# Start the search
# This will:
# 1. Create many different model configurations
# 2. Train each for a few epochs
# 3. Evaluate on validation set
# 4. Keep the best configurations
# 5. Train best ones more thoroughly
print("Starting hyperparameter search...")
tuner.search(
    x_train, y_train,
    epochs=10,  # Train each configuration for 10 epochs initially
    validation_split=0.2  # Use 20% of training data for validation
)

# Get the best model found during search
# This model has the hyperparameters that gave highest validation accuracy
best_model = tuner.get_best_models()[0]

# Get best hyperparameters
best_hps = tuner.get_best_hyperparameters()[0]
print("\nBest Hyperparameters Found:")
print(f"Number of layers: {best_hps.get('num_layers')}")
print(f"Learning rate: {best_hps.get('learning_rate')}")
for i in range(best_hps.get('num_layers')):
    print(f"Layer {i} units: {best_hps.get(f'units_{i}')}")
    print(f"Layer {i} dropout: {best_hps.get(f'dropout_{i}')}")
```

---

## Deploying Deep Learning Models

### Save Model

```python
# Save entire model
model.save('my_model.h5')

# Save only weights
model.save_weights('my_weights.h5')

# Save architecture as JSON
model_json = model.to_json()
with open('model_architecture.json', 'w') as f:
    f.write(model_json)
```

### Convert to TensorFlow Lite (Mobile)

```python
# Convert to TFLite
converter = tf.lite.TFLiteConverter.from_keras_model(model)
tflite_model = converter.convert()

# Save
with open('model.tflite', 'wb') as f:
    f.write(tflite_model)
```

### Flask API for Model Serving

```python
from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import io
from PIL import Image

app = Flask(__name__)
model = load_model('my_model.h5')

@app.route('/predict', methods=['POST'])
def predict():
    # Get image from request
    file = request.files['image']
    img = Image.open(io.BytesIO(file.read()))
    
    # Preprocess
    img = img.resize((224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array /= 255.0
    
    # Predict
    prediction = model.predict(img_array)
    class_idx = np.argmax(prediction[0])
    confidence = float(prediction[0][class_idx])
    
    return jsonify({
        'class': int(class_idx),
        'confidence': confidence
    })

if __name__ == '__main__':
    app.run(debug=True)
```

---

## Real-World Project Ideas

1. **Medical Image Classification**: Classify X-rays, skin lesions
2. **Object Detection**: Detect objects in images/videos
3. **Style Transfer**: Apply artistic styles to images
4. **Image Super-Resolution**: Enhance image quality
5. **Face Recognition**: Build face recognition system
6. **Text Generation**: Generate text using RNNs/LSTMs
7. **Time Series Forecasting**: Predict future values
8. **Anomaly Detection**: Detect unusual patterns

---

## Common Issues and Solutions

### Issue 1: Overfitting

```python
# Solutions:
# 1. Add dropout
layers.Dropout(0.5)

# 2. Data augmentation
datagen = ImageDataGenerator(...)

# 3. Early stopping
from tensorflow.keras.callbacks import EarlyStopping
early_stop = EarlyStopping(monitor='val_loss', patience=5)
model.fit(..., callbacks=[early_stop])

# 4. Reduce model complexity
```

### Issue 2: Slow Training

```python
# Solutions:
# 1. Use GPU
# 2. Reduce batch size
# 3. Use mixed precision
tf.keras.mixed_precision.set_global_policy('mixed_float16')

# 4. Use smaller model or transfer learning
```

### Issue 3: Memory Issues

```python
# Solutions:
# 1. Reduce batch size
# 2. Use data generators
# 3. Reduce image size
# 4. Use model checkpointing
from tensorflow.keras.callbacks import ModelCheckpoint
checkpoint = ModelCheckpoint('best_model.h5', save_best_only=True)
```

---

## Next Steps

1. Experiment with different architectures
2. Try transfer learning on your datasets
3. Learn about advanced techniques (attention, transformers)
4. Explore computer vision and NLP applications
5. Study model optimization and deployment
6. Practice with real-world projects

---

*Practice building models on real datasets to master deep learning!*

