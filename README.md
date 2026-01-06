# Sound Playground 🎵

Un'applicazione web educativa interattiva che esplora la connessione tra matematica, fisica e musica attraverso 14 moduli didattici.

## 📖 Descrizione

Sound Playground è una piattaforma didattica che guida gli utenti attraverso i concetti fondamentali dell'acustica e della musica, inclusi:

- Vibrazioni sonore e frequenze
- Ampiezza e intensità del suono
- Armoniche e trasformata di Fourier
- Scale musicali e temperamenti
- Sintesi audio e psicoacustica
- Quiz interattivi e giochi di ear training

## ✨ Caratteristiche

- **14 Moduli Didattici** - Percorso educativo completo dalla fisica del suono alla teoria musicale
- **Visualizzazioni Interattive** - Rappresentazioni grafiche in tempo reale delle forme d'onda
- **Web Audio API** - Generazione e manipolazione del suono in tempo reale
- **Interfaccia Intuitiva** - Design responsive ottimizzato per desktop e mobile
- **Contenuti in Italiano** - Tutti i moduli e le spiegazioni sono in lingua italiana

## 🚀 Installazione e Utilizzo

### Prerequisiti

- Node.js (versione 18 o superiore)
- npm o yarn

### Installazione

```bash
# Clona il repository
git clone <URL_DEL_REPOSITORY>

# Entra nella directory del progetto
cd sound-playground

# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:8080`

## 🛠️ Tecnologie Utilizzate

- **Vite** - Build tool e dev server
- **React 18** - Framework UI
- **TypeScript** - Type safety
- **shadcn/ui** - Componenti UI
- **Tailwind CSS** - Styling
- **React Router DOM** - Navigazione
- **Web Audio API** - Generazione audio
- **React Query** - State management

## 📁 Struttura del Progetto

```
src/
├── components/        # Componenti React riutilizzabili
│   ├── ui/           # Componenti shadcn/ui
│   └── ...           # PlayButton, WaveVisualizer, InfoBox, etc.
├── hooks/            # Custom React hooks
│   ├── useAudioContext.ts
│   └── use-mobile.tsx
├── pages/            # Pagine dei moduli
│   ├── Index.tsx
│   ├── Module1.tsx - Module11.tsx
│   └── NotFound.tsx
├── lib/              # Utility functions
└── App.tsx           # Configurazione routing
```

## 🎓 Moduli Didattici

1. **Il suono come vibrazione** - Introduzione alla fisica del suono
2. **Frequenza e altezza** - Relazione tra frequenza e percezione tonale
3. **Ampiezza e intensità** - Volume e dinamica sonora
4. **Timbro e spettro** - Caratteristiche distintive dei suoni
5. **Armonici e Fourier** - Analisi spettrale e armoniche
6. **Ottava e rapporti** - Intervalli musicali fondamentali
7. **Costruire la scala con le quinte** - Teoria della scala musicale
8. **La dominante** - Ruolo degli accordi nella tonalità
9. **Corde e colonne d'aria** - Fisica degli strumenti musicali
10. **I battimenti** - Interferenza di frequenze vicine
11. **Temperamenti** - Sistemi di intonazione musicale

## 🧑‍💻 Sviluppo

### Comandi Disponibili

```bash
npm run dev          # Avvia il server di sviluppo
npm run build        # Build di produzione
npm run build:dev    # Build di sviluppo
npm run lint         # Esegue ESLint
npm run preview      # Anteprima della build
npm run test         # Esegue i test
npm run test:watch   # Test in modalità watch
npm run test:ui      # UI per i test
```

### Aggiungere un Nuovo Modulo

1. Crea un nuovo file `src/pages/ModuleX.tsx`
2. Utilizza il componente `ModuleLayout` per la struttura
3. Aggiungi la route in `src/App.tsx`
4. Aggiungi la card del modulo in `src/pages/Index.tsx`

## 🎨 Vibe Coding

Questo progetto è stato realizzato utilizzando il **vibe coding**, un approccio di sviluppo che sfrutta l'intelligenza artificiale per la generazione e l'iterazione rapida del codice, mantenendo sempre il controllo e la qualità attraverso revisioni continue e test.

Il vibe coding permette di:
- Prototipare rapidamente nuove funzionalità
- Esplorare diverse soluzioni architetturali
- Mantenere coerenza nel codice e nello stile
- Accelerare lo sviluppo mantenendo alta la qualità

## 📄 Licenza

Questo progetto è distribuito sotto licenza MIT.

## 🤝 Contribuire

I contributi sono benvenuti! Sentiti libero di aprire issue o pull request per miglioramenti, correzioni o nuove funzionalità.

## 📞 Contatti

Per domande o suggerimenti, apri una issue su GitHub.
