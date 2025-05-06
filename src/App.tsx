import { useEffect, useState } from 'react';
import { Triangle } from 'lucide-react';
import logo from '/logo.png';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import RegistrationForm from './components/registration-form';
import Ticket from './components/ticket';
import Home from './pages/home';
import { addDoc, collection, getDocs, query, Timestamp, where } from 'firebase/firestore';
import { db } from './libs/firebase-config';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  active: boolean;
  agenda: { time: string; topic: string }[];
}

function App() {
  const [participant, setParticipant] = useState<{ name: string; email: string; } | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false); 
  const [fetchingEvent, setFetchingEvent] = useState(true); 
  const [ticketId, setTicketId] = useState<string | null>(null);

  const handleRegister = async (name: string, email: string) => {
    if (!event) return;

    setLoading(true);

    try {
      const participantsRef = collection(db, 'participants');
      const existingParticipantQuery = query(
        participantsRef,
        where('email', '==', email),
        where('eventId', '==', event.id)
      );
      const querySnapshot = await getDocs(existingParticipantQuery);

      if (querySnapshot.empty) {
        const docRef = await addDoc(participantsRef, {
          name,
          email,
          isAssistence: false,
          eventId: event.id,
          timestamp: Timestamp.now(),
        });
        setTicketId(docRef.id);
      } else {
        console.log("El usuario ya está registrado para este evento.");
        // If already registered, get the existing doc id
        setTicketId(querySnapshot.docs[0].id);
      }

      setParticipant({ name, email });
    } catch (error) {
      console.error("Error al registrar al participante:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    const fetchActiveEvent = async () => {
      const eventRef = collection(db, 'events');
      const activeEventQuery = query(eventRef, where('active', '==', true));
      
      try {
        const querySnapshot = await getDocs(activeEventQuery);

        if (!querySnapshot.empty) {
          const eventDoc = querySnapshot.docs[0];
          const eventData = { id: eventDoc.id, ...eventDoc.data() } as Event;
          setEvent(eventData);
        } else {
          setEvent(null);
        }
      } catch (error) {
        console.error("Error al obtener el evento activo:", error);
      }

      setFetchingEvent(false); 
    };

    fetchActiveEvent();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-black text-white p-4">
        <div className="max-w-4xl mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ticket" element={
              fetchingEvent ? ( 
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  <p className="ml-2">Loading evento...</p>
                </div>
              ) : event ? (
                !participant ? (
                  <>
                    <div className="flex items-center gap-2 mb-8">
                      <Triangle className="text-purple-500 h-8 w-8" />
                      <img src={logo} className="h-8 w-auto object-contain" alt="Vite logo" />
                    </div>
                    {loading ? (
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                        <p className="ml-2">Registrando...</p>
                      </div>
                    ) : (
                      <RegistrationForm onRegister={handleRegister} />
                    )}
                  </>
                ) : (
                  <Ticket participant={participant} agenda={event.agenda} ticketId={ticketId} />
                )
              ) : (
                <h1 className="text-center text-xl">No hay eventos disponibles</h1>
              )
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
