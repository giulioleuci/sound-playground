/**
 * Quiz Questions for all modules
 * Domande quiz per consolidare l'apprendimento
 */

import { QuizQuestion } from '@/components/Quiz';

export const quizzes: Record<number, QuizQuestion[]> = {
  // Modulo 1: Il suono come vibrazione
  1: [
    {
      question: 'Cosa genera un suono?',
      options: [
        'Un oggetto che vibra',
        'La luce che si riflette',
        'Il calore che si propaga',
        'L\'elettricità statica',
      ],
      correctAnswer: 0,
      explanation:
        'Ogni suono nasce da un oggetto che vibra: una corda, una membrana, le corde vocali, ecc.',
    },
    {
      question: 'Quando una vibrazione è più veloce, il suono risultante è:',
      options: ['Più acuto', 'Più grave', 'Più forte', 'Più debole'],
      correctAnswer: 0,
      explanation:
        'Vibrazioni più veloci producono suoni più acuti, mentre vibrazioni più lente producono suoni più gravi.',
    },
    {
      question: 'Come "vede" il suono il nostro orecchio?',
      options: [
        'Percepisce le vibrazioni dell\'aria',
        'Osserva le onde luminose',
        'Misura la temperatura',
        'Rileva campi magnetici',
      ],
      correctAnswer: 0,
      explanation:
        'L\'orecchio percepisce le vibrazioni dell\'aria attraverso il timpano, che vibra in risposta alle onde sonore.',
    },
    {
      question: 'Cosa rappresenta un\'onda sonora?',
      options: [
        'Il movimento avanti e indietro delle molecole d\'aria',
        'Il colore del suono',
        'La temperatura dell\'aria',
        'La direzione del vento',
      ],
      correctAnswer: 0,
      explanation:
        'Un\'onda sonora rappresenta il movimento oscillatorio delle molecole d\'aria che si propagano nello spazio.',
    },
    {
      question: 'Perché possiamo distinguere un suono acuto da uno grave?',
      options: [
        'Per la diversa velocità di vibrazione',
        'Per il diverso colore',
        'Per la diversa dimensione',
        'Per il diverso peso',
      ],
      correctAnswer: 0,
      explanation:
        'Distinguiamo suoni acuti e gravi in base alla frequenza di vibrazione: più alta la frequenza, più acuto il suono.',
    },
  ],

  // Modulo 2: Frequenza e altezza
  2: [
    {
      question: 'Cosa si misura in Hertz (Hz)?',
      options: [
        'Il numero di vibrazioni al secondo',
        'Il volume del suono',
        'La distanza percorsa dal suono',
        'La temperatura dell\'aria',
      ],
      correctAnswer: 0,
      explanation:
        'Gli Hertz misurano la frequenza, cioè quante vibrazioni complete avvengono in un secondo.',
    },
    {
      question: 'Una frequenza di 440 Hz significa che:',
      options: [
        'Ci sono 440 vibrazioni al secondo',
        'Il suono dura 440 secondi',
        'Il suono ha un volume di 440',
        'Il suono viaggia a 440 metri al secondo',
      ],
      correctAnswer: 0,
      explanation:
        '440 Hz è la frequenza della nota LA (A4), e significa 440 oscillazioni complete al secondo.',
    },
    {
      question: 'Raddoppiando la frequenza di un suono, otteniamo:',
      options: [
        'La stessa nota un\'ottava sopra',
        'Un suono più forte',
        'Un suono più debole',
        'Una nota completamente diversa',
      ],
      correctAnswer: 0,
      explanation:
        'Raddoppiare la frequenza produce la stessa nota un\'ottava più alta. Ad esempio, 440 Hz → 880 Hz è sempre un LA.',
    },
    {
      question: 'Quale frequenza è più acuta?',
      options: ['1000 Hz', '500 Hz', '250 Hz', '100 Hz'],
      correctAnswer: 0,
      explanation:
        'Frequenze più alte corrispondono a suoni più acuti. 1000 Hz è il suono più acuto tra le opzioni.',
    },
    {
      question: 'Il periodo di un\'onda è:',
      options: [
        'Il tempo di una vibrazione completa',
        'La distanza tra due picchi',
        'Il volume massimo',
        'La velocità del suono',
      ],
      correctAnswer: 0,
      explanation:
        'Il periodo è il tempo necessario per completare un ciclo di vibrazione. È l\'inverso della frequenza.',
    },
  ],

  // Modulo 3: Ampiezza e intensità
  3: [
    {
      question: 'L\'ampiezza di un\'onda sonora determina:',
      options: [
        'Il volume del suono',
        'L\'altezza (acuto/grave)',
        'Il timbro',
        'La velocità',
      ],
      correctAnswer: 0,
      explanation:
        'L\'ampiezza determina l\'intensità o volume del suono: maggiore ampiezza = suono più forte.',
    },
    {
      question: 'Un suono con ampiezza doppia rispetto a un altro è:',
      options: [
        'Più forte',
        'Più acuto',
        'Più veloce',
        'Più colorato',
      ],
      correctAnswer: 0,
      explanation:
        'Raddoppiare l\'ampiezza rende il suono più forte, ma non cambia la sua frequenza o altezza.',
    },
    {
      question: 'Cosa succede se aumentiamo solo l\'ampiezza di un\'onda?',
      options: [
        'Il suono diventa più forte ma mantiene la stessa altezza',
        'Il suono diventa più acuto',
        'Il suono diventa più grave',
        'Il suono cambia timbro',
      ],
      correctAnswer: 0,
      explanation:
        'Modificare l\'ampiezza influenza solo il volume, non la frequenza (altezza) del suono.',
    },
    {
      question: 'In fisica, l\'intensità del suono si misura in:',
      options: ['Decibel (dB)', 'Hertz (Hz)', 'Metri (m)', 'Watt (W)'],
      correctAnswer: 0,
      explanation:
        'I decibel (dB) misurano l\'intensità sonora su scala logaritmica.',
    },
    {
      question: 'Quale affermazione è corretta?',
      options: [
        'Frequenza determina altezza, ampiezza determina volume',
        'Frequenza determina volume, ampiezza determina altezza',
        'Frequenza e ampiezza determinano entrambe il volume',
        'Frequenza e ampiezza sono la stessa cosa',
      ],
      correctAnswer: 0,
      explanation:
        'La frequenza controlla se un suono è acuto o grave, l\'ampiezza controlla se è forte o debole.',
    },
  ],

  // Modulo 4: Timbro e spettro
  4: [
    {
      question: 'Perché un violino e un flauto suonano diversi sulla stessa nota?',
      options: [
        'Hanno timbri diversi',
        'Hanno frequenze diverse',
        'Hanno volumi diversi',
        'Hanno velocità diverse',
      ],
      correctAnswer: 0,
      explanation:
        'Il timbro è ciò che distingue strumenti diversi sulla stessa nota, determinato dalla forma d\'onda.',
    },
    {
      question: 'Quale forma d\'onda ha il suono più "puro"?',
      options: ['Sinusoidale', 'Quadra', 'Triangolare', 'Dente di sega'],
      correctAnswer: 0,
      explanation:
        'L\'onda sinusoidale è il suono più puro, contenente una sola frequenza senza armonici.',
    },
    {
      question: 'Cosa determina principalmente il timbro di un suono?',
      options: [
        'La forma dell\'onda',
        'La frequenza fondamentale',
        'Il volume',
        'La durata',
      ],
      correctAnswer: 0,
      explanation:
        'Il timbro è determinato dalla forma d\'onda, che contiene la fondamentale più gli armonici.',
    },
    {
      question: 'Uno spettro sonoro mostra:',
      options: [
        'Le frequenze presenti e la loro intensità',
        'Il colore del suono',
        'La velocità del suono',
        'La temperatura dell\'aria',
      ],
      correctAnswer: 0,
      explanation:
        'Lo spettro è una rappresentazione che mostra quali frequenze sono presenti in un suono e quanto sono forti.',
    },
    {
      question: 'Un\'onda quadra ha uno spettro con:',
      options: [
        'Solo armonici dispari',
        'Solo armonici pari',
        'Tutti gli armonici',
        'Nessun armonico',
      ],
      correctAnswer: 0,
      explanation:
        'L\'onda quadra contiene solo gli armonici dispari (1°, 3°, 5°, 7°, ecc.) della frequenza fondamentale.',
    },
  ],

  // Modulo 5: Armonici e Fourier
  5: [
    {
      question: 'Il teorema di Fourier afferma che:',
      options: [
        'Ogni onda periodica può essere scomposta in onde sinusoidali',
        'Ogni suono ha la stessa frequenza',
        'Ogni suono ha lo stesso volume',
        'Ogni onda ha forma triangolare',
      ],
      correctAnswer: 0,
      explanation:
        'Fourier dimostrò che qualsiasi onda periodica può essere rappresentata come somma di onde sinusoidali.',
    },
    {
      question: 'Gli armonici sono:',
      options: [
        'Multipli interi della frequenza fondamentale',
        'Frequenze casuali',
        'Solo frequenze dispari',
        'Solo frequenze pari',
      ],
      correctAnswer: 0,
      explanation:
        'Gli armonici sono frequenze che sono multipli esatti della fondamentale: 2f, 3f, 4f, ecc.',
    },
    {
      question: 'Se la fondamentale è 100 Hz, il terzo armonico è:',
      options: ['300 Hz', '200 Hz', '150 Hz', '400 Hz'],
      correctAnswer: 0,
      explanation:
        'Il terzo armonico è 3 volte la fondamentale: 100 Hz × 3 = 300 Hz.',
    },
    {
      question: 'Cosa rende "ricco" il suono di uno strumento?',
      options: [
        'La presenza di molti armonici',
        'Una frequenza molto alta',
        'Un volume molto alto',
        'Una durata molto lunga',
      ],
      correctAnswer: 0,
      explanation:
        'Un suono ricco contiene molti armonici in diverse proporzioni, creando un timbro complesso.',
    },
    {
      question: 'La sintesi additiva consiste nel:',
      options: [
        'Sommare onde sinusoidali per creare timbri complessi',
        'Aumentare il volume',
        'Accelerare la frequenza',
        'Mescolare suoni casuali',
      ],
      correctAnswer: 0,
      explanation:
        'La sintesi additiva crea suoni complessi sommando multiple onde sinusoidali (armonici).',
    },
  ],

  // Modulo 6: Ottava e rapporti
  6: [
    {
      question: 'Il rapporto di frequenza di un\'ottava è:',
      options: ['2:1', '3:2', '4:3', '5:4'],
      correctAnswer: 0,
      explanation:
        'Un\'ottava corrisponde a un raddoppio della frequenza, quindi rapporto 2:1.',
    },
    {
      question: 'Se DO è a 261 Hz, DO un\'ottava sopra è a:',
      options: ['522 Hz', '391 Hz', '130.5 Hz', '783 Hz'],
      correctAnswer: 0,
      explanation:
        'Un\'ottava sopra significa raddoppiare la frequenza: 261 × 2 = 522 Hz.',
    },
    {
      question: 'Perché l\'ottava suona così consonante?',
      options: [
        'Ha il rapporto matematico più semplice (2:1)',
        'Ha il volume più alto',
        'Ha la durata più lunga',
        'Ha il colore più brillante',
      ],
      correctAnswer: 0,
      explanation:
        'Il rapporto 2:1 è il più semplice dopo l\'unisono, creando la consonanza più forte.',
    },
    {
      question: 'Quante ottave ci sono tra 100 Hz e 800 Hz?',
      options: ['3', '2', '4', '5'],
      correctAnswer: 0,
      explanation:
        '100 → 200 (1 ottava), 200 → 400 (2 ottave), 400 → 800 (3 ottave).',
    },
    {
      question: 'La scala musicale moderna divide l\'ottava in:',
      options: ['12 semitoni', '7 note', '8 note', '10 semitoni'],
      correctAnswer: 0,
      explanation:
        'L\'ottava è divisa in 12 semitoni uguali nel sistema temperato.',
    },
  ],

  // Modulo 7: Costruire la scala con le quinte
  7: [
    {
      question: 'Il rapporto di frequenza di una quinta giusta è:',
      options: ['3:2', '2:1', '4:3', '5:4'],
      correctAnswer: 0,
      explanation:
        'La quinta giusta ha rapporto 3:2, uno degli intervalli più consonanti.',
    },
    {
      question: 'Partendo da DO, la sua quinta è:',
      options: ['SOL', 'FA', 'MI', 'LA'],
      correctAnswer: 0,
      explanation:
        'La quinta di DO è SOL. Il ciclo delle quinte è fondamentale in musica.',
    },
    {
      question: 'La scala pitagorica si costruisce usando:',
      options: [
        'Solo intervalli di quinta',
        'Solo intervalli di ottava',
        'Solo intervalli di terza',
        'Intervalli casuali',
      ],
      correctAnswer: 0,
      explanation:
        'Pitagora costruì la scala usando solo rapporti di 3:2 (quinte) e 2:1 (ottave).',
    },
    {
      question: 'Quante quinte servono per tornare alla nota di partenza (circa)?',
      options: ['12', '7', '8', '5'],
      correctAnswer: 0,
      explanation:
        'Il ciclo delle quinte comprende 12 passaggi per tornare (quasi) alla nota iniziale.',
    },
    {
      question: 'Quale problema nasce con la scala pitagorica?',
      options: [
        'Le 12 quinte non chiudono perfettamente sull\'ottava',
        'È troppo semplice',
        'Ha troppe note',
        'Ha troppo poche note',
      ],
      correctAnswer: 0,
      explanation:
        'La "virgola pitagorica" è la differenza tra 12 quinte e 7 ottave, causando problemi di intonazione.',
    },
  ],

  // Modulo 8: La dominante
  8: [
    {
      question: 'La dominante è la nota che si trova:',
      options: [
        'Una quinta sopra la tonica',
        'Un\'ottava sopra la tonica',
        'Una terza sopra la tonica',
        'Una quarta sopra la tonica',
      ],
      correctAnswer: 0,
      explanation:
        'La dominante è il quinto grado della scala, una quinta sopra la tonica.',
    },
    {
      question: 'Perché la dominante crea tensione?',
      options: [
        'Tende a risolvere sulla tonica',
        'È troppo forte',
        'È troppo debole',
        'È fuori scala',
      ],
      correctAnswer: 0,
      explanation:
        'La dominante crea tensione armonica che si risolve tornando alla tonica.',
    },
    {
      question: 'In tonalità di DO, la dominante è:',
      options: ['SOL', 'FA', 'MI', 'LA'],
      correctAnswer: 0,
      explanation:
        'In DO maggiore, la dominante (V grado) è SOL.',
    },
    {
      question: 'Il rapporto tra tonica e dominante è:',
      options: ['3:2', '2:1', '4:3', '5:4'],
      correctAnswer: 0,
      explanation:
        'La quinta (tonica-dominante) ha rapporto 3:2.',
    },
    {
      question: 'La progressione armonica I-V-I è importante perché:',
      options: [
        'Crea tensione e risoluzione',
        'È la più veloce',
        'È la più forte',
        'È la più silenziosa',
      ],
      correctAnswer: 0,
      explanation:
        'Questa progressione (tonica-dominante-tonica) è la base dell\'armonia tonale.',
    },
  ],

  // Modulo 9: Corde e colonne d'aria
  9: [
    {
      question: 'Come cambia la frequenza di una corda se dimezziamo la sua lunghezza?',
      options: [
        'Raddoppia (sale di un\'ottava)',
        'Si dimezza (scende di un\'ottava)',
        'Resta uguale',
        'Quadruplica',
      ],
      correctAnswer: 0,
      explanation:
        'Dimezzando la lunghezza, la frequenza raddoppia. È il principio dei tasti della chitarra.',
    },
    {
      question: 'La frequenza di una corda vibrante dipende da:',
      options: [
        'Lunghezza, tensione e massa',
        'Solo dalla lunghezza',
        'Solo dalla tensione',
        'Solo dal colore',
      ],
      correctAnswer: 0,
      explanation:
        'La formula della corda vibrante include lunghezza L, tensione T e densità μ.',
    },
    {
      question: 'Per ottenere la quinta di una nota su una corda:',
      options: [
        'Accorciamo la corda a 2/3 della lunghezza',
        'Raddoppiamo la lunghezza',
        'Dimezziamo la lunghezza',
        'Non cambiamo la lunghezza',
      ],
      correctAnswer: 0,
      explanation:
        'Il rapporto 3:2 della quinta si ottiene con lunghezza 2/3 (inverso del rapporto di frequenza).',
    },
    {
      question: 'Il flauto di Pan funziona con:',
      options: [
        'Colonne d\'aria di diverse lunghezze',
        'Corde di diverse tensioni',
        'Membrane di diversi spessori',
        'Campane di diverse dimensioni',
      ],
      correctAnswer: 0,
      explanation:
        'Il flauto di Pan usa tubi di diverse lunghezze per produrre note diverse.',
    },
    {
      question: 'In una canna chiusa, la fondamentale è:',
      options: [
        'La metà della frequenza di una canna aperta della stessa lunghezza',
        'Il doppio della frequenza di una canna aperta',
        'Uguale a una canna aperta',
        'Non ha frequenza',
      ],
      correctAnswer: 0,
      explanation:
        'Una canna chiusa risuona a metà della frequenza di una canna aperta della stessa lunghezza.',
    },
  ],

  // Modulo 10: I battimenti
  10: [
    {
      question: 'I battimenti acustici si verificano quando:',
      options: [
        'Due frequenze molto vicine si sovrappongono',
        'Un suono è molto forte',
        'Un suono è molto acuto',
        'Due suoni hanno lo stesso volume',
      ],
      correctAnswer: 0,
      explanation:
        'I battimenti sono fluttuazioni periodiche dell\'ampiezza causate da frequenze leggermente diverse.',
    },
    {
      question: 'Se sovrapponiamo 440 Hz e 444 Hz, sentiamo battimenti a:',
      options: ['4 Hz', '440 Hz', '444 Hz', '884 Hz'],
      correctAnswer: 0,
      explanation:
        'La frequenza dei battimenti è la differenza tra le due frequenze: 444 - 440 = 4 Hz.',
    },
    {
      question: 'I battimenti sono utili per:',
      options: [
        'Accordare strumenti musicali',
        'Aumentare il volume',
        'Cambiare il timbro',
        'Accelerare il suono',
      ],
      correctAnswer: 0,
      explanation:
        'Gli accordatori usano i battimenti: quando scompaiono, le due note sono perfettamente intonate.',
    },
    {
      question: 'Cosa succede ai battimenti se avviciniamo le due frequenze?',
      options: [
        'Rallentano',
        'Accelerano',
        'Restano uguali',
        'Scompaiono immediatamente',
      ],
      correctAnswer: 0,
      explanation:
        'Frequenze più vicine producono battimenti più lenti. Quando coincidono, i battimenti scompaiono.',
    },
    {
      question: 'I battimenti sono un fenomeno di:',
      options: [
        'Interferenza costruttiva e distruttiva',
        'Riflessione',
        'Rifrazione',
        'Diffrazione',
      ],
      correctAnswer: 0,
      explanation:
        'I battimenti nascono dall\'interferenza tra onde: si sommano e si sottraggono periodicamente.',
    },
  ],

  // Modulo 11: Temperamenti
  11: [
    {
      question: 'La virgola pitagorica è:',
      options: [
        'La differenza tra 12 quinte e 7 ottave',
        'Un errore di calcolo',
        'Una nota musicale',
        'Uno strumento a corda',
      ],
      correctAnswer: 0,
      explanation:
        'Salendo per 12 quinte non si arriva esattamente a 7 ottave sopra: questa differenza è la virgola pitagorica.',
    },
    {
      question: 'Il temperamento equabile divide l\'ottava in:',
      options: [
        '12 semitoni perfettamente uguali',
        '7 note uguali',
        '12 semitoni di dimensioni diverse',
        '8 note uguali',
      ],
      correctAnswer: 0,
      explanation:
        'Nel temperamento equabile, ogni semitono è esattamente uguale agli altri (rapporto ¹²√2).',
    },
    {
      question: 'Perché fu inventato il temperamento equabile?',
      options: [
        'Per poter suonare in tutte le tonalità',
        'Per suonare più forte',
        'Per suonare più velocemente',
        'Per semplificare la notazione',
      ],
      correctAnswer: 0,
      explanation:
        'Il temperamento equabile permette di modulare liberamente tra tutte le tonalità senza stonature.',
    },
    {
      question: 'Quale intervallo è leggermente "compromesso" nel temperamento equabile?',
      options: [
        'Tutti tranne l\'ottava',
        'Solo la quinta',
        'Solo la terza',
        'Nessuno',
      ],
      correctAnswer: 0,
      explanation:
        'Per rendere tutti i semitoni uguali, tutti gli intervalli (tranne l\'ottava perfetta 2:1) sono leggermente alterati.',
    },
    {
      question: 'Il rapporto di un semitono equabile è:',
      options: [
        'Radice dodicesima di 2',
        '2:1',
        '3:2',
        '4:3',
      ],
      correctAnswer: 0,
      explanation:
        'Ogni semitono moltiplica la frequenza per ¹²√2 ≈ 1.05946.',
    },
  ],

  // Modulo 12: Sintesi Additiva
  12: [
    {
      question: 'La sintesi additiva crea suoni:',
      options: [
        'Sommando onde sinusoidali a diverse frequenze',
        'Sottraendo frequenze da un suono',
        'Filtrando rumore bianco',
        'Modulando la frequenza',
      ],
      correctAnswer: 0,
      explanation:
        'La sintesi additiva costruisce timbri complessi sommando multiple onde sinusoidali (armonici).',
    },
    {
      question: 'I drawbars dell\'organo Hammond controllano:',
      options: [
        'Il livello di ciascun armonico',
        'Il volume generale',
        'La velocità di rotazione',
        'L\'effetto riverbero',
      ],
      correctAnswer: 0,
      explanation:
        'Ogni drawbar controlla l\'intensità di un armonico specifico, permettendo di creare timbri personalizzati.',
    },
    {
      question: 'Quale vantaggio offre la sintesi additiva?',
      options: [
        'Controllo preciso di ogni componente del timbro',
        'Semplicità di programmazione',
        'Basso consumo di CPU',
        'Suoni solo naturali',
      ],
      correctAnswer: 0,
      explanation:
        'La sintesi additiva offre controllo totale su ogni armonico, permettendo di creare qualsiasi timbro teoricamente possibile.',
    },
    {
      question: 'Se attiviamo solo gli armonici dispari otteniamo:',
      options: [
        'Un suono simile a un\'onda quadra',
        'Un suono simile a un\'onda dente di sega',
        'Un suono sinusoidale',
        'Nessun suono',
      ],
      correctAnswer: 0,
      explanation:
        'L\'onda quadra contiene solo armonici dispari (1°, 3°, 5°, 7°, ecc.).',
    },
    {
      question: 'La fondamentale in un timbro è:',
      options: [
        'La frequenza più bassa percepita come nota',
        'L\'armonico più forte',
        'L\'ultimo armonico',
        'Il volume massimo',
      ],
      correctAnswer: 0,
      explanation:
        'La fondamentale è la frequenza base che determina l\'altezza percepita della nota.',
    },
  ],

  // Modulo 13: Inviluppo ADSR
  13: [
    {
      question: 'Cosa rappresenta la "A" in ADSR?',
      options: ['Attack (attacco)', 'Amplitude (ampiezza)', 'Audio', 'Armonic (armonico)'],
      correctAnswer: 0,
      explanation:
        'ADSR sta per Attack, Decay, Sustain, Release - le quattro fasi dell\'inviluppo del suono.',
    },
    {
      question: 'La fase di Attack controlla:',
      options: [
        'Quanto velocemente il suono raggiunge il volume massimo',
        'Il volume finale del suono',
        'La frequenza del suono',
        'Il timbro del suono',
      ],
      correctAnswer: 0,
      explanation:
        'Attack è il tempo che impiega il suono per passare dal silenzio al volume massimo.',
    },
    {
      question: 'Quale strumento tipicamente ha un Attack molto breve?',
      options: ['Pianoforte', 'Archi (violino)', 'Organo a mantice', 'Pad sintetico'],
      correctAnswer: 0,
      explanation:
        'Il pianoforte ha un attacco quasi istantaneo quando il martelletto colpisce la corda.',
    },
    {
      question: 'Il parametro Sustain rappresenta:',
      options: [
        'Il livello di volume mantenuto mentre si tiene la nota',
        'Il tempo di mantenimento',
        'La frequenza della nota',
        'Il numero di armonici',
      ],
      correctAnswer: 0,
      explanation:
        'Sustain è il livello (non il tempo) a cui il suono si stabilizza mentre il tasto è premuto.',
    },
    {
      question: 'La fase di Release controlla:',
      options: [
        'Quanto tempo impiega il suono a tornare al silenzio dopo il rilascio',
        'Il volume massimo',
        'La frequenza finale',
        'Il timbro finale',
      ],
      correctAnswer: 0,
      explanation:
        'Release è il tempo di dissolvenza del suono dopo aver rilasciato il tasto o smesso di suonare.',
    },
  ],

  // Modulo 14: Psicoacustica
  14: [
    {
      question: 'La psicoacustica studia:',
      options: [
        'Come il cervello percepisce e interpreta i suoni',
        'La costruzione di strumenti musicali',
        'La fisica delle onde sonore',
        'La composizione musicale',
      ],
      correctAnswer: 0,
      explanation:
        'La psicoacustica è la scienza che studia la percezione soggettiva del suono da parte del sistema uditivo.',
    },
    {
      question: 'Il Shepard Tone è un\'illusione che:',
      options: [
        'Sembra salire continuamente senza mai fermarsi',
        'Fa sembrare i suoni più forti',
        'Cambia il timbro',
        'Accelera il tempo',
      ],
      correctAnswer: 0,
      explanation:
        'Il Shepard Tone crea l\'illusione di una scala che sale infinitamente sovrapponendo ottave diverse.',
    },
    {
      question: 'La "fundamental missing" (fondamentale mancante) dimostra che:',
      options: [
        'Il cervello può percepire una frequenza anche se non è fisicamente presente',
        'Alcuni suoni non hanno fondamentale',
        'Le alte frequenze sono inutili',
        'Il volume è più importante della frequenza',
      ],
      correctAnswer: 0,
      explanation:
        'Se rimuoviamo la fondamentale ma lasciamo gli armonici, il cervello "ricostruisce" mentalmente la fondamentale mancante.',
    },
    {
      question: 'L\'effetto cocktail party si riferisce alla capacità di:',
      options: [
        'Isolare una conversazione in mezzo al rumore',
        'Sentire suoni più forti',
        'Percepire frequenze più alte',
        'Ignorare tutti i suoni',
      ],
      correctAnswer: 0,
      explanation:
        'Il cervello può focalizzarsi su una sorgente sonora specifica (es. una voce) anche in ambienti rumorosi.',
    },
    {
      question: 'La mascheratura frequenziale avviene quando:',
      options: [
        'Un suono forte rende impercettibile un suono più debole vicino in frequenza',
        'Due suoni si annullano',
        'Un suono cambia timbro',
        'Un suono accelera',
      ],
      correctAnswer: 0,
      explanation:
        'Un suono intenso può "mascherare" suoni più deboli su frequenze vicine, rendendoli inudibili.',
    },
  ],
};

/**
 * Ottiene le domande quiz per un modulo specifico
 */
export function getQuizForModule(moduleNumber: number): QuizQuestion[] {
  return quizzes[moduleNumber] || [];
}

/**
 * Verifica se un modulo ha un quiz disponibile
 */
export function hasQuiz(moduleNumber: number): boolean {
  return moduleNumber in quizzes && quizzes[moduleNumber].length > 0;
}
