export default function Footer() {
  return (
    <footer className="border-t border-white/5 px-4 py-6 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-[var(--rr-muted)] sm:flex-row">
        <p>© {new Date().getFullYear()} ReviewRadar. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-[var(--rr-text)]">
            Privacy
          </a>
          <a href="#" className="hover:text-[var(--rr-text)]">
            Terms
          </a>
          <a href="#" className="hover:text-[var(--rr-text)]">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
