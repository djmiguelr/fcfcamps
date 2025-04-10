'use client';

import { FC, useEffect, useState } from 'react';
import Image from 'next/image';

interface HighDemandModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HighDemandModal: FC<HighDemandModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

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
          <p className="text-white/90">
            Agradecemos la paciencia y comprensión.
          </p>
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
