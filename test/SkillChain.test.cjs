const { expect } = require("chai");
const { ethers }  = require("hardhat");

describe("SkillChain", function () {
  let skillChain, owner, alice, bob, carol;

  beforeEach(async () => {
    [owner, alice, bob, carol] = await ethers.getSigners();
    const SC = await ethers.getContractFactory("SkillChain");
    skillChain = await SC.deploy();
    await skillChain.waitForDeployment();
  });

  // ─── Profile ──────────────────────────────────────────────────────────────

  describe("Profile Registration", () => {
    it("Should register a new profile", async () => {
      await skillChain.connect(alice).registerProfile("alice123");
      const [username] = await skillChain.getProfileBasic(alice.address);
      expect(username).to.equal("alice123");
    });

    it("Should revert on double registration", async () => {
      await skillChain.connect(alice).registerProfile("alice");
      await expect(
        skillChain.connect(alice).registerProfile("alice2")
      ).to.be.revertedWith("Already registered");
    });
  });

  // ─── Task Creation ────────────────────────────────────────────────────────

  describe("Task Creation", () => {
    it("Should create a task with ETH reward", async () => {
      const reward = ethers.parseEther("0.01");
      await expect(
        skillChain.connect(owner).createTask("Test Task", "Do something", "Solidity", 3, { value: reward })
      ).to.emit(skillChain, "TaskCreated").withArgs(1, owner.address, "Solidity");

      const task = await skillChain.tasks(1);
      expect(task.title).to.equal("Test Task");
      expect(task.reward).to.equal(reward);
    });

    it("Should reject invalid difficulty", async () => {
      await expect(
        skillChain.createTask("T", "D", "Solidity", 6, { value: 0 })
      ).to.be.revertedWith("Difficulty must be 1-5");
    });
  });

  // ─── Submission & Voting ──────────────────────────────────────────────────

  describe("Submission & DAO Voting", () => {
    beforeEach(async () => {
      await skillChain.connect(owner).createTask("Task 1", "Do X", "Solidity", 3, {
        value: ethers.parseEther("0.01"),
      });

      // Make alice, bob, carol DAO members by completing 5 tasks each (mock by direct submissions)
      // For test simplicity, we'll just test the voting path
    });

    it("Should allow task submission", async () => {
      await expect(
        skillChain.connect(alice).submitTask(1, "ipfs://QmTest")
      ).to.emit(skillChain, "TaskSubmitted").withArgs(1, 1, alice.address);
    });

    it("Should prevent creator from submitting own task", async () => {
      await expect(
        skillChain.connect(owner).submitTask(1, "ipfs://QmTest")
      ).to.be.revertedWith("Cannot submit own task");
    });
  });

  // ─── View Functions ───────────────────────────────────────────────────────

  describe("View Functions", () => {
    it("Should return active tasks", async () => {
      await skillChain.createTask("T1", "D1", "React", 2, { value: 0 });
      await skillChain.createTask("T2", "D2", "Python", 1, { value: 0 });

      const active = await skillChain.getActiveTasks();
      expect(active.length).to.equal(2);
    });
  });
});
