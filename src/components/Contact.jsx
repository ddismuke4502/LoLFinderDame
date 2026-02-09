import React, { useMemo, useState } from "react";
import ModalShell from "./ModalShell";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); 

  const canSend = useMemo(() => {
    const nameOk = form.name.trim().length > 0;
    const msgOk = form.message.trim().length > 0;
    const emailOk = /\S+@\S+\.\S+/.test(form.email.trim());
    return nameOk && msgOk && emailOk;
  }, [form]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSend || status === "sending") return;

    try {
      setStatus("sending");

      // i can replace later with EmailJS
      await new Promise((r) => setTimeout(r, 800));

      console.log("Contact form submit", form);

      setStatus("success");
      setForm({ name: "", email: "", message: "" });

      setTimeout(() => setStatus("idle"), 2500);
    } catch (err) {
      console.error("Contact send failed:", err);
      setStatus("error");
    }
  };

  return (
    <ModalShell title="Contact">
      <form onSubmit={onSubmit} className="contactForm">
        <p className="contactHint">
          Send a message and I&apos;ll get back to you as soon as possible.
        </p>

        <div className="contactRow">
          <label className="contactField">
            <span className="contactLabel">Name</span>
            <input
              type="text"
              placeholder="Your name"
              required
              value={form.name}
              onChange={(e) => {
                setStatus("idle");
                setForm({ ...form, name: e.target.value });
              }}
            />
          </label>

          <label className="contactField">
            <span className="contactLabel">Email</span>
            <input
              type="email"
              placeholder="you@example.com"
              required
              value={form.email}
              onChange={(e) => {
                setStatus("idle");
                setForm({ ...form, email: e.target.value });
              }}
            />
          </label>
        </div>

        <label className="contactField">
          <span className="contactLabel">Message</span>
          <textarea
            rows="6"
            placeholder="What's up?"
            required
            value={form.message}
            onChange={(e) => {
              setStatus("idle");
              setForm({ ...form, message: e.target.value });
            }}
          />
        </label>

        <div className="contactActions">
          <div className="contactStatus" style={{ marginRight: 12 }}>
            {status === "sending" && <span>Sending...</span>}
            {status === "success" && <span>✅ Sent successfully!</span>}
            {status === "error" && <span>❌ Failed to send. Try again.</span>}
          </div>

          <button
            type="submit"
            className="btnPrimary"
            disabled={!canSend || status === "sending"}
            style={{ opacity: !canSend || status === "sending" ? 0.7 : 1 }}
          >
            {status === "sending" ? "Sending…" : "Send"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

export default Contact;