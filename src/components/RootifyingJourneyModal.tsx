import React from 'react';
import { DragonSerpentineJourney } from './DragonSerpentineJourney';

interface RootifyingJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RootifyingJourneyModal: React.FC<RootifyingJourneyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return <DragonSerpentineJourney onClose={onClose} />;
};
