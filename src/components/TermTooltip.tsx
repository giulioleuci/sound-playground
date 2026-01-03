/**
 * TermTooltip Component
 * Tooltip interattivo per termini musicali con definizioni
 */

import { ReactNode } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

/**
 * Dizionario termini musicali comuni
 */
export const MUSIC_TERMS: Record<string, string> = {
  Hz: 'Hertz - Unità di misura della frequenza. 1 Hz = 1 ciclo al secondo. Ad esempio, il La centrale (A4) vibra a 440 Hz.',
  frequenza:
    'Numero di oscillazioni complete al secondo. Determina l\'altezza del suono: più alta la frequenza, più acuto il suono.',
  ampiezza:
    'Grandezza dell\'oscillazione sonora. Determina l\'intensità (volume) del suono. Maggiore ampiezza = suono più forte.',
  timbro:
    'Qualità del suono che permette di distinguere strumenti diversi anche alla stessa altezza. Dipende dalla combinazione di armonici.',
  armonico:
    'Frequenza multipla intera della frequenza fondamentale. Gli armonici determinano il timbro del suono.',
  fondamentale:
    'La frequenza più bassa in un suono complesso. È quella che percepiamo come "altezza" della nota.',
  ottava:
    'Intervallo musicale tra una nota e un\'altra con frequenza doppia o metà. Ad esempio, A4 (440 Hz) e A5 (880 Hz) sono distanti un\'ottava.',
  quinta:
    'Intervallo musicale di 5 note. Il rapporto di frequenze nella scala pitagorica è 3:2 (es. Do-Sol).',
  temperamento:
    'Sistema di accordatura che definisce le proporzioni tra le note. Il temperamento equabile divide l\'ottava in 12 semitoni uguali.',
  pitagorico:
    'Sistema di accordatura basato su quinte pure (rapporto 3:2). Genera scale matematicamente perfette ma con alcune quinte dissonanti.',
  battimento:
    'Oscillazione periodica di volume che si sente quando due frequenze simili suonano insieme. La frequenza del battimento è la differenza tra le due frequenze.',
  sintesi:
    'Creazione di suoni tramite tecniche elettroniche. La sintesi additiva somma sinusoidi, la sottrattiva filtra forme d\'onda ricche.',
  ADSR:
    'Attack, Decay, Sustain, Release - Parametri che descrivono come varia l\'ampiezza di un suono nel tempo.',
  spettro:
    'Rappresentazione grafica delle frequenze presenti in un suono e della loro intensità relativa.',
  fase:
    'Punto del ciclo dell\'onda in un dato momento. Due onde identiche ma sfasate di 180° si annullano.',
  risonanza:
    'Amplificazione di certe frequenze dovuta alle proprietà fisiche di un sistema (es. cassa di risonanza).',
  trasposizione:
    'Spostamento di una melodia o accordo a un\'altezza diversa mantenendo gli intervalli.',
  intervallo:
    'Distanza tra due note musicali, misurata in semitoni o come rapporto di frequenze.',
  semitono:
    'Intervallo più piccolo nella musica occidentale. Nel temperamento equabile, rapporto di frequenze è 2^(1/12) ≈ 1.059.',
  consonanza:
    'Combinazione di suoni percepita come stabile e piacevole. Basata su rapporti semplici di frequenze.',
  dissonanza:
    'Combinazione di suoni percepita come instabile o tesa. Richiede risoluzione verso consonanza.',
};

interface TermTooltipProps {
  term: string;
  children?: ReactNode;
  definition?: string;
  showIcon?: boolean;
}

/**
 * Componente tooltip per termini musicali
 */
export function TermTooltip({
  term,
  children,
  definition,
  showIcon = false,
}: TermTooltipProps) {
  const tooltipContent = definition || MUSIC_TERMS[term] || 'Definizione non disponibile';

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center gap-1 border-b border-dotted border-purple-400 cursor-help hover:border-purple-600 transition-colors">
            {children || term}
            {showIcon && <HelpCircle className="w-3 h-3 text-purple-400" />}
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs p-3 bg-gray-900 text-white border-gray-700">
          <p className="text-sm leading-relaxed">{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Helper component per evidenziare termini nel testo
 */
interface TextWithTooltipsProps {
  text: string;
  className?: string;
}

export function TextWithTooltips({ text, className }: TextWithTooltipsProps) {
  // Sostituisci termini noti con tooltip
  const parts = text.split(/(\b\w+\b)/g);

  return (
    <p className={className}>
      {parts.map((part, index) => {
        const lowerPart = part.toLowerCase();
        if (MUSIC_TERMS[lowerPart]) {
          return (
            <TermTooltip key={index} term={lowerPart}>
              {part}
            </TermTooltip>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </p>
  );
}
