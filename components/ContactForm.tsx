"use client";

import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import styles from "./ContactForm.module.css";

export type FormCopy = {
  name: string;
  company: string;
  email: string;
  inquiry: string;
  inquiryPlaceholder: string;
  workshop: string;
  message: string;
  submit: string;
  sending: string;
  success: string;
  error: string;
  required: string;
};

const WORKSHOPS = "Executive Workshops";

export function ContactForm({
  copy,
  inquiryTypes,
  workshopOptions,
}: {
  copy: FormCopy;
  inquiryTypes: string[];
  workshopOptions: string[];
}) {
  // ?inquiry=Executive%20Workshops (from the Workshops page) preselects the type.
  const params = useSearchParams();
  const fromUrl = params.get("inquiry") ?? "";
  const [inquiry, setInquiry] = useState(inquiryTypes.includes(fromUrl) ? fromUrl : "");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    setState("sending");
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean };
      if (res.ok && json.ok) {
        setState("sent");
        form.reset();
        setInquiry("");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className={styles.success} role="status">
        <p>{copy.success}</p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="cf-name">
            {copy.name} <span className={styles.req}>({copy.required.toLowerCase()})</span>
          </label>
          <input id="cf-name" name="name" type="text" autoComplete="name" required />
        </div>
        <div className={styles.field}>
          <label htmlFor="cf-company">{copy.company}</label>
          <input id="cf-company" name="company" type="text" autoComplete="organization" />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="cf-email">
          {copy.email} <span className={styles.req}>({copy.required.toLowerCase()})</span>
        </label>
        <input id="cf-email" name="email" type="email" autoComplete="email" required />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="cf-inquiry">
            {copy.inquiry} <span className={styles.req}>({copy.required.toLowerCase()})</span>
          </label>
          <select
            id="cf-inquiry"
            name="inquiry"
            required
            value={inquiry}
            onChange={(e) => setInquiry(e.target.value)}
          >
            <option value="" disabled>
              {copy.inquiryPlaceholder}
            </option>
            {inquiryTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {inquiry === WORKSHOPS && (
          <div className={styles.field}>
            <label htmlFor="cf-workshop">{copy.workshop}</label>
            <select id="cf-workshop" name="workshop" defaultValue={workshopOptions[0]}>
              {workshopOptions.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="cf-message">
          {copy.message} <span className={styles.req}>({copy.required.toLowerCase()})</span>
        </label>
        <textarea id="cf-message" name="message" rows={7} required />
      </div>

      {/* Honeypot: hidden from people, tempting to bots */}
      <div className={styles.hp} aria-hidden="true">
        <label htmlFor="cf-website">Website</label>
        <input id="cf-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={styles.actions}>
        <button type="submit" className="btn btn-primary" disabled={state === "sending"}>
          {state === "sending" ? copy.sending : copy.submit}
        </button>
        {state === "error" && (
          <p className={styles.error} role="alert">
            {copy.error}
          </p>
        )}
      </div>
    </form>
  );
}
