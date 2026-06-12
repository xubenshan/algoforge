import fs from "node:fs";
import vm from "node:vm";

const notePath = "/Users/xubenshan/Desktop/blog/src/algorithm/算法笔记.md";
const dataPath = new URL("../problems-data.js", import.meta.url);

const newProblemMeta = {
  打家劫舍: {
    difficulty: "Medium",
    topic: "动态规划",
    sourceTopic: "动态规划",
    leetcode: "https://leetcode.cn/problems/house-robber/",
    description: "给定每间房屋存放金额的数组，相邻房屋不能同时偷窃，求一夜之内能够偷窃到的最高金额。",
    ideaMarkdown:
      "先从选或不选的递归入手，再用记忆化搜索消除重复状态，最后翻译成递推。状态转移为 `f[i+2] = max(f[i+1], f[i] + nums[i])`，并可用两个变量滚动优化空间。",
  },
  目标和: {
    difficulty: "Medium",
    topic: "动态规划",
    sourceTopic: "动态规划",
    leetcode: "https://leetcode.cn/problems/target-sum/",
    description: "给数组中的每个整数添加正号或负号，统计最终表达式结果等于 target 的不同方案数。",
    ideaMarkdown:
      "设数组总和为 s、添加正号的元素之和为 b，可得 `b = (s + target) / 2`。问题转换为从 nums 中选出和恰好为 b 的子集方案数，即 01 背包的方案数变形。",
  },
};

function parseSections(markdown) {
  const sections = [];
  let topic = "";
  let current = null;

  for (const line of markdown.replace(/\r\n/g, "\n").split("\n")) {
    const topicMatch = line.match(/^### (.+)$/);
    const problemMatch = line.match(/^#### (.+)$/);

    if (topicMatch) {
      topic = topicMatch[1].trim();
      current = null;
    } else if (problemMatch) {
      current = { title: problemMatch[1].trim(), topic, lines: [] };
      sections.push(current);
    } else if (current) {
      current.lines.push(line);
    }
  }

  return sections.map((section) => ({
    ...section,
    noteMarkdown: section.lines.join("\n").trim(),
  }));
}

function cppBlocks(markdown) {
  return [...markdown.matchAll(/```cpp\n([\s\S]*?)\n```/g)].map((match) => match[1].trim());
}

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(dataPath, "utf8"), sandbox);

const problems = sandbox.window.AF_PROBLEMS;
const byTitle = new Map(problems.map((problem) => [problem.title, problem]));
const sections = parseSections(fs.readFileSync(notePath, "utf8"));

for (const section of sections) {
  const blocks = cppBlocks(section.noteMarkdown);
  const existing = byTitle.get(section.title);

  if (existing) {
    existing.noteMarkdown = section.noteMarkdown;
    existing.codeBlocks = blocks;
    if (blocks.length) existing.code = blocks[0];
    continue;
  }

  const meta = newProblemMeta[section.title];
  if (!meta) continue;

  const problem = {
    id: section.title,
    title: section.title,
    ...meta,
    code: blocks[0] || "",
    noteMarkdown: section.noteMarkdown,
    codeBlocks: blocks,
  };
  problems.push(problem);
  byTitle.set(problem.title, problem);
}

fs.writeFileSync(dataPath, `// Generated from ${notePath}\n// Regenerate when the note changes.\nwindow.AF_PROBLEMS = ${JSON.stringify(problems, null, 2)};\n`);
