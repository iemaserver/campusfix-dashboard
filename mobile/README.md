# CampusFix — Student Mobile App

A cross-platform (iOS + Android) Flutter app for **students** of the CampusFix / UEM–IEM
complaint-management system. It talks to the same Flask backend as the web dashboard
(`backend/`, served under `/campusfix/api`) and provides the full student experience:

- **Login** — OTP to your `@uem.edu.in` / `@iem.edu.in` email (primary), plus email + password
  sign-in / registration.
- **Report an issue** — pick a category, enter building/floor/room, describe it, and attach a
  photo (camera or gallery).
- **Dashboard** — live stats (total / pending / in-progress / resolved), month-over-month trend,
  resolution rate, and an "action required" centre for fixes awaiting your review.
- **Track complaints** — searchable, status-filterable list of your complaints.
- **Complaint details** — full status timeline with actor/time per step, photo lightbox, and
  inline **Accept fix** / **Reopen** actions.

## Architecture

```
lib/
  core/        env (base-URL + photo-URL helpers), constants, theme, formatting, ui helpers
  models/      app_user, complaint, dashboard_stats
  services/    api_client (dio), session_store (shared_preferences), auth + complaint services
  state/       auth_provider, complaints_provider  (provider / ChangeNotifier)
  widgets/     status_badge, complaint_card, dashboard_stat_card, category_avatar,
               gradient_button, accept_reopen_sheets
  screens/     welcome, login, home_shell, dashboard, report, track,
               complaint_details, profile, settings
```

The bearer token, cached user, and server URL are persisted with `shared_preferences`. Every
request carries `Authorization: Bearer <token>`; a `401` on a protected route logs you out.

## First-time setup (fresh clone)

You need **two things running** — the backend on your computer and the app on your phone — both on
the **same Wi-Fi network**.

**Prerequisites:** [Flutter SDK](https://docs.flutter.dev/get-started/install), plus the Android SDK
(for Android) and/or Xcode + CocoaPods (for iOS, macOS only). Verify with `flutter doctor`.

### Terminal 1 — start the backend (on the computer)

```bash
cd backend
python3 -m venv venv            # only if venv/ isn't there yet
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
PORT=8000 python app.py
```

You should see `Running on http://0.0.0.0:8000`. The `.env` (DB/SMTP config) is committed, so there's
nothing else to configure. Leave this running.

> **Why port 8000?** On macOS, AirPlay Receiver squats on port 5000 and will intercept the phone's
> requests. Any free port works — 8000 is just the convention used here. `HOST` defaults to `0.0.0.0`
> so devices on the LAN can reach it (set `HOST=127.0.0.1` to restrict to localhost).

**Find the computer's LAN IP** — the app needs it (yours will differ):

```bash
ipconfig getifaddr en0            # macOS (Wi-Fi)
hostname -I | awk '{print $1}'    # Linux
ipconfig                          # Windows → "IPv4 Address" under your Wi-Fi adapter
```

Example result: `192.168.1.42`.

### Terminal 2 — run the app on the phone

```bash
cd mobile
flutter pub get
flutter devices                 # confirm the phone is listed
flutter run                     # pick the phone if prompted
```

- **Android phone:** enable **Developer options → USB debugging**, connect USB, tap **Allow**.
- **iPhone:** open `ios/Runner.xcworkspace` in Xcode once to set a signing team (a free Apple ID
  works for development), then `flutter run`.

### Point the app at the backend (one time)

The built-in defaults only fit an emulator, so on a **physical phone** you set the address once — it's
saved on the device, no rebuild needed:

1. On the **Welcome** screen tap **⚙**, or after logging in go to **Profile → Server Settings**.
2. Enter `http://<YOUR_IP>:8000/campusfix/api` (e.g. `http://192.168.1.42:8000/campusfix/api`).
3. Tap **Test Connection** → it should say **“Connected.”**

Then log in with your `@uem.edu.in` / `@iem.edu.in` email. Done.

For reference, the per-platform defaults (used only if you never change the address):

| Target                | Default base URL                        |
| --------------------- | --------------------------------------- |
| Android emulator      | `http://10.0.2.2:5000/campusfix/api`    |
| iOS simulator / other | `http://127.0.0.1:5000/campusfix/api`   |

`10.0.2.2` is the Android emulator's alias for the host machine.

### Troubleshooting “Test Connection” fails

- Phone and computer on the **same Wi-Fi**? (Guest networks often block device-to-device traffic.)
- **macOS firewall:** System Settings → Network → Firewall → allow incoming for Python (or disable to test).
- Re-check the IP — laptops get a new one when they switch networks.

Cleartext HTTP is enabled for development (Android `usesCleartextTraffic`, iOS ATS arbitrary loads)
because the backend runs over plain HTTP locally. For a production HTTPS backend, tighten both.

## Build an installable APK

```bash
flutter build apk --release     # → build/app/outputs/flutter-apk/app-release.apk
flutter build apk --release --split-per-abi   # smaller, per-architecture (most phones: arm64-v8a)
flutter install                 # build + install to the connected device
flutter build ios               # iOS (requires a full Xcode install + signing)
```

Copy `app-release.apk` to the phone (Drive / email / USB) and tap it — accept **install from unknown
sources**. The same Settings step above applies after installing.

## Tests / analysis

```bash
flutter analyze
flutter test
```
