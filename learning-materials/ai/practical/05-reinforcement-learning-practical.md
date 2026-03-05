# Reinforcement Learning - Practical Guide

## Table of Contents
1. [Setting Up RL Environment](#setting-up-rl-environment)
2. [Your First RL Agent: Q-Learning](#your-first-rl-agent-q-learning)
3. [Deep Q-Network (DQN) for Atari Games](#deep-q-network-dqn-for-atari-games)
4. [Policy Gradient Methods](#policy-gradient-methods)
5. [Training an Agent for Custom Environment](#training-an-agent-for-custom-environment)
6. [Real-World RL Applications](#real-world-rl-applications)

---

## Setting Up RL Environment

### Installation

```bash
# Core RL libraries
pip install gym gymnasium
pip install stable-baselines3
pip install tensorflow torch
pip install numpy matplotlib
pip install opencv-python  # For Atari games
```

---

## Your First RL Agent: Q-Learning

### Problem: Frozen Lake Environment

```python
import gym
import numpy as np
import matplotlib.pyplot as plt

# Create environment
env = gym.make('FrozenLake-v1', is_slippery=True)

print("Action Space:", env.action_space)
print("Observation Space:", env.observation_space)

# Action meanings: 0=Left, 1=Down, 2=Right, 3=Up
# Goal: Navigate from S to G without falling into H
```

### Q-Learning Implementation

```python
class QLearningAgent:
    """
    Q-Learning Agent for solving Frozen Lake problem.
    
    What Q-Learning Does:
    - Learns the value (Q-value) of taking each action in each state
    - Q(state, action) = expected future reward from that state-action pair
    - Goal: Find optimal policy by learning Q-values
    """
    def __init__(self, env, learning_rate=0.1, discount=0.95, epsilon=1.0, epsilon_decay=0.995, epsilon_min=0.01):
        self.env = env  # The environment (Frozen Lake)
        
        # Learning rate: How much to update Q-values (0.0 to 1.0)
        # Higher = learn faster but might overshoot, Lower = learn slower but more stable
        self.lr = learning_rate
        
        # Discount factor (gamma): How much we value future rewards vs immediate
        # 0.95 means: reward 10 steps away is worth 0.95^10 ≈ 0.6 of immediate reward
        # Closer to 1.0 = more long-term thinking, closer to 0.0 = more greedy
        self.gamma = discount
        
        # Epsilon: Exploration rate (0.0 to 1.0)
        # Probability of taking random action (exploring) vs best known action (exploiting)
        # Start at 1.0 (100% exploration), decay over time
        self.epsilon = epsilon
        self.epsilon_decay = epsilon_decay  # How fast to reduce exploration
        self.epsilon_min = epsilon_min  # Minimum exploration (always explore a little)
        
        # Initialize Q-table: 2D array storing Q-values
        # Rows = states (16 positions on frozen lake)
        # Columns = actions (4 directions: left, down, right, up)
        # Initially all zeros (no knowledge)
        # Q_table[state][action] = expected reward from taking action in state
        self.q_table = np.zeros((env.observation_space.n, env.action_space.n))
        # Shape: (16, 4) for Frozen Lake
    
    def choose_action(self, state):
        """
        Epsilon-greedy policy: Balance exploration vs exploitation
        
        Exploration: Try random actions to discover new strategies
        Exploitation: Use best known action based on current Q-values
        """
        # Epsilon-greedy: With probability epsilon, explore (random action)
        if np.random.random() < self.epsilon:
            return self.env.action_space.sample()  # Explore: random action
        else:
            # Exploit: Choose action with highest Q-value for current state
            # argmax returns index of maximum value (which action is best)
            return np.argmax(self.q_table[state])
    
    def update_q_table(self, state, action, reward, next_state, done):
        """
        Q-Learning update rule: Learn from experience
        
        Bellman equation: Q(s,a) = Q(s,a) + α[r + γ*max(Q(s',a')) - Q(s,a)]
        - α (lr): Learning rate
        - r: Immediate reward
        - γ (gamma): Discount factor
        - max(Q(s',a')): Best future value from next state
        """
        # Current Q-value for this state-action pair
        current_q = self.q_table[state, action]
        
        if done:
            # Episode ended: no future rewards, only immediate reward
            target_q = reward
        else:
            # Episode continues: immediate reward + discounted future reward
            # max() finds best action in next state (optimal future value)
            target_q = reward + self.gamma * np.max(self.q_table[next_state])
            # This is the "bootstrapping" - using current estimates to update
        
        # Q-learning update: Move current Q-value towards target
        # (target_q - current_q) = error (how wrong we were)
        # Multiply by learning rate to take small step
        self.q_table[state, action] = current_q + self.lr * (target_q - current_q)
        # If target > current: increase Q-value (action is better than we thought)
        # If target < current: decrease Q-value (action is worse than we thought)
    
    def decay_epsilon(self):
        """
        Reduce exploration over time
        Start exploring a lot, gradually exploit more as we learn
        """
        if self.epsilon > self.epsilon_min:
            # Exponential decay: epsilon *= 0.995 each time
            # Starts at 1.0, gradually decreases to 0.01
            self.epsilon *= self.epsilon_decay

# Train agent
def train_agent(agent, episodes=10000):
    rewards = []
    success_rate = []
    successes = 0
    
    for episode in range(episodes):
        state = env.reset()
        total_reward = 0
        done = False
        
        while not done:
            action = agent.choose_action(state)
            next_state, reward, done, info = env.step(action)
            
            agent.update_q_table(state, action, reward, next_state, done)
            state = next_state
            total_reward += reward
        
        rewards.append(total_reward)
        if reward > 0:  # Reached goal
            successes += 1
        success_rate.append(successes / (episode + 1))
        
        agent.decay_epsilon()
        
        if (episode + 1) % 1000 == 0:
            print(f"Episode {episode + 1}, Success Rate: {success_rate[-1]:.2%}, Epsilon: {agent.epsilon:.3f}")
    
    return rewards, success_rate

# Create and train agent
agent = QLearningAgent(env)
rewards, success_rate = train_agent(agent, episodes=10000)

# Plot results
plt.figure(figsize=(12, 4))
plt.subplot(1, 2, 1)
plt.plot(rewards)
plt.title('Rewards per Episode')
plt.xlabel('Episode')
plt.ylabel('Reward')

plt.subplot(1, 2, 2)
plt.plot(success_rate)
plt.title('Success Rate')
plt.xlabel('Episode')
plt.ylabel('Success Rate')
plt.tight_layout()
plt.show()

# Test trained agent
def test_agent(agent, episodes=10):
    agent.epsilon = 0  # No exploration
    successes = 0
    
    for episode in range(episodes):
        state = env.reset()
        done = False
        steps = 0
        
        while not done and steps < 100:
            action = agent.choose_action(state)
            state, reward, done, info = env.step(action)
            steps += 1
        
        if reward > 0:
            successes += 1
            print(f"Episode {episode + 1}: Success!")
        else:
            print(f"Episode {episode + 1}: Failed")
    
    print(f"\nSuccess Rate: {successes}/{episodes} ({successes/episodes:.2%})")

test_agent(agent)
```

---

## Deep Q-Network (DQN) for Atari Games

### Problem: Play Atari Games

```python
import gym
from stable_baselines3 import DQN
from stable_baselines3.common.env_util import make_atari_env
from stable_baselines3.common.vec_env import VecFrameStack
import numpy as np

# Create Atari environment
env = make_atari_env('Breakout-v4', n_envs=1, seed=0)
env = VecFrameStack(env, n_stack=4)  # Stack 4 frames

print("Environment created!")
```

### Train DQN Agent

```python
# Create DQN agent
model = DQN(
    'CnnPolicy',  # CNN for image input
    env,
    learning_rate=1e-4,
    buffer_size=100000,
    learning_starts=10000,
    batch_size=32,
    gamma=0.99,
    target_update_interval=1000,
    train_freq=4,
    gradient_steps=1,
    exploration_fraction=0.1,
    exploration_final_eps=0.01,
    verbose=1
)

# Train
print("Training DQN agent...")
model.learn(total_timesteps=100000)

# Save model
model.save("dqn_breakout")
```

### Test Trained Agent

```python
# Load model
model = DQN.load("dqn_breakout")

# Test
obs = env.reset()
for i in range(1000):
    action, _states = model.predict(obs, deterministic=True)
    obs, rewards, dones, info = env.step(action)
    env.render()
    
    if dones[0]:
        obs = env.reset()

env.close()
```

### Custom DQN Implementation

```python
import torch
import torch.nn as nn
import torch.optim as optim
import random
from collections import deque

class DQN(nn.Module):
    def __init__(self, input_shape, n_actions):
        super(DQN, self).__init__()
        self.conv = nn.Sequential(
            nn.Conv2d(input_shape[0], 32, 8, stride=4),
            nn.ReLU(),
            nn.Conv2d(32, 64, 4, stride=2),
            nn.ReLU(),
            nn.Conv2d(64, 64, 3, stride=1),
            nn.ReLU()
        )
        
        conv_out_size = self._get_conv_out(input_shape)
        self.fc = nn.Sequential(
            nn.Linear(conv_out_size, 512),
            nn.ReLU(),
            nn.Linear(512, n_actions)
        )
    
    def _get_conv_out(self, shape):
        o = self.conv(torch.zeros(1, *shape))
        return int(np.prod(o.size()))
    
    def forward(self, x):
        conv_out = self.conv(x).view(x.size()[0], -1)
        return self.fc(conv_out)

class ReplayBuffer:
    def __init__(self, capacity):
        self.buffer = deque(maxlen=capacity)
    
    def push(self, state, action, reward, next_state, done):
        self.buffer.append((state, action, reward, next_state, done))
    
    def sample(self, batch_size):
        batch = random.sample(self.buffer, batch_size)
        state, action, reward, next_state, done = map(np.stack, zip(*batch))
        return state, action, reward, next_state, done
    
    def __len__(self):
        return len(self.buffer)

# Training loop (simplified)
def train_dqn(env, episodes=1000):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    
    state_shape = env.observation_space.shape
    n_actions = env.action_space.n
    
    q_network = DQN(state_shape, n_actions).to(device)
    target_network = DQN(state_shape, n_actions).to(device)
    target_network.load_state_dict(q_network.state_dict())
    
    optimizer = optim.Adam(q_network.parameters(), lr=1e-4)
    replay_buffer = ReplayBuffer(10000)
    
    epsilon = 1.0
    epsilon_min = 0.01
    epsilon_decay = 0.995
    
    for episode in range(episodes):
        state = env.reset()
        total_reward = 0
        done = False
        
        while not done:
            # Choose action
            if random.random() < epsilon:
                action = env.action_space.sample()
            else:
                with torch.no_grad():
                    q_values = q_network(torch.FloatTensor(state).unsqueeze(0).to(device))
                    action = q_values.argmax().item()
            
            # Take step
            next_state, reward, done, _ = env.step(action)
            replay_buffer.push(state, action, reward, next_state, done)
            
            # Train
            if len(replay_buffer) > 1000:
                states, actions, rewards, next_states, dones = replay_buffer.sample(32)
                
                # Compute Q-values
                q_values = q_network(torch.FloatTensor(states).to(device))
                next_q_values = target_network(torch.FloatTensor(next_states).to(device))
                
                q_value = q_values.gather(1, torch.LongTensor(actions).unsqueeze(1).to(device))
                next_q_value = next_q_values.max(1)[0].detach()
                target = torch.FloatTensor(rewards).to(device) + 0.99 * next_q_value * (1 - torch.FloatTensor(dones).to(device))
                
                loss = nn.MSELoss()(q_value.squeeze(), target)
                
                optimizer.zero_grad()
                loss.backward()
                optimizer.step()
            
            state = next_state
            total_reward += reward
        
        # Update target network
        if episode % 10 == 0:
            target_network.load_state_dict(q_network.state_dict())
        
        # Decay epsilon
        epsilon = max(epsilon_min, epsilon * epsilon_decay)
        
        if episode % 100 == 0:
            print(f"Episode {episode}, Reward: {total_reward:.2f}, Epsilon: {epsilon:.3f}")
```

---

## Policy Gradient Methods

### REINFORCE Algorithm

```python
import torch
import torch.nn as nn
import torch.optim as optim
import gym
import numpy as np

class PolicyNetwork(nn.Module):
    def __init__(self, state_dim, action_dim, hidden_dim=128):
        super(PolicyNetwork, self).__init__()
        self.fc1 = nn.Linear(state_dim, hidden_dim)
        self.fc2 = nn.Linear(hidden_dim, hidden_dim)
        self.fc3 = nn.Linear(hidden_dim, action_dim)
        self.softmax = nn.Softmax(dim=-1)
    
    def forward(self, state):
        x = torch.relu(self.fc1(state))
        x = torch.relu(self.fc2(x))
        x = self.softmax(self.fc3(x))
        return x

class REINFORCE:
    def __init__(self, state_dim, action_dim, lr=1e-3):
        self.policy = PolicyNetwork(state_dim, action_dim)
        self.optimizer = optim.Adam(self.policy.parameters(), lr=lr)
        self.gamma = 0.99
    
    def select_action(self, state):
        state_tensor = torch.FloatTensor(state).unsqueeze(0)
        probs = self.policy(state_tensor)
        action = torch.multinomial(probs, 1).item()
        return action, probs[0][action].item()
    
    def update(self, rewards, log_probs):
        returns = []
        G = 0
        for reward in reversed(rewards):
            G = reward + self.gamma * G
            returns.insert(0, G)
        
        returns = torch.FloatTensor(returns)
        returns = (returns - returns.mean()) / (returns.std() + 1e-9)  # Normalize
        
        loss = 0
        for log_prob, G in zip(log_probs, returns):
            loss -= log_prob * G
        
        self.optimizer.zero_grad()
        loss.backward()
        self.optimizer.step()

# Train REINFORCE
env = gym.make('CartPole-v1')
state_dim = env.observation_space.shape[0]
action_dim = env.action_space.n

agent = REINFORCE(state_dim, action_dim)

for episode in range(1000):
    state = env.reset()
    rewards = []
    log_probs = []
    
    done = False
    while not done:
        action, prob = agent.select_action(state)
        log_probs.append(torch.log(torch.FloatTensor([prob])))
        
        state, reward, done, _ = env.step(action)
        rewards.append(reward)
    
    agent.update(rewards, log_probs)
    
    if (episode + 1) % 100 == 0:
        total_reward = sum(rewards)
        print(f"Episode {episode + 1}, Total Reward: {total_reward}")
```

### Using Stable-Baselines3 (PPO)

```python
from stable_baselines3 import PPO
from stable_baselines3.common.env_util import make_vec_env

# Create vectorized environment
env = make_vec_env('CartPole-v1', n_envs=4)

# Create PPO agent
model = PPO('MlpPolicy', env, verbose=1)

# Train
model.learn(total_timesteps=100000)

# Save
model.save("ppo_cartpole")

# Test
obs = env.reset()
for i in range(1000):
    action, _states = model.predict(obs, deterministic=True)
    obs, rewards, dones, info = env.step(action)
    env.render()
    
    if dones.any():
        obs = env.reset()

env.close()
```

---

## Training an Agent for Custom Environment

### Create Custom Gym Environment

```python
import gym
from gym import spaces
import numpy as np

class CustomEnv(gym.Env):
    """Custom environment example"""
    metadata = {'render.modes': ['human']}
    
    def __init__(self):
        super(CustomEnv, self).__init__()
        
        # Define action and observation space
        self.action_space = spaces.Discrete(4)  # 4 actions
        self.observation_space = spaces.Box(
            low=0, high=100, shape=(4,), dtype=np.float32
        )
        
        # Initialize state
        self.state = None
    
    def reset(self):
        # Reset environment to initial state
        self.state = np.random.uniform(0, 100, size=(4,))
        return self.state
    
    def step(self, action):
        # Execute action
        # Modify state based on action
        self.state = self.state + np.random.uniform(-1, 1, size=(4,))
        self.state = np.clip(self.state, 0, 100)
        
        # Calculate reward
        reward = -np.sum(np.abs(self.state - 50))  # Reward for being near center
        
        # Check if done
        done = np.random.random() < 0.05  # 5% chance of episode ending
        
        info = {}
        return self.state, reward, done, info
    
    def render(self, mode='human'):
        print(f"State: {self.state}")

# Register and use
from gym.envs.registration import register

register(
    id='CustomEnv-v0',
    entry_point='__main__:CustomEnv',
)

# Use environment
env = gym.make('CustomEnv-v0')
```

### Train Agent on Custom Environment

```python
from stable_baselines3 import PPO

# Create environment
env = CustomEnv()

# Create agent
model = PPO('MlpPolicy', env, verbose=1)

# Train
model.learn(total_timesteps=10000)

# Test
obs = env.reset()
for i in range(100):
    action, _states = model.predict(obs, deterministic=True)
    obs, reward, done, info = env.step(action)
    print(f"Step {i}, Reward: {reward:.2f}")
    if done:
        obs = env.reset()
```

---

## Real-World RL Applications

### Application 1: Trading Agent

```python
import gym
import numpy as np
from stable_baselines3 import PPO

class TradingEnv(gym.Env):
    def __init__(self, prices, initial_balance=10000):
        self.prices = prices
        self.initial_balance = initial_balance
        self.balance = initial_balance
        self.position = 0  # Number of shares
        self.current_step = 0
        
        self.action_space = gym.spaces.Discrete(3)  # Buy, Sell, Hold
        self.observation_space = gym.spaces.Box(
            low=0, high=np.inf, shape=(4,), dtype=np.float32
        )
    
    def reset(self):
        self.balance = self.initial_balance
        self.position = 0
        self.current_step = 0
        return self._get_observation()
    
    def _get_observation(self):
        price = self.prices[self.current_step]
        return np.array([
            price,
            self.balance,
            self.position,
            self.position * price
        ], dtype=np.float32)
    
    def step(self, action):
        price = self.prices[self.current_step]
        
        if action == 0:  # Buy
            if self.balance >= price:
                self.position += 1
                self.balance -= price
        elif action == 1:  # Sell
            if self.position > 0:
                self.position -= 1
                self.balance += price
        
        self.current_step += 1
        
        # Calculate reward (profit)
        portfolio_value = self.balance + self.position * price
        reward = portfolio_value - self.initial_balance
        
        done = self.current_step >= len(self.prices) - 1
        
        return self._get_observation(), reward, done, {}
    
    def render(self):
        price = self.prices[self.current_step]
        portfolio_value = self.balance + self.position * price
        print(f"Step: {self.current_step}, Price: {price:.2f}, "
              f"Balance: {self.balance:.2f}, Position: {self.position}, "
              f"Portfolio Value: {portfolio_value:.2f}")

# Generate sample price data
prices = 100 + np.cumsum(np.random.randn(1000) * 0.5)

# Create and train
env = TradingEnv(prices)
model = PPO('MlpPolicy', env, verbose=1)
model.learn(total_timesteps=10000)

# Test
obs = env.reset()
total_reward = 0
while True:
    action, _ = model.predict(obs, deterministic=True)
    obs, reward, done, _ = env.step(action)
    total_reward += reward
    env.render()
    if done:
        break

print(f"Total Profit: {total_reward:.2f}")
```

### Application 2: Resource Allocation

```python
class ResourceAllocationEnv(gym.Env):
    def __init__(self, n_resources=5, n_tasks=10):
        self.n_resources = n_resources
        self.n_tasks = n_tasks
        
        self.action_space = gym.spaces.MultiDiscrete([n_resources] * n_tasks)
        self.observation_space = gym.spaces.Box(
            low=0, high=1, shape=(n_resources + n_tasks,), dtype=np.float32
        )
        
        self.resource_capacity = np.random.uniform(0.5, 1.0, n_resources)
        self.task_requirements = np.random.uniform(0.1, 0.3, n_tasks)
    
    def reset(self):
        self.resource_usage = np.zeros(self.n_resources)
        self.completed_tasks = np.zeros(self.n_tasks)
        return self._get_observation()
    
    def _get_observation(self):
        return np.concatenate([self.resource_usage, self.completed_tasks])
    
    def step(self, action):
        # Allocate resources based on action
        reward = 0
        
        for task_idx, resource_idx in enumerate(action):
            if self.completed_tasks[task_idx] == 0:  # Task not completed
                requirement = self.task_requirements[task_idx]
                available = self.resource_capacity[resource_idx] - self.resource_usage[resource_idx]
                
                if available >= requirement:
                    self.resource_usage[resource_idx] += requirement
                    self.completed_tasks[task_idx] = 1
                    reward += 10  # Reward for completing task
                else:
                    reward -= 1  # Penalty for failed allocation
        
        done = np.all(self.completed_tasks == 1)
        
        return self._get_observation(), reward, done, {}
```

---

## Best Practices

1. **Start Simple**: Begin with simple environments (FrozenLake, CartPole)
2. **Use Stable-Baselines3**: For production-ready implementations
3. **Hyperparameter Tuning**: Learning rate, discount factor, exploration
4. **Monitor Training**: Track rewards, success rate, loss
5. **Handle Exploration**: Balance exploration vs exploitation
6. **Reward Shaping**: Design informative rewards
7. **Environment Design**: Make environment realistic but learnable

---

## Next Steps

1. Experiment with different algorithms (A3C, DDPG, SAC)
2. Try more complex environments
3. Learn about multi-agent RL
4. Study hierarchical RL
5. Explore real-world applications
6. Practice with custom environments

---

*Practice with different environments to master reinforcement learning!*

