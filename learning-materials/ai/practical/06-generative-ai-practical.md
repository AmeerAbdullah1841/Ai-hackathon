# Generative AI - Practical Guide

## Table of Contents
1. [Setting Up Generative AI Environment](#setting-up-generative-ai-environment)
2. [Text Generation with GPT](#text-generation-with-gpt)
3. [Image Generation with Stable Diffusion](#image-generation-with-stable-diffusion)
4. [Fine-tuning Language Models](#fine-tuning-language-models)
5. [Building a Chatbot with LLMs](#building-a-chatbot-with-llms)
6. [Prompt Engineering in Practice](#prompt-engineering-in-practice)
7. [RAG (Retrieval-Augmented Generation)](#rag-retrieval-augmented-generation)
8. [Real-World Applications](#real-world-applications)

---

## Setting Up Generative AI Environment

### Installation

```bash
# Core libraries
pip install transformers torch
pip install diffusers accelerate
pip install openai  # For OpenAI API
pip install langchain  # For LLM applications
pip install sentence-transformers
pip install pandas numpy matplotlib
```

---

## Text Generation with GPT

### Using Hugging Face Transformers

```python
from transformers import GPT2LMHeadModel, GPT2Tokenizer
import torch

# Load model and tokenizer
model_name = "gpt2"
tokenizer = GPT2Tokenizer.from_pretrained(model_name)
model = GPT2LMHeadModel.from_pretrained(model_name)

# Set padding token
tokenizer.pad_token = tokenizer.eos_token

def generate_text(prompt, max_length=100, temperature=0.7, top_k=50, top_p=0.95):
    """
    Generate text using GPT-2 model.
    
    What We're Trying to Achieve:
    - Take a starting prompt (e.g., "The future of AI")
    - Generate continuation text that follows naturally
    - Control creativity vs consistency through parameters
    
    Parameters Explained:
    - temperature: Controls randomness (0.1 = very focused, 1.0 = very creative)
    - top_k: Consider only top K most likely next words
    - top_p: Consider words until cumulative probability reaches p (nucleus sampling)
    """
    # Encode input: Convert text to numbers (token IDs)
    # "pt" = PyTorch tensor format
    # Example: "Hello world" → [15496, 995]
    inputs = tokenizer.encode(prompt, return_tensors="pt")
    
    # Generate text
    with torch.no_grad():  # Don't compute gradients (we're not training)
        # Generate tokens one by one, building on the prompt
        outputs = model.generate(
            inputs,  # Starting tokens (the prompt)
            
            max_length=max_length,  # Maximum total length (prompt + generated)
            # Stops when reaching this length or EOS token
            
            temperature=temperature,  # Controls randomness in word selection
            # Low (0.1-0.3): More deterministic, focused, repetitive
            # Medium (0.7): Balanced creativity and coherence
            # High (1.0+): Very creative, diverse, sometimes incoherent
            # Formula: probability = exp(logit / temperature)
            
            top_k=top_k,  # Only consider top K most likely next words
            # Filters out unlikely words, focuses on probable ones
            # top_k=50 means: rank all words, only sample from top 50
            # Prevents very unlikely words from being chosen
            
            top_p=top_p,  # Nucleus sampling: consider words until cumulative prob >= p
            # More dynamic than top_k: adapts to distribution
            # If many words are likely, considers more; if few, considers fewer
            # Example: top_p=0.95 means consider words until they sum to 95% probability
            
            do_sample=True,  # Sample from distribution (vs always picking most likely)
            # True = creative, False = deterministic (always best word)
            
            pad_token_id=tokenizer.eos_token_id,  # Use EOS as padding
            # EOS = End of Sequence token, marks end of generation
            
            num_return_sequences=1  # Generate 1 continuation
            # Could generate multiple and pick best
        )
    
    # Decode: Convert token IDs back to text
    # skip_special_tokens=True removes special tokens like [PAD], [EOS]
    generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return generated_text

# Example usage with different parameters:
# Creative: generate_text(prompt, temperature=1.0, top_p=0.9)
# Focused: generate_text(prompt, temperature=0.3, top_p=0.5)

# Generate text
prompt = "The future of artificial intelligence"
generated = generate_text(prompt, max_length=150)
print(generated)
```

### Using Pipeline

```python
from transformers import pipeline

# Create text generation pipeline
generator = pipeline("text-generation", model="gpt2")

# Generate
prompt = "Once upon a time in a world where"
results = generator(
    prompt,
    max_length=100,
    num_return_sequences=3,
    temperature=0.8,
    do_sample=True
)

for i, result in enumerate(results):
    print(f"\nGenerated Text {i+1}:")
    print(result['generated_text'])
```

### Advanced Generation Parameters

```python
def advanced_generation(prompt, **kwargs):
    inputs = tokenizer.encode(prompt, return_tensors="pt")
    
    with torch.no_grad():
        outputs = model.generate(
            inputs,
            max_length=kwargs.get('max_length', 100),
            temperature=kwargs.get('temperature', 0.7),
            top_k=kwargs.get('top_k', 50),
            top_p=kwargs.get('top_p', 0.95),
            repetition_penalty=kwargs.get('repetition_penalty', 1.2),
            num_beams=kwargs.get('num_beams', 1),
            do_sample=kwargs.get('do_sample', True),
            pad_token_id=tokenizer.eos_token_id
        )
    
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

# Examples with different parameters
prompt = "Artificial intelligence is"

# Creative generation
creative = advanced_generation(prompt, temperature=1.0, top_p=0.9)
print("Creative:", creative)

# Focused generation
focused = advanced_generation(prompt, temperature=0.3, top_p=0.5)
print("Focused:", focused)

# Beam search (deterministic)
beam = advanced_generation(prompt, num_beams=5, do_sample=False)
print("Beam Search:", beam)
```

---

## Image Generation with Stable Diffusion

### Using Diffusers Library

```python
from diffusers import StableDiffusionPipeline
import torch

# Load model
model_id = "runwayml/stable-diffusion-v1-5"
pipe = StableDiffusionPipeline.from_pretrained(
    model_id,
    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32
)
pipe = pipe.to("cuda" if torch.cuda.is_available() else "cpu")

# Generate image
prompt = "a beautiful sunset over mountains, digital art, highly detailed"
negative_prompt = "blurry, low quality, distorted"

image = pipe(
    prompt,
    negative_prompt=negative_prompt,
    num_inference_steps=50,
    guidance_scale=7.5,
    height=512,
    width=512
).images[0]

# Save image
image.save("generated_image.png")
image.show()
```

### Advanced Image Generation

```python
from diffusers import StableDiffusionPipeline, DPMSolverMultistepScheduler
import torch

# Load with different scheduler
pipe = StableDiffusionPipeline.from_pretrained(
    "runwayml/stable-diffusion-v1-5",
    torch_dtype=torch.float16
)
pipe.scheduler = DPMSolverMultistepScheduler.from_config(pipe.scheduler.config)
pipe = pipe.to("cuda")

# Generate with different parameters
def generate_image(prompt, **kwargs):
    return pipe(
        prompt,
        num_inference_steps=kwargs.get('steps', 50),
        guidance_scale=kwargs.get('guidance_scale', 7.5),
        height=kwargs.get('height', 512),
        width=kwargs.get('width', 512),
        num_images_per_prompt=kwargs.get('num_images', 1),
        seed=kwargs.get('seed', None)
    ).images

# Generate multiple variations
prompt = "a futuristic city at night, neon lights, cyberpunk style"
images = generate_image(prompt, num_images=4, seed=42)

# Save all images
for i, img in enumerate(images):
    img.save(f"generated_image_{i+1}.png")
```

### Image-to-Image Generation

```python
from diffusers import StableDiffusionImg2ImgPipeline
from PIL import Image
import requests

# Load img2img pipeline
pipe = StableDiffusionImg2ImgPipeline.from_pretrained(
    "runwayml/stable-diffusion-v1-5",
    torch_dtype=torch.float16
)
pipe = pipe.to("cuda")

# Load input image
input_image = Image.open("input_image.jpg")
input_image = input_image.resize((512, 512))

# Generate
prompt = "transform into a painting style"
image = pipe(
    prompt=prompt,
    image=input_image,
    strength=0.75,  # How much to transform (0-1)
    num_inference_steps=50,
    guidance_scale=7.5
).images[0]

image.save("transformed_image.png")
```

---

## Fine-tuning Language Models

### Fine-tuning GPT-2 for Custom Domain

```python
from transformers import GPT2LMHeadModel, GPT2Tokenizer, Trainer, TrainingArguments
from datasets import Dataset
import torch

# Load model
model_name = "gpt2"
tokenizer = GPT2Tokenizer.from_pretrained(model_name)
model = GPT2LMHeadModel.from_pretrained(model_name)

# Set padding token
tokenizer.pad_token = tokenizer.eos_token

# Prepare your custom text data
texts = [
    "Your domain-specific text here...",
    "More examples of your domain...",
    # Add more examples
]

# Tokenize
def tokenize_function(examples):
    return tokenizer(
        examples['text'],
        truncation=True,
        padding=True,
        max_length=512
    )

# Create dataset
dataset = Dataset.from_dict({'text': texts})
tokenized_dataset = dataset.map(tokenize_function, batched=True)

# Training arguments
training_args = TrainingArguments(
    output_dir='./gpt2-finetuned',
    num_train_epochs=3,
    per_device_train_batch_size=4,
    save_steps=500,
    save_total_limit=2,
    prediction_loss_only=True,
    logging_steps=100,
)

# Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset,
)

# Train
trainer.train()

# Save
model.save_pretrained('./gpt2-finetuned')
tokenizer.save_pretrained('./gpt2-finetuned')
```

### Using LoRA for Efficient Fine-tuning

```python
from peft import LoraConfig, get_peft_model, TaskType
from transformers import AutoModelForCausalLM, AutoTokenizer

# Load model
model_name = "gpt2"
model = AutoModelForCausalLM.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)

# Configure LoRA
lora_config = LoraConfig(
    task_type=TaskType.CAUSAL_LM,
    r=8,  # Rank
    lora_alpha=32,
    lora_dropout=0.1,
    target_modules=["c_attn", "c_proj"]  # GPT-2 attention layers
)

# Apply LoRA
model = get_peft_model(model, lora_config)
model.print_trainable_parameters()  # See how many parameters are trainable

# Now train with much fewer parameters
# Training code similar to above...
```

---

## Building a Chatbot with LLMs

### Using OpenAI API

```python
import openai

# Set API key
openai.api_key = "your-api-key-here"

def chat_with_gpt(messages, model="gpt-3.5-turbo", temperature=0.7):
    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        temperature=temperature,
        max_tokens=150
    )
    return response.choices[0].message.content

# Conversation loop
conversation_history = [
    {"role": "system", "content": "You are a helpful assistant."}
]

while True:
    user_input = input("You: ")
    if user_input.lower() in ['quit', 'exit', 'bye']:
        break
    
    conversation_history.append({"role": "user", "content": user_input})
    
    response = chat_with_gpt(conversation_history)
    conversation_history.append({"role": "assistant", "content": response})
    
    print(f"Assistant: {response}")
```

### Using Local Models with LangChain

```python
from langchain.llms import HuggingFacePipeline
from langchain import PromptTemplate, LLMChain
from transformers import pipeline

# Create pipeline
llm_pipeline = pipeline(
    "text-generation",
    model="gpt2",
    max_length=200,
    temperature=0.7
)

llm = HuggingFacePipeline(pipeline=llm_pipeline)

# Create prompt template
template = """You are a helpful assistant. Answer the following question:

Question: {question}

Answer:"""

prompt = PromptTemplate(template=template, input_variables=["question"])

# Create chain
chain = LLMChain(llm=llm, prompt=prompt)

# Use
question = "What is artificial intelligence?"
response = chain.run(question)
print(response)
```

### Building RAG Chatbot

```python
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI

# Load documents
documents = [
    "Your document text here...",
    "More document text...",
]

# Split documents
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
texts = text_splitter.create_documents(documents)

# Create embeddings
embeddings = HuggingFaceEmbeddings()

# Create vector store
vectorstore = FAISS.from_documents(texts, embeddings)

# Create QA chain
llm = OpenAI(temperature=0)
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vectorstore.as_retriever()
)

# Query
query = "What is the main topic?"
result = qa_chain.run(query)
print(result)
```

---

## Prompt Engineering in Practice

### Zero-Shot Learning

```python
from transformers import pipeline

# Zero-shot classification
classifier = pipeline("zero-shot-classification",
                     model="facebook/bart-large-mnli")

text = "I love this new phone! The camera is amazing."
candidate_labels = ["positive", "negative", "neutral"]

result = classifier(text, candidate_labels)
print(f"Text: {text}")
print(f"Label: {result['labels'][0]} (Score: {result['scores'][0]:.4f})")
```

### Few-Shot Learning

```python
def few_shot_prompt(examples, query):
    prompt = "Examples:\n"
    for example in examples:
        prompt += f"Input: {example['input']}\nOutput: {example['output']}\n\n"
    prompt += f"Input: {query}\nOutput:"
    return prompt

# Examples
examples = [
    {"input": "Translate to French: Hello", "output": "Bonjour"},
    {"input": "Translate to French: Goodbye", "output": "Au revoir"},
    {"input": "Translate to French: Thank you", "output": "Merci"},
]

query = "Translate to French: How are you?"
prompt = few_shot_prompt(examples, query)

# Use with language model
generator = pipeline("text-generation", model="gpt2")
result = generator(prompt, max_length=100, num_return_sequences=1)
print(result[0]['generated_text'])
```

### Chain-of-Thought Prompting

```python
def chain_of_thought_prompt(problem):
    prompt = f"""Solve this problem step by step:

Problem: {problem}

Let's think step by step:
1. First, I need to understand what the problem is asking.
2. Then, I'll break it down into smaller steps.
3. Finally, I'll solve each step and combine the results.

Solution:"""
    return prompt

problem = "If a train travels 60 miles in 1 hour, how far will it travel in 3 hours?"
prompt = chain_of_thought_prompt(problem)

generator = pipeline("text-generation", model="gpt2")
result = generator(prompt, max_length=200, temperature=0.3)
print(result[0]['generated_text'])
```

---

## RAG (Retrieval-Augmented Generation)

### Complete RAG Implementation

```python
from langchain.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.llms import HuggingFacePipeline
from transformers import pipeline

# Load documents
loader = TextLoader("document.txt")
documents = loader.load()

# Split documents
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200
)
texts = text_splitter.split_documents(documents)

# Create embeddings
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# Create vector store
vectorstore = Chroma.from_documents(texts, embeddings)

# Create LLM
llm_pipeline = pipeline(
    "text-generation",
    model="gpt2",
    max_length=200
)
llm = HuggingFacePipeline(pipeline=llm_pipeline)

# Create QA chain
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vectorstore.as_retriever(search_kwargs={"k": 3})
)

# Query
query = "What is the main topic of the document?"
result = qa_chain.run(query)
print(result)
```

### Advanced RAG with Metadata

```python
from langchain.schema import Document

# Create documents with metadata
documents = [
    Document(
        page_content="Content about AI...",
        metadata={"source": "article1", "topic": "AI", "date": "2024-01-01"}
    ),
    Document(
        page_content="Content about ML...",
        metadata={"source": "article2", "topic": "ML", "date": "2024-01-02"}
    ),
]

# Create vector store
vectorstore = Chroma.from_documents(documents, embeddings)

# Filtered retrieval
retriever = vectorstore.as_retriever(
    search_kwargs={"k": 3, "filter": {"topic": "AI"}}
)

# Query with filtering
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=retriever
)
```

---

## Real-World Applications

### Application 1: Content Generation

```python
def generate_blog_post(topic, length="medium"):
    prompt = f"""Write a blog post about {topic}.

The blog post should be {length} length and include:
- An engaging introduction
- Main points with examples
- A conclusion

Blog post:"""

    generator = pipeline("text-generation", model="gpt2")
    result = generator(prompt, max_length=500, temperature=0.8)
    return result[0]['generated_text']

# Generate blog post
topic = "The Future of Artificial Intelligence"
blog_post = generate_blog_post(topic, length="long")
print(blog_post)
```

### Application 2: Code Generation

```python
def generate_code(description, language="python"):
    prompt = f"""Write {language} code for the following:

Description: {description}

Code:"""

    generator = pipeline("text-generation", model="gpt2")
    result = generator(prompt, max_length=300, temperature=0.3)
    return result[0]['generated_text']

# Generate code
description = "A function that calculates the factorial of a number"
code = generate_code(description, language="python")
print(code)
```

### Application 3: Text Summarization

```python
from transformers import pipeline

# Summarization
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

long_text = """
Your long text here that needs to be summarized...
[Add multiple paragraphs of text]
"""

summary = summarizer(long_text, max_length=100, min_length=30, do_sample=False)
print("Summary:", summary[0]['summary_text'])
```

### Application 4: Question Answering System

```python
from transformers import pipeline

# Question answering
qa_pipeline = pipeline("question-answering",
                      model="distilbert-base-cased-distilled-squad")

context = """
Artificial intelligence is transforming industries. Machine learning
algorithms can process vast amounts of data. Deep learning uses neural
networks to learn complex patterns.
"""

questions = [
    "What is transforming industries?",
    "What do machine learning algorithms do?",
    "What does deep learning use?"
]

for question in questions:
    answer = qa_pipeline(question=question, context=context)
    print(f"Q: {question}")
    print(f"A: {answer['answer']} (Score: {answer['score']:.4f})\n")
```

---

## Best Practices

1. **Start with Pre-trained Models**: Don't train from scratch
2. **Use Appropriate Models**: Choose based on task and resources
3. **Prompt Engineering**: Craft effective prompts
4. **Fine-tune When Needed**: For domain-specific tasks
5. **Monitor Outputs**: Check for hallucinations and bias
6. **Use RAG**: For factual information
7. **Optimize for Deployment**: Model quantization, pruning
8. **Consider Costs**: API costs, compute costs

---

## Next Steps

1. Experiment with different models (GPT, BERT, T5)
2. Practice prompt engineering
3. Build end-to-end applications
4. Learn about model optimization
5. Study advanced techniques (few-shot, in-context learning)
6. Explore multimodal generation

---

*Practice building real applications to master generative AI!*

