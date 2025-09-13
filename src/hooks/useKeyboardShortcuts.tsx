import { useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface ShortcutConfig {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
  preventDefault?: boolean;
}

export const useKeyboardShortcuts = (shortcuts: ShortcutConfig[] = []) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const shortcutsRef = useRef(shortcuts);
  
  // Update shortcuts ref when shortcuts change
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  const defaultShortcuts: ShortcutConfig[] = [
    // Navigation shortcuts
    {
      key: 'h',
      altKey: true,
      action: () => navigate('/'),
      description: 'Go to Home',
      preventDefault: true,
    },
    {
      key: 'd',
      altKey: true,
      action: () => navigate('/dashboard'),
      description: 'Go to Dashboard',
      preventDefault: true,
    },
    {
      key: 'c',
      altKey: true,
      action: () => navigate('/chat'),
      description: 'Go to Chat',
      preventDefault: true,
    },
    {
      key: 'o',
      altKey: true,
      action: () => navigate('/doctors'),
      description: 'Go to Doctors',
      preventDefault: true,
    },
    {
      key: 'l',
      altKey: true,
      action: () => navigate('/lab-tests'),
      description: 'Go to Lab Tests',
      preventDefault: true,
    },
    // Search shortcut
    {
      key: '/',
      ctrlKey: true,
      action: () => {
        const searchInput = document.querySelector('input[placeholder*="search" i], input[placeholder*="Search" i]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        } else {
          toast({
            title: 'Search',
            description: 'No search input found on this page',
          });
        }
      },
      description: 'Focus search input',
      preventDefault: true,
    },
    // Help shortcut
    {
      key: '?',
      shiftKey: true,
      action: () => {
        showShortcutsHelp();
      },
      description: 'Show keyboard shortcuts',
      preventDefault: true,
    },
    // Emergency shortcut
    {
      key: 'e',
      ctrlKey: true,
      shiftKey: true,
      action: () => {
        toast({
          title: 'Emergency Alert',
          description: 'In case of medical emergency, call 911 immediately!',
          variant: 'destructive',
        });
      },
      description: 'Emergency alert',
      preventDefault: true,
    },
    // Quick appointment scheduling
    {
      key: 'a',
      ctrlKey: true,
      altKey: true,
      action: () => {
        const appointmentSection = document.querySelector('[data-testid="appointment-scheduler"]');
        if (appointmentSection) {
          appointmentSection.scrollIntoView({ behavior: 'smooth' });
        } else {
          navigate('/dashboard');
        }
      },
      description: 'Quick appointment scheduling',
      preventDefault: true,
    },
    // Export functionality
    {
      key: 's',
      ctrlKey: true,
      shiftKey: true,
      action: () => {
        const exportButton = document.querySelector('button[data-action="export"]') as HTMLButtonElement;
        if (exportButton) {
          exportButton.click();
        } else {
          toast({
            title: 'Export',
            description: 'No exportable content found on this page',
          });
        }
      },
      description: 'Export current page data',
      preventDefault: true,
    },
  ];

  const showShortcutsHelp = useCallback(() => {
    const allShortcuts = [...defaultShortcuts, ...shortcutsRef.current];
    
    const shortcutsList = allShortcuts
      .map(shortcut => {
        const keys = [];
        if (shortcut.ctrlKey) keys.push('Ctrl');
        if (shortcut.altKey) keys.push('Alt');
        if (shortcut.shiftKey) keys.push('Shift');
        if (shortcut.metaKey) keys.push('Cmd');
        keys.push(shortcut.key.toUpperCase());
        
        return `${keys.join(' + ')}: ${shortcut.description}`;
      })
      .join('\n');

    toast({
      title: 'Keyboard Shortcuts',
      description: (
        <div className="max-h-64 overflow-y-auto">
          <pre className="text-xs whitespace-pre-wrap font-mono">
            {shortcutsList}
          </pre>
        </div>
      ),
    });
  }, [toast]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Ignore shortcuts when user is typing in input fields
    const activeElement = document.activeElement;
    const isInputActive = 
      activeElement?.tagName === 'INPUT' || 
      activeElement?.tagName === 'TEXTAREA' || 
      activeElement?.getAttribute('contenteditable') === 'true';

    // Only ignore non-global shortcuts when input is active
    const isGlobalShortcut = (event.ctrlKey || event.altKey || event.metaKey) && 
      ['?', 'e'].includes(event.key);

    if (isInputActive && !isGlobalShortcut) return;

    const allShortcuts = [...defaultShortcuts, ...shortcutsRef.current];
    
    const matchingShortcut = allShortcuts.find(shortcut => {
      return (
        shortcut.key.toLowerCase() === event.key.toLowerCase() &&
        !!shortcut.ctrlKey === event.ctrlKey &&
        !!shortcut.altKey === event.altKey &&
        !!shortcut.shiftKey === event.shiftKey &&
        !!shortcut.metaKey === event.metaKey
      );
    });

    if (matchingShortcut) {
      if (matchingShortcut.preventDefault !== false) {
        event.preventDefault();
      }
      
      try {
        matchingShortcut.action();
      } catch (error) {
        console.error('Error executing shortcut:', error);
        toast({
          title: 'Shortcut Error',
          description: 'Failed to execute keyboard shortcut',
          variant: 'destructive',
        });
      }
    }
  }, [navigate, toast]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Return utility functions for components to use
  return {
    showShortcutsHelp,
    addShortcut: (shortcut: ShortcutConfig) => {
      shortcutsRef.current = [...shortcutsRef.current, shortcut];
    },
    removeShortcut: (key: string) => {
      shortcutsRef.current = shortcutsRef.current.filter(s => s.key !== key);
    },
  };
};

// Hook for specific page shortcuts
export const usePageShortcuts = (pageShortcuts: ShortcutConfig[]) => {
  return useKeyboardShortcuts(pageShortcuts);
};

// Common shortcut patterns
export const createShortcut = {
  navigation: (key: string, path: string, description: string): ShortcutConfig => ({
    key,
    altKey: true,
    action: () => {
      const navigate = useNavigate();
      navigate(path);
    },
    description,
    preventDefault: true,
  }),

  action: (key: string, action: () => void, description: string, modifiers?: Partial<Pick<ShortcutConfig, 'ctrlKey' | 'altKey' | 'shiftKey' | 'metaKey'>>): ShortcutConfig => ({
    key,
    ...modifiers,
    action,
    description,
    preventDefault: true,
  }),

  focus: (key: string, selector: string, description: string): ShortcutConfig => ({
    key,
    ctrlKey: true,
    action: () => {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        element.focus();
        if (element instanceof HTMLInputElement) {
          element.select();
        }
      }
    },
    description,
    preventDefault: true,
  }),
};

// Shortcut component for displaying shortcuts in UI
export const ShortcutDisplay = ({ shortcut, className = '' }: { 
  shortcut: Pick<ShortcutConfig, 'key' | 'ctrlKey' | 'altKey' | 'shiftKey' | 'metaKey'>; 
  className?: string; 
}) => {
  const keys = [];
  if (shortcut.ctrlKey) keys.push('Ctrl');
  if (shortcut.altKey) keys.push('Alt');
  if (shortcut.shiftKey) keys.push('Shift');
  if (shortcut.metaKey) keys.push('⌘');
  keys.push(shortcut.key.toUpperCase());

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-mono ${className}`}>
      {keys.map((key, index) => (
        <span key={index}>
          <kbd className="px-1.5 py-0.5 bg-muted border border-border rounded text-xs">
            {key}
          </kbd>
          {index < keys.length - 1 && <span className="mx-1">+</span>}
        </span>
      ))}
    </span>
  );
};