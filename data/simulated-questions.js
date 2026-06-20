(function () {
  const questions = [];

  function optionSet(correct, distractors, seed) {
    const correctText = String(correct);
    const values = [correct, ...distractors]
      .map(String)
      .filter((value, index, array) => array.indexOf(value) === index)
      .slice(0, 4);
    let offset = 1;
    while (values.length < 4) {
      const numeric = Number.parseFloat(correctText);
      const suffix = correctText.replace(/^-?[\d.]+/, "");
      const candidate = Number.isFinite(numeric)
        ? `${numeric + offset + (seed % 5)}${suffix}`
        : `上記以外 ${offset}`;
      if (!values.includes(candidate)) values.push(candidate);
      offset += 1;
    }
    const shift = seed % values.length;
    const options = [...values.slice(shift), ...values.slice(0, shift)];
    return { options, answer: options.indexOf(String(correct)) };
  }

  function add(section, number, category, title, text, correct, distractors, explanation) {
    const result = optionSet(correct, distractors, number);
    questions.push({
      id: `sim-${section.toLowerCase()}-${String(number).padStart(3, "0")}`,
      source: "真题同等难度模拟题",
      year: "Simulation",
      section: `科目${section}`,
      category,
      title,
      text,
      options: result.options,
      answer: result.answer,
      explanation
    });
  }

  for (let i = 0; i < 800; i += 1) {
    const number = i + 1;
    const variant = Math.floor(i / 10);
    switch (i % 10) {
      case 0: {
        const value = 37 + variant * 2;
        const correct = value.toString(2);
        add("A", number, "基礎理論", "2進数変換", `10進数 ${value} を2進数で表したものはどれか。`, correct,
          [(value - 1).toString(2), (value + 1).toString(2), (value + 2).toString(2)],
          `${value} を2で繰り返し割り、余りを逆順に並べると ${correct} になります。`);
        break;
      }
      case 1: {
        const magnitude = 2 + variant;
        const encoded = (256 - magnitude).toString(2).padStart(8, "0");
        add("A", number, "基礎理論", "2の補数", `8ビットの2の補数 ${encoded} が表す10進数はどれか。`, `-${magnitude}`,
          [`${magnitude}`, `-${magnitude + 1}`, `${256 - magnitude}`],
          `最高位が1なので負数です。反転して1を加えると ${magnitude} となるため、値は -${magnitude} です。`);
        break;
      }
      case 2: {
        const hitRate = 80 + (variant % 16);
        const cache = 8 + (variant % 5) * 2;
        const memory = 80 + variant;
        const correct = Math.round((hitRate / 100) * cache + (1 - hitRate / 100) * memory);
        add("A", number, "コンピュータ構成", "実効アクセス時間",
          `キャッシュのヒット率は ${hitRate}％、キャッシュアクセスは ${cache}ns、主記憶アクセスは ${memory}ns である。実効アクセス時間に最も近いものはどれか。`,
          `${correct} ns`, [`${correct + 6} ns`, `${correct + 12} ns`, `${Math.max(1, correct - 5)} ns`],
          `加权平均为 ${hitRate / 100}×${cache}＋${1 - hitRate / 100}×${memory}，约为 ${correct}ns。`);
        break;
      }
      case 3: {
        const mtbf = 900 + variant * 25;
        const mttr = 10 + (variant % 20);
        const availability = mtbf / (mtbf + mttr);
        const correct = `${(availability * 100).toFixed(2)}%`;
        add("A", number, "システム構成", "稼働率", `MTBFが ${mtbf} 時間、MTTRが ${mttr} 時間の装置の稼働率はどれか。`, correct,
          [`${((mtbf / mttr) * 10).toFixed(2)}%`, `${((1 - availability) * 100).toFixed(2)}%`, `${((mttr / mtbf) * 100).toFixed(2)}%`],
          `可用性 = MTBF÷(MTBF＋MTTR) = ${mtbf}÷${mtbf + mttr}，即 ${correct}。`);
        break;
      }
      case 4: {
        const prefix = 23 + (variant % 7);
        const hosts = 2 ** (32 - prefix) - 2;
        add("A", number, "ネットワーク", "サブネット", `IPv4ネットワーク 10.${variant}.0.0/${prefix} で、通常ホストに割り当て可能なアドレス数は幾つか。`, hosts,
          [hosts + 2, Math.max(0, hosts - 2), 2 ** (32 - prefix - 1) - 2],
          `主机位为 ${32 - prefix} 位，共有 2^${32 - prefix} 个地址，扣除网络地址和广播地址后为 ${hosts}。`);
        break;
      }
      case 5: {
        const rows = 120 + variant * 7;
        const every = 3 + (variant % 6);
        const count = Math.floor(rows / every);
        add("A", number, "データベース", "SQL集約",
          `表Tにはidが1から${rows}までの${rows}行がある。SELECT COUNT(*) FROM T WHERE MOD(id, ${every}) = 0 の結果はどれか。`, count,
          [count + 1, count - 1, rows - count],
          `条件に合うのは ${every} 的倍数，共有 floor(${rows}÷${every}) = ${count} 行。`);
        break;
      }
      case 6: {
        const size = 17 + (variant % 13);
        const key = 100 + variant * 11;
        const index = key % size;
        add("A", number, "アルゴリズム", "ハッシュ法", `ハッシュ関数 h(k)=k mod ${size} を用いる。キー ${key} の格納位置はどれか。`, index,
          [(index + 1) % size, (index + 2) % size, size - index],
          `${key} 除以 ${size} 的余数是 ${index}，因此哈希位置为 ${index}。`);
        break;
      }
      case 7: {
        const a = 4 + (variant % 9);
        const b = 7 + (variant % 11);
        const c = 3 + (variant % 8);
        const d = 6 + (variant % 10);
        const critical = Math.max(a + b, c + d);
        add("A", number, "プロジェクトマネジメント", "クリティカルパス",
          `開始から終了までに並行する二つの経路があり、経路1の作業日数は ${a}日と${b}日、経路2は ${c}日と${d}日である。最短工期は何日か。`, critical,
          [a + b + c + d, Math.min(a + b, c + d), critical + 1],
          `并行路径中较长者决定工期。max(${a + b}, ${c + d}) = ${critical} 天。`);
        break;
      }
      case 8: {
        const scenario = variant + 1;
        add("A", number, "セキュリティ", "認証と暗号",
          `組織${scenario}が、通信相手の公開鍵が本人のものであることを第三者によって保証したい。この目的に最も適したものはどれか。`,
          "デジタル証明書", ["共通鍵", "ハッシュ値だけ", "バックアップ媒体"],
          "数字证书由可信认证机构把身份与公钥绑定，可用于确认通信对象及其公钥。" );
        break;
      }
      default: {
        const tx = variant + 1;
        add("A", number, "データベース", "ACID特性",
          `トランザクション${tx}の途中で障害が発生した。更新を全て取り消して開始前の状態に戻す性質はどれか。`,
          "原子性", ["一貫性", "独立性", "耐久性"],
          "原子性表示事务要么全部成功，要么全部撤销；发生故障时应回滚到开始前。" );
      }
    }
  }

  for (let i = 0; i < 882; i += 1) {
    const number = i + 1;
    const variant = Math.floor(i / 9);
    switch (i % 9) {
      case 0: {
        const start = 2 + variant;
        const end = start + 5 + (variant % 14);
        const sum = ((start + end) * (end - start + 1)) / 2;
        add("B", number, "アルゴリズム", "繰返しと合計",
          `次の処理の終了後、sumの値は幾つか。\n整数型: sum ← 0\nfor (iを${start}から${end}まで1ずつ増やす)\n  sum ← sum ＋ i\nendfor`,
          sum, [sum - end, sum + start, end - start + 1],
          `${start} 到 ${end} 的等差数列之和为 (${start}+${end})×${end - start + 1}÷2 = ${sum}。`);
        break;
      }
      case 1: {
        const outer = 3 + variant;
        const inner = 2 + (variant % 9);
        const count = outer * inner;
        add("B", number, "アルゴリズム", "二重ループ",
          `次の処理で count ← count ＋ 1 は何回実行されるか。\nfor (iを1から${outer}まで1ずつ増やす)\n  for (jを1から${inner}まで1ずつ増やす)\n    count ← count ＋ 1\n  endfor\nendfor`,
          count, [outer + inner, count - inner, count + outer],
          `内层每次执行 ${inner} 次，外层执行 ${outer} 次，总次数为 ${outer}×${inner}=${count}。`);
        break;
      }
      case 2: {
        const size = 64 + variant * 13;
        const comparisons = Math.ceil(Math.log2(size + 1));
        add("B", number, "アルゴリズム", "二分探索",
          `昇順に整列された${size}個の異なる要素から、存在しない値を二分探索する。比較回数の最大値はどれか。`,
          comparisons, [comparisons - 1, comparisons + 1, size],
          `未命中时不断把搜索区间减半，最大比较次数为 ceil(log2(${size}+1)) = ${comparisons}。`);
        break;
      }
      case 3: {
        const base = 10 + variant * 3;
        const values = [base, base + 2, base + 5, base + 9];
        const pops = 1 + (variant % 3);
        const top = values[values.length - 1 - pops];
        add("B", number, "データ構造", "スタック",
          `空のスタックに ${values.join("、")} の順でpushした後、popを${pops}回実行する。スタックの先頭要素はどれか。`,
          top, [values[0], values.at(-1), values[Math.min(2, values.length - 1)]],
          `栈是后进先出。弹出 ${pops} 个元素后，栈顶为 ${top}。`);
        break;
      }
      case 4: {
        const base = 20 + variant * 4;
        const values = [base, base + 1, base + 3, base + 6];
        const dequeues = 1 + (variant % 3);
        const front = values[dequeues];
        add("B", number, "データ構造", "キュー",
          `空のキューに ${values.join("、")} の順でenqueueした後、dequeueを${dequeues}回実行する。次にdequeueされる値はどれか。`,
          front, [values[0], values.at(-1), values[Math.max(0, dequeues - 1)]],
          `队列是先进先出。移除前 ${dequeues} 个元素后，下一个出队的是 ${front}。`);
        break;
      }
      case 5: {
        const factor = 3 + (variant % 9);
        const a = factor * (11 + variant);
        const b = factor * (7 + (variant % 4));
        function gcd(x, y) { while (y) [x, y] = [y, x % y]; return x; }
        const result = gcd(a, b);
        add("B", number, "アルゴリズム", "ユークリッドの互除法",
          `次の関数 gcd(${a}, ${b}) の戻り値はどれか。\nwhile (b ≠ 0)\n  r ← a mod b\n  a ← b\n  b ← r\nendwhile\nreturn a`,
          result, [factor, result + factor, Math.abs(a - b)],
          `不断用余数替换两个数，直到余数为0，最后的非零除数即最大公约数 ${result}。`);
        break;
      }
      case 6: {
        const values = [variant + 16, (variant * 3 + 5) % 31, (variant * 5 + 7) % 29];
        const xor = values.reduce((acc, value) => acc ^ value, 0);
        add("B", number, "アルゴリズム", "排他的論理和",
          `整数配列 {${values.join(", ")}} の全要素を順にXORした結果はどれか。`,
          xor, [xor ^ 1, (xor + 2) % 16, values.reduce((a, b) => a + b, 0)],
          `逐项异或：${values.map((v) => v.toString(2).padStart(4, "0")).join(" XOR ")}，结果为 ${xor}。`);
        break;
      }
      case 7: {
        const user = variant + 1;
        add("B", number, "情報セキュリティ", "最小権限",
          `利用者U${user}は日次集計ファイルの閲覧だけを担当する。最小権限の原則に最も適合する設定はどれか。`,
          "対象ファイルの読取り権限だけを付与する", ["管理者権限を付与する", "全共有フォルダの更新権限を付与する", "権限確認を省略する"],
          "最小权限原则要求只授予完成工作所必需的权限，因此仅给予目标文件的读取权限。" );
        break;
      }
      default: {
        const charA = String.fromCharCode(65 + (variant % 20));
        const charB = String.fromCharCode(70 + (variant % 15));
        const countA = 2 + variant;
        const countB = 3 + variant;
        const encoded = `${countA}${charA}${countB}${charB}`;
        add("B", number, "アルゴリズム", "ランレングス符号化",
          `同じ文字の連続数と文字を並べる方式で、文字列「${charA.repeat(countA)}${charB.repeat(countB)}」を符号化した結果はどれか。`,
          encoded, [`${charA}${countA}${charB}${countB}`, `${countA + countB}${charA}${charB}`, `${countB}${charA}${countA}${charB}`],
          `${charA} 连续 ${countA} 次、${charB} 连续 ${countB} 次，所以编码为 ${encoded}。`);
      }
    }
  }

  window.FE_SIMULATED_QUESTIONS = questions;
})();
