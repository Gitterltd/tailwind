
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Forklift, ForkliftStatus, ForkliftType } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

interface ForkliftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  forklift?: Forklift;
  onSave: (forklift: Forklift) => void;
}

const ForkliftDialog = ({ open, onOpenChange, forklift, onSave }: ForkliftDialogProps) => {
  const { toast } = useToast();
  const isEditing = !!forklift;
  
  const [formData, setFormData] = useState<Partial<Forklift>>(
    forklift || {
      id: `${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      model: '',
      type: ForkliftType.GAS,
      capacity: '',
      acquisitionDate: '01/01/2023',
      lastMaintenance: format(new Date(), 'dd/MM/yyyy'),
      status: ForkliftStatus.OPERATIONAL,
      hourMeter: 0
    }
  );

  // Handle form field changes
  const handleChange = (field: keyof Forklift, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Parse date string to Date object (dd/MM/yyyy -> Date)
  const parseDate = (dateStr: string): Date => {
    try {
      const [day, month, year] = dateStr.split('/').map(Number);
      return new Date(year, month - 1, day);
    } catch (e) {
      return new Date();
    }
  };

  // Format date for display (Date -> dd/MM/yyyy)
  const formatDateString = (date: Date): string => {
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.model || !formData.capacity) {
      toast({
        title: "Error saving",
        description: "Fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // Save forklift
    onSave(formData as Forklift);
    
    // Reset form and close dialog
    if (!isEditing) {
      setFormData({
        id: `${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        model: '',
        type: ForkliftType.GAS,
        capacity: '',
        acquisitionDate: '01/01/2023',
        lastMaintenance: format(new Date(), 'dd/MM/yyyy'),
        status: ForkliftStatus.OPERATIONAL,
        hourMeter: 0
      });
    }
    
    onOpenChange(false);
    
    toast({
      title: isEditing ? "Upgraded forklift" : "Forklift added",
      description: `${formData.model} has ${isEditing ? 'updated' : 'added'} successfully!`
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Forklift' : 'Add New Forklift'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Edit your forklift information in the fields below.' 
              : 'Fill in the new forklift information in the fields below.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="id">ID</Label>
              <Input 
                id="id" 
                value={formData.id} 
                onChange={(e) => handleChange('id', e.target.value)}
                disabled={isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => handleChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ForkliftType.GAS}>Gas</SelectItem>
                  <SelectItem value={ForkliftType.ELECTRIC}>Electrical</SelectItem>
                  <SelectItem value={ForkliftType.RETRACTABLE}>Retractable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input 
                id="model" 
                value={formData.model} 
                onChange={(e) => handleChange('model', e.target.value)}
                placeholder="Ex: Toyota 8FGU25"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input 
                id="capacity" 
                value={formData.capacity} 
                onChange={(e) => handleChange('capacity', e.target.value)}
                placeholder="Ex: 2.500 kg"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hourMeter">Hour Meter</Label>
              <Input 
                id="hourMeter" 
                type="number"
                min="0"
                value={formData.hourMeter} 
                onChange={(e) => handleChange('hourMeter', parseInt(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ForkliftStatus.OPERATIONAL}>In Operation</SelectItem>
                  <SelectItem value={ForkliftStatus.MAINTENANCE}>Waiting for Maintenance</SelectItem>
                  <SelectItem value={ForkliftStatus.STOPPED}>Stopped</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Date of Acquisition</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.acquisitionDate}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={parseDate(formData.acquisitionDate || '')}
                  onSelect={(date) => handleChange('acquisitionDate', formatDateString(date || new Date()))}
                  locale={ptBR}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label>Last Maintenance</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.lastMaintenance}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={parseDate(formData.lastMaintenance || '')}
                  onSelect={(date) => handleChange('lastMaintenance', formatDateString(date || new Date()))}
                  locale={ptBR}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{isEditing ? 'Save Changes' : 'Add Forklift'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ForkliftDialog;
