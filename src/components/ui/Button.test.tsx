import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';
import { cn } from '../../utils/cn';

describe('cn utility', () => {
  it('merges tailwind classes correctly', () => {
    expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
    expect(cn('px-2 py-1', 'p-4')).toBe('p-4'); // tailwind-merge handling conflicts
  });
});

describe('Button component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary'); // Default primary variant
  });

  it('handles clicks', async () => {
    let clicked = false;
    render(<Button onClick={() => clicked = true}>Click me</Button>);
    
    await userEvent.click(screen.getByRole('button', { name: /click me/i }));
    expect(clicked).toBe(true);
  });
});
