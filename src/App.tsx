import { useEffect, useState } from 'react';
import { Triangle } from 'lucide-react';
import logo from '/logo.png';

import RegistrationForm from './components/registration-form';
import Ticket from './components/ticket';
import { addDoc, collection, getDocs, query, Timestamp, where, doc, updateDoc } from 'firebase/firestore';
import { db } from './libs/firebase-config';

interface Event {
  id: string;
  title: string;
  description: string;
  date: Timestamp;
  active: boolean;
  participantLimit: number | null;
  registeredParticipants: number;
  agenda: { time: string; topic: string }[];
}

function App() {
  const [participant, setParticipant] = useState<{ name: string; email: string; } | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingEvent, setFetchingEvent] = useState(true);

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

      if (!querySnapshot.empty) {
        console.log("El usuario ya está registrado para este evento.");
        return;
      }

      if (event.participantLimit !== null && event.registeredParticipants >= event.participantLimit ) {
        console.log("Lo sentimos, ya se han llenado los cupos de asistencia.")
      }

      await addDoc(participantsRef, {
        name,
        email,
        eventId: event.id,
        timestamp: Timestamp.now(),
      });

      const eventRef = doc(db, 'events', event.id);
      await updateDoc(eventRef, {
        registeredParticipants: event.registeredParticipants + 1,
      });

      setEvent({ ...event, registeredParticipants: event.registeredParticipants + 1 });
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
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        {fetchingEvent ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p className="ml-2">Cargando evento...</p>
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
            <Ticket participant={participant} agenda={event.agenda} />
          )
        ) : (
          <h1 className="text-center text-xl">No hay eventos disponibles</h1>
        )}
      </div>
    </div>
  );
}

export default App;
