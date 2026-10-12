'use client';

/**
 * Footer subscribe form -> leadcapture (CF Worker + D1, shared across sites)
 */

import { useState, FormEvent } from 'react';

const ENDPOINT = 'https://leadcapture.pengarchersir.workers.dev/subscribe';

export default function SubscribeForm() {
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
    const hp = (form.elements.namedItem('company_website') as HTMLInputElement).value;
    setBusy(true);
    setMsg('Sending…');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, site: 'banana', source: window.location.pathname, hp }),
      });
      const data = await res.json();
      if (data.ok) {
        // keep the current locale prefix if there is one
        const m = window.location.pathname.match(/^\/(zh)(\/|$)/);
        window.location.href = m ? `/${m[1]}/subscribed` : '/subscribed';
      } else {
        setMsg('That didn\u2019t go through — mind trying again?');
      }
    } catch {
      setMsg('Network hiccup — try again in a moment.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-8 p-4 border border-gray-700 rounded-lg max-w-md">
      <p className="text-white font-semibold text-sm mb-1">What&apos;s new at PixBanana</p>
      <p className="text-gray-400 text-sm mb-3 leading-relaxed">
        New styles and engine upgrades, straight to your inbox. One email when something
        worth trying ships — that&apos;s all.
      </p>
      <form onSubmit={onSubmit} className="flex gap-2 flex-wrap">
        <input
          type="email"
          required
          name="email"
          placeholder="you@example.com"
          aria-label="Email address"
          autoComplete="email"
          className="flex-1 min-w-[200px] px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-100 text-sm"
        />
        <input
          type="text"
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }}
        />
        <button
          type="submit"
          disabled={busy}
          className="px-4 py-2 rounded-md bg-yellow-400 text-gray-900 text-sm font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {busy ? 'Sending…' : 'Keep me posted'}
        </button>
      </form>
      {msg && <p className="text-gray-500 text-xs mt-2">{msg}</p>}
    </div>
  );
}
