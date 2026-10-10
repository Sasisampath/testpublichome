import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Sparkles } from "lucide-react";
import { AI_SUMMARY_LINKS, FOOTER_COMPANY, FOOTER_HELP, FOOTER_LEGAL, ROUTES } from "@/data/navigation";
import { NavItem } from "@/components/ui/nav-item";
import "./footer.css";

const SOCIAL_LINKS = [
  { href: "https://www.linkedin.com/company/getjazzhq/", icon: "/assets/footer/linkedin.svg", label: "LinkedIn" },
  { href: "https://www.instagram.com/getjazzhq/", icon: "/assets/footer/instagram.svg", label: "Instagram" },
  { href: "https://x.com/getjazzhq", icon: "/assets/footer/x.svg", label: "X" },
  { href: "https://www.youtube.com/@getjazzhq", icon: "/assets/footer/youtube.svg", label: "YouTube" },
  { href: "https://in.pinterest.com/getjazzhq/", icon: "/assets/footer/pinterest.svg", label: "Pinterest" },
] as const;

const TRUST_MARKS = [
  { src: "/assets/trust/iso-27001.png", alt: "ISO 27001" },
  { src: "/assets/trust/soc-2.png", alt: "SOC 2 Type I" },
  { src: "/assets/trust/gdpr.png", alt: "GDPR" },
] as const;

function LinkColumn({ title, links }: { title: string; links: typeof FOOTER_COMPANY }) {
  return (
    <div className="site-footer__col">
      <p className="site-footer__title">{title}</p>
      <ul role="list">
        {links.map((link) => (
          <li key={link.label}><NavItem href={link.href} className="site-footer__link">{link.label}</NavItem></li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <>
      <footer className="site-footer">
        <div className="site-footer__inner">
          <div className="site-footer__main">
            <div className="site-footer__brand">
              <Link href={ROUTES.home} className="site-footer__logo" aria-label="JazzHQ home">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/logo/jazzhq-white.svg" alt="JazzHQ" width={245} height={40} loading="lazy" />
              </Link>

              <p className="site-footer__follow">Follow us on</p>
              <div className="site-footer__social">
                {SOCIAL_LINKS.map(({ href, icon, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={icon} alt="" width={22} height={22} loading="lazy" />
                  </a>
                ))}
              </div>

              <ul className="site-footer__marks" role="list">
                {TRUST_MARKS.map((mark) => (
                  <li key={mark.alt}><Image src={mark.src} alt={mark.alt} width={60} height={60} /></li>
                ))}
              </ul>

              <address className="site-footer__address">8 The Green Dover, Delaware 19901, United States</address>
            </div>

            <div className="site-footer__nav">
              <LinkColumn title="Company" links={FOOTER_COMPANY} />
              <LinkColumn title="Help & Support" links={FOOTER_HELP} />
            </div>

            <div className="site-footer__ai">
              <p className="site-footer__title">Summarize with AI what JazzHQ does:</p>
              <div className="site-footer__ai-grid">
                {AI_SUMMARY_LINKS.map((item) => (
                  <NavItem key={item.label} href={item.href} className="site-footer__ai-btn">
                    <Sparkles size={20} strokeWidth={1.75} aria-hidden="true" />
                    <span>{item.label}</span>
                    <ChevronRight size={18} strokeWidth={2} aria-hidden="true" />
                  </NavItem>
                ))}
              </div>
            </div>
          </div>

          <div className="site-footer__bottom">
            <p>Copyright © JazzHQ Inc. {year}</p>
            <div className="site-footer__legal">
              {FOOTER_LEGAL.map((link) => (
                <NavItem key={link.label} href={link.href} className="site-footer__link">{link.label}</NavItem>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Final-scroll brand reveal: the wordmark is intentionally cropped by the page edge. */}
      <div className="site-wordmark" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/logo/jazzhq-wordmark.svg" alt="" loading="lazy" />
      </div>
    </>
  );
}
