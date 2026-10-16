import React from 'react';
import { DatabaseManager } from './database/DatabaseManager.tsx';
import { LanguageType } from '../types.ts';

interface DatabaseViewerProps {
  files?: Record<string, string>;
  language?: LanguageType;
  theme?: 'light' | 'dark';
  onClose?: () => void;
}

export const DatabaseViewer: React.FC<DatabaseViewerProps> = ({
  files = {},
  language = 'so',
  theme = 'dark',
  onClose
}) => {
  return (
    <DatabaseManager
      files={files}
      language={language}
      theme={theme}
      onClose={onClose}
    />
  );
};
