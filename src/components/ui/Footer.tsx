import { Radar } from "lucide-react";
import React from "react";


interface FooterProps {
  logo: React.ReactNode;
  brandName: string;
  socialLinks: Array<{
    icon: React.ReactNode;
    href: string;
    label: string;
  }>;
  mainLinks: Array<{
    href: string;
    label: string;
  }>;
  legalLinks: Array<{
    href: string;
    label: string;
  }>;
  copyright: {
    text: string;
    license?: string;
  };
}

export function Footer({
  logo,
  brandName,
  socialLinks,
  mainLinks,
  legalLinks,
  copyright,
}: FooterProps) {
  return (
    <footer className="pt-5 pb-4 border-t border-zinc-200 bg-white">
      <div className="w-full px-6 flex flex-col gap-3 text-[13px]">
        
        {/* Line 1: Brand & Navigation Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-zinc-100">
          <a
            href="/"
            className="flex items-center gap-1.5 font-bold text-zinc-900 hover:text-violet-600 transition-colors text-sm"
            aria-label={brandName}
          >
            {logo}
            <span>{brandName}</span>
          </a>

          <nav className="flex items-center gap-6">
            {mainLinks.map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="text-zinc-500 hover:text-violet-600 transition-colors font-semibold"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Line 2: Copyright & Socials/Legal Links */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-0.5">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-2 gap-y-1 text-zinc-400">
            <span>{copyright.text}</span>
            {copyright.license && (
              <>
                <span className="text-zinc-200 hidden sm:inline">•</span>
                <span className="text-zinc-400">{copyright.license}</span>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* Legal Links */}
            <div className="flex items-center gap-4">
              {legalLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  className="text-zinc-450 hover:text-zinc-700 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <span className="text-zinc-200 hidden sm:inline">|</span>

            {/* Socials */}
            <ul className="flex list-none space-x-2 p-0 m-0">
              {socialLinks.map((link, i) => (
                <li key={i}>
                  <a 
                    href={link.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="h-8 w-8 rounded-lg inline-flex items-center justify-center bg-zinc-50 text-zinc-450 hover:bg-zinc-100 hover:text-zinc-900 transition-all border border-zinc-150 shadow-sm"
                  >
                    {link.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default function AppFooter() {
  const socialLinks = [
    { 
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ), 
      href: "https://twitter.com", 
      label: "Twitter" 
    },
    { 
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
        </svg>
      ), 
      href: "https://github.com", 
      label: "GitHub" 
    },
    { 
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" clipRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      ), 
      href: "https://linkedin.com", 
      label: "LinkedIn" 
    },
  ];

  const mainLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/history", label: "Review" },
    { href: "/profile", label: "About" },
  ];

  const legalLinks = [
    { href: "#", label: "Privacy Policy" },
    { href: "#", label: "Terms of Service" },
  ];

  const copyright = {
    text: "© 2026 ReviewRadar Inc. All rights reserved.",
    license: "MIT License",
  };

  const logo = (
    <div className="flex items-center justify-center">
      <img src="/darkLogo.png" alt="ReviewRadar" className="w-16 h-12" />
    </div>
  );

  return (
    <Footer
      logo={logo}
      brandName="ReviewRadar"
      socialLinks={socialLinks}
      mainLinks={mainLinks}
      legalLinks={legalLinks}
      copyright={copyright}
    />
  );
}
