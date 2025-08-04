import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FolderOpen, HardDrive, Globe } from 'lucide-react';
import { getStoragePath } from '@/utils/localStorage';

export const StorageInfo: React.FC = () => {
  const [storagePath, setStoragePath] = useState<string | null>(null);
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    const checkStorage = async () => {
      const path = await getStoragePath();
      setStoragePath(path);
      setIsElectron(typeof (window as any).electronAPI !== 'undefined');
    };
    
    checkStorage();
  }, []);

  const openStorageLocation = () => {
    if (isElectron && storagePath && storagePath !== 'Browser localStorage') {
      // In Electron, we could potentially open the folder
      // For now, we'll just show an alert with the path
      alert(`Data is stored in: ${storagePath}`);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          {isElectron ? <HardDrive className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
          Data Storage Location
        </CardTitle>
        <CardDescription className="text-xs">
          Your data is stored locally on this device
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Storage Type:</span>
          <Badge variant={isElectron ? "default" : "secondary"}>
            {isElectron ? "File System" : "Browser Storage"}
          </Badge>
        </div>
        
        {storagePath && (
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground">Location:</span>
            <div className="p-2 bg-muted rounded text-xs font-mono break-all">
              {storagePath}
            </div>
            {isElectron && storagePath !== 'Browser localStorage' && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={openStorageLocation}
                className="w-full"
              >
                <FolderOpen className="h-3 w-3 mr-1" />
                Show Location
              </Button>
            )}
          </div>
        )}
        
        <div className="text-xs text-muted-foreground">
          {isElectron 
            ? "Data is saved as JSON files on your local disk and persists permanently."
            : "Data is saved in browser storage and persists until you clear browser data."
          }
        </div>
      </CardContent>
    </Card>
  );
};