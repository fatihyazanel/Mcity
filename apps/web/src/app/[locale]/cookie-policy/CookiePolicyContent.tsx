"use client";

import Link from "next/link";

export default function CookiePolicyContent({ locale }: { locale: string }) {
  function resetConsent() {
    localStorage.removeItem("cookie_consent");
    window.location.reload();
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2 text-gradient">Cookie Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: 1 April 2026</p>

      {/* ── 1. What Are Cookies ── */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">1. What Are Cookies?</h2>
        <p className="text-gray-700 leading-relaxed">
          Cookies are small text files placed on your device when you visit a
          website. They are widely used to make websites work, improve
          performance, and provide personalised information and advertising.
        </p>
      </section>

      {/* ── 2. How We Use Cookies ── */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. How We Use Cookies</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          m.city uses the following categories of cookies:
        </p>

        <div className="space-y-4">
          {/* Necessary */}
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-green-600 font-bold text-lg">✓</span>
              <h3 className="font-semibold text-gray-900">
                Strictly Necessary Cookies
              </h3>
              <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                Always Active
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Essential for the website to function. They include session
              management, security, and cart functionality. They cannot be
              disabled.
            </p>
            <table className="mt-3 w-full text-xs text-gray-600 border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-1 pr-4">Cookie Name</th>
                  <th className="text-left py-1 pr-4">Provider</th>
                  <th className="text-left py-1">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-1 pr-4 font-mono">cookie_consent</td>
                  <td className="py-1 pr-4">m.city</td>
                  <td className="py-1">1 year</td>
                </tr>
                <tr>
                  <td className="py-1 pr-4 font-mono">cart</td>
                  <td className="py-1 pr-4">m.city</td>
                  <td className="py-1">Session</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Analytics */}
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-blue-600 font-bold text-lg">📊</span>
              <h3 className="font-semibold text-gray-900">Analytics Cookies</h3>
              <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                Optional
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Help us understand how visitors interact with the website by
              collecting and reporting information anonymously. We use Google
              Analytics 4.
            </p>
            <table className="mt-3 w-full text-xs text-gray-600 border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-1 pr-4">Cookie Name</th>
                  <th className="text-left py-1 pr-4">Provider</th>
                  <th className="text-left py-1">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-1 pr-4 font-mono">_ga</td>
                  <td className="py-1 pr-4">Google Analytics</td>
                  <td className="py-1">2 years</td>
                </tr>
                <tr>
                  <td className="py-1 pr-4 font-mono">_ga_*</td>
                  <td className="py-1 pr-4">Google Analytics</td>
                  <td className="py-1">2 years</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-2 text-xs text-gray-500">
              Google Privacy Policy:{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-blue-600"
              >
                policies.google.com/privacy
              </a>
            </p>
          </div>

          {/* Marketing */}
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-purple-600 font-bold text-lg">📣</span>
              <h3 className="font-semibold text-gray-900">
                Marketing / Advertising Cookies
              </h3>
              <span className="ml-auto text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                Optional
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Used to display relevant advertising and track campaign
              effectiveness. We use Meta (Facebook) Pixel.
            </p>
            <table className="mt-3 w-full text-xs text-gray-600 border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-1 pr-4">Cookie Name</th>
                  <th className="text-left py-1 pr-4">Provider</th>
                  <th className="text-left py-1">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-1 pr-4 font-mono">_fbp</td>
                  <td className="py-1 pr-4">Meta (Facebook)</td>
                  <td className="py-1">3 months</td>
                </tr>
                <tr>
                  <td className="py-1 pr-4 font-mono">_fbc</td>
                  <td className="py-1 pr-4">Meta (Facebook)</td>
                  <td className="py-1">2 years</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-2 text-xs text-gray-500">
              Meta Privacy Policy:{" "}
              <a
                href="https://www.facebook.com/privacy/policy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-purple-600"
              >
                facebook.com/privacy/policy
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ── 3. Managing Cookies ── */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">3. Managing Your Cookies</h2>
        <p className="text-gray-700 leading-relaxed mb-3">
          You can change your cookie preferences at any time by clicking the
          button below — it will reopen the consent banner.
        </p>
        <button
          onClick={resetConsent}
          className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          ⚙️ Open Cookie Settings
        </button>
        <p className="mt-4 text-gray-700 leading-relaxed">
          You can also control cookies through your browser settings. Note that
          disabling cookies may affect website functionality. For more
          information visit{" "}
          <a
            href="https://www.aboutcookies.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-600 hover:text-blue-800"
          >
            aboutcookies.org
          </a>
          .
        </p>
      </section>

      {/* ── 4. Third-Party Cookies ── */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          4. Third-Party Cookies &amp; Links
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Our website contains links to third-party websites and affiliate
          partner links (e.g. Etsy). These third parties may set their own
          cookies when you click their links. We have no control over these
          cookies and suggest you review the relevant third party&apos;s cookie
          policy.
        </p>
      </section>

      {/* ── 5. Changes ── */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          5. Changes to This Policy
        </h2>
        <p className="text-gray-700 leading-relaxed">
          We may update this Cookie Policy from time to time. The date at the
          top of the page will reflect the latest revision.
        </p>
      </section>

      {/* ── 6. Contact ── */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">6. Contact Us</h2>
        <p className="text-gray-700 leading-relaxed">
          Questions about this Cookie Policy? Email us at{" "}
          <a
            href="mailto:privacy@m.city"
            className="underline text-blue-600 hover:text-blue-800"
          >
            privacy@m.city
          </a>
          .
        </p>
      </section>

      <hr className="my-8 border-gray-200" />
      <Link
        href={`/${locale}`}
        className="text-sm text-gray-500 hover:text-gray-700"
      >
        ← Back to Home
      </Link>
    </main>
  );
}
