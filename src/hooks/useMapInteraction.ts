import { useState, useCallback } from 'react';
import type { ColorMode } from '../types';

interface MapState {
  selectedCountry: string | null;
  hoveredCountry: string | null;
  colorMode: ColorMode;
  tooltipPos: { x: number; y: number } | null;
  zoomLevel: number;
  panOffset: [number, number];
}

export function useMapInteraction() {
  const [state, setState] = useState<MapState>({
    selectedCountry: null,
    hoveredCountry: null,
    colorMode: 'conflict_frequency',
    tooltipPos: null,
    zoomLevel: 1,
    panOffset: [0, 0],
  });

  const selectCountry = useCallback((id: string | null) => {
    setState((s) => ({ ...s, selectedCountry: id }));
  }, []);

  const hoverCountry = useCallback(
    (id: string | null, pos: { x: number; y: number } | null) => {
      setState((s) => ({ ...s, hoveredCountry: id, tooltipPos: pos }));
    },
    [],
  );

  const setColorMode = useCallback((mode: ColorMode) => {
    setState((s) => ({ ...s, colorMode: mode }));
  }, []);

  const setZoom = useCallback((level: number) => {
    setState((s) => ({ ...s, zoomLevel: Math.max(0.5, Math.min(8, level)) }));
  }, []);

  const setPan = useCallback((offset: [number, number]) => {
    setState((s) => ({ ...s, panOffset: offset }));
  }, []);

  return {
    ...state,
    selectCountry,
    hoverCountry,
    setColorMode,
    setZoom,
    setPan,
  };
}
