
import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PresetItem, getItemsByCategory } from '@/constants/billing';
import { Plus } from 'lucide-react';

interface PresetItemSelectorProps {
  onItemSelect: (item: PresetItem) => void;
}

const PresetItemSelector: React.FC<PresetItemSelectorProps> = ({ onItemSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState<PresetItem['category'] | ''>('');
  const [selectedItem, setSelectedItem] = useState<PresetItem | null>(null);

  const handleCategoryChange = (category: PresetItem['category']) => {
    setSelectedCategory(category);
    setSelectedItem(null);
  };

  const handleItemSelect = (itemDescription: string) => {
    // Only attempt to find items if a category is selected
    if (selectedCategory) {
      const item = getItemsByCategory(selectedCategory).find(
        i => i.description === itemDescription
      );
      if (item) {
        setSelectedItem(item);
      }
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
      <Select onValueChange={handleCategoryChange} value={selectedCategory}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Cylinder">Cylinder</SelectItem>
          <SelectItem value="Bottle">Bottles</SelectItem>
        </SelectContent>
      </Select>

      {selectedCategory && (
        <Select 
          onValueChange={handleItemSelect} 
          value={selectedItem?.description || ''}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={`Select ${selectedCategory.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {getItemsByCategory(selectedCategory).map((item) => (
              <SelectItem key={item.description} value={item.description}>
                {item.description}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

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
    </div>
  );
};

export default PresetItemSelector;
