import type { Store, UserProfile } from "./store";

const FORMAT = "kanji-drill-backup";

interface BackupFile {
  format: typeof FORMAT;
  version: 2;
  exportedAt: string;
  users: UserProfile[];
}

export function backupText(store: Store): string {
  const file: BackupFile = {
    format: FORMAT,
    version: 2,
    exportedAt: new Date().toISOString(),
    users: store.users,
  };
  return JSON.stringify(file, null, 2);
}

export function backupFileName(): string {
  const now = new Date();
  const date = `${now.getFullYear()}-${`${now.getMonth() + 1}`.padStart(2, "0")}-${`${now.getDate()}`.padStart(2, "0")}`;
  return `かんじドリル-バックアップ-${date}.json`;
}

/** バックアップの中身を読み取る。おかしければ null を返す。 */
export function parseBackup(text: string): UserProfile[] | null {
  try {
    const parsed = JSON.parse(text) as Partial<BackupFile>;
    if (parsed.format !== FORMAT || !Array.isArray(parsed.users)) return null;
    const users = parsed.users.filter(
      (user) => typeof user?.id === "string" && typeof user?.name === "string",
    );
    return users.length > 0 ? users : null;
  } catch {
    return null;
  }
}

/**
 * 読みこんだユーザーを今の記録に合わせる。
 * 同じユーザー（idが同じ）は、けいけんちが多いほう＝進んでいるほうを残す。
 */
export function mergeUsers(store: Store, incoming: UserProfile[]): { store: Store; added: number; updated: number } {
  let added = 0;
  let updated = 0;
  const users = [...store.users];
  for (const user of incoming) {
    const index = users.findIndex((item) => item.id === user.id);
    if (index === -1) {
      users.push(user);
      added += 1;
    } else if (user.xp >= users[index].xp) {
      users[index] = user;
      updated += 1;
    }
  }
  return {
    store: { ...store, users, currentUserId: store.currentUserId ?? users[0]?.id ?? null },
    added,
    updated,
  };
}

/** ブラウザに「このデータを勝手に消さないで」とお願いする。 */
export async function requestPersistentStorage(): Promise<boolean> {
  try {
    if (!navigator.storage?.persist) return false;
    if (await navigator.storage.persisted()) return true;
    return await navigator.storage.persist();
  } catch {
    return false;
  }
}

export async function isStoragePersisted(): Promise<boolean> {
  try {
    return (await navigator.storage?.persisted?.()) ?? false;
  } catch {
    return false;
  }
}

/** バックアップを共有シート（iPad/iPhone）またはダウンロードで受け取る。 */
export async function saveBackupFile(text: string): Promise<"shared" | "downloaded"> {
  const fileName = backupFileName();
  const file = new File([text], fileName, { type: "application/json" });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: "かんじドリルのバックアップ" });
      return "shared";
    } catch {
      // 共有をやめたときはダウンロードに切りかえる
    }
  }
  const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return "downloaded";
}
