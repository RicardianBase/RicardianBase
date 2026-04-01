import { ArrowRight } from "lucide-react";

const columns = [
  { title: "Product", links: ["Features", "Pricing", "Security", "Integrations"] },
  { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
  { title: "Resources", links: ["Documentation", "Help Center", "Community", "Webinars"] },
  { title: "Legal", links: ["Privacy", "Terms", "Cookie Policy", "Licenses"] },
];

const socials = ["X", "Li", "Gh", "Dr"];

const RicardianFooter = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10">
          {/* Logo & newsletter */}
          <div className="col-span-2">
            <h3 className="text-xl font-semibold text-gray-900">RicardianBase</h3>
            <p className="text-sm text-gray-500 mt-3 leading-relaxed max-w-xs">
              The modern platform for smart contracts, escrow, and milestone-based payments.
            </p>

            {/* Newsletter */}
            <div className="mt-6 flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 text-sm bg-white border border-gray-200 rounded-l-full px-4 py-2.5 outline-none focus:border-gray-400 transition-colors"
              />
              <button className="bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-r-full hover:bg-gray-800 transition-colors flex items-center gap-1">
                Subscribe <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} RicardianBase. All rights reserved.</p>
          <div className="flex gap-3">
            {socials.map((s) => (
              <a
                key={s}
                href="#"
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-xs text-gray-500 hover:bg-gray-100 transition-colors"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default RicardianFooter;
