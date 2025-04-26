import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-red-600 to-red-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Blood Donation System</h3>
            <p className="text-sm">
              Connecting donors and recipients to save lives through efficient blood donation management.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/About" className="text-sm hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/Donate" className="text-sm hover:underline">
                  Become a Donor
                </Link>
              </li>
              <li>
                <Link href="/request" className="text-sm hover:underline">
                  Request Blood
                </Link>
              </li>
              <li>
                <Link href="/Contact" className="text-sm hover:underline">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-sm">Email: support@blooddonation.org</p>
            <p className="text-sm">Phone: +1 (800) 123-4567</p>
            <p className="text-sm">Address: Skina Salazar Pungko-pungko Dapit</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-red-500 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Blood Donation System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}