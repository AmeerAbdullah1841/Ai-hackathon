# Natural Language Processing - Practical Guide

## Table of Contents
1. [Setting Up NLP Environment](#setting-up-nlp-environment)
2. [Text Preprocessing in Practice](#text-preprocessing-in-practice)
3. [Sentiment Analysis Project](#sentiment-analysis-project)
4. [Text Classification with Transformers](#text-classification-with-transformers)
5. [Named Entity Recognition (NER)](#named-entity-recognition-ner)
6. [Text Generation with GPT](#text-generation-with-gpt)
7. [Building a Chatbot](#building-a-chatbot)
8. [Real-World NLP Applications](#real-world-nlp-applications)

---

## Setting Up NLP Environment

### Installation

```bash
# Core NLP libraries
pip install transformers torch tensorflow
pip install nltk spacy
pip install pandas numpy matplotlib seaborn

# Download NLTK data
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('wordnet')"

# Download spaCy model
python -m spacy download en_core_web_sm
```

---

## Text Preprocessing in Practice

### Complete Preprocessing Pipeline

```python
import re
import string
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer, WordNetLemmatizer
import nltk

nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')

def preprocess_text(text, remove_stopwords=True, lemmatize=True):
    """
    Complete text preprocessing pipeline
    """
    # Convert to lowercase
    text = text.lower()
    
    # Remove URLs
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
    
    # Remove email addresses
    text = re.sub(r'\S+@\S+', '', text)
    
    # Remove mentions and hashtags
    text = re.sub(r'@\w+|#\w+', '', text)
    
    # Remove numbers
    text = re.sub(r'\d+', '', text)
    
    # Remove punctuation
    text = text.translate(str.maketrans('', '', string.punctuation))
    
    # Remove extra whitespace
    text = ' '.join(text.split())
    
    # Tokenize
    tokens = word_tokenize(text)
    
    # Remove stopwords
    if remove_stopwords:
        stop_words = set(stopwords.words('english'))
        tokens = [token for token in tokens if token not in stop_words]
    
    # Lemmatize or stem
    if lemmatize:
        lemmatizer = WordNetLemmatizer()
        tokens = [lemmatizer.lemmatize(token) for token in tokens]
    else:
        stemmer = PorterStemmer()
        tokens = [stemmer.stem(token) for token in tokens]
    
    # Remove short tokens
    tokens = [token for token in tokens if len(token) > 2]
    
    return ' '.join(tokens)

# Example usage
sample_text = "I love this product! It's amazing. Check it out at https://example.com #awesome"
cleaned = preprocess_text(sample_text)
print(f"Original: {sample_text}")
print(f"Cleaned: {cleaned}")
```

### Using spaCy for Preprocessing

```python
import spacy

nlp = spacy.load("en_core_web_sm")

def preprocess_with_spacy(text):
    doc = nlp(text)
    
    # Extract tokens, remove stopwords and punctuation
    tokens = [
        token.lemma_.lower() 
        for token in doc 
        if not token.is_stop 
        and not token.is_punct
        and not token.is_space
    ]
    
    return ' '.join(tokens)

text = "The quick brown fox jumps over the lazy dog"
processed = preprocess_with_spacy(text)
print(processed)
```

---

## Sentiment Analysis Project

### Problem Statement
Classify text as positive, negative, or neutral sentiment.

### Step 1: Load and Prepare Data

```python
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns

# Sample data (in practice, use real dataset like IMDB, Amazon reviews)
data = {
    'text': [
        "I love this movie! It's fantastic.",
        "Terrible film, waste of time.",
        "It's okay, nothing special.",
        "Amazing acting and great storyline!",
        "Boring and poorly made.",
        "Decent movie, worth watching.",
        "Best movie I've ever seen!",
        "Horrible, don't watch it.",
        "Pretty good, I enjoyed it.",
        "Worst movie ever made."
    ],
    'sentiment': ['positive', 'negative', 'neutral', 'positive', 
                  'negative', 'neutral', 'positive', 'negative', 
                  'neutral', 'negative']
}

df = pd.DataFrame(data)
print(df.head())
```

### Step 2: Feature Extraction

**What We're Trying to Achieve:**
- Convert text into numerical features that ML models can process
- Transform words into numbers representing their importance
- Create a feature matrix where each text becomes a vector of numbers

**Why TF-IDF?**
- **TF (Term Frequency)**: How often word appears in document
- **IDF (Inverse Document Frequency)**: How rare word is across all documents  
- **TF-IDF**: High score for words frequent in document but rare overall
- Example: "fantastic" appears often in positive reviews (high TF) but rarely in negative (high IDF) = high TF-IDF

```python
# Encode labels: Convert text labels to numbers
# Models need numbers, not text
label_map = {'positive': 1, 'negative': -1, 'neutral': 0}
df['label'] = df['sentiment'].map(label_map)
# Maps: "positive" → 1, "negative" → -1, "neutral" → 0

# Create TF-IDF vectorizer: Converts text to numerical features
vectorizer = TfidfVectorizer(
    max_features=1000,  # Keep top 1000 most important words
    # Why limit? Reduces memory, speeds training, removes noise
    # Words ranked by importance across all documents
    
    ngram_range=(1, 2),  # Use both single words and word pairs
    # Unigrams (1): "love", "movie", "fantastic" - individual words
    # Bigrams (2): "love this", "this movie", "movie fantastic" - word pairs
    # Bigrams capture phrases: "not good" vs "good" have opposite meanings
    # Helps model understand context better
    
    stop_words='english'  # Remove common words: "the", "a", "is", "and"
    # These appear in all texts, don't help classify sentiment
    # Removing them reduces noise and improves accuracy
)

# Fit and transform: Learn vocabulary, then convert texts to numbers
# fit_transform() does two steps:
# 1. fit(): Analyzes all texts, builds vocabulary, calculates TF-IDF weights
# 2. transform(): Converts each text to a vector of 1000 numbers
X = vectorizer.fit_transform(df['text'])
# Result: Sparse matrix (most values are 0 - most words don't appear in each text)
# Shape: (num_texts, num_features) e.g., (10, 1000)

y = df['label']  # Target labels: 1 (positive), -1 (negative), 0 (neutral)

print(f"Feature matrix shape: {X.shape}")  # e.g., (10, 1000) = 10 texts, 1000 features
print(f"Vocabulary size: {len(vectorizer.vocabulary_)}")  # Number of unique words/phrases
# Vocabulary maps: word → column index in feature matrix
```

### Step 3: Train Model

**What We're Trying to Achieve:**
- Train a classifier to predict sentiment from text features
- Learn patterns: which words/phrases indicate positive/negative/neutral sentiment
- Evaluate how well the model performs on unseen data

**Why Naive Bayes?**
- Fast and efficient for text classification
- Works well with sparse features (many zeros, like TF-IDF)
- Probabilistic: gives probability for each class
- Good baseline for text classification

```python
# Split data: Separate into training and testing sets
# Training: Model learns from this (70%)
# Testing: Model evaluated on this (30%) - simulates real-world performance
X_train, X_test, y_train, y_test = train_test_split(
    X, y,  # Features and labels
    test_size=0.3,  # 30% for testing, 70% for training
    random_state=42,  # Seed for reproducibility (same split every time)
    stratify=y  # Keep same proportion of each class in train/test
    # Ensures both sets have similar distribution of positive/negative/neutral
)

# Create Naive Bayes classifier
# Naive Bayes: Uses Bayes' theorem with "naive" assumption (features independent)
# Actually works well for text despite independence assumption
model = MultinomialNB(alpha=1.0)  # alpha = smoothing parameter
# Smoothing prevents zero probabilities (if word never seen in class)
# alpha=1.0 is Laplace smoothing (add 1 to all counts)

# Train the model
# Model learns: P(sentiment | words) from training examples
# For each word, learns: how likely it appears in positive/negative/neutral texts
model.fit(X_train, y_train)
# After this, model knows which words indicate which sentiment

# Make predictions on test set (unseen data)
y_pred = model.predict(X_test)
# Returns predicted class for each test text: [1, -1, 0, ...]

# Evaluate model performance
# Accuracy: Percentage of correct predictions
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy:.4f}")  # e.g., 0.8500 = 85% correct

# Detailed classification report
print("\nClassification Report:")
print(classification_report(y_test, y_pred, 
      target_names=['negative', 'neutral', 'positive']))
# Shows for each class:
# - Precision: Of predicted positive, how many were actually positive?
# - Recall: Of actual positive, how many did we find?
# - F1-score: Harmonic mean of precision and recall
# - Support: Number of examples in each class
```

### Step 4: Using Pre-trained Models (Better Approach)

```python
from transformers import pipeline

# Use Hugging Face sentiment analysis pipeline
sentiment_analyzer = pipeline("sentiment-analysis", 
                              model="distilbert-base-uncased-finetuned-sst-2-english")

# Analyze text
texts = [
    "I love this product!",
    "This is terrible.",
    "It's okay, nothing special."
]

results = sentiment_analyzer(texts)
for text, result in zip(texts, results):
    print(f"Text: {text}")
    print(f"Sentiment: {result['label']}, Score: {result['score']:.4f}\n")
```

### Step 5: Fine-tuning BERT for Sentiment

```python
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from transformers import Trainer, TrainingArguments
from datasets import Dataset
import torch

# Load pre-trained model and tokenizer
model_name = "distilbert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(
    model_name, num_labels=3
)

# Prepare data
def tokenize_function(examples):
    return tokenizer(examples['text'], truncation=True, padding=True)

# Convert to dataset format
train_dataset = Dataset.from_dict({
    'text': df['text'].tolist(),
    'labels': df['label'].tolist()
})
train_dataset = train_dataset.map(tokenize_function, batched=True)

# Training arguments
training_args = TrainingArguments(
    output_dir='./sentiment_model',
    num_train_epochs=3,
    per_device_train_batch_size=16,
    save_steps=500,
    save_total_limit=2,
)

# Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
)

# Train
trainer.train()
```

---

## Text Classification with Transformers

### Problem Statement
Classify text into multiple categories using transformer models.

### Step 1: Load Data

```python
# Example: News category classification
categories = {
    'text': [
        "Stock market reaches all-time high",
        "New vaccine shows promising results",
        "Team wins championship game",
        "Company reports record profits",
        "Scientists discover new planet",
        "Player scores winning goal"
    ],
    'category': ['business', 'science', 'sports', 'business', 'science', 'sports']
}

df = pd.DataFrame(categories)
```

### Step 2: Using Hugging Face Transformers

```python
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from transformers import pipeline
import torch

# Use pre-trained model
model_name = "distilbert-base-uncased"
classifier = pipeline("text-classification", 
                     model="j-hartmann/emotion-english-distilroberta-base")

# Classify text
text = "I'm feeling great today!"
result = classifier(text)
print(result)
```

### Step 3: Fine-tuning for Custom Categories

```python
from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments
from datasets import Dataset
from sklearn.preprocessing import LabelEncoder

# Prepare data
le = LabelEncoder()
df['label_encoded'] = le.fit_transform(df['category'])

# Load model
model_name = "distilbert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(
    model_name, num_labels=len(le.classes_)
)

# Tokenize
def tokenize(examples):
    return tokenizer(examples['text'], truncation=True, padding=True, max_length=128)

# Create dataset
dataset = Dataset.from_pandas(df[['text', 'label_encoded']])
dataset = dataset.map(tokenize, batched=True)

# Split
train_test = dataset.train_test_split(test_size=0.2)
train_dataset = train_test['train']
test_dataset = train_test['test']

# Training arguments
training_args = TrainingArguments(
    output_dir='./text_classifier',
    num_train_epochs=3,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=16,
    evaluation_strategy="epoch",
    save_strategy="epoch",
    load_best_model_at_end=True,
)

# Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=test_dataset,
)

# Train
trainer.train()

# Save
model.save_pretrained('./text_classifier')
tokenizer.save_pretrained('./text_classifier')
```

---

## Named Entity Recognition (NER)

### Problem Statement
Identify and classify named entities in text (person, organization, location, etc.).

### Step 1: Using spaCy

```python
import spacy

nlp = spacy.load("en_core_web_sm")

text = "Apple Inc. was founded by Steve Jobs in Cupertino, California in 1976."

doc = nlp(text)

# Extract entities
print("Entities found:")
for ent in doc.ents:
    print(f"{ent.text} - {ent.label_} - {ent.start_char}-{ent.end_char}")

# Visualize
from spacy import displacy
displacy.render(doc, style="ent", jupyter=True)
```

### Step 2: Using Transformers for NER

```python
from transformers import pipeline

# Use pre-trained NER model
ner = pipeline("ner", 
               model="dbmdz/bert-large-cased-finetuned-conll03-english",
               aggregation_strategy="simple")

text = "Tim Cook is the CEO of Apple Inc. in Cupertino, California."

entities = ner(text)
for entity in entities:
    print(f"{entity['word']} - {entity['entity_group']} - {entity['score']:.4f}")
```

### Step 3: Custom NER with Training Data

```python
from transformers import AutoTokenizer, AutoModelForTokenClassification
from transformers import Trainer, TrainingArguments
from datasets import Dataset

# Prepare NER data (BIO format)
# B-PER = Beginning of Person
# I-PER = Inside Person
# O = Outside entity

ner_data = {
    'tokens': [
        ['Apple', 'Inc.', 'was', 'founded', 'by', 'Steve', 'Jobs'],
        ['Microsoft', 'is', 'located', 'in', 'Redmond', 'Washington']
    ],
    'ner_tags': [
        [3, 4, 0, 0, 0, 1, 2],  # B-ORG, I-ORG, O, O, O, B-PER, I-PER
        [3, 0, 0, 0, 5, 6]  # B-ORG, O, O, O, B-LOC, I-LOC
    ]
}

# Load model
model_name = "bert-base-cased"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForTokenClassification.from_pretrained(
    model_name, num_labels=7  # Number of NER labels
)

# Tokenize and align labels
def tokenize_and_align_labels(examples):
    tokenized_inputs = tokenizer(
        examples['tokens'],
        truncation=True,
        is_split_into_words=True,
        padding=True
    )
    
    # Align labels with tokenized inputs
    labels = []
    for i, label in enumerate(examples['ner_tags']):
        word_ids = tokenized_inputs.word_ids(batch_index=i)
        previous_word_idx = None
        label_ids = []
        for word_idx in word_ids:
            if word_idx is None:
                label_ids.append(-100)
            elif word_idx != previous_word_idx:
                label_ids.append(label[word_idx])
            else:
                label_ids.append(-100)
            previous_word_idx = word_idx
        labels.append(label_ids)
    
    tokenized_inputs["labels"] = labels
    return tokenized_inputs

# Create dataset and train (similar to previous examples)
```

---

## Text Generation with GPT

### Problem Statement
Generate text using pre-trained language models.

### Step 1: Using GPT-2

```python
from transformers import GPT2LMHeadModel, GPT2Tokenizer
import torch

# Load model and tokenizer
model_name = "gpt2"
tokenizer = GPT2Tokenizer.from_pretrained(model_name)
model = GPT2LMHeadModel.from_pretrained(model_name)

# Set pad token
tokenizer.pad_token = tokenizer.eos_token

# Generate text
prompt = "The future of artificial intelligence"
inputs = tokenizer.encode(prompt, return_tensors="pt")

# Generate
with torch.no_grad():
    outputs = model.generate(
        inputs,
        max_length=100,
        num_return_sequences=1,
        temperature=0.7,
        do_sample=True,
        pad_token_id=tokenizer.eos_token_id
    )

generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
print(generated_text)
```

### Step 2: Using Pipeline

```python
from transformers import pipeline

# Text generation pipeline
generator = pipeline("text-generation", model="gpt2")

prompt = "Once upon a time"
generated = generator(
    prompt,
    max_length=100,
    num_return_sequences=1,
    temperature=0.7,
    do_sample=True
)

print(generated[0]['generated_text'])
```

### Step 3: Fine-tuning GPT for Specific Domain

```python
from transformers import GPT2LMHeadModel, GPT2Tokenizer, Trainer, TrainingArguments
from datasets import Dataset

# Load model
model_name = "gpt2"
tokenizer = GPT2Tokenizer.from_pretrained(model_name)
model = GPT2LMHeadModel.from_pretrained(model_name)

# Prepare your domain-specific text data
texts = [
    "Your domain-specific text here...",
    "More examples...",
]

# Tokenize
def tokenize_function(examples):
    return tokenizer(examples['text'], truncation=True, padding=True, max_length=512)

dataset = Dataset.from_dict({'text': texts})
dataset = dataset.map(tokenize_function, batched=True)

# Training arguments
training_args = TrainingArguments(
    output_dir='./gpt2-finetuned',
    num_train_epochs=3,
    per_device_train_batch_size=4,
    save_steps=500,
    prediction_loss_only=True,
)

# Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset,
)

# Train
trainer.train()
```

---

## Building a Chatbot

### Problem Statement
Create a conversational chatbot using transformers.

### Step 1: Simple Rule-Based Chatbot

```python
import re

class SimpleChatbot:
    def __init__(self):
        self.responses = {
            r'hello|hi|hey': "Hello! How can I help you?",
            r'how are you': "I'm doing well, thank you! How about you?",
            r'what is your name': "I'm a chatbot. What's your name?",
            r'bye|goodbye': "Goodbye! Have a great day!",
            r'thanks|thank you': "You're welcome!",
        }
    
    def respond(self, user_input):
        user_input = user_input.lower()
        
        for pattern, response in self.responses.items():
            if re.search(pattern, user_input):
                return response
        
        return "I'm not sure how to respond to that. Can you rephrase?"

# Usage
bot = SimpleChatbot()
print(bot.respond("Hello"))
print(bot.respond("How are you?"))
```

### Step 2: Using DialoGPT (Conversational AI)

```python
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

# Load DialoGPT model
model_name = "microsoft/DialoGPT-medium"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

def chat_with_bot(user_input, chat_history_ids=None):
    # Encode user input
    new_user_input_ids = tokenizer.encode(
        user_input + tokenizer.eos_token, 
        return_tensors='pt'
    )
    
    # Append to chat history
    if chat_history_ids is not None:
        bot_input_ids = torch.cat([chat_history_ids, new_user_input_ids], dim=-1)
    else:
        bot_input_ids = new_user_input_ids
    
    # Generate response
    chat_history_ids = model.generate(
        bot_input_ids,
        max_length=1000,
        pad_token_id=tokenizer.eos_token_id,
        no_repeat_ngram_size=3,
        do_sample=True,
        top_k=100,
        top_p=0.7,
        temperature=0.8
    )
    
    # Decode response
    response = tokenizer.decode(
        chat_history_ids[:, bot_input_ids.shape[-1]:][0], 
        skip_special_tokens=True
    )
    
    return response, chat_history_ids

# Chat loop
chat_history = None
while True:
    user_input = input("You: ")
    if user_input.lower() in ['quit', 'exit', 'bye']:
        break
    
    response, chat_history = chat_with_bot(user_input, chat_history)
    print(f"Bot: {response}")
```

### Step 3: Using ChatGPT API (OpenAI)

```python
import openai

# Set your API key
openai.api_key = "your-api-key-here"

def chat_with_gpt(prompt, conversation_history=[]):
    # Add user message
    conversation_history.append({"role": "user", "content": prompt})
    
    # Call API
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=conversation_history,
        temperature=0.7,
        max_tokens=150
    )
    
    # Get assistant response
    assistant_message = response.choices[0].message.content
    conversation_history.append({"role": "assistant", "content": assistant_message})
    
    return assistant_message, conversation_history

# Usage
conversation = []
while True:
    user_input = input("You: ")
    if user_input.lower() in ['quit', 'exit']:
        break
    
    response, conversation = chat_with_gpt(user_input, conversation)
    print(f"Bot: {response}")
```

---

## Real-World NLP Applications

### Application 1: Email Classification

```python
from transformers import pipeline

# Classify emails into categories
classifier = pipeline("zero-shot-classification",
                     model="facebook/bart-large-mnli")

email = "Your order #12345 has been shipped and will arrive tomorrow."
categories = ["shipping", "billing", "support", "marketing", "other"]

result = classifier(email, categories)
print(f"Email: {email}")
print(f"Category: {result['labels'][0]} (Score: {result['scores'][0]:.4f})")
```

### Application 2: Text Summarization

```python
from transformers import pipeline

# Summarize long text
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

text = """
Artificial intelligence is transforming industries across the globe.
Machine learning algorithms can now process vast amounts of data
and make predictions with remarkable accuracy. Deep learning,
a subset of machine learning, uses neural networks to learn
complex patterns. Natural language processing enables computers
to understand and generate human language. Computer vision allows
machines to interpret visual information. These technologies are
being applied in healthcare, finance, transportation, and many
other sectors, revolutionizing how we work and live.
"""

summary = summarizer(text, max_length=50, min_length=30, do_sample=False)
print("Original text length:", len(text))
print("Summary:", summary[0]['summary_text'])
```

### Application 3: Question Answering

```python
from transformers import pipeline

# Question answering
qa_pipeline = pipeline("question-answering",
                      model="distilbert-base-cased-distilled-squad")

context = """
Artificial intelligence (AI) is intelligence demonstrated by machines,
in contrast to the natural intelligence displayed by humans and animals.
Leading AI textbooks define the field as the study of "intelligent agents":
any device that perceives its environment and takes actions that maximize
its chance of successfully achieving its goals.
"""

question = "What is artificial intelligence?"

answer = qa_pipeline(question=question, context=context)
print(f"Question: {question}")
print(f"Answer: {answer['answer']}")
print(f"Confidence: {answer['score']:.4f}")
```

### Application 4: Language Translation

```python
from transformers import pipeline

# Translation
translator = pipeline("translation_en_to_fr", model="t5-base")

text = "Hello, how are you today?"
translation = translator(text)
print(f"English: {text}")
print(f"French: {translation[0]['translation_text']}")
```

### Application 5: Text Similarity

```python
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Load model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Example sentences
sentences = [
    "The cat sat on the mat",
    "A feline was resting on the rug",
    "I love programming in Python",
    "Python is my favorite programming language"
]

# Encode sentences
embeddings = model.encode(sentences)

# Calculate similarity
similarity_matrix = cosine_similarity(embeddings)

print("Similarity Matrix:")
for i, sent1 in enumerate(sentences):
    for j, sent2 in enumerate(sentences):
        if i < j:
            print(f"\n'{sent1}' vs '{sent2}'")
            print(f"Similarity: {similarity_matrix[i][j]:.4f}")
```

---

## Best Practices

1. **Always preprocess text** before feeding to models
2. **Use pre-trained models** when possible (saves time and resources)
3. **Fine-tune on your domain** for better performance
4. **Handle edge cases** (empty text, special characters)
5. **Monitor model performance** in production
6. **Consider computational costs** (larger models = slower inference)
7. **Use appropriate tokenizers** for your model
8. **Batch processing** for efficiency

---

## Next Steps

1. Practice with real datasets (IMDB, Amazon reviews, news articles)
2. Experiment with different transformer models
3. Learn about attention mechanisms
4. Explore multilingual NLP
5. Study advanced topics (few-shot learning, prompt engineering)
6. Build end-to-end NLP applications

---

*Practice with real-world datasets to master NLP!*

