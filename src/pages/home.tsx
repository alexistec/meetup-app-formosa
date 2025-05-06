import React from 'react';
import { useNavigate } from 'react-router-dom';
import ThreeDBadge from '../components/three-d-badge';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center w-full max-w-6xl gap-8">
        {/* Title */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white text-center mb-4 tracking-tight">
          Hola!
        </h1>

        {/* 3D Badge */}
        <div className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px]">
          <ThreeDBadge />
        </div>

        {/* Description */}
        <p  className="text-gray-300 text-lg text-center max-w-2xl font-medium tracking-wide">
          Comunidad nerd en Formosa. Organizamos charlas sobre temas como programmer, cyberseguridad, mobile, server, y más.
        </p>

        {/* Button */}
        <button
          onClick={() => navigate('/ticket')}
          style={{ backgroundColor: 'rgb(168 85 247 / var(--tw-text-opacity))' }}
          className="text-white font-semibold py-4 px-8 rounded-lg flex items-center justify-center transition-colors hover:bg-purple-600 text-lg tracking-wide"
        >
          Get a ticket
          <span className="ml-2 text-xl">→</span>
        </button>
      </div>
    </div>
  );
};

export default Home; 