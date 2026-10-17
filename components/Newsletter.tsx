"use client";

import React, { useState } from "react";
import { Mail, CheckCircle } from "lucide-react";

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <div className="p-space-lg rounded-xl bg-gradient-to-br from-surface-container-low via-surface-container to-surface-container-high border border-outline-variant/40 shadow-xl flex flex-col gap-space-md">
      <div className="flex items-center gap-space-sm">
        <div className="w-10 h-10 rounded-full bg-primary-container/20 border border-primary-container/40 flex items-center justify-center text-primary-fixed-dim">
          <Mail className="w-5 h-5 text-primary-container" />
        </div>
        <div className="flex flex-col">
          <span className="font-label-caps text-label-caps uppercase text-secondary tracking-wider">
            Midnight Wire
          </span>
          <h3 className="font-playfair text-headline-sm text-on-surface">
            CinePulse Intelligence
          </h3>
        </div>
      </div>

      <p className="font-body-sm text-body-sm text-on-surface-variant">
        Receive curated midnight dispatches, exclusive box office breakdowns, and insider festival festival wire directly to your inbox.
      </p>

      {subscribed ? (
        <div className="flex items-center gap-space-xs p-space-md rounded-lg bg-primary-container/20 border border-primary-container text-on-primary-container font-label-md">
          <CheckCircle className="w-5 h-5 text-primary-fixed-dim" />
          <span>You are subscribed to the Midnight Dispatch.</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-space-xs">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your executive email..."
            className="flex-grow px-space-md py-2.5 rounded-lg bg-surface-container-lowest border border-surface-container-highest text-on-surface placeholder:text-tertiary focus:outline-none focus:border-primary-container font-body-sm"
            required
          />
          <button
            type="submit"
            className="px-space-md py-2.5 rounded-lg bg-primary-container text-on-primary-container font-label-md text-label-md hover:bg-primary-container/90 transition-colors shadow-md shrink-0"
          >
            Subscribe Wire
          </button>
        </form>
      )}
    </div>
  );
};
