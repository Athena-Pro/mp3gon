import { describe, it, expect } from 'vitest';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Header from '../Header';

describe('Header', () => {
  it('renders application title', () => {
    const html = ReactDOMServer.renderToString(<Header />);
    expect(html).toContain('Sonic Geometer');
  });
});
