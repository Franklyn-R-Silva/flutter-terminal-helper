// src/data/flutter_commands_categorized.ts
// =======================================
// Flutter/Dart commands grouped by category for the TreeView.
// Strings here are the English SOURCE for localization (vscode.l10n);
// Portuguese translations live in l10n/bundle.l10n.pt-br.json.
// =======================================

export interface FlutterCommand {
  /** Short label shown in the tree (not localized — command-like). */
  label: string;
  /** CLI command pasted/run in the terminal. */
  command: string;
  /** Localizable English description (tooltip + secondary text). */
  description: string;
}

export interface CommandCategory {
  /** Localizable English category name (with emoji). */
  name: string;
  /** Codicon id (https://microsoft.github.io/vscode-codicons/). */
  icon: string;
  commands: FlutterCommand[];
}

export const FLUTTER_COMMAND_CATEGORIES: CommandCategory[] = [
  {
    name: "🧹 Cleaning & Dependencies",
    icon: "trash",
    commands: [
      { label: "Clean", command: "flutter clean", description: "Remove build and temporary files" },
      { label: "Clean + Get", command: "flutter clean && flutter pub get", description: "Clean and fetch dependencies" },
      { label: "Pub Get", command: "flutter pub get", description: "Fetch all project dependencies" },
      { label: "Pub Upgrade", command: "flutter pub upgrade", description: "Upgrade all dependencies" },
      { label: "Pub Outdated", command: "flutter pub outdated", description: "Show outdated dependencies" },
      { label: "Pub Add", command: "flutter pub add ", description: "Add a new package (type the name)" },
      { label: "Pub Remove", command: "flutter pub remove ", description: "Remove a package (type the name)" },
      { label: "Cache Repair", command: "flutter pub cache repair", description: "Repair the Flutter package cache" },
      { label: "Cache Clean", command: "flutter pub cache clean", description: "Empty the Flutter package cache" },
    ],
  },
  {
    name: "🏗️ Build",
    icon: "package",
    commands: [
      { label: "Build APK", command: "flutter build apk", description: "Build the Android APK" },
      { label: "Build App Bundle", command: "flutter build appbundle", description: "Build the Android App Bundle (AAB)" },
      { label: "Build IPA", command: "flutter build ipa", description: "Build the iOS IPA file" },
      { label: "Build iOS", command: "flutter build ios", description: "Build the iOS app" },
      { label: "Build Web", command: "flutter build web", description: "Build the web app" },
      { label: "Build Windows", command: "flutter build windows", description: "Build the Windows app" },
      { label: "Build macOS", command: "flutter build macos", description: "Build the macOS app" },
      { label: "Build Linux", command: "flutter build linux", description: "Build the Linux app" },
      { label: "Build AAR", command: "flutter build aar", description: "Build an Android library (AAR)" },
    ],
  },
  {
    name: "▶️ Run",
    icon: "play",
    commands: [
      { label: "Run", command: "flutter run", description: "Run the app on the connected device" },
      { label: "Run on Chrome", command: "flutter run -d chrome", description: "Run on Chrome (web)" },
      { label: "Run on Windows", command: "flutter run -d windows", description: "Run on the Windows desktop" },
      { label: "Run on macOS", command: "flutter run -d macos", description: "Run on the macOS desktop" },
      { label: "Run on Linux", command: "flutter run -d linux", description: "Run on the Linux desktop" },
      { label: "Run Debug", command: "flutter run --debug", description: "Run in debug mode" },
      { label: "Run Profile", command: "flutter run --profile", description: "Run in profile mode" },
      { label: "Run Release", command: "flutter run --release", description: "Run in release mode" },
    ],
  },
  {
    name: "📱 Devices",
    icon: "device-mobile",
    commands: [
      { label: "List Devices", command: "flutter devices", description: "List connected devices" },
      { label: "List Emulators", command: "flutter emulators", description: "List available emulators" },
      { label: "Launch Emulator", command: "flutter emulators --launch Pixel_6", description: "Launch a specific emulator" },
      { label: "Create Emulator", command: "flutter emulators --create", description: "Create a new emulator" },
      { label: "Attach", command: "flutter attach", description: "Attach to a running Flutter app" },
      { label: "Logs", command: "flutter logs", description: "Show logs from the connected device" },
    ],
  },
  {
    name: "🧪 Test & Analyze",
    icon: "beaker",
    commands: [
      { label: "Test", command: "flutter test", description: "Run the Flutter tests" },
      { label: "Test with Coverage", command: "flutter test --coverage", description: "Run tests with coverage" },
      { label: "Analyze", command: "flutter analyze", description: "Analyze the project for issues" },
      { label: "Format", command: "dart format .", description: "Format all project files" },
      { label: "Dart Fix", command: "dart fix --apply", description: "Apply automatic Dart fixes" },
      { label: "Dart Test", command: "dart test", description: "Run the Dart tests" },
    ],
  },
  {
    name: "🧰 Configuration",
    icon: "tools",
    commands: [
      { label: "Doctor", command: "flutter doctor", description: "Check the Flutter install and environment" },
      { label: "Doctor Verbose", command: "flutter doctor -v", description: "Detailed doctor output" },
      { label: "Upgrade Flutter", command: "flutter upgrade", description: "Upgrade the Flutter SDK" },
      { label: "Stable Channel", command: "flutter channel stable", description: "Switch to the stable channel" },
      { label: "Beta Channel", command: "flutter channel beta", description: "Switch to the beta channel" },
      { label: "Enable Web", command: "flutter config --enable-web", description: "Enable web support" },
      { label: "Precache", command: "flutter precache", description: "Download binary artifacts for target platforms" },
    ],
  },
  {
    name: "🎯 Dart",
    icon: "code",
    commands: [
      { label: "Dart Run", command: "dart run", description: "Run a Dart script" },
      { label: "Dart Pub Get", command: "dart pub get", description: "Fetch Dart dependencies" },
      { label: "Dart Analyze", command: "dart analyze", description: "Analyze the Dart code" },
      { label: "Dart Format", command: "dart format .", description: "Format all Dart files" },
      { label: "Compile EXE", command: "dart compile exe ", description: "Compile to a native executable (type the file)" },
      { label: "Compile JS", command: "dart compile js ", description: "Compile to JavaScript (type the file)" },
      { label: "DevTools", command: "dart devtools", description: "Launch Dart DevTools" },
    ],
  },
  {
    name: "📦 Project",
    icon: "folder",
    commands: [
      { label: "Create Project", command: "flutter create my_app", description: "Create a new Flutter project" },
      { label: "Recreate Platforms", command: "flutter create .", description: "Recreate the platform folders" },
      { label: "Create for Platforms", command: "flutter create --platforms=android,ios .", description: "Create for specific platforms" },
      { label: "Create Package", command: "flutter create --template=package ", description: "Create a Dart package (type the name)" },
      { label: "Create Plugin", command: "flutter create --template=plugin ", description: "Create a Flutter plugin (type the name)" },
    ],
  },
  {
    name: "⚙️ Code Generation",
    icon: "gear",
    commands: [
      { label: "Build Runner Build", command: "dart run build_runner build --delete-conflicting-outputs", description: "Generate code (build_runner)" },
      { label: "Build Runner Watch", command: "dart run build_runner watch --delete-conflicting-outputs", description: "build_runner watch mode" },
      { label: "Build Runner Clean", command: "dart run build_runner clean", description: "Clean the build_runner cache" },
      { label: "Generate Localization", command: "flutter gen-l10n", description: "Generate the localization files (l10n)" },
    ],
  },
  {
    name: "🔥 Firebase",
    icon: "flame",
    commands: [
      { label: "FlutterFire Configure", command: "flutterfire configure", description: "Configure Firebase for Flutter" },
      { label: "Activate FlutterFire CLI", command: "dart pub global activate flutterfire_cli", description: "Activate the FlutterFire CLI" },
      { label: "Firebase Login", command: "firebase login", description: "Log in to Firebase" },
      { label: "Firebase Init", command: "firebase init", description: "Initialize Firebase in the project" },
      { label: "Firebase Deploy", command: "firebase deploy", description: "Deploy to Firebase Hosting" },
    ],
  },
  {
    name: "🔍 Info",
    icon: "info",
    commands: [
      { label: "Flutter Version", command: "flutter --version", description: "Show the Flutter version" },
      { label: "Dart Version", command: "dart --version", description: "Show the Dart version" },
      { label: "Flutter Help", command: "flutter --help", description: "Show the Flutter help" },
    ],
  },
];
