import React, { useState } from 'react';


interface RegistrationFormProps {
  onRegister: (name: string, email: string) => void;
}

function RegistrationForm({ onRegister }: RegistrationFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      onRegister(name, email);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-zinc-900 rounded-xl p-8">
      <h2 className="text-2xl font-bold mb-6">Mi ticket</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Nombre
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-purple-500"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-purple-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
        >
          Get Ticket
        </button>
      </form>
    </div>
  );
}

export default RegistrationForm;