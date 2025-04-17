
import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { useCylinders } from '@/context/CylinderContext';

interface PresetItem {
  description: string;
  hsnSac: string;
  defaultRate: number;
}

interface PresetItemSelectorProps {
  onItemSelect: (item: PresetItem) => void;
  onCustomItemAdd: () => void;
}

const PresetItemSelector: React.FC<PresetItemSelectorProps> = ({ onItemSelect, onCustomItemAdd }) => {
  const { cylinders } = useCylinders();
  const [selectedItem, setSelectedItem] = useState<PresetItem | null>(null);

  const handleItemSelect = (itemDescription: string) => {
    const item = cylinders.find(i => i.name === itemDescription);
    if (item) {
      setSelectedItem({
        description: item.name,
        hsnSac: item.hsnSac,
        defaultRate: item.defaultRate
      });
    }
  };

  const handleAddItem = () => {
    if (selectedItem) {
      onItemSelect(selectedItem);
      setSelectedItem(null);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <Select onValueChange={handleItemSelect} value={selectedItem?.description || ''}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select cylinder size" />
        </SelectTrigger>
        <SelectContent>
          {cylinders.map((cylinder) => (
            <SelectItem key={cylinder.id} value={cylinder.name}>
              {cylinder.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedItem && (
        <Button 
          onClick={handleAddItem}
          variant="outline" 
          size="sm"
          className="ml-2"
        >
          <Plus className="mr-1 h-4 w-4" /> Add
        </Button>
      )}
      
      <Button 
        onClick={onCustomItemAdd}
        variant="outline" 
        size="sm"
        className="ml-2"
      >
        <Plus className="mr-1 h-4 w-4" /> Add Custom Item
      </Button>
    </div>
  );
};

export default PresetItemSelector;
