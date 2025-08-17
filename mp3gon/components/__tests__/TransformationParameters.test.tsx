import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import TransformationParameters from '../TransformationParameters';
import { TransformationType } from '../../types';

describe('TransformationParameters', () => {
  it('calls onParamsChange when slider changes', () => {
    const handleChange = vi.fn();
    const container = document.createElement('div');
    document.body.appendChild(container);

    const configs = {
      gateThreshold: { label: 'Gate Threshold', min: 0, max: 1, step: 0.1, defaultValue: 0.5 }
    };

    act(() => {
      createRoot(container).render(
        <TransformationParameters
          transformation={TransformationType.AMPLITUDE}
          params={{}}
          onParamsChange={handleChange}
          configs={configs}
        />
      );
    });

    const input = container.querySelector('input[name="gateThreshold"]') as HTMLInputElement;
    act(() => {
      input.value = '0.7';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });

    expect(handleChange).toHaveBeenCalledWith({ gateThreshold: 0.7 });
  });
});
