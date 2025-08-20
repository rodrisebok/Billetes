import React from 'react';
import { DollarSign, Scan } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <div className="text-center mb-12 pt-8">
      <div className="relative mb-6">
        <div className="w-24 h-24 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full mx-auto flex items-center justify-center shadow-2xl">
          <DollarSign className="w-12 h-12 text-white" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
          <Scan className="w-5 h-5 text-gray-900" />
        </div>
      </div>
      <h1 className="text-3xl font-bold text-white mb-2">
        MoneyReader
      </h1>
      <p className="text-blue-200 text-lg">
        Identificador de billetes accesible
      </p>
    </div>
  );
};

export default Logo;