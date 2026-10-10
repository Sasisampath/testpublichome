import Image from "next/image";
import { Reveal } from "@/components/home/reveal";

// Static content from the approved homepage design. Change items here only
// when the wording has been approved.
const CERTIFICATIONS = [
  { name: "ISO 27001", detail: "Information Security Management", badge: "/assets/trust/iso-27001.png" },
  { name: "SOC 2 Type I", detail: "Security Controls Audit Report", badge: "/assets/trust/soc-2.png" },
  { name: "GDPR", detail: "European Union data security law.", badge: "/assets/trust/gdpr.png" },
];

export function DataResponsibilitySection() {
  return (
    <section className="dh-trust dh-container" aria-labelledby="trust-title">
      <Reveal className="dh-section-head">
        <h2 id="trust-title">Your data. Our responsibility.</h2>
      </Reveal>

      <Reveal>
        <ul className="dh-trust__list">
          {CERTIFICATIONS.map((item) => (
            <li key={item.name} className="dh-trust__item">
              <Image src={item.badge} alt="" width={80} height={80} className="dh-trust__badge" />
              <span className="dh-trust__text">
                <span className="dh-trust__name">{item.name}</span>
                <span className="dh-trust__detail">{item.detail}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="dh-trust__note">
          <Image src="/assets/trust/shield.svg" alt="" width={18} height={18} />
          Independently audited. Continuously monitored. Built for enterprise trust.
        </p>
      </Reveal>
    </section>
  );
}
