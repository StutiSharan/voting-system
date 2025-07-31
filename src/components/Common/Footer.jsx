import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-indigo-700 text-white">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Branding */}
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold">VotingApp</h2>
          <p className="text-sm opacity-80">
            Your secure, transparent online voting platform.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-2">
          <h3 className="font-semibold">Quick Links</h3>
          <ul className="space-y-1 text-sm opacity-90">
            <li>
              <Link to="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link to="/elections" className="hover:underline">
                Elections
              </Link>
            </li>
            <li>
              <Link to="/profile" className="hover:underline">
                Profile
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div className="space-y-2">
          <h3 className="font-semibold">Get in Touch</h3>
          <p className="text-sm opacity-90">
            <Mail className="inline-block mr-2" size={16} />
            support@votingapp.com
          </p>
          <div className="flex gap-4 mt-2">
            <a href="https://facebook.com" aria-label="Facebook" className="hover:text-yellow-300">
              <Facebook size={20} />
            </a>
            <a href="https://twitter.com" aria-label="Twitter" className="hover:text-yellow-300">
              <Twitter size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-indigo-600/50 pt-4 text-center text-xs opacity-80">
        © {new Date().getFullYear()} VotingApp. All rights reserved.
      </div>
    </footer>
  );
}
