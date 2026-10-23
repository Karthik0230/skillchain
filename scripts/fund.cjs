const hre = require("hardhat");

async function main() {
  const [funder] = await hre.ethers.getSigners();
  const target = "0xDe1c2Be41C3318275E94FAD81660459a932c0353";
  // Your address above should be the one you want to fund the target from.
  const amount = hre.ethers.parseEther("100");

  console.log(`Sending 100 ETH from ${funder.address} to ${target}...`);

  const tx = await funder.sendTransaction({ to: target, value: amount });
  await tx.wait();

  const balance = await hre.ethers.provider.getBalance(target);
  console.log(`✅ Done! New balance: ${hre.ethers.formatEther(balance)} ETH`);
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
