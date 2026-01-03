import { 
  Waves, 
  Activity, 
  Volume2, 
  Sparkles, 
  Layers, 
  Music2, 
  ListMusic,
  Star,
  Guitar,
  Scale
} from 'lucide-react';
import { ModuleCard } from '@/components/ModuleCard';

const modules = [
  {
    number: 1,
    title: 'Il suono come vibrazione',
    description: 'Scopri come nasce un suono osservando le vibrazioni che lo creano.',
    icon: Waves,
    to: '/modulo-1',
    color: '#3b82f6',
  },
  {
    number: 2,
    title: 'Frequenza e altezza',
    description: 'Esplora come la velocità delle vibrazioni determina se un suono è grave o acuto.',
    icon: Activity,
    to: '/modulo-2',
    color: '#8b5cf6',
  },
  {
    number: 3,
    title: 'Ampiezza e intensità',
    description: 'Comprendi cosa rende un suono più forte o più debole.',
    icon: Volume2,
    to: '/modulo-3',
    color: '#ec4899',
  },
  {
    number: 4,
    title: 'Timbro e spettro',
    description: 'Perché un violino e un flauto suonano diversi anche sulla stessa nota?',
    icon: Sparkles,
    to: '/modulo-4',
    color: '#f97316',
  },
  {
    number: 5,
    title: 'Armonici e Fourier',
    description: 'Ogni suono complesso è fatto di suoni semplici: scopri come.',
    icon: Layers,
    to: '/modulo-5',
    color: '#14b8a6',
  },
  {
    number: 6,
    title: 'Ottava e rapporti',
    description: 'Il magico rapporto 2:1 che fa "tornare" la musica.',
    icon: Music2,
    to: '/modulo-6',
    color: '#f43f5e',
  },
  {
    number: 7,
    title: 'Costruire la scala con le quinte',
    description: 'Usa le frazioni per costruire tutte le note musicali.',
    icon: ListMusic,
    to: '/modulo-7',
    color: '#6366f1',
  },
  {
    number: 8,
    title: 'La dominante',
    description: 'La nota più importante dopo la tonica: perché crea tensione?',
    icon: Star,
    to: '/modulo-8',
    color: '#eab308',
  },
  {
    number: 9,
    title: 'Corde e colonne d\'aria',
    description: 'Dalle corde di chitarra alle canne del flauto di Pan.',
    icon: Guitar,
    to: '/modulo-9',
    color: '#22c55e',
  },
  {
    number: 10,
    title: 'Temperamenti',
    description: 'Quando la matematica non torna: la virgola pitagorica.',
    icon: Scale,
    to: '/modulo-10',
    color: '#0ea5e9',
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="container mx-auto px-4 py-16 relative">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 info-badge mb-6">
              <Waves size={16} />
              <span>Esplora il mondo dei suoni</span>
            </div>
            
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              <span className="text-foreground">Matematica, Fisica</span>
              <br />
              <span className="gradient-text">e Musica</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Scopri come i numeri si trasformano in melodie, le vibrazioni in armonia, 
              e la matematica in musica. Un viaggio interattivo tra scienza e arte.
            </p>
          </div>
        </div>

        {/* Decorative wave */}
        <div className="h-24 bg-gradient-to-b from-transparent to-muted/30" />
      </header>

      {/* Modules grid */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title text-center mb-2">I moduli</h2>
          <p className="text-center text-muted-foreground mb-10">
            Clicca su un modulo per iniziare l'esplorazione
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <ModuleCard key={module.number} {...module} />
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-border mt-12">
        <p className="text-center text-sm text-muted-foreground">
          Un laboratorio interattivo per esplorare la connessione tra matematica e musica
        </p>
      </footer>
    </div>
  );
};

export default Index;
