# 🎲 Spiele-Tracker (Anja & Valentin)

Eine kleine Spaß-Webseite, um Spieleabende zu dokumentieren: Spiele anlegen,
Ergebnisse eintragen, Dashboard-Übersicht, Gesamtwertung und Notizen.

Gebaut mit React + Vite, Daten liegen in einer kostenlosen Supabase-Datenbank
(damit ihr beide dieselben Spielstände seht, egal von welchem Gerät aus),
gehostet kostenlos über GitHub Pages.

## 1. Supabase-Projekt anlegen (einmalig, kostenlos)

1. Auf [supabase.com](https://supabase.com) ein kostenloses Konto anlegen und
   ein neues Projekt erstellen (Name frei wählbar, z.B. "spiele-tracker").
2. Im Projekt links auf **SQL Editor** gehen, den Inhalt von
   [`supabase/schema.sql`](supabase/schema.sql) einfügen und ausführen.
   Das legt die Tabellen für Spiele, Partien, Punkte und Notizen an.
3. Links auf **Project Settings → Data API** gehen und dort kopieren:
   - **Project URL** (sieht aus wie `https://xxxxx.supabase.co`)
   - **anon public** Key (ein langer String)

   Diese zwei Werte braucht die App.

## 2. Lokal ausprobieren

```
npm install
```

Datei `.env.local` im Projektordner anlegen:

```
VITE_SUPABASE_URL=https://DEIN-PROJEKT.supabase.co
VITE_SUPABASE_ANON_KEY=DEIN-ANON-KEY
```

Dann:

```
npm run dev
```

Die Seite läuft dann lokal unter `http://localhost:5173`.

## 3. Auf GitHub veröffentlichen (kostenlos, keine Domain nötig)

1. Ein neues GitHub-Repository erstellen (öffentlich oder privat, beides
   funktioniert mit GitHub Pages bei einem privaten Account mit Pro/Team,
   öffentlich ist am einfachsten für ein privates Konto).
2. Dieses Projekt dort hinpushen:

   ```
   git remote add origin https://github.com/DEIN-USERNAME/DEIN-REPO.git
   git add -A
   git commit -m "Initial commit"
   git push -u origin main
   ```

3. Im Repo unter **Settings → Pages** bei "Build and deployment" die Quelle
   auf **GitHub Actions** stellen.
4. Im Repo unter **Settings → Secrets and variables → Actions** zwei
   Repository-Secrets anlegen (mit genau diesen Namen):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

   (dieselben Werte wie oben aus Supabase).
5. Bei jedem Push auf `main` baut eine GitHub Action die Seite automatisch
   und veröffentlicht sie unter `https://DEIN-USERNAME.github.io/DEIN-REPO/`.
   Den Fortschritt seht ihr im Repo unter dem Tab **Actions**.

Das war's – die Seite ist dann für euch beide unter derselben URL erreichbar,
mit denselben Spielständen, kostenlos.

## Funktionen

- **Dashboard** – Übersicht: Anzahl Spiele, gespielte Partien, Siege pro
  Person, letzte Partien.
- **Spiele** – Spiele anlegen (inkl. Regel "höher gewinnt" oder "niedriger
  gewinnt") und pro Spiel Ergebnisse eintragen.
- **Gesamtwertung** – Siege pro Person über alle Spiele hinweg, pro Spiel
  aufgeschlüsselt.
- **Notizen** – freie Notizen, z.B. Hausregeln oder lustige Momente.

## Ein neues Spiel später hinzufügen

Einfach auf der Seite **Spiele** über das Formular "Neues Spiel anlegen" –
kein Code nötig.
