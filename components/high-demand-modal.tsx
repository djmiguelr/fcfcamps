'use client';

import { FC, useEffect, useState } from 'react';
import Image from 'next/image';

interface HighDemandModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HighDemandModal: FC<HighDemandModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const whatsappLinks = [
    {
      city: 'Barranquilla',
      phone: '573204142424',
      gradient: 'from-yellow-500 via-yellow-600 to-yellow-700'
    },
    {
      city: 'Bogotá',
      phone: '573204070090',
      gradient: 'from-red-500 via-red-600 to-red-700'
    }
  ];

  const handleWhatsAppClick = (phone: string, city: string) => {
    const message = encodeURIComponent(`¡Hola! Estoy interesado en FCF Camps ${city}. ¿Me pueden ayudar con información?`);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative z-10 bg-gradient-to-b from-blue-900 to-blue-950 p-8 rounded-2xl max-w-lg w-full mx-4 shadow-2xl border border-blue-500/20">
        {/* Logo */}
        <div className="mb-6 w-48 h-24 relative mx-auto">
          <Image
            src="/logo-camps-escritorio.png"
            alt="FCF Camps Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Message */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-yellow-400">¡Discúlpanos!</h2>
          <p className="text-white/90 leading-relaxed">
            Debido a la alta demanda en la venta de cupos, estamos experimentado algunos 
            inconvenientes tecnológicos en nuestra página. En breve nos comunicáremos 
            contigo para guiarte en la compra de tu cupo.
          </p>
          <p className="text-yellow-400 font-semibold">
            Tu reserva se encuentra activa.
          </p>
          <p className="text-white/90 mb-2">
            Agradecemos la paciencia y comprensión.
          </p>

          {/* Info text */}
          <p className="text-yellow-400 font-semibold text-lg mb-4">
            Recibe más información
          </p>

          {/* WhatsApp Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {whatsappLinks.map((link) => (
              <button
                key={link.city}
                onClick={() => handleWhatsAppClick(link.phone, link.city)}
                className={`group relative overflow-hidden rounded-xl bg-gradient-to-r ${link.gradient} p-[2px] transition-all duration-300 ease-out hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-blue-900`}
              >
                <div className="relative rounded-[10px] bg-blue-950 px-4 py-3">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-lg font-semibold text-white">{link.city}</span>
                    <svg
                      className="h-5 w-5 text-green-500 transition-transform duration-300 group-hover:scale-110"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div className="absolute inset-0 -z-10 animate-pulse bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-1000"></div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-lg transition-colors"
        >
          Entendido
        </button>
      </div>
    </div>
  );
};
