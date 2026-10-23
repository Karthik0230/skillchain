# ⛓️ SkillChain

> **Your wallet is your resume.** A decentralised application where users prove skills by completing on-chain micro-tasks judged by a peer DAO.

---

## 🌟 Overview

SkillChain replaces traditional certificates with on-chain, peer-verified skill proofs. Instead of a PDF nobody trusts, your Ethereum wallet address accumulates verifiable XP, streak data, and DAO-approved task completions — all permanently on-chain.

### Core Features

| Feature | Description |
|---|---|
| 🎯 Task Board | Browse skill-tagged micro-tasks with ETH rewards |
| 📤 Submissions | Submit IPFS proof-of-work for any task |
| 🗳️ DAO Voting | Peer review via on-chain majority vote |
| ⚡ XP & Levels | Gamified skill leveling (Novice → Legend) |
| 🔥 Streaks | Daily activity tracking stored on-chain |
| 👛 Wallet Resume | Your address IS your verified credential |
| 🔗 On-chain links | Every action links to blockchain explorer |
A lot of features are stioll under development.
---

## 🏗️ Tech Stack

### Frontend
- **React 18** + **Vite** — fast dev environment
- **Tailwind CSS** — utility-first styling
- **ethers.js v6** — blockchain interaction
- **Framer Motion** — animations (ready to add)
- **React Router v6** — client-side routing

### Smart Contracts
- **Solidity 0.8.24** — core contract logic
- **Hardhat** — compile, test, deploy
- **Local Hardhat Network** — for development

### Design System
- Background: `#0B0F19` (deep space navy)
- Accent: Neon Blue → Purple gradient
- Cards: Glassmorphism (`backdrop-blur` + transparent borders)
- Fonts: **Poppins** (headings) + **Inter** (body)

# The private keys printed by a local Hardhat node are for local testing only. Never use those accounts or keys on mainnet or with real funds.

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- MetaMask browser extension
- npm or yarn

### 1. Install dependencies

```bash
npm install
```

### 2. Start local blockchain

```bash
npm run node
```

This starts a local Hardhat network at `http://127.0.0.1:8545`.

**Import a test account into MetaMask:**
- Network: `localhost:8545`, Chain ID: `31337`
- Copy a private key from the Hardhat output

### 3. Deploy the contract

```bash
# In a new terminal:
npm run deploy:local
```

This deploys the contract, seeds demo tasks, and saves `src/abi/SkillChain.json` with the contract address.

### 4. Start the frontend

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)
# This is a local development address, not a publicly accessible deployment link.

---

## 📁 Project Structure

```
skillchain/
├── contracts/
│   └── SkillChain.sol          # Core smart contract
├── scripts/
│   └── deploy.cjs              # Deploy + seed script
├── test/
│   └── SkillChain.test.cjs     # Contract tests
├── src/
│   ├── abi/
│   │   └── SkillChain.json     # ABI + deployed address
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   └── layout/             # Navbar, etc.
│   ├── context/
│   │   └── Web3Context.jsx     # Wallet + contract state
│   ├── hooks/
│   │   └── useContract.js      # useTasks, useVote, etc.
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── TasksPage.jsx
│   │   ├── DAOPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── LeaderboardPage.jsx
│   │   └── CreateTaskPage.jsx
│   └── utils/
│       └── helpers.js          # XP math, formatting, etc.
├── hardhat.config.cjs
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## 🔗 Smart Contract

**`SkillChain.sol`** — Single contract managing everything:

| Function | Description |
|---|---|
| `registerProfile(username)` | Create on-chain identity |
| `createTask(...)` | Post a new task, stake ETH reward |
| `submitTask(taskId, proofURI)` | Submit IPFS proof for a task |
| `vote(submissionId, approve)` | DAO members vote on submissions |
| `getActiveTasks()` | List all open tasks |
| `getPendingSubmissions()` | List unvoted submissions |
| `getProfileBasic(address)` | Get XP, streak, DAO status |

### XP & Level System

| XP Range | Level |
|---|---|
| 0–199 | Novice |
| 200–499 | Apprentice |
| 500–999 | Journeyman |
| 1000–1999 | Expert |
| 2000–3999 | Master |
| 4000+ | Legend |

### DAO Membership
- Complete **5 approved tasks** to earn voting rights
- DAO members vote on all pending submissions
- **3 votes** needed for a submission to be judged
- Majority (yes > no) approves and releases ETH reward

---

## 🧪 Running Tests

```bash
npm run test:contracts
```

---

## 🌐 Deploying to Testnet (Sepolia)

1. Get Sepolia ETH from a faucet
2. Add to `.env`:
   ```
   SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
   PRIVATE_KEY=0xYOUR_PRIVATE_KEY
   ```
3. Uncomment the Sepolia config in `hardhat.config.cjs`
4. Run:
   ```bash
   npx hardhat run scripts/deploy.cjs --network sepolia
   ```

---

## 🎓 College Submission Notes

This project demonstrates:
- **Smart contract development** in Solidity with XP, voting, and reward mechanics
- **Full-stack dApp** connecting React frontend to Ethereum contracts
- **Decentralised governance** — no admin key, DAO controls outcomes
- **Tokenomics design** — XP system, streak incentives, ETH staking
- **Web3 UX patterns** — wallet connect, transaction feedback, on-chain links

---

## 📄 License

MIT
