import Image from "next/image";
import { ADVISORS } from "@/data/home";

function AdvisorCard({ advisor }: { advisor: (typeof ADVISORS)[number] }) {
  return (
    <article className="dh-advisor">
      <div className="dh-advisor__photo">
        <Image src={advisor.photo} alt={advisor.name} width={112} height={112} />
      </div>
      <h3 className="dh-advisor__name">{advisor.name}</h3>
      <p className="dh-advisor__role">{advisor.role}</p>
    </article>
  );
}

export function BackedByCards() {
  return (
    <div className="dh-advisors">
      {ADVISORS.map((advisor) => <AdvisorCard key={advisor.name} advisor={advisor} />)}
    </div>
  );
}
