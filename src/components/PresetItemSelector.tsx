
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

interface PresetItem {
  description: string;
  hsnSac: string;
  defaultRate: number;
}

interface PresetItemSelectorProps {
  onItemSelect: (item: PresetItem) => void;
  onCustomItemAdd: () => void;
}

const PRESET_ITEMS: PresetItem[] = [
  { description: '8kg Cylinder', hsnSac: '27111900', defaultRate: 800 },
  { description: '12kg', hsnSac: '27111900', defaultRate: 1200 },
  { description: '17kg', hsnSac: '27111900', defaultRate: 1700 },
  { description: '33kg', hsnSac: '27111900', defaultRate: 3300 },
];

const PresetItemSelector: React.FC<PresetItemSelectorProps> = ({ onItemSelect, onCustomItemAdd }) => {
  const [selectedItem, setSelectedItem] = useState<PresetItem | null>(null);

  const handleItemSelect = (itemDescription: string) => {
    const item = PRESET_ITEMS.find(i => i.description === itemDescription);
    if (item) {
      setSelectedItem(item);
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
          {PRESET_ITEMS.map((item) => (
            <SelectItem key={item.description} value={item.description}>
              {item.description}
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
