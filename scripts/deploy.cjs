const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying SkillChain contract...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  const SkillChain = await hre.ethers.getContractFactory("SkillChain");
  const skillChain = await SkillChain.deploy();

  await skillChain.waitForDeployment();
  const address = await skillChain.getAddress();

  console.log("✅ SkillChain deployed to:", address);

  // Seed demo tasks across all skill tags
  console.log("\n📦 Seeding demo tasks...");

  const signers = await hre.ethers.getSigners();
  const accounts = signers.slice(0, 5); // use first 5 Hardhat accounts as task creators

  // Register demo profiles for the accounts
  const usernames = ["CryptoWizard", "ReactNinja", "ChainBuilder", "PythonWitch", "SolidityPro"];
  for (let i = 0; i < accounts.length; i++) {
    const tx = await skillChain.connect(accounts[i]).registerProfile(usernames[i]);
    await tx.wait();
    console.log(`  👤 Registered profile: ${usernames[i]}`);
  }

  // [title, description, skillTag, difficulty (1-5), rewardEth, creatorIndex]
  const tasks = [
    // Solidity
    ["Build a Solidity ERC-20 Token",       "Create a standard ERC-20 token with mint, burn, and transfer. Deploy to local network and share the contract address + verified source.",                                    "Solidity",   3, "0.03", 0],
    ["Implement a Multi-Sig Wallet",         "Write a Solidity multi-signature wallet that requires 2-of-3 owner approvals before executing any ETH transfer.",                                                           "Solidity",   4, "0.05", 0],
    ["Write a Reentrancy-Safe Vault",        "Build an ETH vault contract that is protected against reentrancy attacks. Include a test that proves the attack is blocked.",                                               "Solidity",   5, "0.08", 0],
    ["ERC-721 NFT Collection",               "Deploy a basic NFT collection with on-chain metadata. Mint at least 3 tokens and share the contract + token URIs.",                                                         "Solidity",   3, "0.03", 0],

    // React
    ["React DApp Wallet Connect Button",     "Build a reusable React component that connects to MetaMask, shows the connected address, and handles chain switching.",                                                     "React",      2, "0.01", 1],
    ["Token Balance Dashboard",              "Create a React page that reads and displays ERC-20 token balances for a connected wallet using ethers.js.",                                                                 "React",      3, "0.02", 1],
    ["Transaction History Feed",             "Build a React component that fetches and displays the last 10 transactions for a wallet address using a public RPC.",                                                       "React",      3, "0.02", 1],

    // Python
    ["Write a Merkle Tree in Python",        "Implement a Merkle tree from scratch in Python. Include insert, proof generation, and proof verification. Add unit tests.",                                                 "Python",     3, "0.02", 2],
    ["On-Chain Data Scraper",                "Write a Python script using web3.py that reads all TaskCreated events from a deployed contract and exports them to a CSV file.",                                            "Python",     2, "0.01", 2],
    ["IPFS File Uploader Script",            "Write a Python CLI tool that uploads a file to IPFS via the Pinata API and returns the IPFS hash. Handle errors gracefully.",                                               "Python",     2, "0.01", 2],

    // Security
    ["Smart Contract Security Audit",        "Audit the provided vulnerable contract (link in description). List all vulnerabilities with severity ratings and suggested fixes. Submit as a markdown report.",            "Security",   4, "0.05", 3],
    ["CTF Challenge — Reentrancy Attack",    "Exploit the provided vulnerable contract in a local Hardhat test. Write the attacker contract and a test that drains the vault. Then write the fix.",                      "Security",   5, "0.08", 3],
    ["Phishing Site Detection Report",       "Analyze 3 known Web3 phishing sites (use public lists). Document the techniques used and write a checklist users can follow to stay safe.",                                "Security",   2, "0.01", 3],

    // TypeScript
    ["Type-Safe ethers.js Wrapper",          "Write a TypeScript module that wraps ethers.js contract calls with full type safety using generated types from the ABI. Include usage examples.",                           "TypeScript", 3, "0.02", 4],
    ["Hardhat TypeChain Integration",        "Set up TypeChain in a Hardhat project and write fully typed deployment and test scripts. Share the repo with working compile + test commands.",                              "TypeScript", 3, "0.02", 4],

    // Rust
    ["Solana Hello World Program",           "Write and deploy a basic Solana on-chain program in Rust using Anchor. The program should store and retrieve a string message.",                                            "Rust",       4, "0.05", 0],
    ["CLI Wallet Key Generator",             "Build a Rust CLI tool that generates an Ethereum-compatible key pair, derives the address, and saves the encrypted keystore to disk.",                                      "Rust",       4, "0.05", 1],

    // DevOps
    ["Deploy Contract to Sepolia",           "Deploy any Solidity contract to the Sepolia testnet, verify the source code on Etherscan, and share the verified contract link.",                                           "DevOps",     2, "0.01", 2],
    ["GitHub Actions CI for Hardhat",        "Set up a GitHub Actions workflow that runs hardhat compile and hardhat test on every push and pull request. Share the repo with a passing workflow badge.",                 "DevOps",     3, "0.02", 3],
    ["Docker Container for a DApp",          "Containerise a full-stack dApp (frontend + local hardhat node) using Docker Compose. The app should be fully functional with docker compose up.",                           "DevOps",     4, "0.04", 4],
  ];

  for (const [title, desc, skill, diff, reward, creatorIdx] of tasks) {
    const tx = await skillChain.connect(accounts[creatorIdx]).createTask(
      title, desc, skill, diff,
      { value: hre.ethers.parseEther(reward) }
    );
    await tx.wait();
    console.log(`  ✓ [${skill.padEnd(10)}] Diff ${diff} | ${reward} ETH — "${title}"`);
  }

  console.log("\n🎉 Done! Save this address in your .env:");
  console.log(`VITE_CONTRACT_ADDRESS=${address}`);

  // Save ABI + address for frontend
  const fs = require("fs");
  const artifact = await hre.artifacts.readArtifact("SkillChain");
  const deployment = {
    address,
    abi: artifact.abi,
    network: hre.network.name,
    deployedAt: new Date().toISOString(),
  };

  fs.writeFileSync(
    "./src/abi/SkillChain.json",
    JSON.stringify(deployment, null, 2)
  );
  console.log("📄 ABI saved to src/abi/SkillChain.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
