import { QrCode, Triangle } from 'lucide-react';
import logo from '/logo.png'


interface TicketProps {
    participant: {
      name: string;
      email: string;
    };
    agenda: { time: string; topic: string }[];
  }

function Ticket({ participant,agenda }: TicketProps) {
  const ticketId = Math.random().toString(36).substr(2, 6).toUpperCase();
  
  return (
    <div className="relative max-w-[320px] h-[600px] mx-auto" style={{ marginTop:70 }}>
      <div className="absolute inset-0 p-[2px] rounded-[30px] bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500">
        <div className="relative h-full w-full bg-black rounded-[28px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent" />
          
          {/* Ticket notches */}
          <div className="absolute -left-2 top-1/2 w-4 h-4 bg-black rounded-full transform -translate-y-1/2" />
          <div className="absolute -right-2 top-1/2 w-4 h-4 bg-black rounded-full transform -translate-y-1/2" />
          
          <div className="relative h-full p-6 flex flex-col justify-between">
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Triangle className="text-purple-500 h-6 w-6" />
                    <img src={logo} className="h-8 w-auto object-contain" alt="logo" />
                </h2>
              </div>
            </div>
            <div className="space-y-6 flex-1 flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center p-4 ring-4 ring-purple-500 ring-offset-4 ring-offset-black">
                <QrCode className="w-full h-full text-black" />
              </div>
              
              <div className="text-center space-y-2">
                <h3 className=" font-bold text-white">{participant.name}, estará presente esta meet!</h3>
                <p className="text-base text-purple-300">@debatechformosa</p>
              </div>
              
              <div className="w-full bg-zinc-900/50 backdrop-blur-sm rounded-xl p-4 space-y-3 border border-purple-500/20">
                <h4 className="text-lg font-semibold text-purple-300">Agenda</h4>
                <ul className="space-y-2">
                  {agenda.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-cyan-400 font-mono text-sm">{item.time}</span>
                      <span className="text-gray-200 text-sm">{item.topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-xs text-purple-300">Hosted by Github</p>
              <p className="font-mono text-xl text-white tracking-wider">#{ticketId}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ticket;