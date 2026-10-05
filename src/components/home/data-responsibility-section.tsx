import { ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/home/reveal";

// Static, approved content only: the same compliance statement as the top
// banner. Add items here only when their wording has been approved.
const CERTIFICATIONS = [
  { name: "ISO 27001", status: "Compliant" },
  { name: "SOC 2 Type I", status: "Compliant" },
];

export function DataResponsibilitySection() {
  return (
    <section className="dh-trust dh-container" aria-labelledby="trust-title">
      <Reveal className="dh-trust__copy">
        <h2 id="trust-title">Your data.<br />Our responsibility.</h2>
        <p>JazzHQ is ISO 27001 and SOC 2 Type I Compliant.</p>
      </Reveal>

      <Reveal>
        <ul className="dh-trust__list">
          {CERTIFICATIONS.map((item) => (
            <li key={item.name} className="dh-trust__item">
              <span className="dh-trust__icon" aria-hidden="true"><ShieldCheck size={26} strokeWidth={1.8} /></span>
              <span className="dh-trust__name">{item.name}</span>
              <span className="dh-trust__status">{item.status}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
