export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr]">
      <header className="p-4 border-b">
        <nav className="flex gap-4 text-sm">
          <a href="/admin/games" className="underline">
            Games
          </a>
          <a href="/admin/tournaments" className="underline">
            Tournaments
          </a>
        </nav>
      </header>
      <main className="p-6 max-w-3xl mx-auto">{children}</main>
    </div>
  );
}
