"use client";
import { useState } from "react";
import { AUDIENCES, AUDIENCE_ORDER, type Audience } from "./audiences";
import { VinylScene } from "./vinyl-scene";
import { NavItem } from "@/components/ui/nav-item";

export function DistributionHero() {
  // The turntable starts with no record; the selector and copy default to Buyer.
  const [audience, setAudience] = useState<Audience | null>(null);
  const shown = audience ?? "buyer";
  const active = AUDIENCES[shown];
  return <section className={`dh-hero dh-container dh-accent--${shown}`} aria-labelledby="distribution-title">
    <div className="dh-hero-top">
      <div className="dh-hero-intro">
        <h1 id="distribution-title">Full-stack AI Distribution Platform</h1>
        <p className="dh-hero-description">JazzHQ connects companies looking for AI with the vendors building it and the trusted partners who can sell, implement and support it.</p>
      </div>
      <VinylScene audience={audience} />
    </div>
    <div className="dh-records" aria-label="Choose your audience">
      {AUDIENCE_ORDER.map(key => {
        const item = AUDIENCES[key];
        return <button type="button" key={key} className={`dh-record dh-accent--${key}`} aria-pressed={shown === key} aria-controls="audience-detail" onClick={() => setAudience(key)}>
          <span className="dh-sleeve-art" aria-hidden="true"><span className="dh-disc"><span>{item.number}</span></span><span className="dh-sleeve"><span className="dh-ring" /></span></span>
          <span className="dh-record-name">{item.heading}</span>
          <span className="dh-record-arrow" aria-hidden="true">{shown === key ? "↗" : "+"}</span>
        </button>;
      })}
    </div>
    <div className="dh-audience-detail" id="audience-detail">
      <div aria-live="polite" aria-atomic="true"><p className="dh-audience-title">{active.proposition}</p><p className="dh-audience-description">{active.description}</p></div>
      <NavItem href={active.href} className="dh-primary-cta">{active.cta}<span aria-hidden="true">↗</span></NavItem>
    </div>
  </section>;
}
