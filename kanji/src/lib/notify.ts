import { levelInfo } from "./level";
import { masteredCount, streak, type DailyStat, type UserProfile } from "./store";

export type WebhookKind = "discord" | "slack" | "other";

export function detectKind(url: string): WebhookKind {
  if (/discord(app)?\.com\/api\/webhooks\//.test(url)) return "discord";
  if (/hooks\.slack\.com\//.test(url)) return "slack";
  return "other";
}

export function kindLabel(kind: WebhookKind): string {
  if (kind === "discord") return "Discord";
  if (kind === "slack") return "Slack";
  return "そのほか";
}

/**
 * Webhook にメッセージを送る。
 * Discord は結果を読めるが、Slack など CORS を返さない相手には no-cors で投げるため
 * 「送ったけれど届いたかは分からない」= "sent" を返す。
 */
export async function sendWebhook(url: string, text: string): Promise<"ok" | "sent" | "error"> {
  const kind = detectKind(url);
  try {
    if (kind === "discord") {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
        keepalive: true, // アプリを閉じた直後でも送信を続けられるように
      });
      return response.ok ? "ok" : "error";
    }
    // Slack / IFTTT など: プリフライトを避けるため text/plain で投げる
    await fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body: JSON.stringify({ text, value1: text }),
      keepalive: true,
    });
    return "sent";
  } catch {
    return "error";
  }
}

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

function formatDay(day: string): string {
  const [, month, date] = day.split("-").map(Number);
  const weekday = WEEKDAYS[new Date(day).getDay()] ?? "";
  return `${month}/${date}(${weekday})`;
}

function formatMinutes(seconds: number): string {
  const minutes = Math.max(1, Math.round(seconds / 60));
  return `${minutes}分`;
}

/** ほごしゃに送る「1日のまとめ」の文面を作る。 */
export function buildDailySummary(user: UserProfile, day: string, stat: DailyStat): string {
  const info = levelInfo(user.xp);
  const rate = stat.questions > 0 ? Math.round((stat.correct / stat.questions) * 100) : 0;
  const lines = [
    `📗 かんじドリル ${formatDay(day)} ${user.emoji}${user.name}`,
    `・学習 ${formatMinutes(stat.seconds)} / ${stat.questions}問 / 正答率 ${rate}%`,
  ];
  if (stat.tests.length > 0) {
    lines.push(`・テスト: ${stat.tests.map((test) => `${test.title} ${test.score}点`).join("、")}`);
  }
  if (stat.wrong.length > 0) {
    lines.push(`・まちがえた漢字: ${stat.wrong.slice(0, 15).join(" ")}`);
  }
  lines.push(
    `・レベル${info.level}（${info.title}）・れんぞく${streak(user)}日・おぼえた${masteredCount(user)}字`,
  );
  return lines.join("\n");
}

export function sampleSummary(): string {
  return [
    "📗 かんじドリル 8/18(火) 🐼たろう",
    "・学習 12分 / 25問 / 正答率 84%",
    "・テスト: 4年生 第3回 テスト 90点",
    "・まちがえた漢字: 械 害 街",
    "・レベル5（かけだし）・れんぞく3日・おぼえた48字",
    "",
    "（これはテスト送信です）",
  ].join("\n");
}
