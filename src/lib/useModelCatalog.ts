import { useEffect, useState } from 'react';
import axios from 'axios';
import { AIProviderType } from '../types.ts';

export interface CatalogModel {
  id: string;
  name: string;
  provider: AIProviderType;
  description: string;
  free?: boolean;
  contextLength?: number;
}

export interface ModelCatalog {
  gemini: CatalogModel[];
  openrouter: CatalogModel[];
  orServerKey: boolean;
  geminiServerKey: boolean;
  loading: boolean;
}

type Loaded = Omit<ModelCatalog, 'loading'>;

// One shared copy for every picker (create screen, AI settings, builder settings)
let cache: Loaded | null = null;
let inflight: Promise<Loaded> | null = null;

async function loadCatalog(): Promise<Loaded> {
  const [prov, or] = await Promise.allSettled([
    axios.get('/api/ai/providers'),
    axios.get('/api/ai/openrouter/models')
  ]);

  let gemini: CatalogModel[] = [];
  let orServerKey = false;
  let geminiServerKey = false;
  if (prov.status === 'fulfilled') {
    const data: any = prov.value.data;
    const g = (data?.providers || []).find((p: any) => p.id === 'gemini');
    gemini = (g?.models || []).map((m: any) => ({
      id: m.id,
      name: m.name || m.id,
      provider: 'gemini' as AIProviderType,
      description: m.description || ''
    }));
    orServerKey = Boolean(data?.openrouter?.hasServerKey);
    geminiServerKey = Boolean(data?.serverDefault?.hasBuiltinKey);
  }

  let openrouter: CatalogModel[] = [];
  if (or.status === 'fulfilled') {
    openrouter = ((or.value.data as any)?.models || []).map((m: any) => ({
      id: m.id,
      name: m.name || m.id,
      provider: 'openrouter' as AIProviderType,
      description: m.free
        ? 'Free'
        : `$${((m.promptPrice || 0) * 1e6).toFixed(2)} in / $${((m.completionPrice || 0) * 1e6).toFixed(2)} out per 1M tokens`,
      free: Boolean(m.free),
      contextLength: m.contextLength || 0
    }));
  }

  return { gemini, openrouter, orServerKey, geminiServerKey };
}

export function useModelCatalog(): ModelCatalog {
  const [state, setState] = useState<Loaded | null>(cache);

  useEffect(() => {
    if (cache) return;
    let alive = true;
    if (!inflight) {
      inflight = loadCatalog().then(r => {
        // Only keep the result if at least one list loaded (otherwise try again next time)
        if (r.gemini.length > 0 || r.openrouter.length > 0) cache = r;
        inflight = null;
        return r;
      });
    }
    inflight.then(r => { if (alive) setState(r); }).catch(() => { inflight = null; });
    return () => { alive = false; };
  }, []);

  return {
    gemini: state?.gemini || [],
    openrouter: state?.openrouter || [],
    orServerKey: state?.orServerKey || false,
    geminiServerKey: state?.geminiServerKey || false,
    loading: !state
  };
}
