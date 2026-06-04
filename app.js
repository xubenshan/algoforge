const sections = [
  { id: "intro", icon: "file-text", title: "概览" },
  { id: "roadmap", icon: "map", title: "路线" },
  { id: "problems", icon: "book-open", title: "题单" },
  { id: "company", icon: "building-2", title: "公司题" },
  { id: "review", icon: "messages-square", title: "复盘" },
];

const pages = {
  intro: {
    title: "算法笔记配套站",
    toc: ["定位", "学习方式", "当前版本"],
    body: `
      <p>AlgoForge 是 <strong>算法笔记.md</strong> 的配套练习站。题目、思路和 C++ 模板都围绕笔记展开，网站负责把它们整理成路线、题单、力扣跳转和进度记录。</p>
      <h2 id="定位">定位</h2>
      <p>这里不是重新写一套教程，而是把你的笔记变成可刷、可复盘、可按公司专题训练的学习工作台。</p>
      <h2 id="学习方式">学习方式</h2>
      <ul>
        <li>先从「路线」确定本周主题。</li>
        <li>进入「题单」筛选题型，点击题目看笔记里的思路、C++ 模板和力扣链接。</li>
        <li>需要面试冲刺时，进入「公司题」按手撕题和机试题组合练习。</li>
      </ul>
      <h2 id="当前版本">当前版本</h2>
      <p>当前已整理笔记中的核心题目，并补充力扣链接。后续可以继续把公司真题、限时机试和错题本接进来。</p>
    `,
  },
  review: {
    title: "面试复盘",
    toc: ["口述结构", "边界清单", "限时训练"],
    body: `
      <p>算法题做完不算结束。秋招面试里，能把思路讲清楚和写出代码同样重要。</p>
      <h2 id="口述结构">口述结构</h2>
      <p>先说暴力做法，再说优化点，最后解释为什么当前题型适合这个数据结构或算法模板。</p>
      <h2 id="边界清单">边界清单</h2>
      <p>每题至少检查空输入、重复元素、极端长度、下标越界和返回值格式。</p>
      <h2 id="限时训练">限时训练</h2>
      <p>Easy 控制在 10 分钟，Medium 先控制在 30 分钟，稳定后再缩到 20 分钟。</p>
    `,
  },
};

const topicMeta = {
  "双指针": { icon: "move-horizontal", plan: "阶段 1", note: "有序数组、相向指针、去重。" },
  "滑动窗口": { icon: "panel-right-open", plan: "阶段 2", note: "维护窗口，左右边界只前进。" },
  "二分查找": { icon: "split", plan: "阶段 3", note: "明确搜索区间和收缩条件。" },
  "链表": { icon: "workflow", plan: "阶段 4", note: "先画指针，再写更新顺序。" },
  "二叉树": { icon: "git-branch", plan: "阶段 5", note: "递归定义、遍历时机和返回值。" },
};

const problems = window.AF_PROBLEMS || [];

const companySets = [
  {
    company: "字节跳动",
    mode: "手撕高频",
    focus: "偏爱窗口、双指针和链表指针题，重点看边界表达和代码速度。",
    titles: ["无重复字符的最长子串", "三数之和", "K个一组翻转链表", "二叉树的右视图"],
  },
  {
    company: "腾讯",
    mode: "基础稳定",
    focus: "重视经典数据结构题，要求思路稳、实现稳、复杂度能讲清楚。",
    titles: ["反转链表", "环形链表II", "验证二叉搜索树", "二叉树的最近公共祖先"],
  },
  {
    company: "美团",
    mode: "机试速度",
    focus: "适合限时练习，优先训练快速读题、快速套模板和边界检查。",
    titles: ["长度最小的子数组", "搜索旋转排序数组", "接雨水", "重排链表"],
  },
  {
    company: "阿里",
    mode: "结构化手撕",
    focus: "题目不一定刁钻，但会追问为什么这样写、有没有更清晰的返回值设计。",
    titles: ["平衡二叉树", "二叉搜索树的最近公共祖先", "删除链表的倒数第N个结点", "在排序数组中查找元素的第一个和最后一个位置"],
  },
  {
    company: "华为",
    mode: "机试/笔试",
    focus: "适合用来做 30 分钟一组的模拟，训练题型切换和实现完整度。",
    titles: ["两数之和-有序数组", "乘积小于K的子数组", "寻找峰值", "删除排序链表中的重复元素II"],
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

function problemById(id) {
  return problems.find((problem) => problem.id === id) || problems[0];
}

function problemByTitle(title) {
  return problems.find((problem) => problem.title === title);
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
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

function progressScore() {
  return Math.round((state.completed.size / problems.length) * 100);
}

function setRoute(route) {
  state.route = route;
  location.hash = route;
  render();
  scrollToContentTop();
}

function setProblem(problemId) {
  state.route = `problem:${problemId}`;
  location.hash = `problem-${problemId}`;
  render();
  scrollToContentTop();
}

function showTopicProblems(topic) {
  state.route = "problems";
  state.topic = topic;
  state.keyword = "";
  state.difficulty = "all";
  location.hash = "problems";
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
      <div class="stat-card"><b>${state.completed.size}</b><span>已掌握</span></div>
      <div class="stat-card"><b>${problems.length - state.completed.size}</b><span>待完成</span></div>
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
      <span class="chip green">${state.completed.size} / ${problems.length} 已掌握</span>
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
  renderToc(["训练包", "使用方式"]);
  els.content.innerHTML = `
    <h1>公司手撕 / 机试专题</h1>
    <p>这个专题不脱离笔记另造题库，而是把 <strong>算法笔记.md</strong> 里的题按常见公司面试和机试节奏重新编组。点击题目仍然进入同一份笔记思路和 C++ 模板。</p>
    <h2 id="训练包">训练包</h2>
    <div class="company-grid">
      ${companySets
        .map((set) => {
          const setProblems = set.titles.map(problemByTitle).filter(Boolean);
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
                  .map(
                    (problem) => `
                      <button data-problem="${problem.id}">
                        <span>${problem.title}</span>
                        <small>${problem.topic}</small>
                      </button>
                    `
                  )
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
      <p>手撕专题每组 3 到 4 题，先限时写代码，再回到题目详情页对照笔记思路复盘边界、复杂度和口述表达。</p>
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
        <a class="mini-button" href="${problem.leetcode}" target="_blank" rel="noreferrer" data-stop>${icon("external-link")}力扣</a>
      </div>
    </article>
  `;
}

function renderProblemDetail(problemId) {
  const problem = problemById(problemId);
  const done = state.completed.has(problem.id);
  renderToc(["笔记内容", "复盘"]);
  els.content.innerHTML = `
    <h1>${problem.title}</h1>
    <div class="article-meta compact-meta">
      <span class="chip green">${problem.topic}</span>
      <span class="chip difficulty ${problem.difficulty}">${problem.difficulty}</span>
    </div>
    <div class="detail-actions">
      <button class="ghost-button" data-route="problems">${icon("arrow-left")}返回题单</button>
      <a class="ghost-button primary-link" href="${problem.leetcode}" target="_blank" rel="noreferrer">${icon("external-link")}打开力扣</a>
      <label class="checkbox-row ghost-button">
        <input type="checkbox" ${done ? "checked" : ""} data-complete="${problem.id}" />
        已掌握
      </label>
      <button class="ghost-button" data-focus="${problem.id}">${icon("pin")}加入今日</button>
    </div>
    <h2 id="笔记内容">笔记内容</h2>
    <div class="note-article">${renderNoteMarkdown(problem.noteMarkdown || problem.ideaMarkdown || problem.description || problemSummary(problem))}</div>
    <h2 id="复盘">复盘</h2>
    <ul>
      <li>能否一句话说出为什么用 <strong>${problem.topic}</strong>？</li>
      <li>边界条件是否覆盖空输入、重复元素和下标范围？</li>
      <li>能否说明时间复杂度和空间复杂度？</li>
    </ul>
  `;
}

function render() {
  document.body.classList.toggle("light", state.theme === "light");
  renderTopNav();
  renderSideNav();

  if (state.route === "roadmap") renderRoadmap();
  else if (state.route === "problems") renderProblemList();
  else if (state.route === "company") renderCompanyPractice();
  else if (state.route.startsWith("problem:")) renderProblemDetail(state.route.slice("problem:".length));
  else renderGenericPage(state.route);

  renderIcons();
  els.content.focus({ preventScroll: true });
}

function bindEvents() {
  document.body.addEventListener("input", (event) => {
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

    const card = event.target.closest(".problem-card[data-problem]");
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
