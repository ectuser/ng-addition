import { Signal, computed, inject } from '@angular/core';

import { DEFERRED_LOADER_OPTIONS, DeferredLoaderOptions } from './deferred-loader-settings';

export function useSettings(
  loadingThreshold: Signal<number | undefined>,
  minLoadingTime: Signal<number | undefined>,
): Signal<DeferredLoaderOptions> {
  const options = inject(DEFERRED_LOADER_OPTIONS);

  return computed(() => {
    const loadingThresholdOption = loadingThreshold() ?? options.loadingThreshold;
    const minLoadingTimeOption = minLoadingTime() ?? options.minLoadingTime;

    return {
      ...options,
      loadingThresholdOption,
      minLoadingTimeOption,
    };
  });
}
