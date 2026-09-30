import Image from "next/image";
import { PillButton } from "@/components/ui/pill-button";
import { Reveal } from "@/components/home/reveal";

const PHOTOS = [
  { src: "/assets/jazzclub/cinematic/room-14.webp", alt: "JazzHQ community members together at a JazzClub event", className: "dh-club-photo--a" },
  { src: "/assets/jazzclub/cinematic/room-01.webp", alt: "Members connecting at a JazzClub community event", className: "dh-club-photo--b" },
  { src: "/assets/jazzclub/cinematic/room-03.webp", alt: "Conversations and connections in the JazzHQ community", className: "dh-club-photo--c" },
];

export function JazzClubClose() {
  return <section className="dh-club" aria-labelledby="club-title">
    <div className="dh-club-inner dh-container">
      <Reveal className="dh-club-copy">
        <h2 id="club-title">Still not sure?<br />Meet us at the next<br /><span>JazzClub event</span></h2>
        <p>We regularly host meetups across 15+ cities. Come and experience what it is like to be part of the world&rsquo;s #1 AI community.</p>
        <div className="dh-club-stat"><strong>15+</strong><span>cities</span></div>
        <PillButton>Find the Next JazzClub</PillButton>
      </Reveal>
      <div className="dh-club-photos">
        {PHOTOS.map((photo) => (
          <figure key={photo.src} className={`dh-club-photo ${photo.className}`}>
            <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 767px) 80vw, 34vw" className="object-cover" />
          </figure>
        ))}
      </div>
    </div>
  </section>;
}
