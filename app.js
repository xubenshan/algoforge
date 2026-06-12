const sections = [
  { id: "roadmap", icon: "map", title: "路线" },
  { id: "problems", icon: "book-open", title: "题单" },
  { id: "company", icon: "building-2", title: "公司题" },
  { id: "review", icon: "messages-square", title: "复盘" },
];

const pages = {
  intro: {
    title: "算法笔记配套站",
    toc: ["开始", "网站信息"],
    body: `
    `,
  },
  review: {
    title: "面试复盘",
    toc: ["批注总览"],
    body: `
      <p>算法题做完不算结束。秋招面试里，能把思路讲清楚和写出代码同样重要。</p>
      <h2 id="批注总览">批注总览</h2>
    `,
  },
};

const topicMeta = {
  "双指针": { icon: "move-horizontal", plan: "阶段 1", note: "有序数组、相向指针、去重。" },
  "滑动窗口": { icon: "panel-right-open", plan: "阶段 2", note: "维护窗口，左右边界只前进。" },
  "二分查找": { icon: "split", plan: "阶段 3", note: "明确搜索区间和收缩条件。" },
  "链表": { icon: "workflow", plan: "阶段 4", note: "先画指针，再写更新顺序。" },
  "二叉树": { icon: "git-branch", plan: "阶段 5", note: "递归定义、遍历时机和返回值。" },
  "回溯": { icon: "route", plan: "阶段 6", note: "画搜索树，明确选择、递归和撤销现场。" },
  "动态规划": { icon: "chart-no-axes-combined", plan: "阶段 7", note: "定义状态，写出转移方程、初始值和遍历顺序。" },
};

const problems = window.AF_PROBLEMS || [];
const companyExtraProblems = window.AF_COMPANY_EXTRA_PROBLEMS || [];
const allProblems = [...problems, ...companyExtraProblems];

const companySets = [
  {
    company: "字节跳动",
    mode: "手撕高频",
    focus: "偏爱窗口、双指针和链表指针题，重点看边界表达和代码速度。",
    titles: ["两个栈实现队列", "LRU 缓存"],
  },
  {
    company: "腾讯",
    mode: "基础稳定",
    focus: "重视经典数据结构题，要求思路稳、实现稳、复杂度能讲清楚。",
    titles: ["合并区间"],
  },
  {
    company: "美团",
    mode: "机试速度",
    focus: "适合限时练习，优先训练快速读题、快速套模板和边界检查。",
    titles: ["环形链表", "反转链表II", "合并两个有序链表", "LRU 缓存", "合并有序数组", "最长回文子串", "买卖股票的最佳时机", "数组中的第 K 个最大元素"],
  },
  {
    company: "阿里",
    mode: "结构化手撕",
    focus: "题目不一定刁钻，但会追问为什么这样写、有没有更清晰的返回值设计。",
    titles: ["二分查找", "LRU 缓存", "字符串相乘"],
  },
  {
    company: "华为",
    mode: "机试/笔试",
    focus: "适合用来做 30 分钟一组的模拟，训练题型切换和实现完整度。",
    titles: ["字符串解码", "滑动窗口最大值"],
  },
  {
    company: "快手",
    mode: "手撕高频",
    focus: "覆盖链表、二叉树、排序和设计模式，适合集中练基础手写能力。",
    titles: ["环形链表", "二叉树遍历", "单例模式", "快速排序", "两数之和", "二叉树的最近公共祖先", "有序链表转换二叉搜索树"],
  },
  {
    company: "小米",
    mode: "基础手写",
    focus: "以基础数据结构和字符串题为主，适合练习稳定实现和边界表达。",
    titles: ["合并两个有序链表", "二叉树遍历", "两数之和", "最长回文子串"],
  },
  {
    company: "滴滴",
    mode: "链表/哈希",
    focus: "链表合并、缓存结构和哈希查找都适合作为限时手撕训练。",
    titles: ["合并两个有序链表", "LRU 缓存", "两数之和"],
  },
  {
    company: "哈啰",
    mode: "链表基础",
    focus: "聚焦链表环检测，重点说清快慢指针为什么一定相遇。",
    titles: ["环形链表"],
  },
  {
    company: "猿辅导",
    mode: "链表区间",
    focus: "重点训练局部反转里的前驱节点、断链和接链顺序。",
    titles: ["反转链表II"],
  },
  {
    company: "蘑菇街",
    mode: "链表合并",
    focus: "适合用虚拟头节点练习链表题的稳定写法。",
    titles: ["合并两个有序链表"],
  },
  {
    company: "小红书",
    mode: "二叉树",
    focus: "从递归定义和遍历顺序入手，练习基础树题口述。",
    titles: ["二叉树遍历"],
  },
  {
    company: "百度",
    mode: "排序手写",
    focus: "适合复习分区思想、递归边界和快排复杂度。",
    titles: ["快速排序"],
  },
  {
    company: "蔚来",
    mode: "并发手写",
    focus: "练习条件变量、线程顺序控制和唤醒条件表达。",
    titles: ["三个线程交替打印 ABC"],
  },
];

const state = {
  route: "intro",
  completed: new Set(JSON.parse(localStorage.getItem("af-completed") || "[]")),
  focusProblem: localStorage.getItem("af-focus-problem") || problems[0].id,
  theme: localStorage.getItem("af-theme") || "dark",
  keyword: "",
  topic: "all",
  difficulty: "all",
};

const els = {
  content: document.querySelector("#content"),
  sideNav: document.querySelector("#sideNav"),
  tocNav: document.querySelector("#tocNav"),
  mobileSearch: document.querySelector("#mobileSearch"),
  mobileMenuToggle: document.querySelector("#mobileMenuToggle"),
  sidebarScrim: document.querySelector("#sidebarScrim"),
  quickSearch: document.querySelector("#quickSearch"),
};

function icon(name) {
  return `<i data-lucide="${name}"></i>`;
}

function renderIcons() {
  if (window.lucide) window.lucide.createIcons();
}

function saveCompleted() {
  localStorage.setItem("af-completed", JSON.stringify([...state.completed]));
}

function setSidebarOpen(open) {
  document.body.classList.toggle("sidebar-open", open);
  if (els.mobileMenuToggle) {
    els.mobileMenuToggle.setAttribute("aria-expanded", String(open));
    els.mobileMenuToggle.setAttribute("aria-label", open ? "关闭侧边栏" : "打开侧边栏");
  }
}

function reviewNoteStorageKey(problemId) {
  return `af-review-note-${problemId}`;
}

function getReviewNote(problemId) {
  return localStorage.getItem(reviewNoteStorageKey(problemId)) || "";
}

function reviewNotes() {
  return allProblems
    .map((problem) => ({
      problem,
      note: getReviewNote(problem.id).trim(),
    }))
    .filter((item) => item.note);
}

function problemById(id) {
  return allProblems.find((problem) => problem.id === id) || allProblems[0];
}

function problemByTitle(title) {
  return allProblems.find((problem) => problem.title === title);
}

function companyProblemByTitle(title, company) {
  return allProblems.find((problem) => problem.title === title && problemSourceForCompany(problem, company));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function problemSourceForCompany(problem, company) {
  if (!problem.sources) return null;
  return problem.sources.find((source) => source.company === company) || null;
}

function renderProblemSources(problem) {
  if (!problem.sources?.length) return "";
  return `
    <div class="source-panel">
      <div class="source-panel-title">${icon("link")}真题来源</div>
      <div class="source-list">
        ${problem.sources
          .map(
            (source) => `
              <a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">
                <strong>${escapeHtml(source.company)}</strong>
                <span>${escapeHtml(source.label)}</span>
                <small>${escapeHtml(source.evidence)}</small>
              </a>
            `
          )
          .join("")}
      </div>
    </div>
  `;
}

function inlineMarkdown(value) {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*{2}([^*]+)\*{2}/g, "<strong>$1</strong>");
}

function markdownToHtml(markdown) {
  if (window.marked) {
    return window.marked.parse(markdown, {
      async: false,
      breaks: false,
      gfm: true,
    });
  }

  const lines = markdown.split("\n");
  const blocks = [];
  let paragraph = [];
  let list = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push(`<p>${inlineMarkdown(paragraph.join(" "))}</p>`);
    paragraph = [];
  };
  const flushList = () => {
    if (!list.length) return;
    blocks.push(`<ul>${list.map((item) => `<li>${inlineMarkdown(item)}</li>`).join("")}</ul>`);
    list = [];
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushParagraph();
      flushList();
      return;
    }
    const bullet = trimmed.match(/^[-*]\s+(.+)/);
    if (bullet) {
      flushParagraph();
      list.push(bullet[1]);
      return;
    }
    flushList();
    paragraph.push(trimmed);
  });
  flushParagraph();
  flushList();
  return blocks.join("");
}

function renderNoteMarkdown(markdown) {
  if (!markdown) return "";
  const codeBlocks = [];
  const prepared = markdown.replace(/```cpp\n([\s\S]*?)\n```/g, (_, code) => {
    const token = `@@AF_CPP_BLOCK_${codeBlocks.length}@@`;
    codeBlocks.push(code.trim());
    return token;
  });
  let html = markdownToHtml(prepared);
  codeBlocks.forEach((code, index) => {
    html = html.replace(`<p>@@AF_CPP_BLOCK_${index}@@</p>`, renderCodeBlock(code, "cpp"));
    html = html.replace(`@@AF_CPP_BLOCK_${index}@@`, renderCodeBlock(code, "cpp"));
  });
  return html;
}

function splitProblemNote(markdown) {
  const lines = (markdown || "").split("\n");
  if (!lines[0]?.trim().startsWith(">")) return { statement: markdown || "", notes: "" };

  let index = 0;
  while (index < lines.length) {
    const trimmed = lines[index].trim();
    const nextStartsQuote = lines[index + 1]?.trim().startsWith(">");
    if (trimmed.startsWith(">") || (!trimmed && nextStartsQuote)) {
      index += 1;
      continue;
    }
    break;
  }

  return {
    statement: lines.slice(0, index).join("\n").trim(),
    notes: lines.slice(index).join("\n").trim(),
  };
}

function problemSummary(problem) {
  const text = (problem.ideaMarkdown || problem.description || problem.noteMarkdown || "")
    .replace(/[`*_>#=-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > 88 ? `${text.slice(0, 88)}...` : text;
}

function highlightCpp(code) {
  if (window.hljs) {
    try {
      return window.hljs.highlight(code, {
        language: "cpp",
        ignoreIllegals: true,
      }).value;
    } catch (error) {
      return escapeHtml(code);
    }
  }

  let html = escapeHtml(code);
  const tokens = [];
  const tokenKey = (index) => {
    let n = index;
    let key = "";
    do {
      key = String.fromCharCode(65 + (n % 26)) + key;
      n = Math.floor(n / 26) - 1;
    } while (n >= 0);
    return `@@AF${key}TOKEN@@`;
  };
  const stash = (className, value) => {
    const key = tokenKey(tokens.length);
    tokens.push(`<span class="${className}">${value}</span>`);
    return key;
  };
  html = html.replace(/(\/\/.*)$/gm, (match) => stash("tok-comment", match));
  html = html.replace(/(&quot;.*?&quot;)/g, (match) => stash("tok-string", match));
  html = html.replace(
    /\b(class|public|private|protected|return|if|else|while|for|int|long|bool|true|false|nullptr|vector|string|auto|sort|max|min|LLONG_MIN|LLONG_MAX)\b/g,
    '<span class="tok-keyword">$1</span>'
  );
  html = html.replace(/\b(\d+)\b/g, '<span class="tok-number">$1</span>');
  tokens.forEach((token, index) => {
    html = html.replace(tokenKey(index), token);
  });
  return html;
}

function renderCodeBlock(code, language = "cpp") {
  const lines = code.replace(/\n$/, "").split("\n");
  const rows = lines
    .map(
      (line, index) =>
        `<span class="code-line"><span class="line-no">${index + 1}</span><span class="line-code">${line ? highlightCpp(line) : " "}</span></span>`
    )
    .join("");

  return `
    <div class="code-card code-window">
      <header class="code-window-bar">
        <span class="window-controls" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="code-lang">${language}</span>
      </header>
      <pre class="code-pre"><code class="language-${language} code-lines">${rows}</code></pre>
    </div>
  `;
}

function coreCompletedCount() {
  return problems.filter((problem) => state.completed.has(problem.id)).length;
}

function progressScore() {
  return Math.round((coreCompletedCount() / problems.length) * 100);
}

function setRoute(route) {
  state.route = route;
  location.hash = route;
  setSidebarOpen(false);
  render();
  scrollToContentTop();
}

function setProblem(problemId) {
  state.route = `problem:${problemId}`;
  location.hash = `problem-${problemId}`;
  setSidebarOpen(false);
  render();
  scrollToContentTop();
}

function showTopicProblems(topic) {
  state.route = "problems";
  state.topic = topic;
  state.keyword = "";
  state.difficulty = "all";
  location.hash = "problems";
  setSidebarOpen(false);
  render();
  scrollToContentTop();
}

function scrollToContentTop() {
  requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }));
}

function renderSideNav() {
  els.sideNav.innerHTML = sections
    .map(
      (section) => `
        <button class="side-item ${state.route === section.id ? "is-active" : ""}" data-route="${section.id}">
          <span>${icon(section.icon)}${section.title}</span>
          <i class="chevron" data-lucide="chevron-right"></i>
        </button>
      `
    )
    .join("");
}

function renderTopNav() {
  document.querySelectorAll(".top-nav button").forEach((button) => {
    const route = button.dataset.route;
    const active =
      route === state.route ||
      (route === "problems" && (state.route === "problems" || state.route.startsWith("problem:")));
    button.classList.toggle("is-active", active);
  });
}

function renderToc(items) {
  els.tocNav.innerHTML = items
    .map((item, index) => `<a class="${index === 0 ? "is-active" : ""}" href="#${item}">${item}</a>`)
    .join("");
}

function renderGenericPage(route) {
  const page = pages[route] || pages.intro;
  renderToc(page.toc);
  els.content.innerHTML = `<h1>${page.title}</h1>${page.body}`;
}

function renderIntroPage() {
  renderToc(pages.intro.toc);
  els.content.innerHTML = `
    <section class="home-hero" id="开始">
      <div class="home-logo-wrap" aria-hidden="true">
        <img src="assets/algoforge-logo.png?v=20260604-logo" alt="" />
      </div>
      <div class="home-hero-copy">
        <h1>AlgoForge</h1>
        <p class="home-subtitle">把算法笔记整理成可刷题、可复盘、可按公司专题训练的面试准备站。</p>
        <div class="home-actions">
          <button class="home-button primary" data-route="problems" type="button">${icon("book-open")}开始刷题</button>
          <button class="home-button" data-route="roadmap" type="button">${icon("map")}学习路线</button>
        </div>
      </div>
    </section>
    <section class="home-info" id="网站信息">
      <div>
        <h2>网站信息</h2>
        <p>AlgoForge 是面向秋招、实习和笔试冲刺的算法学习网站。它把算法笔记中的核心题目整理成清晰的学习路线、专题题单和带来源的公司真题列表，方便按照题型持续刷题。</p>
        <p>每道题都保留题目描述、思路笔记、C++ 代码模板和力扣入口。刷题后的掌握状态、今日题目和复盘批注会保存在当前浏览器本地，适合日常滚动复习和面试前集中回看。</p>
        <p>推荐使用方式是先从路线确定阶段目标，再进入题单独立完成题目，最后在复盘中记录自己的口述答案、边界卡点和二刷提醒。</p>
      </div>
    </section>
  `;
}

function renderReviewPage() {
  const notes = reviewNotes();
  const completedWithNotes = notes.filter(({ problem }) => state.completed.has(problem.id)).length;
  renderToc(pages.review.toc);
  els.content.innerHTML = `
    <h1>面试复盘</h1>
    <p>算法题做完不算结束。秋招面试里，能把思路讲清楚和写出代码同样重要。</p>
    <h2 id="批注总览">批注总览</h2>
    <div class="review-summary">
      <div class="stat-card"><b>${notes.length}</b><span>已写批注</span></div>
      <div class="stat-card"><b>${completedWithNotes}</b><span>已掌握且有批注</span></div>
      <div class="stat-card"><b>${allProblems.length - notes.length}</b><span>待补复盘</span></div>
    </div>
    ${
      notes.length
        ? `
          <div class="review-note-grid">
            ${notes
              .map(
                ({ problem, note }) => `
                  <article class="review-note-card" data-problem="${problem.id}" role="button" tabindex="0" aria-label="打开 ${problem.title} 的批注">
                    <div class="review-card-head">
                      <div>
                        <span class="chip green">${problem.topic}</span>
                        <span class="chip difficulty ${problem.difficulty}">${problem.difficulty}</span>
                      </div>
                      <span class="review-state">${state.completed.has(problem.id) ? "已掌握" : "待巩固"}</span>
                    </div>
                    <h3>${problem.title}</h3>
                    <p class="review-note-text">${escapeHtml(note)}</p>
                  </article>
                `
              )
              .join("")}
          </div>
        `
        : `
          <div class="empty-review">
            <strong>还没有批注</strong>
            <p>进入任意题目详情，在「复盘」里的「我的批注」写下口述答案或卡点，这里会自动汇总。</p>
            <button class="ghost-button" data-route="problems" type="button">${icon("book-open")}去题单补第一条</button>
          </div>
        `
    }
  `;
}

function renderRoadmap() {
  const grouped = Object.entries(topicMeta)
    .map(([topic, meta]) => {
      const total = problems.filter((problem) => problem.topic === topic).length;
      const done = problems.filter((problem) => problem.topic === topic && state.completed.has(problem.id)).length;
      return `
        <article class="roadmap-item" data-topic-route="${topic}" role="button" tabindex="0" aria-label="查看${topic}题单">
          <span>${icon(meta.icon)}</span>
          <div>
            <strong>${meta.plan} · ${topic}</strong>
            <p>${meta.note}</p>
          </div>
          <b>${done}/${total}</b>
        </article>
      `;
    })
    .join("");
  const focus = problemById(state.focusProblem);

  renderToc(["进度", "路线", "今日题目"]);
  els.content.innerHTML = `
    <h1>学习路线</h1>
    <h2 id="进度">进度</h2>
    <div class="progress-dashboard">
      <div class="stat-card"><b>${coreCompletedCount()}</b><span>已掌握</span></div>
      <div class="stat-card"><b>${problems.length - coreCompletedCount()}</b><span>待完成</span></div>
      <div class="stat-card"><b>${progressScore()}%</b><span>题单进度</span></div>
    </div>
    <h2 id="路线">路线</h2>
    <div class="roadmap-list">${grouped}</div>
    <h2 id="今日题目">今日题目</h2>
    <div class="callout">
      <div class="callout-title">${icon("pin")}当前焦点</div>
      <p><strong>${focus.title}</strong>：${problemSummary(focus)}</p>
    </div>
    <div class="detail-actions">
      <button class="ghost-button" data-problem="${focus.id}">${icon("book-open")}查看题解</button>
      <a class="ghost-button" href="${focus.leetcode}" target="_blank" rel="noreferrer">${icon("external-link")}去力扣刷题</a>
    </div>
  `;
}

function renderProblemList() {
  const topics = [...new Set(problems.map((problem) => problem.topic))];
  const topicOptions = ["all", ...topics];
  const difficultyOptions = ["all", "Easy", "Medium", "Hard"];
  const filtered = problems.filter((problem) => {
    const keyword = state.keyword.trim().toLowerCase();
    const hitKeyword = [problem.title, problem.topic, problem.description, problem.ideaMarkdown, problem.noteMarkdown]
      .join(" ")
      .toLowerCase()
      .includes(keyword);
    const hitTopic = state.topic === "all" || problem.topic === state.topic;
    const hitDifficulty = state.difficulty === "all" || problem.difficulty === state.difficulty;
    return hitKeyword && hitTopic && hitDifficulty;
  });

  renderToc(["筛选", "题目", "刷题建议"]);
  els.content.innerHTML = `
    <h1>核心题单</h1>
    <div class="article-meta compact-meta">
      <span class="chip green">${coreCompletedCount()} / ${problems.length} 已掌握</span>
      <span class="chip gold">题单来自算法笔记</span>
    </div>
    <h2 id="筛选">筛选</h2>
    <div class="problem-toolbar">
      <label class="search-box" for="problemSearch">${icon("search")}<input id="problemSearch" type="search" placeholder="搜索题目或题型" value="${escapeHtml(state.keyword)}" autocomplete="off" /></label>
      <div class="filter-group" role="group" aria-label="按题型筛选">
        ${topicOptions
          .map(
            (topic) => `
              <button class="filter-pill ${topic === state.topic ? "is-active" : ""}" data-topic-filter="${topic}" type="button">
                ${topic === "all" ? "全部题型" : topic}
              </button>
            `
          )
          .join("")}
      </div>
      <div class="filter-group compact-filter" role="group" aria-label="按难度筛选">
        ${difficultyOptions
          .map(
            (level) => `
              <button class="filter-pill difficulty-filter ${level === state.difficulty ? "is-active" : ""}" data-difficulty-filter="${level}" type="button">
                ${level === "all" ? "全部难度" : level}
              </button>
            `
          )
          .join("")}
      </div>
    </div>
    <h2 id="题目">题目</h2>
    <div class="problem-grid">
      ${
        filtered.length
          ? filtered.map(problemCard).join("")
          : `<div class="problem-card"><h3>没有匹配题目</h3><p>换一个关键词或筛选条件试试。</p></div>`
      }
    </div>
    <h2 id="刷题建议">刷题建议</h2>
    <p>先独立尝试，再看模板。点开详情页后可以直接跳到对应力扣题目。</p>
  `;
}

function renderCompanyPractice() {
  renderToc(["真题列表", "使用方式"]);
  els.content.innerHTML = `
    <h1>公司面试真题</h1>
    <p>这个模块只收录有公开面经或真题汇总来源的题目。每道题都保留“来源”入口，未找到对应公司来源的题不会放在这里。</p>
    <h2 id="真题列表">真题列表</h2>
    <div class="company-grid">
      ${companySets
        .map((set) => {
          const setProblems = set.titles.map((title) => companyProblemByTitle(title, set.company)).filter(Boolean);
          return `
            <article class="company-card">
              <div class="company-head">
                <div>
                  <span class="chip gold">${set.mode}</span>
                  <h3>${set.company}</h3>
                </div>
                <b>${setProblems.length} 题</b>
              </div>
              <p>${set.focus}</p>
              <div class="company-problems">
                ${setProblems
                  .map((problem) => {
                    const source = problemSourceForCompany(problem, set.company);
                    return `
                      <div class="company-problem-row">
                        <button data-problem="${problem.id}">
                          <span>${problem.title}</span>
                          <small>${problem.topic} · 面经来源</small>
                        </button>
                        <a class="source-link" href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer" data-stop title="${escapeHtml(source.evidence)}">${icon("link")}来源</a>
                      </div>
                    `;
                  })
                  .join("")}
              </div>
            </article>
          `;
        })
        .join("")}
    </div>
    <h2 id="使用方式">使用方式</h2>
    <div class="callout">
      <div class="callout-title">${icon("timer")}建议节奏</div>
      <p>先点来源核对题目记录，再进入详情页限时实现。做完后在复盘批注里记录口述思路、边界条件和复杂度表达。</p>
    </div>
  `;
}

function problemCard(problem) {
  const done = state.completed.has(problem.id);
  return `
    <article class="problem-card" data-problem="${problem.id}" role="button" tabindex="0" aria-label="打开 ${problem.title} 题解">
      <div class="problem-meta">
        <span class="chip green">${problem.topic}</span>
        <span class="chip difficulty ${problem.difficulty}">${problem.difficulty}</span>
      </div>
      <h3>${problem.title}</h3>
      <p>${problemSummary(problem)}</p>
      <div class="problem-actions">
        <label class="checkbox-row" data-stop>
          <input type="checkbox" ${done ? "checked" : ""} data-complete="${problem.id}" />
          已掌握
        </label>
      <a class="mini-button" href="${problem.leetcode}" target="_blank" rel="noreferrer" data-stop>${icon("external-link")}${problem.externalLabel || "力扣"}</a>
      </div>
    </article>
  `;
}

function renderProblemDetail(problemId) {
  const problem = problemById(problemId);
  const done = state.completed.has(problem.id);
  const reviewNote = getReviewNote(problem.id);
  const backRoute = problem.source === "company-extra" ? "company" : "problems";
  const backLabel = problem.source === "company-extra" ? "返回公司题" : "返回题单";
  const detailMarkdown = problem.noteMarkdown || problem.ideaMarkdown || problem.description || problemSummary(problem);
  const { statement, notes } = splitProblemNote(detailMarkdown);
  renderToc(notes ? ["题目", "思路与代码", "复盘"] : ["题目", "复盘"]);
  els.content.innerHTML = `
    <h1>${problem.title}</h1>
    <div class="article-meta compact-meta">
      <span class="chip green">${problem.topic}</span>
      <span class="chip difficulty ${problem.difficulty}">${problem.difficulty}</span>
    </div>
    <div class="detail-actions">
      <button class="ghost-button" data-route="${backRoute}">${icon("arrow-left")}${backLabel}</button>
      <a class="ghost-button primary-link" href="${problem.leetcode}" target="_blank" rel="noreferrer">${icon("external-link")}${problem.externalLabel || "打开力扣"}</a>
      <label class="checkbox-row ghost-button">
        <input type="checkbox" ${done ? "checked" : ""} data-complete="${problem.id}" />
        已掌握
      </label>
      <button class="ghost-button" data-focus="${problem.id}">${icon("pin")}加入今日</button>
    </div>
    ${renderProblemSources(problem)}
    <h2 id="题目">题目</h2>
    <div class="note-article problem-statement">${renderNoteMarkdown(statement)}</div>
    ${
      notes
        ? `
          <h2 id="思路与代码">思路与代码</h2>
          <div class="note-article">${renderNoteMarkdown(notes)}</div>
        `
        : ""
    }
    <h2 id="复盘">复盘</h2>
    <ul>
      <li>能否一句话说出为什么用 <strong>${problem.topic}</strong>？</li>
      <li>边界条件是否覆盖空输入、重复元素和下标范围？</li>
      <li>能否说明时间复杂度和空间复杂度？</li>
    </ul>
    <section class="review-note-panel" aria-labelledby="review-note-title">
      <div class="review-note-head">
        <h3 id="review-note-title">我的批注</h3>
        <span data-review-status="${problem.id}">${reviewNote ? "已保存" : "自动保存"}</span>
      </div>
      <textarea
        data-review-note="${problem.id}"
        spellcheck="false"
        placeholder="把你的口述答案、卡住的边界、复杂度表达或二刷提醒写在这里。"
      >${escapeHtml(reviewNote)}</textarea>
    </section>
  `;
}

function render() {
  document.body.classList.toggle("light", state.theme === "light");
  document.body.classList.toggle("home-page", state.route === "intro");
  renderTopNav();
  renderSideNav();

  if (state.route === "intro") renderIntroPage();
  else if (state.route === "roadmap") renderRoadmap();
  else if (state.route === "problems") renderProblemList();
  else if (state.route === "company") renderCompanyPractice();
  else if (state.route === "review") renderReviewPage();
  else if (state.route.startsWith("problem:")) renderProblemDetail(state.route.slice("problem:".length));
  else renderGenericPage(state.route);

  renderIcons();
  els.content.focus({ preventScroll: true });
}

function bindEvents() {
  els.mobileMenuToggle.addEventListener("click", () => {
    setSidebarOpen(!document.body.classList.contains("sidebar-open"));
  });

  els.sidebarScrim.addEventListener("click", () => {
    setSidebarOpen(false);
  });

  document.body.addEventListener("input", (event) => {
    const reviewNote = event.target.closest("[data-review-note]");
    if (reviewNote) {
      localStorage.setItem(reviewNoteStorageKey(reviewNote.dataset.reviewNote), reviewNote.value);
      const status = document.querySelector(`[data-review-status="${reviewNote.dataset.reviewNote}"]`);
      if (status) status.textContent = "已保存";
      return;
    }

    const search = event.target.closest("#problemSearch");
    if (!search) return;

    state.keyword = search.value;
    renderProblemList();
    renderIcons();
    const nextSearch = document.querySelector("#problemSearch");
    if (nextSearch) {
      nextSearch.focus();
      nextSearch.setSelectionRange(nextSearch.value.length, nextSearch.value.length);
    }
  });

  document.body.addEventListener("click", (event) => {
    const topicFilter = event.target.closest("[data-topic-filter]");
    if (topicFilter) {
      state.topic = topicFilter.dataset.topicFilter;
      state.difficulty = "all";
      renderProblemList();
      renderIcons();
      return;
    }

    const difficultyFilter = event.target.closest("[data-difficulty-filter]");
    if (difficultyFilter) {
      state.difficulty = difficultyFilter.dataset.difficultyFilter;
      renderProblemList();
      renderIcons();
      return;
    }

    const complete = event.target.closest("[data-complete]");
    if (complete) {
      if (complete.checked) state.completed.add(complete.dataset.complete);
      else state.completed.delete(complete.dataset.complete);
      saveCompleted();
      render();
      return;
    }

    const focus = event.target.closest("[data-focus]");
    if (focus) {
      state.focusProblem = focus.dataset.focus;
      localStorage.setItem("af-focus-problem", state.focusProblem);
      render();
      return;
    }

    const topicRoute = event.target.closest("[data-topic-route]");
    if (topicRoute) {
      showTopicProblems(topicRoute.dataset.topicRoute);
      return;
    }

    if (event.target.closest("[data-stop]")) return;

    const problem = event.target.closest("[data-problem]");
    if (problem) {
      setProblem(problem.dataset.problem);
      return;
    }

    const route = event.target.closest("[data-route]");
    if (route) setRoute(route.dataset.route);
  });

  document.querySelector("#resetProgress").addEventListener("click", () => {
    state.completed.clear();
    saveCompleted();
    render();
  });

  document.querySelector("#themeToggle").addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    localStorage.setItem("af-theme", state.theme);
    render();
  });

  document.querySelector("#globalSearch").addEventListener("click", () => {
    state.route = "problems";
    setSidebarOpen(false);
    render();
    const input = document.querySelector("#problemSearch");
    if (input) input.focus();
    els.mobileSearch.classList.toggle("is-open", window.matchMedia("(max-width: 860px)").matches);
  });

  els.quickSearch.addEventListener("input", (event) => {
    state.keyword = event.target.value;
    state.route = "problems";
    render();
  });

  window.addEventListener("hashchange", applyHashRoute);

  document.body.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const topicCard = event.target.closest("[data-topic-route]");
    if (topicCard) {
      event.preventDefault();
      showTopicProblems(topicCard.dataset.topicRoute);
      return;
    }

    const card = event.target.closest(".problem-card[data-problem], .review-note-card[data-problem]");
    if (!card) return;
    event.preventDefault();
    setProblem(card.dataset.problem);
  });
}

function applyHashRoute() {
  const hash = decodeURIComponent(location.hash.replace("#", ""));
  if (!hash) return;
  if (hash.startsWith("problem-")) state.route = `problem:${hash.replace("problem-", "")}`;
  else if (pages[hash] || hash === "roadmap" || hash === "problems" || hash === "company" || hash === "review") state.route = hash;
  setSidebarOpen(false);
  render();
  scrollToContentTop();
}

function init() {
  applyHashRoute();
  if (!location.hash) state.route = "intro";
  bindEvents();
  render();
}

init();
