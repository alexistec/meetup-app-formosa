import { useState } from 'react';
import { Triangle } from 'lucide-react';
import logo from '/logo.png'

import RegistrationForm from './components/registration-form';
import Ticket from './components/Ticket';

function App() {
  const [participant, setParticipant] = useState<{
    name: string;
    email: string;
  } | null>(null);

  const handleRegister = (name: string, email: string) => {
    setParticipant({ name, email });
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        {!participant ? (
          <>
            <div className="flex items-center gap-2 mb-8">
              <Triangle className="text-purple-500 h-8 w-8" />
              <img 
                src={logo} 
                className="h-8 w-auto object-contain" 
                alt="Vite logo" 
              />
            </div>
            <RegistrationForm onRegister={handleRegister} />
          </>
        ) : (
          <Ticket participant={participant} />
        )}
      </div>
    </div>
  );
}

export default App;