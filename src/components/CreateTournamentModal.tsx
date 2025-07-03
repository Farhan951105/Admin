import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { adminAPI } from '../utils/api';
import type { Tournament as ApiTournament } from '../types';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from './ui/label';
import { toast } from "sonner";

interface CreateTournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTournamentCreated: (newTournament: ApiTournament) => void;
}

const CreateTournamentModal: React.FC<CreateTournamentModalProps> = ({ isOpen, onClose, onTournamentCreated }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [bannerImage, setBannerImage] = useState<File | null>(null);

  const [newTournament, setNewTournament] = useState({
    name: '',
    theme: 'Classic',
    entryFee: '',
    currency: 'USDT',
    startsAt: '',
    startingStack: '',
    blindspeed: '',
    minPlayers: '',
    maxPlayers: '',
    prizePlaces: '',
    lateRegMin: '',
  });

  useEffect(() => {
    if (!isOpen) {
      setIsAnimatingOut(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      onClose();
    }, 300); // Duration of the fade-out animation
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTournament(prev => ({ ...prev, [name]: value }));
  };

  const handleThemeChange = (value: string) => {
    setNewTournament(prev => ({ ...prev, theme: value }));
  };

  const handleCurrencyChange = (value: string) => {
    setNewTournament(prev => ({ ...prev, currency: value }));
  };

  const handleCreateTournament = async () => {
    setIsCreating(true);
    try {
      const tournamentData = {
        ...newTournament,
        entryFee: parseFloat(newTournament.entryFee) || 0,
        startingStack: parseInt(newTournament.startingStack),
        blindspeed: parseInt(newTournament.blindspeed),
        minPlayers: parseInt(newTournament.minPlayers),
        maxPlayers: newTournament.maxPlayers ? parseInt(newTournament.maxPlayers) : undefined,
        prizePlaces: parseInt(newTournament.prizePlaces),
        lateRegMin: parseInt(newTournament.lateRegMin),
        prizeStructure: [], // Defaulting prize structure
        startsAt: newTournament.startsAt ? new Date(newTournament.startsAt).toISOString() : '',
      };

      const formData = new FormData();
      Object.entries(tournamentData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      if (bannerImage) {
        formData.append("banner", bannerImage);
      }

      const createdTournament = await adminAPI.createTournament(formData);

      onTournamentCreated(createdTournament);
      onClose();
      toast.success("Tournament created successfully!");
    } catch (error: any) {
      console.error('Failed to create tournament:', error);
      let errorMsg = "An unexpected error occurred. Please try again.";
      const serverError = error.response?.data?.error;

      if (typeof serverError === 'string') {
        errorMsg = serverError;
      } else if (typeof serverError === 'object' && serverError !== null) {
        // Handle Zod-formatted errors
        const messages = Object.values(serverError)
          .flatMap((err: any) => err._errors)
          .filter(Boolean);

        if (messages.length > 0) {
          errorMsg = messages.join('; ');
        }
      }

      toast.error(errorMsg);
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen && !isAnimatingOut) {
    return null;
  }

  const backdropClasses = `fixed inset-0 bg-background/80 backdrop-blur-sm z-50 overflow-y-auto flex items-start justify-center pt-10 px-4 pb-10 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`;
  const modalClasses = `relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-card transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`;

  return ReactDOM.createPortal(
    <div className={backdropClasses} onClick={handleClose}>
      <div className={modalClasses} onClick={(e) => e.stopPropagation()}>
        <div className="mt-3">
          <h3 className="text-lg font-medium text-foreground mb-4">Create New Tournament</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="bannerImage">Banner Image</Label>
              <Input
                id="bannerImage"
                name="bannerImage"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setBannerImage(file);
                  }
                }}
              />
              {bannerImage && (
                <img
                  src={URL.createObjectURL(bannerImage)}
                  alt="Preview"
                  className="mt-2 w-full h-32 object-cover rounded"
                />
              )}
            </div>

            <div>
              <Label htmlFor="name">Tournament Name</Label>
              <Input id="name" name="name" value={newTournament.name} onChange={handleInputChange} placeholder="e.g., Sunday Million" />
            </div>
            <div>
              <Label htmlFor="theme">Tournament Theme</Label>
              <Select name="theme" value={newTournament.theme} onValueChange={handleThemeChange}>
                <SelectTrigger id="theme">
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Classic">Classic</SelectItem>
                  <SelectItem value="Cosmic">Cosmic</SelectItem>
                  <SelectItem value="Nautical">Nautical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="entryFee">Entry Fee</Label>
                <Input id="entryFee" name="entryFee" type="number" value={newTournament.entryFee} onChange={handleInputChange} placeholder="e.g., 100" />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select name="currency" value={newTournament.currency} onValueChange={handleCurrencyChange}>
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USDT">USDT</SelectItem>
                    <SelectItem value="USDC">USDC</SelectItem>
                    <SelectItem value="BTC">BTC</SelectItem>
                    <SelectItem value="ETH">ETH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="startsAt">Start Date & Time</Label>
              <Input id="startsAt" name="startsAt" type="datetime-local" value={newTournament.startsAt} onChange={handleInputChange} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startingStack">Starting Stack</Label>
                <Input id="startingStack" name="startingStack" type="number" value={newTournament.startingStack} onChange={handleInputChange} placeholder="e.g., 10000" />
              </div>
              <div>
                <Label htmlFor="blindspeed">Blind Speed (sec)</Label>
                <Input id="blindspeed" name="blindspeed" type="number" value={newTournament.blindspeed} onChange={handleInputChange} placeholder="e.g., 600" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minPlayers">Min Players</Label>
                <Input id="minPlayers" name="minPlayers" type="number" value={newTournament.minPlayers} onChange={handleInputChange} placeholder="e.g., 2" />
              </div>
              <div>
                <Label htmlFor="maxPlayers">Max Players</Label>
                <Input id="maxPlayers" name="maxPlayers" type="number" value={newTournament.maxPlayers} onChange={handleInputChange} placeholder="e.g., 9" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="prizePlaces">Prize Places</Label>
                <Input id="prizePlaces" name="prizePlaces" type="number" value={newTournament.prizePlaces} onChange={handleInputChange} placeholder="e.g., 3" />
              </div>
              <div>
                <Label htmlFor="lateRegMin">Late Reg (min)</Label>
                <Input id="lateRegMin" name="lateRegMin" type="number" value={newTournament.lateRegMin} onChange={handleInputChange} placeholder="e.g., 60" />
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateTournament}
              disabled={isCreating}
            >
              {isCreating ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CreateTournamentModal; 