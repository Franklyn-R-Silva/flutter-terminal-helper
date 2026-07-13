// src/state/stores.ts
// =======================================
// Persistent stores for favorites and recent commands. Both are backed by a
// vscode.Memento-like object injected at construction, which keeps the logic
// pure and unit-testable with an in-memory fake.
// =======================================

import { type FlutterCommand } from "../data/flutter_commands_categorized";

/** Minimal subset of vscode.Memento we rely on (get/update). */
export interface KeyValueStore {
  get<T>(key: string, defaultValue: T): T;
  update(key: string, value: unknown): Thenable<void> | void;
}

const FAVORITES_KEY = "flutterHelper.favorites";
const RECENT_KEY = "flutterHelper.recent";

/** Commands are identified by their (trimmed) command string. */
function sameCommand(a: FlutterCommand, command: string): boolean {
  return a.command.trim() === command.trim();
}

/** Normalizes an arbitrary value into a FlutterCommand (defensive on read). */
function toCommand(value: unknown): FlutterCommand | null {
  if (
    value &&
    typeof (value as FlutterCommand).command === "string" &&
    typeof (value as FlutterCommand).label === "string"
  ) {
    const cmd = value as FlutterCommand;
    return {
      label: cmd.label,
      command: cmd.command,
      description: typeof cmd.description === "string" ? cmd.description : "",
    };
  }
  return null;
}

function readList(store: KeyValueStore, key: string): FlutterCommand[] {
  const raw = store.get<unknown[]>(key, []);
  return Array.isArray(raw)
    ? raw.map(toCommand).filter((c): c is FlutterCommand => c !== null)
    : [];
}

/** Toggle-able list of favorite commands, most-recently-added last. */
export class FavoritesStore {
  constructor(private readonly store: KeyValueStore) {}

  list(): FlutterCommand[] {
    return readList(this.store, FAVORITES_KEY);
  }

  has(command: string): boolean {
    return this.list().some((c) => sameCommand(c, command));
  }

  /** Adds the command if absent, removes it if present. Returns the new state. */
  async toggle(cmd: FlutterCommand): Promise<boolean> {
    const current = this.list();
    const exists = current.some((c) => sameCommand(c, cmd.command));
    const next = exists
      ? current.filter((c) => !sameCommand(c, cmd.command))
      : [...current, cmd];
    await this.store.update(FAVORITES_KEY, next);
    return !exists;
  }

  async remove(command: string): Promise<void> {
    const next = this.list().filter((c) => !sameCommand(c, command));
    await this.store.update(FAVORITES_KEY, next);
  }
}

/** Bounded MRU list of the commands the user has run/pasted. */
export class RecentStore {
  constructor(
    private readonly store: KeyValueStore,
    private readonly limit: number
  ) {}

  list(): FlutterCommand[] {
    if (this.limit <= 0) {
      return [];
    }
    return readList(this.store, RECENT_KEY).slice(0, this.limit);
  }

  /** Records a use: moves the command to the front, de-duplicated and capped. */
  async record(cmd: FlutterCommand): Promise<void> {
    if (this.limit <= 0) {
      return;
    }
    const rest = readList(this.store, RECENT_KEY).filter(
      (c) => !sameCommand(c, cmd.command)
    );
    const next = [cmd, ...rest].slice(0, this.limit);
    await this.store.update(RECENT_KEY, next);
  }

  async clear(): Promise<void> {
    await this.store.update(RECENT_KEY, []);
  }
}
