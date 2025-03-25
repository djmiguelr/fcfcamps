'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { Calendar, MapPin, Trophy, Users, Star, Zap, Award, Heart, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { YouTubeBackground } from "@/components/youtube-background";
import { CountdownTimer } from "@/components/countdown-timer";
import { FloatingBalls } from "@/components/floating-balls";
import { AnimatedNumber } from "@/components/animated-number";
import { TestimonialSlider } from "@/components/testimonial-slider";
import { CategoriesSection } from "@/components/categories-section";
import { BenefitCard } from "@/components/benefit-card";
import type { FC } from 'react';

interface PageProps {}

interface BallPosition {
  top: string;
  left: string;
  delay: string;
  duration: string;
  scale: string;
}

const Page: FC<PageProps> = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Bogotá");
  const [ballPositions, setBallPositions] = useState<BallPosition[]>([]);

  useEffect(() => {
    const positions = Array.from({ length: 10 }, () => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${15 + Math.random() * 20}s`,
      scale: `${0.5 + Math.random() * 0.5}`,
    }));
    setBallPositions(positions);
  }, []);

  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden min-h-screen">
        <YouTubeBackground videoId="s-LnYw8I-Ys" />
        <div className="container relative z-10 mx-auto px-4 py-32 text-center">
          <FloatingBalls />
          
          <div className="animate-bounce mb-4">
            <div className="inline-block bg-gradient-to-r from-yellow-500 to-yellow-300 text-blue-900 font-bold px-6 py-3 rounded-full text-sm md:text-base transform rotate-2 shadow-lg">
              ¡CUPOS LIMITADOS!
            </div>
          </div>

          <div className="mb-6 transform hover:scale-105 transition-transform duration-500">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-lg mb-8">
              <span className="text-yellow-400 animate-pulse">PREPÁRATE</span> PARA
            </h1>
            <div className="flex flex-col items-center justify-center mb-8">
              {/* Imagen para escritorio */}
              <div className="hidden md:block w-[1200px] h-[350px] relative">
                <Image
                  src="/logo-camps-escritorio.png"
                  alt="FCF Camps 2025"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              {/* Imagen para móvil */}
              <div className="md:hidden w-[600px] h-[697px] relative mx-auto">
                <Image
                  src="/logo-camps-movil.png"
                  alt="FCF Camps 2025"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-24 -right-6 animate-spin-slow text-yellow-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a4.2 4.2 0 0 0-3 1.2L12 12" />
                  <path d="M12 2a4.2 4.2 0 0 1 3 1.2L12 12" />
                  <path d="M12 22a4.2 4.2 0 0 0 3-1.2L12 12" />
                  <path d="M12 22a4.2 4.2 0 0 1-3-1.2L12 12" />
                  <path d="M2 12h10" />
                  <path d="M22 12h-10" />
                </svg>
              </div>
            </div>
          </div>

          <p className="mb-8 max-w-3xl mx-auto text-xl md:text-2xl text-white drop-shadow-md animate-fade-in">
            ¡Separa tu cupo ahora y vive una experiencia inolvidable con los mejores entrenadores de fútbol!
          </p>

          <div className="mb-10">
            <CountdownTimer targetDate="2025-07-15T00:00:00" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-yellow-500 to-yellow-300 hover:from-yellow-400 hover:to-yellow-200 text-blue-900 font-bold text-lg px-10 py-8 rounded-xl transform hover:scale-110 transition-all duration-300 shadow-xl"
              onClick={() => {
                document.getElementById("categorias")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              ¡RESERVA TU CUPO AHORA!
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-blue-600/80 hover:bg-blue-700 text-white border-white px-10 py-8 rounded-xl transform hover:scale-110 transition-all duration-300 shadow-xl font-bold"
              onClick={() => {
                document.getElementById("beneficios")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              CONOCE MÁS
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats-section" className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-blue-800/50 rounded-xl p-6 transform hover:scale-105 transition-transform duration-300 backdrop-blur-sm">
              <AnimatedNumber value={500} suffix="+" />
              <p className="text-yellow-300 font-medium">Niños Felices</p>
            </div>
            <div className="bg-blue-800/50 rounded-xl p-6 transform hover:scale-105 transition-transform duration-300 backdrop-blur-sm">
              <AnimatedNumber value={20} suffix="+" />
              <p className="text-yellow-300 font-medium">Entrenadores Pro</p>
            </div>
            <div className="bg-blue-800/50 rounded-xl p-6 transform hover:scale-105 transition-transform duration-300 backdrop-blur-sm">
              <AnimatedNumber value={5} suffix=" años" />
              <p className="text-yellow-300 font-medium">De Experiencia</p>
            </div>
            <div className="bg-blue-800/50 rounded-xl p-6 transform hover:scale-105 transition-transform duration-300 backdrop-blur-sm">
              <AnimatedNumber value={100} suffix="%" />
              <p className="text-yellow-300 font-medium">Diversión Garantizada</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="relative bg-gradient-to-b from-blue-600 to-blue-800 py-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-blue-700 to-transparent"></div>

        {/* Animated soccer balls in background */}
        <div className="absolute inset-0 overflow-hidden">
          {ballPositions.map((position, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                top: position.top,
                left: position.left,
                animationDelay: position.delay,
                animationDuration: position.duration,
                opacity: 0.1,
                transform: `scale(${position.scale})`,
              }}
            >
              <Image src="/placeholder.svg?height=100&width=100" alt="Soccer ball" width={100} height={100} />
            </div>
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 transform hover:scale-105 transition-transform duration-500">
            <div className="inline-block bg-yellow-400 text-blue-900 font-bold px-4 py-2 rounded-lg text-sm mb-4 transform -rotate-2">
              ¡LO MEJOR PARA TU CAMPEÓN!
            </div>
            <h2 className="text-center text-4xl md:text-5xl font-bold mb-4 text-white">
              UNA <span className="text-yellow-400">EXPERIENCIA ÚNICA</span> PARA TU CAMPEÓN
            </h2>
            <div className="w-24 h-1 bg-red-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BenefitCard
              icon={<Trophy className="h-12 w-12 text-yellow-400" />}
              title="Entrena como la selección Colombia"
              description="Entrenamiento con miembros del cuerpo técnico de la selección Colombia."
              color="bg-gradient-to-br from-red-500 to-red-600"
            />
            <BenefitCard
              icon={<Users className="h-12 w-12 text-yellow-400" />}
              title="Nuevos Amigos"
              description="Conoce a otros niños apasionados por el fútbol y forma amistades para toda la vida."
              color="bg-gradient-to-br from-blue-700 to-blue-800"
            />
            <BenefitCard
              icon={<Star className="h-12 w-12 text-yellow-400" />}
              title="Valores de la selección Colombia"
              description="Disciplina, respeto, pasión, trabajo en equipo y superación."
              color="bg-gradient-to-br from-red-500 to-red-600"
            />
            <BenefitCard
              icon={<Zap className="h-12 w-12 text-yellow-400" />}
              title="Actividades Divertidas"
              description="Juegos, competencias y actividades diseñadas para aprender mientras te diviertes."
              color="bg-gradient-to-br from-blue-700 to-blue-800"
            />
            <BenefitCard
              icon={<Award className="h-12 w-12 text-yellow-400" />}
              title="Premios y Reconocimientos"
              description="Todos los participantes reciben medallas, certificados y premios especiales."
              color="bg-gradient-to-br from-red-500 to-red-600"
            />
            <BenefitCard
              icon={<Heart className="h-12 w-12 text-yellow-400" />}
              title="Experiencia Inolvidable"
              description="Momentos únicos que tu hijo recordará toda la vida."
              color="bg-gradient-to-br from-blue-700 to-blue-800"
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <CategoriesSection />



      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 transform hover:scale-105 transition-transform duration-500">
            <div className="inline-block bg-blue-600 text-white font-bold px-4 py-2 rounded-lg text-sm mb-4 transform -rotate-2">
              TESTIMONIOS
            </div>
            <h2 className="text-center text-4xl md:text-5xl font-bold mb-4 text-blue-800">
              LO QUE <span className="text-red-600">DICEN LOS PADRES</span>
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <TestimonialSlider />
        </div>
      </section>

      {/* Camp Details Section */}
      <section className="py-20 bg-gradient-to-b from-blue-600 to-blue-800 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full -translate-y-1/2 translate-x-1/2 opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500 rounded-full translate-y-1/2 -translate-x-1/2 opacity-20 blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 transform hover:scale-105 transition-transform duration-500">
            <div className="inline-block bg-yellow-400 text-blue-900 font-bold px-4 py-2 rounded-lg text-sm mb-4 transform rotate-2">
              INFORMACIÓN IMPORTANTE
            </div>
            <h2 className="text-center text-4xl md:text-5xl font-bold mb-4 text-white">
              DETALLES DEL <span className="text-yellow-400">CAMPAMENTO</span>
            </h2>
            <div className="w-24 h-1 bg-red-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start gap-4 bg-blue-700/50 p-6 rounded-xl transform hover:scale-105 transition-transform duration-300 backdrop-blur-sm">
                <Calendar className="h-12 w-12 text-yellow-400 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-yellow-300">Fechas</h3>
                  <p className="text-lg">Bogotá: 16 AL 21 JUNIO (Semana 1), 23 AL 28 JUNIO (Semana 2), 14 AL 19 JULIO (Semana 3)</p>
                  <p className="text-lg">Barranquilla: 23 AL 28 JUNIO (Semana 1), 30 JUNIO AL 5 JULIO (Semana 2)</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-blue-700/50 p-6 rounded-xl transform hover:scale-105 transition-transform duration-300 backdrop-blur-sm">
                <MapPin className="h-12 w-12 text-yellow-400 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-yellow-300">Ubicación</h3>
                  <p className="text-lg">Centro Deportivo FCF - Bogotá</p>
                  <p className="text-lg">Complejo Deportivo - Barranquilla</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-blue-700/50 p-6 rounded-xl transform hover:scale-105 transition-transform duration-300 backdrop-blur-sm">
                <Users className="h-12 w-12 text-yellow-400 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-yellow-300">Edades</h3>
                  <p className="text-lg">Niños y niñas de 6 a 17 años</p>
                  <p className="text-lg">Grupos organizados por edad y nivel</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:rotate-3 transition-transform duration-500 group">
              <div className="relative">
                <Image
                  src="/Instalaciones-de-primera.png"
                  alt="Instalaciones FCF Camps"
                  width={800}
                  height={700}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 to-transparent flex items-end">
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Instalaciones de Primera</h3>
                    <p className="text-blue-100">Campos profesionales con todas las medidas de seguridad</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-700/50 p-6 rounded-xl text-center transform hover:scale-105 transition-transform duration-300 backdrop-blur-sm">
              <div className="bg-yellow-400 text-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-yellow-300">Competencias</h3>
              <p>Torneos internos y premios para todos los participantes</p>
            </div>

            <div className="bg-blue-700/50 p-6 rounded-xl text-center transform hover:scale-105 transition-transform duration-300 backdrop-blur-sm">
              <div className="bg-yellow-400 text-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-yellow-300">Alimentación</h3>
              <p>Menú balanceado diseñado por nutricionistas deportivos</p>
            </div>

            <div className="bg-blue-700/50 p-6 rounded-xl text-center transform hover:scale-105 transition-transform duration-300 backdrop-blur-sm">
              <div className="bg-yellow-400 text-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-yellow-300">Kit Deportivo</h3>
              <p>Uniforme completo, mochila y accesorios exclusivos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-5"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-yellow-400 mb-2">FCF CAMPS 2025</h3>
              <p className="text-blue-200 max-w-md mx-auto">
                La mejor experiencia de fútbol para niños. ¡Inscríbete ahora y vive una experiencia inolvidable!
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <a
                href="#"
                className="bg-blue-700 hover:bg-blue-600 p-3 rounded-full transition-colors transform hover:scale-110"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </a>

              <a
                href="#"
                className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 hover:from-purple-500 hover:via-pink-400 hover:to-orange-300 p-3 rounded-full transition-colors transform hover:scale-110"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </a>
            </div>

            <div className="text-sm text-blue-200">
              <p>&copy; 2025 FCF Camps. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Page;
