import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Building2, Users, Heart } from "lucide-react";

export function LifestyleShowcase() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#0F3460] mb-4">
            Built for American Communities
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Habitum understands the unique challenges of HOA and COA management across the United States.
            From compliance complexity to property value protection, we've got you covered.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Card 1 - Suburban Communities */}
          <div className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all">
            <div className="aspect-[4/5] relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxzdWJ1cmJhbiUyMGhvbWVzJTIwbmVpZ2hib3Job29kfGVufDF8fHx8MTc3MzI4MDU5M3ww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Suburban American neighborhood homes"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A365D] via-[#1A365D]/60 to-transparent"></div>

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Diverse Communities</h3>
                <p className="text-white/90 text-sm">
                  Managing single-family HOAs, townhome communities, and luxury condominiums across the USA
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 - Happy Homeowners */}
          <div className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all">
            <div className="aspect-[4/5] relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGZhbWlseSUyMGFtZXJpY2FuJTIwaG9tZXxlbnwxfHx8fDE3NzMyODA1OTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Happy American family at home"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#16A8B8] via-[#16A8B8]/60 to-transparent"></div>

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Happy Homeowners</h3>
                <p className="text-white/90 text-sm">
                  Transparent communication and instant self-service create thriving, valuable communities
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 - Property Value Focus */}
          <div className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all">
            <div className="aspect-[4/5] relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob21lJTIwZXh0ZXJpb3J8ZW58MXx8fHwxNzczMjM3NzgxfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Modern American home exterior"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D3748] via-[#2D3748]/60 to-transparent"></div>

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Property Value Protection</h3>
                <p className="text-white/90 text-sm">
                  From small boards to enterprise associations, we scale with your needs
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Banner */}
        <div className="bg-gradient-to-r from-[#1A365D] via-[#16A8B8] to-[#1A365D] rounded-2xl p-12 text-white shadow-2xl">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">800+</div>
              <div className="text-white/80">Communities Managed</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">75K+</div>
              <div className="text-white/80">Happy Homeowners</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">96%</div>
              <div className="text-white/80">Assessment Collection Rate</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">65%</div>
              <div className="text-white/80">Admin Time Saved</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
