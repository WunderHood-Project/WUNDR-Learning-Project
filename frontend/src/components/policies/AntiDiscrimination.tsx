export default function AntiDiscriminationPolicy() {
  return (
    <article className="flex flex-col mx-auto max-w-3xl px-4 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-wondergreen">Anti-Discrimination Policy – WonderHood</h1>

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
          Organization: WonderHood, a 501(c)(3) nonprofit, Colorado, USA.
        </p>
      </header>

      <section className="space-y-3">
        <p>
          WonderHood is committed to providing a welcoming, inclusive, and safe environment for all participants, families,
          volunteers, partners, and community members.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-wondergreen">Non-Discrimination</h2>
        <p className="mt-2">
          WonderHood does not unlawfully discriminate in access to programs, events, services, volunteer opportunities, or
          communications based on any protected characteristic, including race, color, national origin, ancestry, ethnicity,
          religion or creed, sex, pregnancy, sexual orientation, gender identity or expression, age, disability, genetic
          information, marital status, or military or veteran status.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-wondergreen">Equal Access and Participation</h2>
        <p className="mt-2">
          We strive to ensure fair and respectful treatment for everyone involved in our programs. When possible, we make
          reasonable efforts to support access needs so participants can safely take part in activities.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-wondergreen">Reporting Concerns</h2>
        <p className="mt-2">
          If you believe you have experienced or witnessed discrimination or harassment related to WonderHood programs or
          services, please contact us at{" "}
          <a href="mailto:info@whproject.org" className="text-wondergreen hover:text-wonderleaf">
            info@whproject.org
          </a>
          . We review concerns promptly and take appropriate action.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-wondergreen">Updates</h2>
        <p className="mt-2">
          We may update this Policy from time to time. The “Effective date” reflects the most recent version.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-wondergreen">Contact Us</h2>
        <p className="mt-2">
          Email:{" "}
          <a href="mailto:info@whproject.org" className="text-wondergreen hover:text-wonderleaf">
            info@whproject.org
          </a>
        </p>
      </section>
    </article>
  );
}
