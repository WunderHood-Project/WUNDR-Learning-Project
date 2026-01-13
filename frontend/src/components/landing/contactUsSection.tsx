export default function ContactUsSection() {
  return (
    <section className="mb-14 sm:mb-16">
      <div className="mx-auto max-w-4xl rounded-2xl border border-wonderleaf/20 bg-white/60 p-6 sm:p-8 text-center backdrop-blur-sm">
        <p className="mb-3 sm:mb-4 text-sm sm:text-lg text-gray-600">
          Any questions? We&rsquo;d love to hear from you!
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 sm:flex-row">
          <a
            href="mailto:info@whproject.org"
            rel="noopener noreferrer"
            className="font-semibold text-wonderleaf transition-colors duration-300 hover:text-wondergreen"
          >
            info@whproject.org
          </a>
        </div>

      </div>
    </section>
  )
}
