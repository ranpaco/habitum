import { Building2, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRegion } from "../context/RegionContext";

export function Footer() {
  const { region } = useRegion();

  return (
    <footer className="bg-[#0F3460] text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#16A8B8] to-white rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-[#0F3460]" />
              </div>
              <span className="text-xl font-semibold">Habitum</span>
            </div>
            <p className="text-white/70 mb-6 leading-relaxed">
              {region === "usa"
                ? "AI-powered HOA management for modern community associations across the United States."
                : "AI-powered condominium management for modern administrators in LatAm."
              }
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Product</h4>
            <ul className="space-y-3">
              <li><a href="#features" className="text-white/70 hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-white/70 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Integrations</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">API</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Roadmap</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-3">
              <li><a href="#about" className="text-white/70 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Stay Updated</h4>
            <p className="text-white/70 mb-4 text-sm">
              Subscribe to our newsletter for tips and updates
            </p>
            <div className="flex flex-col gap-3">
              <Input 
                type="email" 
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <Button className="bg-[#16A8B8] hover:bg-[#16A8B8]/90 text-white">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <div className="grid md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Mail className="w-5 h-5 text-[#16A8B8]" />
              <span className="text-white/70">contact@nameofyourapp.com</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Phone className="w-5 h-5 text-[#16A8B8]" />
              <span className="text-white/70">{region === "usa" ? "+1 (888) 123-4567" : "+58 412 XXX XXXX"}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <MapPin className="w-5 h-5 text-[#16A8B8]" />
              <span className="text-white/70">{region === "usa" ? "San Francisco, CA" : "Caracas, Venezuela"}</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8 text-center text-white/60 text-sm">
          <p>
            {region === "usa"
              ? "© 2026 Habitum. All rights reserved. Built for American HOAs and community associations."
              : "© 2026 Habitum. All rights reserved. Made with ❤️ for LatAm condominiums."
            }
          </p>
        </div>
      </div>
    </footer>
  );
}