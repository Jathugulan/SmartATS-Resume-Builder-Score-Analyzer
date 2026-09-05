import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const GitHubIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FOOTER_LINKS = {
  Product: [
    { label: 'Features', to: '/features' },
    { label: 'Templates', to: '/templates' },
    { label: 'Pricing', to: '/pricing' },
    { label: 'How It Works', to: '/how-it-works' },
  ],
  Resources: [
    { label: 'Resume Guide', to: '/features' },
    { label: 'ATS Guide', to: '/how-it-works' },
    { label: 'Career Tips', to: '/templates' },
    { label: 'FAQ', to: '/pricing#faq' },
  ],
  Company: [
    { label: 'About', to: '/features' },
    { label: 'Contact', to: '/pricing' },
  ],
  Legal: [
    { label: 'Privacy Policy', to: '#' },
    { label: 'Terms of Service', to: '#' },
  ],
};

export default function PublicFooter() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <footer
      className={`border-t mt-auto ${isDark ? 'bg-slate-950 border-white/8' : 'bg-white border-slate-200'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Zap className="w-4 h-4 text-white" fill="currentColor" />
              </div>
              <span className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>
                Smart<span className="text-indigo-500">ATS</span>
              </span>
            </Link>
            <p className={`text-sm leading-relaxed mb-5 max-w-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Build Smart · Get Hired.<br />
              The AI-powered ATS Resume Builder & Score Analyzer trusted by professionals worldwide.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: GitHubIcon, href: '#', label: 'GitHub' },
                { icon: LinkedInIcon, href: '#', label: 'LinkedIn' },
                { icon: TwitterIcon, href: '#', label: 'Twitter' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                    isDark
                      ? 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/8'
                      : 'text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-bold tracking-widest uppercase mb-4"
                style={{ color: 'var(--text-secondary)' }}>
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className={`text-sm transition-colors ${
                        isDark
                          ? 'text-slate-400 hover:text-white'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className={`mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${
          isDark ? 'border-white/8' : 'border-slate-200'
        }`}>
          <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            © 2026 SmartATS. All rights reserved.
          </p>
          <p className={`text-xs ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
            ATS scores are estimates. Results may vary across different applicant tracking systems.
          </p>
        </div>
      </div>
    </footer>
  );
}
