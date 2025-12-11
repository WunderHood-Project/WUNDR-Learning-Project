import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-wondergreen text-white border-t py-10 mt-10">
      <div className="flex flex-wrap justify-center text-lg gap-6 mb-4">
        <Link href="/donate" className="hover:underline">Support Us</Link>
        <Link href="/get-involved/partnership" className="hover:underline">Partner With Us</Link>
        <Link href="/volunteer" className="hover:underline">Volunteer</Link>
        <Link href="/faq" className="hover:underline">FAQ</Link>
        <Link href="/contact-us" className="hover:underline">Contact Us</Link>
      </div>
      <div className="border-t border-gray-200 pt-4 max-w-5xl mx-auto text-center text-white text-md">
        <p className="mb-3">WonderHood is a registered 501(c)(3) non-profit organization. All donations are tax-deductible to the fullest extent allowed by law.</p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 text-md md:text-md">
          <span>&copy; 2025 WonderHood. All rights reserved.</span>
          <a href="/privacy-policy" className="hover:underline">Privacy Policy</a>
          <a href="/terms" className="hover:underline">Terms of Service</a>
        </div>

        <div className="flex flex-row justify-center gap-4 mt-4">
          {/* FACEBOOK */}
          <Link
            href=''
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/socials/Facebook_Logo_Primary.png"
              alt="Facebook"
              className="w-6 h-6 hover:opacity-80 transition"
            />
          </Link>

          {/* INSTAGRAM */}
          <Link
            href=''
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/socials/Instagram_Glyph_Gradient.png"
              alt="Instagram"
              className="w-6 h-6 hover:opacity-80 transition"
            />
          </Link>

          {/* LINKEDIN */}
          <Link
            href=''
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/socials/InBug-White.png"
              alt="LinkedIn"
              className="w-6 h-6 hover:opacity-80 transition"
            />
          </Link>
        </div>
      </div>
    </footer>
  );
}
