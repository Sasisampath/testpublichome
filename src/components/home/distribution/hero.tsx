"use client";
import { useState } from "react";
import { Button } from "@/components/Button/button";
import { AUDIENCES, AUDIENCE_ORDER, type Audience } from "./audiences";
import { VinylScene } from "./vinyl-scene";

export function DistributionHero() {
  const [audience, setAudience] = useState<Audience | null>(null);
  const active = AUDIENCES[audience ?? "buyer"];
  return <section className="dh-hero dh-container" aria-labelledby="distribution-title">
    <div className="dh-hero-top">
      <div className="dh-hero-intro">
        <p className="dh-positioning">Full Stack AI Distribution Platform</p>
        <h1 id="distribution-title">AI needs humans<br />to <em>deploy it.</em></h1>
        <p className="dh-hero-description">JazzHQ connects companies looking for AI with the vendors building it and the trusted partners who can sell, implement and support it.</p>
      </div>
      <VinylScene audience={audience} />
    </div>
    <div className="dh-path-heading"><h2>Choose your path</h2></div>
    <div className="dh-records" aria-label="Choose your audience">
      {AUDIENCE_ORDER.map(key => {
        const item = AUDIENCES[key];
        return <button type="button" key={key} className={`dh-record dh-record--${key}`} aria-pressed={audience === key} aria-controls="audience-detail" onClick={() => setAudience(key)}>
          <span className="dh-sleeve-art" aria-hidden="true"><span className="dh-disc"><span>{item.number}</span></span><span className="dh-sleeve"><span>JAZZHQ<br />AI DISTRIBUTION</span><span className="dh-ring" /><small>VOL. {item.number}</small></span></span>
          <span className="dh-record-copy"><span className="dh-record-name">{item.heading}</span><span className="dh-record-proposition">{item.proposition}</span></span>
          <span className="dh-record-arrow" aria-hidden="true">{audience === key ? "↗" : "+"}</span>
        </button>;
      })}
    </div>
    <div className="dh-audience-detail" id="audience-detail">
      <div aria-live="polite" aria-atomic="true"><p className="dh-audience-title">{active.proposition}</p><p className="dh-audience-description">{active.description}</p></div>
      <Button variant={active.variant} className="dh-primary-cta">{active.cta}<span aria-hidden="true">↗</span></Button>
    </div>
  </section>;
}
