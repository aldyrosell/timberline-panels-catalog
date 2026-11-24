"use client";

import { useId, useState } from "react";

type Status = "idle" | "submitting" | "subscribed" | "unconfigured" | "error";

export type NewsletterCopy = {
  placeholder: string;
  submitLabel: string;
  submittingLabel: string;
  success: string;
  unconfigured: string;
  error: string;
};

type NewsletterFormProps = NewsletterCopy & { endpoint: string };

export function NewsletterForm({
  endpoint,
  placeholder,
  submitLabel,
  submittingLabel,
  success,
  unconfigured,
  error,
}: NewsletterFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const emailId = useId();

  const messages: Partial<Record<Status, string>> = {
    subscribed: success,
    unconfigured,
    error,
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!endpoint) {
      setStatus("unconfigured");
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(event.currentTarget),
      });

      setStatus(response.ok ? "subscribed" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex items-stretch overflow-hidden rounded-[12px] border border-white/30 bg-white/10"
      >
        <label htmlFor={emailId} className="sr-only">
          {placeholder}
        </label>
        <input
          id={emailId}
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder={placeholder}
          className="min-h-[46px] min-w-0 flex-1 border-0 bg-transparent px-3.5 text-sm text-white placeholder:text-white/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="bg-gold-ink hover:bg-gold-hover min-h-[46px] flex-none px-[22px] text-sm font-semibold text-white disabled:opacity-70"
        >
          {status === "submitting" ? submittingLabel : submitLabel}
        </button>
      </form>

      {messages[status] ? (
        <p
          role="status"
          className={`mt-3 mb-0 text-[13px] ${
            status === "subscribed" ? "text-gold-soft" : "text-white/80"
          }`}
        >
          {messages[status]}
        </p>
      ) : null}
    </>
  );
}
