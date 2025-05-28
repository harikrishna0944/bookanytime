import React from "react";
import { Link } from "react-router-dom";
import { 
  FaFacebook as Facebook, 
  FaTwitter as Twitter, 
  FaInstagram as Instagram,
  FaLinkedin as Linkedin,
  FaHome as Home,
  FaEnvelope as Envelope,
  FaPhone as Phone,
  FaMapMarkerAlt as MapPin
} from "react-icons/fa";

function Footer() {
  return (
    <footer style={{ backgroundColor: '#212529', color: '#fff', padding: '40px 0', width: '100%', margin: '0' }}>
      <div style={{ maxWidth: '100%', margin: '0 auto' }}>
        <div className="row text-center text-md-start px-3 px-md-5">
          {/* Column 1 - Brand Info */}
          <div className="col-md-3 mb-4 mb-md-0">
            <h4 className="text-lg font-semibold mb-4 text-white font-poppins text-decoration-none">BookAnyTime</h4>
            <p className="text-white-50 mb-3">
              Find and book the perfect accommodation or venue for any occasion. From hotels to farmhouses, we've got you covered.
            </p>
            <div className="flex space-x-8">
              <a href="#" className="text-white-50 text-decoration-none">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white-50 text-decoration-none">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white-50 text-decoration-none">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white-50 text-decoration-none">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          {/* Column 2 - Quick Links */}
          <div className="col-md-2 mb-4 mb-md-0">
            <h5 className="text-lg font-semibold mb-4 text-white font-poppins">Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-white-50 text-decoration-none">Home</Link></li>
              <div className="mt-1 mb-2"></div>
              <li><Link to="/search" className="text-white-50 text-decoration-none">Search</Link></li>
              <div className="mt-1 mb-2"></div>
              <li><Link to="/list-property" className="text-white-50 text-decoration-none">List Property</Link></li>
              <div className="mt-1 mb-2"></div>
              <li><Link to="/wishlist" className="text-white-50 text-decoration-none">Wishlist</Link></li>
              <div className="mt-1 mb-2"></div>
              <li><Link to="/about" className="text-white-50 text-decoration-none">About Us</Link></li>
            </ul>
          </div>

          {/* Column 3 - Property Types */}
          <div className="col-md-3 mb-4 mb-md-0">
            <h5 className="text-lg font-semibold mb-4 text-white font-poppins">Property Types</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/search?type=hotel" className="text-white-50 text-decoration-none">
                  Hotels
                </Link>
              </li>
              <div className="mt-1 mb-2"></div>
              <li>
                <Link to="/search?type=farmhouse" className="text-white-50 text-decoration-none">
                  Farmhouses
                </Link>
              </li>
              <div className="mt-1 mb-2"></div>
              <li>
                <Link to="/search?type=banquet" className="text-white-50 text-decoration-none">
                  Banquet Halls
                </Link>
              </li>
              <div className="mt-1 mb-2"></div>
              <li>
                <Link to="/search?type=service-apartment" className="text-white-50 text-decoration-none">
                  Service Apartments
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Contact Us */}
          <div className="col-md-4 mb-4 mb-md-0">
            <h5 className="text-lg font-semibold mb-4 text-white font-poppins">Contact Us</h5>
            <ul className="list-unstyled">
              <li className="flex items-start mb-2">
                <MapPin size={20} className="text-white-50 mr-2 mt-1" />
                <span className="text-white-50">
                  123 Booking Street, Delhi, India
                </span>
              </li>
              <li className="flex items-center mb-2">
                <Phone size={20} className="text-white-50 mr-2" />
                <span className="text-white-50">+91 98765 43210</span>
              </li>
              <li className="flex items-center">
                <Envelope size={20} className="text-white-50 mr-2" />
                <span className="text-white-50">info@bookanytime.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Horizontal Line */}
        <hr className="my-4 bg-white-50" style={{ borderColor: '#6c757d' }} />

        {/* Footer Bottom */}
        <div className="row mt-4 mx-0">
          <div className="col-md-6 text-center text-md-start">
            <small className="text-white-50">&copy; {new Date().getFullYear()} BookAnytime. All rights reserved.</small>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <Link to="/privacy" className="text-white-50 text-decoration-none mx-2">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-white-50 text-decoration-none mx-2">
              Terms of Service
            </Link>
            <Link to="/faq" className="text-white-50 text-decoration-none mx-2">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;