import { useState } from "react";
import { levelInfo } from "../lib/level";
import { buildDailySummary, detectKind, kindLabel, sampleSummary, sendWebhook } from "../lib/notify";
import { dayKey, emptyDaily, type ParentSettings, type Store, type UserProfile } from "../lib/store";
import ScreenHeader from "./ScreenHeader";

interface Props {
  store: Store;
  onChange: (parent: ParentSettings) => void;
  onBack: () => void;
}

/** 直近7日ぶんの合計。 */
function lastWeek(user: UserProfile) {
  let questions = 0;
  let correct = 0;
  let seconds = 0;
  let tests = 0;
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const stat = user.daily[dayKey(date)];
    if (!stat) continue;
    questions += stat.questions;
    correct += stat.correct;
    seconds += stat.seconds;
    tests += stat.tests.length;
  }
  return { questions, correct, seconds, tests };
}

export default function ParentScreen({ store, onChange, onBack }: Props) {
  const { parent } = store;
  const [unlocked, setUnlocked] = useState(parent.pin === "");
  const [pinInput, setPinInput] = useState("");
  const [url, setUrl] = useState(parent.webhookUrl);
  const [newPin, setNewPin] = useState(parent.pin);
  const [message, setMessage] = useState<string | null>(null);

  if (!unlocked) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col gap-4 px-4 pt-8 pb-10">
        <ScreenHeader title="ほごしゃメニュー" onBack={onBack} />
        <p className="text-center text-base font-bold text-slate-400">4けたの数字を 入力してください</p>
        <input
          value={pinInput}
          onChange={(event) => setPinInput(event.target.value.replace(/\D/g, "").slice(0, 4))}
          inputMode="numeric"
          className="w-full rounded-2xl border-4 border-slate-200 px-5 py-4 text-center text-3xl font-black tracking-[0.5em] outline-none focus:border-blue-400"
        />
        <button
          type="button"
          onClick={() => {
            if (pinInput === parent.pin) setUnlocked(true);
            else setMessage("⚠️ 数字がちがいます");
          }}
          className="rounded-full bg-blue-600 px-6 py-4 text-xl font-black text-white active:bg-blue-700"
        >
          ひらく
        </button>
        {message && <p className="text-center text-base font-bold text-rose-600">{message}</p>}
      </div>
    );
  }

  const kind = detectKind(url);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 pt-6 pb-10">
      <ScreenHeader title="ほごしゃメニュー" onBack={onBack} />

      {message && (
        <p className="rounded-2xl bg-blue-50 px-5 py-4 text-base font-bold text-blue-700">{message}</p>
      )}

      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <p className="text-lg font-black text-slate-700">この1週間のようす</p>
        <div className="mt-3 grid gap-3">
          {store.users.map((user) => {
            const week = lastWeek(user);
            const today = user.daily[dayKey()] ?? emptyDaily();
            const info = levelInfo(user.xp);
            return (
              <div key={user.id} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-lg font-black text-slate-700">
                  {user.emoji} {user.name}
                  <span className="ml-2 text-sm font-bold text-blue-600">
                    レベル{info.level}・{info.title}
                  </span>
                </p>
                <p className="mt-1 text-base font-bold text-slate-500">
                  7日間: {week.questions}問・正答率{" "}
                  {week.questions > 0 ? Math.round((week.correct / week.questions) * 100) : 0}%・
                  テスト{week.tests}回・約{Math.round(week.seconds / 60)}分
                </p>
                <p className="text-sm font-bold text-slate-400">
                  きょう: {today.questions}問（正解 {today.correct}）
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-lg font-black text-slate-700">1日のまとめを 通知する</p>
          <button
            type="button"
            onClick={() => onChange({ ...parent, enabled: !parent.enabled })}
            className={`h-8 w-14 rounded-full transition ${parent.enabled ? "bg-emerald-500" : "bg-slate-300"}`}
          >
            <span
              className={`block h-6 w-6 rounded-full bg-white transition ${
                parent.enabled ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        </div>
        <p className="mt-2 text-sm font-bold text-slate-400">
          その日の学習を終えてアプリを閉じたときに、保護者のチャットへ1日1回まとめて送ります。
          送りそびれた日は、次に開いたときにまとめて送ります。
        </p>

        <label className="mt-4 block text-base font-black text-slate-600">
          Webhook の URL
          <input
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            onBlur={() => onChange({ ...parent, webhookUrl: url.trim() })}
            placeholder="https://discord.com/api/webhooks/..."
            autoComplete="off"
            autoCapitalize="off"
            className="mt-2 w-full rounded-2xl border-2 border-slate-200 px-4 py-3 font-mono text-sm outline-none focus:border-blue-400"
          />
        </label>
        <p className="mt-1 text-sm font-bold text-slate-400">
          種類: {kindLabel(kind)}
          {kind === "other" && url.trim() !== "" && "（Discord / Slack 以外は届いたか確認できません）"}
        </p>

        <button
          type="button"
          disabled={url.trim() === ""}
          onClick={async () => {
            onChange({ ...parent, webhookUrl: url.trim() });
            const result = await sendWebhook(url.trim(), sampleSummary());
            setMessage(
              result === "ok"
                ? "✅ 送信できました。保護者のチャットを確認してください"
                : result === "sent"
                  ? "📨 送信しました（届いたかはチャットで確認してください）"
                  : "⚠️ 送信できませんでした。URLを確認してください",
            );
          }}
          className="mt-4 w-full rounded-full bg-blue-600 px-6 py-4 text-lg font-black text-white active:bg-blue-700 disabled:opacity-40"
        >
          テスト送信する
        </button>

        {store.users.length > 0 && (
          <button
            type="button"
            disabled={url.trim() === ""}
            onClick={async () => {
              const user = store.users[0];
              const stat = user.daily[dayKey()] ?? emptyDaily();
              await sendWebhook(url.trim(), buildDailySummary(user, dayKey(), stat));
              setMessage("📨 きょうのまとめを送りました");
            }}
            className="mt-2 w-full rounded-full border-2 border-blue-200 px-6 py-3 text-base font-black text-blue-700 disabled:opacity-40"
          >
            きょうのまとめを 今すぐ送る（{store.users[0].name}）
          </button>
        )}
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <p className="text-lg font-black text-slate-700">Webhook URL の作り方</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-base font-bold text-slate-500">
          <li>スマホに Discord アプリを入れ、自分だけのサーバーを1つ作る</li>
          <li>チャンネル名の横の設定 →「連携サービス」→「ウェブフックを作成」</li>
          <li>「ウェブフックURLをコピー」して、上の欄に貼り付ける</li>
          <li>「テスト送信する」で届けば完了。Discord の通知をオンにしておく</li>
        </ol>
        <p className="mt-2 text-sm font-bold text-slate-400">
          Slack の Incoming Webhook でも同じように使えます。
        </p>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <p className="text-lg font-black text-slate-700">この画面のロック</p>
        <p className="mt-1 text-sm font-bold text-slate-400">
          4けたの数字を決めると、次からこの画面を開くときに必要になります（空にすると解除）
        </p>
        <input
          value={newPin}
          onChange={(event) => setNewPin(event.target.value.replace(/\D/g, "").slice(0, 4))}
          inputMode="numeric"
          placeholder="----"
          className="mt-3 w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-center text-2xl font-black tracking-[0.5em] outline-none focus:border-blue-400"
        />
        <button
          type="button"
          onClick={() => {
            onChange({ ...parent, pin: newPin });
            setMessage(newPin === "" ? "🔓 ロックを解除しました" : "🔒 ロックを設定しました");
          }}
          className="mt-3 w-full rounded-full bg-slate-800 px-6 py-3 text-base font-black text-white active:bg-slate-900"
        >
          ロックを 保存する
        </button>
      </section>
    </div>
  );
}
