export function SetupNotice() {
  return (
    <div className="setup-notice">
      <h2>Supabase ist noch nicht eingerichtet</h2>
      <p>
        Lege eine Datei <code>.env.local</code> im Projektordner an mit:
      </p>
      <pre>{`VITE_SUPABASE_URL=https://DEIN-PROJEKT.supabase.co
VITE_SUPABASE_ANON_KEY=DEIN-ANON-KEY`}</pre>
      <p>Details dazu stehen in der README.</p>
    </div>
  )
}
