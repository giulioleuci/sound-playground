# Guida alla Contribuzione

Grazie per il tuo interesse nel contribuire a Sound Playground! 🎵

## Come Contribuire

### Segnalare Bug

1. Verifica che il bug non sia già stato segnalato nelle [Issues](../../issues)
2. Crea una nuova issue con:
   - Titolo chiaro e descrittivo
   - Passi per riprodurre il bug
   - Comportamento atteso vs comportamento attuale
   - Screenshot se applicabile
   - Info browser e sistema operativo

### Proporre Nuove Features

1. Apri una issue descrivendo:
   - Il problema che la feature risolve
   - La soluzione proposta
   - Alternative considerate
   - Mockup o esempi se disponibili

### Pull Requests

1. **Fork** del repository
2. Crea un **branch** dal branch `main`:
   ```bash
   git checkout -b feature/nome-feature
   ```
3. Fai le tue modifiche seguendo le linee guida
4. **Testa** le modifiche:
   ```bash
   npm run dev      # Test locale
   npm run build    # Verifica build
   npm run lint     # Linting
   ```
5. **Commit** con messaggi chiari:
   ```bash
   git commit -m "feat: aggiungi visualizzazione 3D onde"
   ```
6. **Push** al tuo fork
7. Apri una **Pull Request** verso `main`

## Linee Guida per il Codice

### Struttura File

```
src/
├── components/       # Componenti riutilizzabili
├── hooks/           # Custom React hooks
├── lib/             # Utilities e helpers
├── pages/           # Pagine/moduli
└── ...
```

### Convenzioni Codice

- **TypeScript**: Usa tipi espliciti, evita `any`
- **Naming**:
  - Componenti: `PascalCase`
  - File: `kebab-case.tsx` o `PascalCase.tsx` per componenti
  - Funzioni/variabili: `camelCase`
  - Costanti: `UPPER_SNAKE_CASE`
- **Imports**: Usa alias `@/` per paths assoluti
- **Comments**: JSDoc per funzioni pubbliche
- **Formatting**: Usa Prettier (auto-formattato)

### Codice Audio

- Usa `@/lib/audioUtils` per funzioni audio condivise
- Cleanup sempre oscillatori in `useEffect` cleanup
- Gestisci errori AudioContext
- Testa su browser diversi (Chrome, Firefox, Safari)

### Componenti UI

- Usa componenti shadcn/ui esistenti quando possibile
- Dark mode: usa classi Tailwind `dark:`
- Responsive: usa breakpoints Tailwind (`sm:`, `md:`, `lg:`)
- Accessibilità: aggiungi label, ARIA attributes

### Moduli Educativi

Struttura raccomandata per nuovi moduli:

```tsx
import ModuleLayout from '@/components/ModuleLayout';
import { useModuleStatus } from '@/hooks/useProgress';
// ... altri imports

export default function ModuloX() {
  const { markCompleted } = useModuleStatus(X);

  return (
    <ModuleLayout
      moduleNumber={X}
      title="Titolo"
      description="Descrizione"
      nextModule={{...}}
      prevModule={{...}}
    >
      {/* Contenuto educativo */}

      {/* InfoBox per spiegazioni */}
      {/* Visualizzazioni interattive */}
      {/* Controlli audio */}
      {/* Quiz opzionale */}

      <button onClick={() => markCompleted(100)}>
        Completa Modulo
      </button>
    </ModuleLayout>
  );
}
```

## Testing

### Unit Tests

```bash
npm run test        # Run tests
npm run test:watch  # Watch mode
```

Scrivi test per:
- Calcoli musicali (frequenze, intervalli, temperamenti)
- Utility functions
- Custom hooks (con @testing-library/react-hooks)

### Manual Testing

- Testa su Chrome, Firefox, Safari
- Testa responsive (mobile, tablet, desktop)
- Testa dark mode
- Testa con screen reader se possibile
- Verifica performance (60fps per animazioni)

## Commit Messages

Usa [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - Nuova feature
- `fix:` - Bug fix
- `docs:` - Documentazione
- `style:` - Formatting, no code change
- `refactor:` - Code restructuring
- `perf:` - Performance improvement
- `test:` - Adding tests
- `chore:` - Maintenance

Esempi:
```
feat: aggiungi modulo sintesi FM
fix: correggi memory leak oscillatori
docs: aggiorna README con nuovi moduli
refactor: estrai logica canvas in hook
```

## Code of Conduct

- Sii rispettoso e costruttivo
- Accetta feedback con mente aperta
- Focus sul migliorare il progetto
- Aiuta altri contributor

## Domande?

- Apri una [Discussion](../../discussions)
- Contatta i maintainer

## Licenza

Contribuendo, accetti che i tuoi contributi siano licenziati sotto la stessa licenza del progetto.

---

Grazie per contribuire a Sound Playground! 🎶
