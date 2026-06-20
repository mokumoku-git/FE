const STORE_KEY = "fe-trainer-state-v1";
const SETTINGS_KEY = "fe-trainer-settings-v1";
const IMPORT_KEY = "fe-trainer-imported-v1";

const $ = (id) => document.getElementById(id);
const todayKey = () => new Date().toISOString().slice(0, 10);

const defaultSettings = {
  apiKey: "",
  model: "gpt-4.1-mini",
  dailyCount: 30
};

const JA_TEXT = {
  "二分探索": "二分探索",
  "队列": "キュー",
  "主键": "主キー",
  "TCP 特性": "TCP の特徴",
  "哈希函数": "ハッシュ関数",
  "补码": "2の補数",
  "白盒测试": "ホワイトボックステスト",
  "关键路径": "クリティカルパス",
  "SWOT": "SWOT",
  "负载均衡": "ロードバランシング",
  "时间复杂度": "時間計算量",
  "事务 ACID": "トランザクション ACID",
  "SQL 注入": "SQL インジェクション",
  "OSI 层": "OSI 階層",
  "缓存": "キャッシュ",
  "敏捷开发": "アジャイル開発",
  "二叉搜索树": "二分探索木",
  "对称加密": "共通鍵暗号",
  "SQL 聚合": "SQL 集約",
  "RAID 1": "RAID 1",
  "DNS": "DNS",
  "中断": "割込み",
  "风险管理": "リスク管理",
  "KPI": "KPI",
  "递归": "再帰",
  "多因素认证": "多要素認証",
  "回归测试": "リグレッションテスト",
  "第三范式": "第3正規形",
  "HTTP 状态码": "HTTP ステータスコード",
  "可用性": "可用性",
  "流水线": "パイプライン",
  "栈的应用": "スタックの応用",
  "SaaS": "SaaS",
  "最小权限": "最小権限",
  "索引": "インデックス",
  "CIDR": "CIDR",
  "UML": "UML",
  "WBS": "WBS",
  "虚拟内存": "仮想記憶",
  "水平扩展": "スケールアウト",
  "栈 / スタック": "スタック",
  "队列 / キュー": "キュー",
  "堆 / ヒープ": "ヒープ",
  "树 / 木": "木",
  "允许 NULL": "NULL を許す",
  "可以重复": "重複してもよい",
  "唯一且非 NULL": "一意であり NULL でない",
  "只能由一个列组成": "一つの列だけで構成される",
  "无连接": "コネクションレス",
  "可靠的面向连接传输": "信頼性のあるコネクション型転送",
  "只用于广播": "ブロードキャストだけに用いる",
  "不进行顺序控制": "順序制御を行わない",
  "还原明文": "平文を復元する",
  "确认完整性": "完全性を確認する",
  "压缩图片": "画像を圧縮する",
  "分配 IP 地址": "IP アドレスを割り当てる",
  "-1": "-1",
  "-2": "-2",
  "126": "126",
  "254": "254",
  "内部结构和逻辑路径": "内部構造と論理パス",
  "用户满意度": "利用者満足度",
  "市场规模": "市場規模",
  "硬件价格": "ハードウェア価格",
  "成本最低的路径": "コストが最小の経路",
  "风险最小的路径": "リスクが最小の経路",
  "决定项目最短工期的最长路径": "プロジェクトの最短工期を決める最長経路",
  "人员最多的路径": "人員が最も多い経路",
  "优势 / Strength": "強み / Strength",
  "机会 / Opportunity": "機会 / Opportunity",
  "威胁 / Threat": "脅威 / Threat",
  "弱点 / Weakness": "弱み / Weakness",
  "分散请求到多台服务器": "複数のサーバへ要求を分散する",
  "加密数据库字段": "データベース項目を暗号化する",
  "压缩源代码": "ソースコードを圧縮する",
  "替代 DNS": "DNS を置き換える",
  "O(log n)": "O(log n)",
  "O(n)": "O(n)",
  "O(n log n)": "O(n log n)",
  "O(n^2)": "O(n^2)",
  "隔离性 / Isolation": "分離性 / Isolation",
  "完整性 / Integrity": "完全性 / Integrity",
  "输入 / Input": "入力 / Input",
  "索引 / Index": "索引 / Index",
  "参数化查询": "パラメタ化問合せ",
  "把数据库改名": "データベース名を変更する",
  "关闭显示器": "ディスプレイを消す",
  "缩短密码长度": "パスワードを短くする",
  "物理层": "物理層",
  "数据链路层": "データリンク層",
  "网络层": "ネットワーク層",
  "应用层": "アプリケーション層",
  "降低主存访问延迟": "主記憶アクセスの遅延を小さくする",
  "永久保存文件": "ファイルを永続的に保存する",
  "执行网络路由": "ネットワークのルーティングを行う",
  "增加屏幕分辨率": "画面解像度を上げる",
  "一次性完成所有设计": "すべての設計を一度に完了する",
  "频繁交付和反馈": "頻繁な提供とフィードバック",
  "禁止需求变化": "要求変更を禁止する",
  "只写文档不交付软件": "文書だけを書きソフトウェアを提供しない",
  "都大于该节点": "すべてその節点より大きい",
  "都小于该节点": "すべてその節点より小さい",
  "都等于该节点": "すべてその節点と等しい",
  "没有任何顺序关系": "順序関係がない",
  "加密和解密使用同一密钥": "暗号化と復号に同じ鍵を用いる",
  "不需要密钥": "鍵を必要としない",
  "只能用于数字签名": "ディジタル署名だけに用いる",
  "公开密钥必须保密": "公開鍵を秘密にしなければならない",
  "条带化": "ストライピング",
  "镜像": "ミラーリング",
  "奇偶校验分散": "パリティ分散",
  "压缩存储": "圧縮保存",
  "域名和 IP 地址的对应解析": "ドメイン名と IP アドレスの対応を解決する",
  "压缩网页": "Web ページを圧縮する",
  "检测病毒": "ウイルスを検出する",
  "生成随机数": "乱数を生成する",
  "让 CPU 响应外部或内部事件": "CPU が外部または内部の事象に応答する",
  "永久关闭进程": "プロセスを永続的に停止する",
  "删除内存": "メモリを削除する",
  "提高显示亮度": "画面の明るさを上げる",
  "颜色和形状": "色と形",
  "发生概率和影响度": "発生確率と影響度",
  "人数和年龄": "人数と年齢",
  "文件名和大小": "ファイル名とサイズ",
  "关键绩效指标": "重要業績評価指標",
  "加密私钥索引": "暗号化秘密鍵索引",
  "内核进程编号": "カーネルプロセス番号",
  "知识产权保险": "知的財産保険",
  "基准条件": "基底条件",
  "全局变量": "グローバル変数",
  "数据库连接": "データベース接続",
  "网络端口": "ネットワークポート",
  "结合多个不同类型凭证提高认证强度": "複数種類の認証要素を組み合わせて認証強度を高める",
  "减少所有密码长度": "すべてのパスワードを短くする",
  "共享所有账号": "すべてのアカウントを共有する",
  "取消访问控制": "アクセス制御をなくす",
  "确认修改没有破坏既有功能": "変更が既存機能を壊していないことを確認する",
  "只测试新员工": "新入社員だけをテストする",
  "删除旧代码": "古いコードを削除する",
  "测量办公面积": "事務所の面積を測定する",
  "传递依赖": "推移的関数従属",
  "物理依赖": "物理依存",
  "网络依赖": "ネットワーク依存",
  "编译依赖": "コンパイル依存",
  "成功": "成功",
  "未找到资源": "リソースが見つからない",
  "服务器内部错误": "サーバ内部エラー",
  "永久重定向": "恒久的リダイレクト",
  "90%": "90%",
  "99%": "99%",
  "99.9%": "99.9%",
  "99.99%": "99.99%",
  "提高吞吐量": "スループットを向上させる",
  "增加磁盘容量": "ディスク容量を増やす",
  "减少网络地址": "ネットワークアドレスを減らす",
  "禁止并行": "並列処理を禁止する",
  "函数调用管理": "関数呼出しの管理",
  "域名解析": "ドメイン名解決",
  "磁盘镜像": "ディスクミラーリング",
  "通过网络提供软件功能": "ネットワーク経由でソフトウェア機能を提供する",
  "只销售物理服务器": "物理サーバだけを販売する",
  "只提供电力": "電力だけを提供する",
  "汇编语言标准": "アセンブリ言語の標準",
  "只授予完成任务所需的权限": "作業に必要な権限だけを付与する",
  "给所有用户管理员权限": "全利用者に管理者権限を与える",
  "禁用日志": "ログを無効にする",
  "公开所有密钥": "すべての鍵を公開する",
  "提高查询速度但可能增加更新成本": "問合せ速度を高めるが更新コストが増えることがある",
  "删除所有重复数据": "すべての重複データを削除する",
  "替代事务": "トランザクションを置き換える",
  "保证网络加密": "ネットワーク暗号化を保証する",
  "8": "8",
  "16": "16",
  "24": "24",
  "32": "32",
  "参与者与系统功能的关系": "アクタとシステム機能の関係",
  "CPU 电路图": "CPU の回路図",
  "数据库物理页": "データベースの物理ページ",
  "网络电缆长度": "ネットワークケーブルの長さ",
  "把项目工作分解成可管理的组成部分": "プロジェクト作業を管理可能な構成要素へ分解する",
  "加密通信": "通信を暗号化する",
  "压缩图像": "画像を圧縮する",
  "控制 CPU 温度": "CPU 温度を制御する",
  "让程序使用比物理内存更大的地址空间": "物理メモリより大きなアドレス空間をプログラムに提供する",
  "提高显示色彩": "表示色数を増やす",
  "替代所有文件系统": "すべてのファイルシステムを置き換える",
  "消除所有缓存": "すべてのキャッシュをなくす",
  "增加服务器台数提升处理能力": "サーバ台数を増やして処理能力を高める",
  "只升级单台服务器 CPU": "単一サーバの CPU だけを強化する",
  "删除备份": "バックアップを削除する",
  "缩短密码": "パスワードを短くする"
};

let importedQuestions = loadJson(IMPORT_KEY, []);
let questions = [...window.FE_QUESTIONS, ...importedQuestions];
let state = loadJson(STORE_KEY, {
  daily: {},
  answers: {},
  wrong: {},
  sessions: {},
  currentIndex: 0,
  activeSet: "daily"
});
let settings = { ...defaultSettings, ...loadJson(SETTINGS_KEY, {}) };
let deferredInstallPrompt = null;

function loadJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function saveState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function shuffle(items, seed) {
  const output = [...items];
  let value = seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) || 1;
  for (let i = output.length - 1; i > 0; i--) {
    value = (value * 9301 + 49297) % 233280;
    const j = Math.floor((value / 233280) * (i + 1));
    [output[i], output[j]] = [output[j], output[i]];
  }
  return output;
}

function ensureDaily(force = false) {
  const key = todayKey();
  if (!state.daily[key] || force) {
    const count = Math.min(settings.dailyCount, questions.length);
    state.daily[key] = shuffle(questions, `${key}-${Date.now()}`).slice(0, count).map((q) => q.id);
    state.currentIndex = 0;
    state.activeSet = "daily";
    saveState();
  }
}

function activeIds() {
  if (state.activeSet === "wrong") return Object.keys(state.wrong);
  return state.daily[todayKey()] || [];
}

function activeQuestions() {
  const ids = activeIds();
  return ids.map((id) => questions.find((q) => q.id === id)).filter(Boolean);
}

function currentQuestion() {
  const set = activeQuestions();
  if (state.currentIndex >= set.length) state.currentIndex = Math.max(0, set.length - 1);
  return set[state.currentIndex];
}

function displayTitle(q) {
  return JA_TEXT[q.title] || q.title;
}

function displayQuestion(q) {
  return q.text.includes("\n\n") ? q.text.split("\n\n").pop() : q.text;
}

function displayOption(option) {
  if (JA_TEXT[option]) return JA_TEXT[option];
  if (option.includes(" / ")) return option.split(" / ").pop();
  return option;
}

function renderPractice() {
  ensureDaily();
  const set = activeQuestions();
  const q = currentQuestion();
  if (!q) return;
  const record = state.answers[q.id] || { attempts: 0, correct: 0, selected: null };
  $("questionIndex").textContent = `第 ${state.currentIndex + 1} / ${set.length} 题`;
  $("questionTag").textContent = `${q.section} · ${q.category} · ${q.source}`;
  $("questionTitle").textContent = displayTitle(q);
  $("questionText").textContent = displayQuestion(q);
  $("optionList").innerHTML = "";

  q.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "option";
    if (record.selected === index) button.classList.add("selected");
    if (record.selected !== null && index === q.answer) button.classList.add("correct");
    if (record.selected === index && index !== q.answer) button.classList.add("wrong");
    button.innerHTML = `<span class="option-key">${String.fromCharCode(65 + index)}</span><span>${displayOption(option)}</span>`;
    button.addEventListener("click", () => answerQuestion(q, index));
    $("optionList").appendChild(button);
  });

  if (record.selected === null || record.selected === undefined) {
    $("feedback").className = "feedback hidden";
    $("feedback").textContent = "";
  } else {
    const ok = record.selected === q.answer;
    $("feedback").className = `feedback ${ok ? "good" : "bad"}`;
    $("feedback").textContent = `${ok ? "正解" : "不正解"}。答案：${String.fromCharCode(65 + q.answer)}。中文解释：${q.explanation}`;
  }

  $("currentAccuracy").textContent = record.attempts ? `${Math.round((record.correct / record.attempts) * 100)}%` : "-";
  $("currentAttempts").textContent = record.attempts || 0;
  $("currentState").textContent = record.selected == null ? "未作答" : record.selected === q.answer ? "已掌握" : "需复习";
  $("aiOutput").textContent = "";
  renderProgress();
}

function answerQuestion(q, index) {
  const key = todayKey();
  const isCorrect = index === q.answer;
  const record = state.answers[q.id] || { attempts: 0, correct: 0, selected: null, history: [] };
  record.attempts += 1;
  record.correct += isCorrect ? 1 : 0;
  record.selected = index;
  record.lastAnswered = new Date().toISOString();
  record.history = [...(record.history || []), { at: record.lastAnswered, selected: index, correct: isCorrect }];
  state.answers[q.id] = record;
  if (isCorrect) delete state.wrong[q.id];
  else state.wrong[q.id] = { addedAt: record.lastAnswered, category: q.category };
  state.sessions[key] = state.sessions[key] || { answered: 0, correct: 0 };
  state.sessions[key].answered += 1;
  state.sessions[key].correct += isCorrect ? 1 : 0;
  saveState();
  renderAll();
}

function renderProgress() {
  const ids = state.daily[todayKey()] || [];
  const done = ids.filter((id) => state.answers[id]?.selected !== null && state.answers[id]?.selected !== undefined).length;
  $("todayProgress").textContent = `${done} / ${ids.length || settings.dailyCount}`;
  $("todayMeter").style.width = `${ids.length ? (done / ids.length) * 100 : 0}%`;
}

function renderWrong() {
  const ids = Object.keys(state.wrong);
  $("wrongList").innerHTML = ids.length ? "" : `<div class="notice">目前没有错题。いい感じです。</div>`;
  ids.forEach((id) => {
    const q = questions.find((item) => item.id === id);
    if (!q) return;
    $("wrongList").appendChild(questionListItem(q));
  });
}

function questionListItem(q) {
  const item = document.createElement("article");
  const record = state.answers[q.id] || { attempts: 0, correct: 0 };
  const accuracy = record.attempts ? Math.round((record.correct / record.attempts) * 100) : 0;
  item.className = "list-item";
  item.innerHTML = `
    <h3>${displayTitle(q)}</h3>
    <p>${displayQuestion(q).split("\n")[0]}</p>
    <div class="pill-row">
      <span class="pill">${q.category}</span>
      <span class="pill">${q.section}</span>
      <span class="pill">正确率 ${accuracy}%</span>
      <span class="pill">${q.source}</span>
    </div>
  `;
  item.addEventListener("click", () => {
    state.activeSet = Object.keys(state.wrong).includes(q.id) ? "wrong" : "daily";
    const index = activeIds().indexOf(q.id);
    state.currentIndex = Math.max(0, index);
    saveState();
    switchView("practice");
  });
  return item;
}

function renderStats() {
  const records = Object.values(state.answers);
  const total = records.reduce((sum, r) => sum + (r.attempts || 0), 0);
  const correct = records.reduce((sum, r) => sum + (r.correct || 0), 0);
  $("totalAnswers").textContent = total;
  $("overallAccuracy").textContent = total ? `${Math.round((correct / total) * 100)}%` : "0%";
  $("wrongCount").textContent = Object.keys(state.wrong).length;
  $("streakDays").textContent = `${calcStreak()} 天`;
  renderDailyChart();
  renderCategoryStats();
}

function calcStreak() {
  let streak = 0;
  const date = new Date();
  while (true) {
    const key = date.toISOString().slice(0, 10);
    if (!state.sessions[key]?.answered) break;
    streak += 1;
    date.setDate(date.getDate() - 1);
  }
  return streak;
}

function renderDailyChart() {
  $("dailyChart").innerHTML = "";
  const dates = [];
  for (let i = 13; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().slice(0, 10));
  }
  const max = Math.max(1, ...dates.map((d) => state.sessions[d]?.answered || 0));
  dates.forEach((date) => {
    const answered = state.sessions[date]?.answered || 0;
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.title = `${date}: ${answered}`;
    bar.style.height = `${Math.max(3, (answered / max) * 160)}px`;
    bar.innerHTML = `<span>${date.slice(5).replace("-", "/")}</span>`;
    $("dailyChart").appendChild(bar);
  });
}

function renderCategoryStats() {
  const map = {};
  for (const q of questions) {
    const r = state.answers[q.id];
    if (!r?.attempts) continue;
    map[q.category] = map[q.category] || { attempts: 0, correct: 0 };
    map[q.category].attempts += r.attempts;
    map[q.category].correct += r.correct;
  }
  $("categoryStats").innerHTML = "";
  const entries = Object.entries(map);
  if (!entries.length) {
    $("categoryStats").innerHTML = `<p class="muted">做完几题后这里会显示分类掌握情况。</p>`;
    return;
  }
  entries.sort((a, b) => a[0].localeCompare(b[0])).forEach(([name, item]) => {
    const pct = Math.round((item.correct / item.attempts) * 100);
    const row = document.createElement("div");
    row.className = "category-row";
    row.innerHTML = `<strong>${name}</strong><div class="progress-line"><span style="width:${pct}%"></span></div><span>${pct}%</span>`;
    $("categoryStats").appendChild(row);
  });
}

function renderLibrary() {
  $("libraryList").innerHTML = "";
  questions.forEach((q) => $("libraryList").appendChild(questionListItem(q)));
}

function buildPrompt(q) {
  const selected = state.answers[q.id]?.selected;
  return `请用中文和日语解释这道日本基本情报技术者考试 FE 题。请说明正确答案、为什么其他选项不对，并给一个记忆点。

問題:
${displayQuestion(q)}

選択肢:
${q.options.map((o, i) => `${String.fromCharCode(65 + i)}. ${displayOption(o)}`).join("\n")}

正确答案: ${String.fromCharCode(65 + q.answer)}
我的选择: ${selected == null ? "未选择" : String.fromCharCode(65 + selected)}
已有简要解释: ${q.explanation}`;
}

async function explainWithAi() {
  const q = currentQuestion();
  if (!q) return;
  if (!settings.apiKey) {
    $("aiOutput").textContent = "还没有保存 API Key。可以去设置保存，或点击“复制提示词”后粘贴到 ChatGPT。";
    return;
  }
  $("aiOutput").textContent = "生成中...";
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${settings.apiKey}`
      },
      body: JSON.stringify({
        model: settings.model,
        input: buildPrompt(q),
        max_output_tokens: 900
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "AI 请求失败");
    $("aiOutput").textContent = data.output_text || "没有收到文本结果。";
  } catch (error) {
    $("aiOutput").textContent = `生成失败：${error.message}\n\n你仍然可以复制提示词到 ChatGPT 使用。`;
  }
}

async function copyPrompt() {
  const q = currentQuestion();
  if (!q) return;
  await navigator.clipboard.writeText(buildPrompt(q));
  $("aiOutput").textContent = "提示词已复制。";
}

function switchView(viewId) {
  document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.id === viewId));
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("active", item.dataset.view === viewId));
  renderAll();
}

function renderSettings() {
  $("apiKeyInput").value = settings.apiKey;
  $("modelInput").value = settings.model;
  $("dailyCountInput").value = settings.dailyCount;
}

function renderAll() {
  renderPractice();
  renderWrong();
  renderStats();
  renderLibrary();
  renderSettings();
}

function bindEvents() {
  document.querySelectorAll(".nav-item").forEach((item) => item.addEventListener("click", () => switchView(item.dataset.view)));
  $("newDailyBtn").addEventListener("click", () => {
    ensureDaily(true);
    renderAll();
  });
  $("resetAnswerBtn").addEventListener("click", () => {
    const q = currentQuestion();
    if (!q) return;
    if (state.answers[q.id]) state.answers[q.id].selected = null;
    saveState();
    renderAll();
  });
  $("prevBtn").addEventListener("click", () => {
    state.currentIndex = Math.max(0, state.currentIndex - 1);
    saveState();
    renderPractice();
  });
  $("nextBtn").addEventListener("click", () => {
    state.currentIndex = Math.min(activeQuestions().length - 1, state.currentIndex + 1);
    saveState();
    renderPractice();
  });
  $("startWrongBtn").addEventListener("click", () => {
    state.activeSet = "wrong";
    state.currentIndex = 0;
    saveState();
    switchView("practice");
  });
  $("aiExplainBtn").addEventListener("click", explainWithAi);
  $("copyPromptBtn").addEventListener("click", copyPrompt);
  $("saveSettingsBtn").addEventListener("click", () => {
    settings = {
      apiKey: $("apiKeyInput").value.trim(),
      model: $("modelInput").value.trim() || defaultSettings.model,
      dailyCount: Number($("dailyCountInput").value) || 30
    };
    saveSettings();
    ensureDaily(true);
    renderAll();
  });
  $("installAppBtn").addEventListener("click", installApp);
  $("clearDataBtn").addEventListener("click", () => {
    if (!confirm("确定清空学习记录吗？题库和设置会保留。")) return;
    state = { daily: {}, answers: {}, wrong: {}, sessions: {}, currentIndex: 0, activeSet: "daily" };
    saveState();
    ensureDaily(true);
    renderAll();
  });
  $("exportBtn").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify({ state, settings: { ...settings, apiKey: "" }, importedQuestions }, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `fe-trainer-export-${todayKey()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  });
  $("importFile").addEventListener("change", importQuestions);
}

function setupPwa() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    $("installAppBtn")?.classList.remove("hidden");
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    $("installAppBtn")?.classList.add("hidden");
  });
}

async function installApp() {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  $("installAppBtn").classList.add("hidden");
}

async function importQuestions(event) {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const items = Array.isArray(data) ? data : data.questions;
    if (!Array.isArray(items)) throw new Error("JSON 需要是数组，或包含 questions 数组。");
    const normalized = items.map((q, index) => ({
      id: q.id || `import-${Date.now()}-${index}`,
      source: q.source || "导入题",
      year: q.year || "Imported",
      section: q.section || "科目A",
      category: q.category || "未分类",
      title: q.title || `导入题 ${index + 1}`,
      text: q.text,
      options: q.options,
      answer: q.answer,
      explanation: q.explanation || ""
    }));
    if (normalized.some((q) => !q.text || !Array.isArray(q.options) || typeof q.answer !== "number")) {
      throw new Error("每题需要 text、options 数组、answer 数字。");
    }
    importedQuestions = [...importedQuestions, ...normalized];
    localStorage.setItem(IMPORT_KEY, JSON.stringify(importedQuestions));
    questions = [...window.FE_QUESTIONS, ...importedQuestions];
    ensureDaily(true);
    renderAll();
  } catch (error) {
    alert(`导入失败：${error.message}`);
  } finally {
    event.target.value = "";
  }
}

bindEvents();
setupPwa();
ensureDaily();
renderAll();
