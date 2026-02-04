
export default function PrivacyPolicy() {
  return (
    <article className=" flex flex-col mx-auto max-w-3xl px-4 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-wondergreen">Privacy Policy – WonderHood</h1>
        <p className="text-md text-gray-600">
          <span className="font-medium">Effective date:</span> September 4, 2025 ·{" "}
          <span className="font-medium">Planned review by:</span> December 31, 2026
        </p>
        <p className="text-md text-gray-600">
          Contact:{" "}
          <a href="mailto:info@whproject.org" className="text-wondergreen hover:text-wonderleaf">
            info@whproject.org
          </a>
        </p>
        <p className="text-md text-gray-600">
          Organization: WonderHood, a 501(c)(3) nonprofit. We operate in the U.S. and process/store data in the U.S. only.
        </p>
      </header>

      <section className="space-y-3">
        <p>
          This Privacy Policy explains how WonderHood (“we,” “us,” “our”) collects, uses, discloses, and protects
          personal information when you use our website, register for programs and events, donate, or otherwise interact with us.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-wondergreen">1) Information We Collect</h2>
        <ul className="mt-2 list-disc pl-6 space-y-1 text-gray-800">
          <li><b>Account & profile</b>: name, email, city/state, (hashed) password, optional avatar.</li>
          <li><b>Child/participant</b> (provided by parent/guardian): first name, last name, preferred name, date of birth, grade, allergies/health notes for safety, emergency contact.</li>
          <li><b>Donations</b>: amount, date/time, donor contact; <b>we do not store full card/bank details</b>.</li>
          <li><b>Photos & media</b>: event photos/videos with consent.</li>
          <li><b>Technical</b>: IP, device/browser, cookies/localStorage, pages visited, timestamps.</li>
          <li><b>Waiver/consent records</b>: signature name, timestamp, version, acknowledgements (sections checked), and a copy of the waiver text as presented at signing. We may also store technical metadata (e.g., IP address and user-agent) at the time of signing for security and audit purposes.</li>
          <li><b>Communications</b>: emails/messages you send us and our operational communications with you (sent via Google Workspace / Gmail).</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-wondergreen">2) How We Use Information</h2>
        <ul className="mt-2 list-disc pl-6 space-y-1 text-gray-800">
          <li>Provide and improve our site, programs, and events.</li>
          <li>Register participants; manage rosters, reminders, and safety planning.</li>
          <li>Send confirmations, receipts, schedules, and optional announcements (with opt-in).</li>
          <li>Process donations and issue <b>tax acknowledgment receipts</b>.</li>
          <li>Protect safety, prevent abuse/fraud, and comply with laws.</li>
          <li>Report aggregated (non-identifying) metrics to donors/grantors.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-wondergreen">3) Legal Basis / Consent</h2>
        <p>
          We process information with your consent, to fulfill a request/registration/donation, and/or for legitimate nonprofit purposes
          such as participant safety and reporting. Children’s data is supplied by a parent/guardian (see §9).
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-wondergreen">4) Sharing & Service Providers</h2>
        <p className="mt-2">We do <b>not</b> sell personal information and we do not share it for targeted advertising.
                            We share information only with trusted service providers that help us operate our Services:</p>
        <ul className="mt-2 list-disc pl-6 space-y-1 text-gray-800">
          <li><b>Payments:</b> Stripe (donations/transactions processing).</li>
          <li><b>Database:</b> MongoDB Atlas (U.S. region).</li>
          <li><b>Document storage:</b> Google Cloud Storage (signed waiver PDFs and related records).</li>
          <li><b>Email/communications:</b> Google Workspace / Gmail (sending confirmations, notices, and administrative emails).</li>
          <li><b>Basic analytics:</b> limited, aggregated usage data to improve the site (no targeted advertising).</li>
        </ul>
        <p className="mt-2">These providers are bound by confidentiality and data processing terms. We may disclose information if required by law
    or to protect rights and safety. We do not disclose children’s information publicly.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-wondergreen">5) Payments & Donations</h2>
        <p className="mt-2">
          Payments are processed by <b>Stripe</b>. We <b>do not store</b> full card numbers or bank account numbers on our servers.
          We retain donation metadata (amount, date, donor contact) for receipts and nonprofit reporting.
          Donations are generally <b>non-refundable</b>. If you believe a payment was made by mistake (duplicate or wrong amount),
          email us within 7 days at <a href="mailto:info@whproject.org" className="text-wondergreen hover:text-wonderleaf">info@whproject.org</a>.
        </p>
        <p className="mt-2">
          <b>Tax acknowledgment:</b> we email a receipt including our EIN. If no goods or services were provided in exchange for your contribution,
          the donation may be tax-deductible under U.S. law. Required wording: “No goods or services were provided in exchange for this contribution.”
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-wondergreen">6) Cookies & Analytics</h2>
        <p className="mt-2">
          We use cookies/localStorage for login sessions, basic site functions, and aggregated analytics. You can control cookies in your browser;
          disabling some cookies may affect functionality. We do not use interest-based advertising cookies.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-wondergreen">7) Storage, Location & Security</h2>
        <ul className="mt-2 list-disc pl-6 space-y-1 text-gray-800">
          <li><b>Location:</b> we operate in the United States. Data is stored in MongoDB Atlas (U.S. region). Signed waiver PDFs are stored in Google Cloud Storage (U.S.). Operational emails are sent and stored via Google Workspace / Gmail.</li>
          <li><b>In transit:</b> HTTPS/TLS encryption.</li>
          <li><b>Access control:</b> limited to staff/volunteers on a need-to-know basis.</li>
          <li><b>Retention:</b> accounts — while active; event/registration records — up to 3 years; waiver/consent records (including signed waiver PDFs) — up to 7 years; donation/financial records — up to 7 years; media — until consent is withdrawn or content is retired. Then we delete or anonymize unless law requires longer.</li>
        </ul>
        <p className="mt-2">No method of transmission or storage is 100% secure, but we apply reasonable safeguards for a small nonprofit.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-wondergreen">8) Your Choices & Rights</h2>
        <ul className="mt-2 list-disc pl-6 space-y-1 text-gray-800">
          <li>Request access, correction, or deletion via <a href="mailto:info@whproject.org" className="text-wondergreen hover:text-wonderleaf">info@whproject.org</a>.</li>
          <li>Unsubscribe from emails via the link or by contacting us.</li>
          <li>Withdraw photo/media consent; we will stop future use and make reasonable efforts to remove past posts within our control.</li>
          <li>Manage cookies in your browser settings.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-wondergreen">9) Children’s Privacy</h2>
        <p className="mt-2">
          Accounts/registrations are created by a parent or legal guardian. We collect only the minimum information needed for safe participation.
          We do not knowingly collect personal information directly from children under 13 online without verifiable parental consent.
          Parents/guardians can review or delete their child’s information and withdraw participation at any time.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-wondergreen">10) International Users</h2>
        <p className="mt-2">We operate in the United States and store/process data in the U.S. only.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-wondergreen">11) Third-Party Links</h2>
        <p className="mt-2">Our site may link to third-party websites/services with their own privacy practices.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-wondergreen">12) Changes to This Policy</h2>
        <p className="mt-2">
          We may update this Policy from time to time. The “Effective date” reflects the latest version. If we make material changes,
          we will post an update on our site or contact you when appropriate. We plan to review this Policy no later than December 31, 2026.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-wondergreen">Contact Us</h2>
        <p className="mt-2">
          Email:{" "}
          <a href="mailto:info@whproject.org" className="text-wondergreen hover:text-wonderleaf">
            info@whproject.org
          </a>{" "}
        </p>
      </section>
    </article>
  );
}
