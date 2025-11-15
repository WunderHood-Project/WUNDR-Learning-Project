import Link from "next/link";
// import { FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-wondergreen text-white border-t py-10 mt-10">
      <div className="flex flex-wrap justify-center text-lg gap-6 mb-4">
        <Link href="/donate" className="hover:underline">Support Us</Link>
        <Link href="/finances-and-policies" className="hover:underline">Finances and Policies</Link>
        <Link href="/volunteer" className="hover:underline">Volunteer</Link>
        <Link href="/get-involved/partnership" className="hover:underline">Partner With Us</Link>
        <Link href="/contact" className="hover:underline">Contact Us</Link>
        <div className="flex justify-center gap-4 mb-2">
          {/* <a href="https://linkedin.com/-link" target="_blank" rel="noopener noreferrer">
              <FaLinkedin  className="w-6 h-6 hover:opacity-80" />
          </a>
          <a href="https://instagram.com/-link" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="w-6 h-6 hover:opacity-80" />
          </a>
          <a href="https://facebook.com/-link" target="_blank" rel="noopener noreferrer">
              <FaFacebook className="w-6 h-6 hover:opacity-80" />
          </a> */}
        </div>
      </div>
      <div className="border-t border-gray-200 pt-4 max-w-5xl mx-auto text-center text-white text-md">
        <p className="mb-3">WonderHood is a registered 501(c)(3) non-profit organization. All donations are tax-deductible to the fullest extent allowed by law.</p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 text-md md:text-md">
          <span>&copy; 2025 WonderHood. All rights reserved.</span>
          <a href="/privacy-policy" className="hover:underline">Privacy Policy</a>
          <a href="/terms" className="hover:underline">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
