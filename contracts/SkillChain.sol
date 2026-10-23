// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title SkillChain
 * @dev Core contract for on-chain skill verification via micro-tasks and DAO voting
 */
contract SkillChain {
    // ─── Structs ────────────────────────────────────────────────────────────────

    struct Task {
        uint256 id;
        string  title;
        string  description;
        string  skillTag;          // e.g. "Solidity", "React", "Python"
        uint8   difficulty;        // 1-5
        uint256 reward;            // in wei
        address creator;
        bool    isActive;
        uint256 createdAt;
    }

    struct Submission {
        uint256 id;
        uint256 taskId;
        address submitter;
        string  proofURI;          // IPFS hash of work proof
        uint256 voteYes;
        uint256 voteNo;
        bool    judged;
        bool    approved;
        uint256 submittedAt;
    }

    struct UserProfile {
        address wallet;
        string  username;
        uint256 totalXP;
        uint256 streak;            // consecutive days active
        uint256 lastActiveDay;
        uint256 tasksCompleted;
        mapping(string => uint256) skillLevels; // skillTag => XP in that skill
        bool    isDAO;             // DAO member (earned by completing 5+ tasks)
    }

    // ─── State ──────────────────────────────────────────────────────────────────

    uint256 public taskCount;
    uint256 public submissionCount;

    mapping(uint256 => Task)       public tasks;
    mapping(uint256 => Submission) public submissions;
    mapping(address => UserProfile) public profiles;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(address => uint256[])  public userSubmissions;
    mapping(address => uint256[])  public userCompletedTasks;

    uint256 public constant VOTE_THRESHOLD = 3;   // min votes to judge
    uint256 public constant XP_PER_TASK    = 100;
    uint256 public constant DAO_THRESHOLD  = 5;   // tasks to become DAO member

    // ─── Events ─────────────────────────────────────────────────────────────────

    event TaskCreated(uint256 indexed taskId, address indexed creator, string skillTag);
    event TaskSubmitted(uint256 indexed submissionId, uint256 indexed taskId, address indexed submitter);
    event Voted(uint256 indexed submissionId, address indexed voter, bool vote);
    event SubmissionJudged(uint256 indexed submissionId, bool approved, address submitter);
    event StreakUpdated(address indexed user, uint256 streak);
    event LevelUp(address indexed user, string skill, uint256 newLevel);
    event DAOMemberAdded(address indexed user);

    // ─── Modifiers ──────────────────────────────────────────────────────────────

    modifier onlyDAO() {
        require(profiles[msg.sender].isDAO, "Must be a DAO member");
        _;
    }

    modifier taskExists(uint256 _taskId) {
        require(_taskId > 0 && _taskId <= taskCount, "Task does not exist");
        _;
    }

    // ─── Profile ────────────────────────────────────────────────────────────────

    function registerProfile(string calldata _username) external {
        require(bytes(profiles[msg.sender].username).length == 0, "Already registered");
        profiles[msg.sender].wallet   = msg.sender;
        profiles[msg.sender].username = _username;
    }

    function getSkillLevel(address _user, string calldata _skill) external view returns (uint256) {
        return profiles[_user].skillLevels[_skill];
    }

    // ─── Task Management ────────────────────────────────────────────────────────

    function createTask(
        string calldata _title,
        string calldata _description,
        string calldata _skillTag,
        uint8  _difficulty
    ) external payable {
        require(_difficulty >= 1 && _difficulty <= 5, "Difficulty must be 1-5");
        require(bytes(_title).length > 0, "Title required");

        taskCount++;
        tasks[taskCount] = Task({
            id:          taskCount,
            title:       _title,
            description: _description,
            skillTag:    _skillTag,
            difficulty:  _difficulty,
            reward:      msg.value,
            creator:     msg.sender,
            isActive:    true,
            createdAt:   block.timestamp
        });

        emit TaskCreated(taskCount, msg.sender, _skillTag);
    }

    function submitTask(uint256 _taskId, string calldata _proofURI)
        external
        taskExists(_taskId)
    {
        require(tasks[_taskId].isActive, "Task not active");
        require(tasks[_taskId].creator != msg.sender, "Cannot submit own task");
        require(bytes(_proofURI).length > 0, "Proof URI required");

        submissionCount++;
        submissions[submissionCount] = Submission({
            id:          submissionCount,
            taskId:      _taskId,
            submitter:   msg.sender,
            proofURI:    _proofURI,
            voteYes:     0,
            voteNo:      0,
            judged:      false,
            approved:    false,
            submittedAt: block.timestamp
        });

        userSubmissions[msg.sender].push(submissionCount);
        _updateStreak(msg.sender);

        emit TaskSubmitted(submissionCount, _taskId, msg.sender);
    }

    // ─── DAO Voting ─────────────────────────────────────────────────────────────

    function vote(uint256 _submissionId, bool _approve) external onlyDAO {
        Submission storage sub = submissions[_submissionId];
        require(!sub.judged,                          "Already judged");
        require(sub.submitter != msg.sender,          "Cannot vote on own submission");
        require(!hasVoted[_submissionId][msg.sender], "Already voted");

        hasVoted[_submissionId][msg.sender] = true;

        if (_approve) {
            sub.voteYes++;
        } else {
            sub.voteNo++;
        }

        emit Voted(_submissionId, msg.sender, _approve);

        uint256 total = sub.voteYes + sub.voteNo;
        if (total >= VOTE_THRESHOLD) {
            _judgeSubmission(_submissionId);
        }
    }

    function _judgeSubmission(uint256 _submissionId) internal {
        Submission storage sub = submissions[_submissionId];
        sub.judged   = true;
        sub.approved = sub.voteYes > sub.voteNo;

        if (sub.approved) {
            _awardXP(sub.submitter, sub.taskId);
            uint256 reward = tasks[sub.taskId].reward;
            if (reward > 0) {
                payable(sub.submitter).transfer(reward);
            }
            userCompletedTasks[sub.submitter].push(sub.taskId);
        }

        emit SubmissionJudged(_submissionId, sub.approved, sub.submitter);
    }

    // ─── XP & Leveling ──────────────────────────────────────────────────────────

    function _awardXP(address _user, uint256 _taskId) internal {
        Task storage task    = tasks[_taskId];
        uint256 xpEarned     = XP_PER_TASK * task.difficulty;

        profiles[_user].totalXP         += xpEarned;
        profiles[_user].skillLevels[task.skillTag] += xpEarned;
        profiles[_user].tasksCompleted++;

        // Check DAO eligibility
        if (profiles[_user].tasksCompleted >= DAO_THRESHOLD && !profiles[_user].isDAO) {
            profiles[_user].isDAO = true;
            emit DAOMemberAdded(_user);
        }

        // Emit level-up event based on XP thresholds
        uint256 skillXP = profiles[_user].skillLevels[task.skillTag];
        uint256 newLevel = _xpToLevel(skillXP);
        emit LevelUp(_user, task.skillTag, newLevel);
    }

    function _xpToLevel(uint256 _xp) internal pure returns (uint256) {
        if (_xp < 200)  return 1;
        if (_xp < 500)  return 2;
        if (_xp < 1000) return 3;
        if (_xp < 2000) return 4;
        if (_xp < 4000) return 5;
        return 6; // Master
    }

    // ─── Streaks ────────────────────────────────────────────────────────────────

    function _updateStreak(address _user) internal {
        uint256 today     = block.timestamp / 1 days;
        uint256 lastDay   = profiles[_user].lastActiveDay;

        if (lastDay == today) return; // already active today

        if (lastDay + 1 == today) {
            profiles[_user].streak++;
        } else if (lastDay != today) {
            profiles[_user].streak = 1; // reset streak
        }

        profiles[_user].lastActiveDay = today;
        emit StreakUpdated(_user, profiles[_user].streak);
    }

    // ─── View Helpers ────────────────────────────────────────────────────────────

    function getActiveTasks() external view returns (Task[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= taskCount; i++) {
            if (tasks[i].isActive) count++;
        }
        Task[] memory active = new Task[](count);
        uint256 idx = 0;
        for (uint256 i = 1; i <= taskCount; i++) {
            if (tasks[i].isActive) {
                active[idx++] = tasks[i];
            }
        }
        return active;
    }

    function getPendingSubmissions() external view returns (Submission[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= submissionCount; i++) {
            if (!submissions[i].judged) count++;
        }
        Submission[] memory pending = new Submission[](count);
        uint256 idx = 0;
        for (uint256 i = 1; i <= submissionCount; i++) {
            if (!submissions[i].judged) {
                pending[idx++] = submissions[i];
            }
        }
        return pending;
    }

    function getUserSubmissions(address _user) external view returns (uint256[] memory) {
        return userSubmissions[_user];
    }

    function getUserCompletedTasks(address _user) external view returns (uint256[] memory) {
        return userCompletedTasks[_user];
    }

    function getSubmission(uint256 _id) external view returns (Submission memory) {
        return submissions[_id];
    }

    function getProfileBasic(address _user) external view returns (
        string memory username,
        uint256 totalXP,
        uint256 streak,
        uint256 tasksCompleted,
        bool    isDAO
    ) {
        UserProfile storage p = profiles[_user];
        return (p.username, p.totalXP, p.streak, p.tasksCompleted, p.isDAO);
    }
}
