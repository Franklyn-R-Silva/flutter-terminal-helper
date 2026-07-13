// src/data/commandsRepository.ts
// =======================================
// Loads and validates the command catalog. Centralizes fault tolerance:
// malformed entries are dropped instead of breaking the whole tree, and
// an empty/invalid catalog raises a clear error the UI can surface.
// =======================================

import {
  FLUTTER_COMMAND_CATEGORIES,
  type CommandCategory,
  type FlutterCommand,
} from "./flutter_commands_categorized";

function isValidCommand(cmd: unknown): cmd is FlutterCommand {
  return (
    !!cmd &&
    typeof (cmd as FlutterCommand).label === "string" &&
    typeof (cmd as FlutterCommand).command === "string" &&
    (cmd as FlutterCommand).command.trim().length > 0
  );
}

function sanitizeCategory(category: CommandCategory): CommandCategory | null {
  if (!category || typeof category.name !== "string") {
    return null;
  }
  const commands = Array.isArray(category.commands)
    ? category.commands.filter(isValidCommand)
    : [];
  if (commands.length === 0) {
    return null;
  }
  return {
    name: category.name,
    icon:
      typeof category.icon === "string" && category.icon
        ? category.icon
        : "circle-outline",
    commands,
  };
}

/** English key (localized in CommandItem) for the user-defined category. */
export const CUSTOM_CATEGORY_NAME = "⭐ Custom Commands";

/**
 * Builds a category from user-provided commands (e.g. the
 * `flutterHelper.customCommands` setting). Invalid entries are dropped;
 * returns null when nothing valid remains, so callers can simply skip it.
 */
export function buildCustomCategory(raw: unknown): CommandCategory | null {
  const commands = Array.isArray(raw) ? raw.filter(isValidCommand) : [];
  if (commands.length === 0) {
    return null;
  }
  return {
    name: CUSTOM_CATEGORY_NAME,
    icon: "star-full",
    commands: commands.map((cmd) => ({
      label: cmd.label,
      command: cmd.command,
      description:
        typeof cmd.description === "string" && cmd.description
          ? cmd.description
          : cmd.command.trim(),
    })),
  };
}

/**
 * Loads the categories. Async so the source can later come from disk/network
 * without changing callers, and so the UI can show a loading state. Any valid
 * `customCommands` are appended as a trailing "Custom" category.
 * Throws when the catalog is missing or every entry is invalid.
 */
export async function loadCommandCategories(
  customCommands: unknown = []
): Promise<CommandCategory[]> {
  const source = FLUTTER_COMMAND_CATEGORIES;

  if (!Array.isArray(source) || source.length === 0) {
    throw new Error("Command catalog is empty or unavailable.");
  }

  const categories = source
    .map(sanitizeCategory)
    .filter((c): c is CommandCategory => c !== null);

  if (categories.length === 0) {
    throw new Error("No valid commands found in the catalog.");
  }

  const custom = buildCustomCategory(customCommands);
  if (custom) {
    categories.push(custom);
  }

  return categories;
}
