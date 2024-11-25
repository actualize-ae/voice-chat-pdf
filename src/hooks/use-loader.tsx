

import RippleWaveLoader from '@/components/loaders/RippleWaveLoader';
import SpinningCubeLoader from '@/components/loaders/SpinningCubeLoader';
import WhirlpoolLoader from '@/components/loaders/WhirlpoolLoader';
import { cn } from '@/lib/utils';
import { useState, useCallback } from 'react';
import React from 'react';
// Add further loader types
export type LoaderType = 'whirlpool' | 'spinning-cube' | 'ripple';

interface UseLoaderReturn {
  isLoading: boolean;
  loaderType: LoaderType;
  showLoader: (type?: LoaderType) => void;
  hideLoader: () => void;
  LoaderComponent: React.FC;
  classNames?: string
}

export const useLoader = ({ loaderType = 'whirlpool', className = '' }: { loaderType?: LoaderType, className?: string }): UseLoaderReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const showLoader = useCallback(() => {
    setIsLoading(true);
  }, []);

  const hideLoader = useCallback(() => {
    setIsLoading(false);
  }, []);

  const wrapperClassName = cn('fixed z-10', className)
  const LoaderComponent = () => {
    if (!isLoading) return null;

    switch (loaderType) {
      case 'whirlpool':
        return <div className={wrapperClassName}><WhirlpoolLoader /></div>
      case 'spinning-cube':
        return <div className={wrapperClassName}><SpinningCubeLoader /></div>
      case 'ripple':
        return <div className={wrapperClassName}><RippleWaveLoader /></div>
      default:
        return null;
    }
  };

  return {
    isLoading,
    loaderType,
    showLoader,
    hideLoader,
    LoaderComponent,
  };
};