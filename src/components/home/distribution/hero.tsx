"use client";
import { useState } from "react";
import { AUDIENCES, AUDIENCE_ORDER, type Audience } from "./audiences";
import { NavItem } from "@/components/ui/nav-item";
import { VinylIcon } from "@/components/ui/vinyl-icon";

export function DistributionHero() {
  const [shown, setAudience] = useState<Audience>("buyer");
  const active = AUDIENCES[shown];
  return <section className={`dh-hero dh-container dh-accent--${shown}`} aria-labelledby="distribution-title">
    <div className="dh-hero-top">
      <div className="dh-hero-intro">
        <h1 id="distribution-title">Full-stack AI Distribution Platform</h1>
      </div>
    </div>
    <div className="dh-records" aria-label="Choose your audience">
      {AUDIENCE_ORDER.map(key => {
        const item = AUDIENCES[key];
        return <button type="button" key={key} className={`dh-record dh-accent--${key}`} aria-pressed={shown === key} aria-controls="audience-detail" onClick={() => setAudience(key)}>
          <VinylIcon journey={key} size={54} />
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
