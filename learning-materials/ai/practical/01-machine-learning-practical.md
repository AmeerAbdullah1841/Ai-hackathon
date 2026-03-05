# Machine Learning - Practical Guide

## Table of Contents
1. [Setting Up Your Environment](#setting-up-your-environment)
2. [Your First ML Project: House Price Prediction](#your-first-ml-project-house-price-prediction)
3. [Email Spam Classifier](#email-spam-classifier)
4. [Customer Churn Prediction](#customer-churn-prediction)
5. [Sales Forecasting](#sales-forecasting)
6. [Image Classification with Traditional ML](#image-classification-with-traditional-ml)
7. [Best Practices and Common Pitfalls](#best-practices-and-common-pitfalls)
8. [Deploying Your Model](#deploying-your-model)

---

## Setting Up Your Environment

### Installation

```bash
# Create virtual environment
python -m venv ml_env
source ml_env/bin/activate  # On Windows: ml_env\Scripts\activate

# Install essential packages
pip install numpy pandas scikit-learn matplotlib seaborn jupyter
```

### Verify Installation

```python
import numpy as np
import pandas as pd
import sklearn
print(f"NumPy: {np.__version__}")
print(f"Pandas: {pd.__version__}")
print(f"Scikit-learn: {sklearn.__version__}")
```

---

## Your First ML Project: House Price Prediction

### Problem Statement
Predict house prices based on features like size, location, number of bedrooms, etc.

### Step 1: Load and Explore Data

**What We're Trying to Achieve:**
- Load our dataset containing house features and prices
- Understand the structure and characteristics of our data
- Identify any data quality issues (missing values, outliers)
- Get familiar with the data before building our model

**Why This Step Matters:**
- You can't build a good model without understanding your data
- Data exploration reveals patterns and relationships
- Helps identify problems early (missing data, incorrect values)
- Guides feature selection and preprocessing decisions

```python
# Import necessary libraries
import pandas as pd  # For data manipulation and analysis
import numpy as np   # For numerical operations
import matplotlib.pyplot as plt  # For plotting graphs
import seaborn as sns  # For statistical visualizations
from sklearn.model_selection import train_test_split  # To split data into train/test
from sklearn.linear_model import LinearRegression  # Our ML model
from sklearn.metrics import mean_squared_error, r2_score  # To evaluate model performance

# Load data (using sample data structure)
# In practice, you'd load from CSV: df = pd.read_csv('house_prices.csv')
# We're creating sample data to demonstrate the process
data = {
    'size_sqft': [1500, 2000, 1800, 2200, 1600, 2400, 1900, 2100],  # House size in square feet
    'bedrooms': [2, 3, 3, 4, 2, 4, 3, 3],  # Number of bedrooms
    'bathrooms': [2, 2.5, 2, 3, 2, 3, 2.5, 2.5],  # Number of bathrooms
    'age_years': [5, 10, 8, 15, 3, 20, 12, 7],  # Age of house in years
    'price': [250000, 320000, 290000, 380000, 270000, 420000, 310000, 350000]  # Target: house price
}

# Convert dictionary to DataFrame (table-like structure)
df = pd.DataFrame(data)

# Explore data - understand what we're working with
print(df.head())  # Show first 5 rows - see actual data values
print(df.describe())  # Statistical summary: mean, std, min, max for each column
print(df.info())  # Data types and memory usage - ensure correct types

# Check for missing values
# Missing data can cause problems - we need to handle it
print(df.isnull().sum())  # Count missing values in each column
# If any column has missing values, we'll need to fill or remove them
```

### Step 2: Data Visualization

```python
# Visualize relationships
plt.figure(figsize=(12, 8))

# Price distribution
plt.subplot(2, 2, 1)
sns.histplot(df['price'], kde=True)
plt.title('Price Distribution')

# Size vs Price
plt.subplot(2, 2, 2)
sns.scatterplot(x='size_sqft', y='price', data=df)
plt.title('Size vs Price')

# Bedrooms vs Price
plt.subplot(2, 2, 3)
sns.boxplot(x='bedrooms', y='price', data=df)
plt.title('Bedrooms vs Price')

# Correlation heatmap
plt.subplot(2, 2, 4)
sns.heatmap(df.corr(), annot=True, cmap='coolwarm')
plt.title('Feature Correlations')

plt.tight_layout()
plt.show()
```

### Step 3: Prepare Data

```python
# Separate features and target
X = df[['size_sqft', 'bedrooms', 'bathrooms', 'age_years']]
y = df['price']

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print(f"Training set: {X_train.shape}")
print(f"Test set: {X_test.shape}")
```

### Step 4: Train Model

**What We're Trying to Achieve:**
- Train a linear regression model to learn the relationship between house features and prices
- The model will learn weights (coefficients) for each feature
- Make predictions on both training and test data
- Evaluate how well the model performs

**Why Linear Regression?**
- Simple and interpretable
- Fast to train
- Good baseline for regression problems
- Works well when relationships are approximately linear

```python
# Create Linear Regression model
# Linear Regression finds the best line (or hyperplane) that fits the data
# Formula: price = w1*size + w2*bedrooms + w3*bathrooms + w4*age + bias
# The model learns the weights (w1, w2, w3, w4) and bias
model = LinearRegression()

# Train the model
# This is where the "learning" happens
# The model analyzes training data and finds the best weights
# fit() method calculates: what weights minimize prediction error?
model.fit(X_train, y_train)
# After this, model has learned the relationship between features and price

# Make predictions on training data
# This shows how well model learned from training examples
y_pred_train = model.predict(X_train)

# Make predictions on test data (unseen data)
# This shows how well model generalizes to new data
y_pred_test = model.predict(X_test)

# Evaluate model performance
# Mean Squared Error (MSE): Average of squared differences
# Lower is better. MSE penalizes large errors more
train_mse = mean_squared_error(y_train, y_pred_train)  # Error on training data
test_mse = mean_squared_error(y_test, y_pred_test)  # Error on test data

# R² Score (R-squared): Proportion of variance explained
# Range: 0 to 1 (or negative if worse than baseline)
# 1.0 = perfect predictions, 0.0 = no better than predicting mean
train_r2 = r2_score(y_train, y_pred_train)
test_r2 = r2_score(y_test, y_pred_test)

print(f"Training MSE: {train_mse:.2f}")  # Should be low
print(f"Test MSE: {test_mse:.2f}")  # Should be similar to training (not much higher)
print(f"Training R²: {train_r2:.4f}")  # Should be close to 1.0
print(f"Test R²: {test_r2:.4f}")  # Should be close to training R²

# Feature importance: Which features matter most?
# Coefficients show how much price changes per unit change in feature
# Positive coefficient: feature increases price
# Negative coefficient: feature decreases price
# Larger absolute value: feature has bigger impact
print("\nFeature Coefficients:")
for feature, coef in zip(X.columns, model.coef_):
    print(f"{feature}: {coef:.2f}")
    # Example: size_sqft: 150.23 means each extra sqft adds $150.23 to price
```

### Step 5: Make Predictions

```python
# Predict for new house
new_house = pd.DataFrame({
    'size_sqft': [2000],
    'bedrooms': [3],
    'bathrooms': [2.5],
    'age_years': [5]
})

predicted_price = model.predict(new_house)[0]
print(f"Predicted price: ${predicted_price:,.2f}")
```

### Real-World Enhancement: Using Real Dataset

```python
# Using Boston Housing Dataset (now in California Housing)
from sklearn.datasets import fetch_california_housing

housing = fetch_california_housing()
df = pd.DataFrame(housing.data, columns=housing.feature_names)
df['target'] = housing.target

# Follow same steps as above
```

---

## Email Spam Classifier

### Problem Statement
Classify emails as spam or not spam using text features.

### Step 1: Load and Prepare Data

```python
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# Sample email data (in practice, use real dataset)
emails = [
    ("Get rich quick! Click here now!", "spam"),
    ("Meeting tomorrow at 3 PM", "ham"),
    ("You've won $1000! Claim now!", "spam"),
    ("Project update: Status is on track", "ham"),
    ("Free money! No investment needed!", "spam"),
    ("Lunch at 12:30?", "ham"),
    ("Congratulations! You're a winner!", "spam"),
    ("Quarterly report attached", "ham"),
    ("Act now! Limited time offer!", "spam"),
    ("Team meeting rescheduled to Friday", "ham"),
]

# Create DataFrame
df = pd.DataFrame(emails, columns=['text', 'label'])

# Encode labels
df['label_encoded'] = df['label'].map({'ham': 0, 'spam': 1})

print(df.head())
```

### Step 2: Feature Extraction

```python
# Convert text to numerical features using TF-IDF
vectorizer = TfidfVectorizer(
    max_features=1000,
    stop_words='english',
    lowercase=True,
    ngram_range=(1, 2)  # Unigrams and bigrams
)

X = vectorizer.fit_transform(df['text'])
y = df['label_encoded']

print(f"Feature matrix shape: {X.shape}")
print(f"Vocabulary size: {len(vectorizer.vocabulary_)}")
```

### Step 3: Train-Test Split

```python
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42, stratify=y
)
```

### Step 4: Train Model

```python
# Use Naive Bayes (good for text classification)
model = MultinomialNB(alpha=1.0)  # alpha for smoothing
model.fit(X_train, y_train)

# Predictions
y_pred = model.predict(X_test)

# Evaluate
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy:.4f}")

print("\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=['ham', 'spam']))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))
```

### Step 5: Test on New Email

```python
# New email to classify
new_email = "Free gift card! Click to claim!"

# Transform to features
new_email_features = vectorizer.transform([new_email])

# Predict
prediction = model.predict(new_email_features)[0]
probability = model.predict_proba(new_email_features)[0]

label = 'spam' if prediction == 1 else 'ham'
print(f"Email: {new_email}")
print(f"Prediction: {label}")
print(f"Confidence: {probability[prediction]:.4f}")
```

### Real-World Example: Using Spam Dataset

```python
# Download spam dataset
# You can use UCI ML Repository or Kaggle datasets
# Example with a CSV file:
# df = pd.read_csv('spam.csv', encoding='latin-1')
# df = df[['v1', 'v2']]  # Label and text columns
# df.columns = ['label', 'text']
```

---

## Customer Churn Prediction

### Problem Statement
Predict which customers will churn (cancel subscription) based on their usage patterns.

### Step 1: Load Data

```python
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score

# Sample customer data
np.random.seed(42)
n_customers = 1000

data = {
    'age': np.random.randint(18, 70, n_customers),
    'monthly_charges': np.random.uniform(20, 100, n_customers),
    'total_charges': np.random.uniform(100, 5000, n_customers),
    'tenure_months': np.random.randint(1, 72, n_customers),
    'contract_type': np.random.choice(['Month-to-month', 'One year', 'Two year'], n_customers),
    'payment_method': np.random.choice(['Electronic', 'Mailed check', 'Bank transfer'], n_customers),
    'services_count': np.random.randint(1, 7, n_customers),
}

df = pd.DataFrame(data)

# Create churn target (higher churn for month-to-month, low tenure, high charges)
churn_prob = (
    (df['contract_type'] == 'Month-to-month').astype(int) * 0.3 +
    (df['tenure_months'] < 12).astype(int) * 0.2 +
    (df['monthly_charges'] > 70).astype(int) * 0.2 +
    np.random.random(n_customers) * 0.3
)
df['churn'] = (churn_prob > 0.5).astype(int)

print(df.head())
print(f"\nChurn rate: {df['churn'].mean():.2%}")
```

### Step 2: Data Preprocessing

```python
# Encode categorical variables
le_contract = LabelEncoder()
le_payment = LabelEncoder()

df['contract_encoded'] = le_contract.fit_transform(df['contract_type'])
df['payment_encoded'] = le_payment.fit_transform(df['payment_method'])

# Select features
features = ['age', 'monthly_charges', 'total_charges', 'tenure_months', 
            'services_count', 'contract_encoded', 'payment_encoded']
X = df[features]
y = df['churn']

# Handle class imbalance (if needed)
from sklearn.utils import class_weight
class_weights = class_weight.compute_class_weight(
    'balanced', classes=np.unique(y), y=y
)
class_weight_dict = dict(zip(np.unique(y), class_weights))
print(f"Class weights: {class_weight_dict}")
```

### Step 3: Train Model

```python
# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train Random Forest
model = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    class_weight='balanced',
    random_state=42
)
model.fit(X_train_scaled, y_train)

# Predictions
y_pred = model.predict(X_test_scaled)
y_pred_proba = model.predict_proba(X_test_scaled)[:, 1]
```

### Step 4: Evaluate Model

```python
# Metrics
accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred)
recall = recall_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)
roc_auc = roc_auc_score(y_test, y_pred_proba)

print(f"Accuracy: {accuracy:.4f}")
print(f"Precision: {precision:.4f}")
print(f"Recall: {recall:.4f}")
print(f"F1-Score: {f1:.4f}")
print(f"ROC-AUC: {roc_auc:.4f}")

# Feature importance
feature_importance = pd.DataFrame({
    'feature': features,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

print("\nFeature Importance:")
print(feature_importance)
```

### Step 5: Business Application

```python
# Identify high-risk customers
df_test = X_test.copy()
df_test['churn_probability'] = y_pred_proba
df_test['predicted_churn'] = y_pred
df_test['actual_churn'] = y_test.values

# High-risk customers (probability > 0.7)
high_risk = df_test[df_test['churn_probability'] > 0.7]
print(f"\nHigh-risk customers: {len(high_risk)}")
print(f"Actual churn rate in high-risk: {high_risk['actual_churn'].mean():.2%}")

# Action: Target these customers for retention campaigns
```

---

## Sales Forecasting

### Problem Statement
Forecast future sales based on historical data.

### Step 1: Create Time Series Data

```python
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error
import matplotlib.pyplot as plt

# Generate sample sales data
dates = pd.date_range('2020-01-01', '2023-12-31', freq='D')
np.random.seed(42)

# Create trend and seasonality
trend = np.linspace(1000, 2000, len(dates))
seasonality = 200 * np.sin(2 * np.pi * np.arange(len(dates)) / 365.25)
noise = np.random.normal(0, 50, len(dates))
sales = trend + seasonality + noise
sales = np.maximum(sales, 0)  # No negative sales

df = pd.DataFrame({
    'date': dates,
    'sales': sales
})

# Create features
df['day_of_week'] = df['date'].dt.dayofweek
df['month'] = df['date'].dt.month
df['day_of_month'] = df['date'].dt.day
df['is_weekend'] = (df['day_of_week'] >= 5).astype(int)

# Lag features
df['sales_lag_1'] = df['sales'].shift(1)
df['sales_lag_7'] = df['sales'].shift(7)
df['sales_lag_30'] = df['sales'].shift(30)

# Rolling averages
df['sales_ma_7'] = df['sales'].rolling(window=7).mean()
df['sales_ma_30'] = df['sales'].rolling(window=30).mean()

# Drop NaN rows
df = df.dropna()

print(df.head())
```

### Step 2: Prepare Features

```python
# Features for prediction
features = ['day_of_week', 'month', 'day_of_month', 'is_weekend',
            'sales_lag_1', 'sales_lag_7', 'sales_lag_30',
            'sales_ma_7', 'sales_ma_30']

# Split: Use last 30 days for testing
split_idx = len(df) - 30
train_df = df.iloc[:split_idx]
test_df = df.iloc[split_idx:]

X_train = train_df[features]
y_train = train_df['sales']
X_test = test_df[features]
y_test = test_df['sales']
```

### Step 3: Train Models

```python
# Linear Regression
lr_model = LinearRegression()
lr_model.fit(X_train, y_train)
lr_pred = lr_model.predict(X_test)

# Random Forest
rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)
rf_pred = rf_model.predict(X_test)

# Evaluate
print("Linear Regression:")
print(f"MAE: {mean_absolute_error(y_test, lr_pred):.2f}")
print(f"RMSE: {np.sqrt(mean_squared_error(y_test, lr_pred)):.2f}")

print("\nRandom Forest:")
print(f"MAE: {mean_absolute_error(y_test, rf_pred):.2f}")
print(f"RMSE: {np.sqrt(mean_squared_error(y_test, rf_pred)):.2f}")
```

### Step 4: Visualize Forecasts

```python
plt.figure(figsize=(15, 6))
plt.plot(test_df['date'], y_test, label='Actual', linewidth=2)
plt.plot(test_df['date'], lr_pred, label='Linear Regression', alpha=0.7)
plt.plot(test_df['date'], rf_pred, label='Random Forest', alpha=0.7)
plt.xlabel('Date')
plt.ylabel('Sales')
plt.title('Sales Forecast Comparison')
plt.legend()
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()
```

---

## Image Classification with Traditional ML

### Problem Statement
Classify images using traditional ML (before deep learning).

### Step 1: Load Images

```python
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, classification_report
import matplotlib.pyplot as plt

# Load digit dataset (8x8 pixel images)
digits = load_digits()

print(f"Images shape: {digits.images.shape}")
print(f"Data shape: {digits.data.shape}")
print(f"Target shape: {digits.target.shape}")

# Visualize some images
fig, axes = plt.subplots(2, 5, figsize=(10, 4))
for i, ax in enumerate(axes.flat):
    ax.imshow(digits.images[i], cmap='gray')
    ax.set_title(f'Label: {digits.target[i]}')
    ax.axis('off')
plt.tight_layout()
plt.show()
```

### Step 2: Feature Extraction

```python
# For traditional ML, we can use:
# 1. Raw pixels (flattened)
# 2. Histogram of Oriented Gradients (HOG)
# 3. Local Binary Patterns (LBP)

# Using raw pixels (simple approach)
X = digits.data
y = digits.target

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
```

### Step 3: Train Model

```python
# Support Vector Machine
svm_model = SVC(kernel='rbf', gamma='scale', C=1.0)
svm_model.fit(X_train, y_train)

# Predictions
y_pred = svm_model.predict(X_test)

# Evaluate
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy:.4f}")

print("\nClassification Report:")
print(classification_report(y_test, y_pred))
```

### Step 4: Using HOG Features (Better for Real Images)

```python
from skimage.feature import hog
from skimage import data, exposure

# Example: Extract HOG features from an image
image = digits.images[0]

# Compute HOG features
fd, hog_image = hog(
    image,
    orientations=8,
    pixels_per_cell=(2, 2),
    cells_per_block=(1, 1),
    visualize=True
)

print(f"HOG feature vector length: {len(fd)}")

# Apply to all images
hog_features = []
for img in digits.images:
    fd = hog(img, orientations=8, pixels_per_cell=(2, 2), cells_per_block=(1, 1))
    hog_features.append(fd)

X_hog = np.array(hog_features)

# Train on HOG features
X_train_hog, X_test_hog, y_train, y_test = train_test_split(
    X_hog, y, test_size=0.2, random_state=42
)

svm_hog = SVC(kernel='rbf')
svm_hog.fit(X_train_hog, y_train)
y_pred_hog = svm_hog.predict(X_test_hog)

print(f"HOG Features Accuracy: {accuracy_score(y_test, y_pred_hog):.4f}")
```

---

## Best Practices and Common Pitfalls

### 1. Data Leakage

**Problem**: Using future information to predict past

```python
# WRONG: Using target variable in features
# df['target_lag'] = df['target'].shift(-1)  # Future data!

# CORRECT: Only use past data
df['target_lag'] = df['target'].shift(1)  # Past data
```

### 2. Train-Test Contamination

```python
# WRONG: Scaling before split
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)  # Uses test data statistics!
X_train, X_test = train_test_split(X_scaled, ...)

# CORRECT: Scale after split
X_train, X_test = train_test_split(X, ...)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)  # Only transform, don't fit
```

### 3. Handling Missing Values

```python
# Check for missing values
print(df.isnull().sum())

# Option 1: Drop rows with missing values
df_clean = df.dropna()

# Option 2: Impute missing values
from sklearn.impute import SimpleImputer

imputer = SimpleImputer(strategy='mean')  # or 'median', 'most_frequent'
X_imputed = imputer.fit_transform(X)

# Option 3: Fill with forward fill (for time series)
df['column'].fillna(method='ffill', inplace=True)
```

### 4. Feature Engineering Tips

```python
# Create interaction features
df['feature_interaction'] = df['feature1'] * df['feature2']

# Create polynomial features
from sklearn.preprocessing import PolynomialFeatures
poly = PolynomialFeatures(degree=2, include_bias=False)
X_poly = poly.fit_transform(X)

# Binning continuous variables
df['age_group'] = pd.cut(df['age'], bins=[0, 30, 50, 100], labels=['Young', 'Middle', 'Old'])

# Encoding cyclical features (day of week, month)
df['day_sin'] = np.sin(2 * np.pi * df['day_of_week'] / 7)
df['day_cos'] = np.cos(2 * np.pi * df['day_of_week'] / 7)
```

### 5. Model Selection

```python
from sklearn.model_selection import cross_val_score, GridSearchCV

# Cross-validation
scores = cross_val_score(model, X_train, y_train, cv=5, scoring='accuracy')
print(f"CV Accuracy: {scores.mean():.4f} (+/- {scores.std() * 2:.4f})")

# Hyperparameter tuning
param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [5, 10, 15]
}

grid_search = GridSearchCV(
    RandomForestClassifier(),
    param_grid,
    cv=5,
    scoring='accuracy'
)
grid_search.fit(X_train, y_train)
print(f"Best parameters: {grid_search.best_params_}")
print(f"Best score: {grid_search.best_score_:.4f}")
```

### 6. Handling Class Imbalance

```python
# Option 1: Class weights
model = RandomForestClassifier(class_weight='balanced')

# Option 2: SMOTE (Synthetic Minority Oversampling)
from imblearn.over_sampling import SMOTE

smote = SMOTE(random_state=42)
X_resampled, y_resampled = smote.fit_resample(X_train, y_train)

# Option 3: Undersampling
from imblearn.under_sampling import RandomUnderSampler
undersample = RandomUnderSampler(random_state=42)
X_resampled, y_resampled = undersample.fit_resample(X_train, y_train)
```

---

## Deploying Your Model

### Save and Load Model

```python
import joblib
import pickle

# Save model
joblib.dump(model, 'model.pkl')
joblib.dump(scaler, 'scaler.pkl')
joblib.dump(vectorizer, 'vectorizer.pkl')

# Load model
loaded_model = joblib.load('model.pkl')
loaded_scaler = joblib.load('scaler.pkl')
```

### Simple Flask API

```python
# app.py
from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load model
model = joblib.load('model.pkl')
scaler = joblib.load('scaler.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    features = np.array([data['features']])
    features_scaled = scaler.transform(features)
    prediction = model.predict(features_scaled)[0]
    probability = model.predict_proba(features_scaled)[0].tolist()
    
    return jsonify({
        'prediction': int(prediction),
        'probability': probability
    })

if __name__ == '__main__':
    app.run(debug=True)
```

### Test API

```python
import requests

data = {
    'features': [2000, 3, 2.5, 5, 2, 1, 0]  # Example features
}

response = requests.post('http://localhost:5000/predict', json=data)
print(response.json())
```

---

## Real-World Project Ideas

1. **Credit Card Fraud Detection**: Use transaction data to detect fraud
2. **Product Recommendation**: Build recommendation system for e-commerce
3. **Sentiment Analysis**: Analyze customer reviews
4. **Demand Forecasting**: Predict product demand
5. **Customer Segmentation**: Cluster customers for marketing
6. **Price Optimization**: Predict optimal pricing
7. **Predictive Maintenance**: Predict equipment failures
8. **Lead Scoring**: Score sales leads

---

## Next Steps

1. Practice with real datasets from Kaggle
2. Experiment with different algorithms
3. Learn about model evaluation metrics
4. Study feature engineering techniques
5. Explore ensemble methods
6. Move to deep learning for complex problems

---

*Happy Learning! Practice is key to mastering machine learning.*

