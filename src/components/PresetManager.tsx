/**
 * PresetManager Component
 * Gestione preset personalizzati per parametri audio
 */

import { useState } from 'react';
import { Save, Trash2, Download, Upload, Star } from 'lucide-react';
import { usePresets } from '@/hooks/useProgress';
import { cn } from '@/lib/utils';
import type { AudioPreset } from '@/lib/storage';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface PresetManagerProps {
  moduleNumber: number;
  currentParameters: Record<string, any>;
  onLoadPreset: (parameters: Record<string, any>) => void;
  className?: string;
}

/**
 * Gestione completa preset audio
 */
export function PresetManager({
  moduleNumber,
  currentParameters,
  onLoadPreset,
  className,
}: PresetManagerProps) {
  const { presets, savePreset, deletePreset } = usePresets(moduleNumber);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [presetDescription, setPresetDescription] = useState('');

  const handleSavePreset = () => {
    if (!presetName.trim()) return;

    savePreset({
      name: presetName,
      description: presetDescription || undefined,
      moduleNumber,
      parameters: currentParameters,
    });

    setPresetName('');
    setPresetDescription('');
    setShowSaveDialog(false);
  };

  const handleLoadPreset = (preset: AudioPreset) => {
    onLoadPreset(preset.parameters);
  };

  const handleDeletePreset = (presetId: string) => {
    if (confirm('Sei sicuro di voler eliminare questo preset?')) {
      deletePreset(presetId);
    }
  };

  const handleExportPresets = () => {
    const data = JSON.stringify(presets, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sound-playground-presets-module-${moduleNumber}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          I Tuoi Preset
        </h3>
        <div className="flex gap-2">
          {presets.length > 0 && (
            <button
              onClick={handleExportPresets}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Esporta preset"
            >
              <Download className="w-5 h-5" />
            </button>
          )}
          <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                <Save className="w-4 h-4" />
                Salva Preset
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Salva Preset</DialogTitle>
                <DialogDescription>
                  Salva la configurazione attuale come preset riutilizzabile
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nome Preset *
                  </label>
                  <Input
                    value={presetName}
                    onChange={e => setPresetName(e.target.value)}
                    placeholder="Es: Quinta Giusta La-Mi"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Descrizione (opzionale)
                  </label>
                  <Textarea
                    value={presetDescription}
                    onChange={e => setPresetDescription(e.target.value)}
                    placeholder="Aggiungi una descrizione per ricordare questo preset..."
                    rows={3}
                    className="w-full resize-none"
                  />
                </div>
              </div>
              <DialogFooter>
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Annulla
                </button>
                <button
                  onClick={handleSavePreset}
                  disabled={!presetName.trim()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Salva
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Presets List */}
      {presets.length === 0 ? (
        <div className="p-8 text-center bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
          <Star className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-600" />
          <p className="text-gray-600 dark:text-gray-400 mb-1">
            Nessun preset salvato
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Salva le tue configurazioni preferite per riutilizzarle facilmente
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {presets.map(preset => (
            <div
              key={preset.id}
              className="group p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {preset.name}
                  </h4>
                  {preset.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {preset.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-500">
                    <span>
                      {new Date(preset.createdAt).toLocaleDateString('it-IT')}
                    </span>
                    <span>•</span>
                    <span>
                      {Object.keys(preset.parameters).length} parametri
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleLoadPreset(preset)}
                    className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                  >
                    Carica
                  </button>
                  <button
                    onClick={() => handleDeletePreset(preset.id)}
                    className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Elimina preset"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Preview parameters (collapsed) */}
              <details className="mt-3 text-sm">
                <summary className="cursor-pointer text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
                  Mostra parametri
                </summary>
                <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-auto">
                    {JSON.stringify(preset.parameters, null, 2)}
                  </pre>
                </div>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Preset cards compatti per sidebar
 */
export function PresetCards({
  moduleNumber,
  onLoadPreset,
  className,
}: Omit<PresetManagerProps, 'currentParameters'>) {
  const { presets, deletePreset } = usePresets(moduleNumber);

  if (presets.length === 0) return null;

  return (
    <div className={cn('space-y-2', className)}>
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        Preset Rapidi
      </h4>
      <div className="grid grid-cols-2 gap-2">
        {presets.slice(0, 4).map(preset => (
          <button
            key={preset.id}
            onClick={() => onLoadPreset(preset.parameters)}
            className="p-3 text-left bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-800 transition-colors group"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm font-medium text-purple-900 dark:text-purple-100 truncate">
                {preset.name}
              </span>
              <button
                onClick={e => {
                  e.stopPropagation();
                  deletePreset(preset.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              </button>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
