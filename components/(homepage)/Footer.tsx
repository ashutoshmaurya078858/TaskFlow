import { Sparkles, Mail } from "lucide-react";

import {
  FaGithub,
  FaTwitter,
  FaYoutube,
  FaLinkedin
} from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-white font-bold text-base">FlowTask</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs mb-5">
              The modern project management tool for teams that value speed, clarity, and craftsmanship.
            </p>
            <div className="flex items-center gap-3">
              {[FaTwitter, FaLinkedin, FaGithub, FaYoutube, Mail].map((Icon, i) => (
                <button key={i} className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors">
                  <Icon className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </div>

          {[
            { title: "Product",   links: ["Features", "Integrations", "Changelog", "Roadmap", "Status"] },
            { title: "Company",   links: ["About", "Blog", "Careers", "Press", "Contact"] },
            { title: "Resources", links: ["Docs", "API Reference", "Community", "Support", "Privacy"] },
          ].map(col => (
            <div key={col.title}>
              <p className="text-white text-xs font-bold uppercase tracking-widest mb-4">{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map(l => (
                  <li key={l}>
                    <a href="#" className="text-sm hover:text-white transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">© {new Date().getFullYear()} FlowTask Inc. All rights reserved.</p>
          <div className="flex gap-6 text-xs">
            {["Terms", "Privacy", "Cookies", "Security"].map(l => (
              <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}