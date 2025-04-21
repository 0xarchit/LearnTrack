import React from 'react';
import Card from '../../ui/Card';
import { FileText, Download } from 'lucide-react';
import Button from '../../ui/Button';

export default function StudentMaterials() {
  const materials = [
    {
      id: 1,
      title: 'Web Development Fundamentals',
      type: 'PDF',
      size: '2.4 MB',
      date: '2025-04-10'
    },
    {
      id: 2,
      title: 'Database Design Guide',
      type: 'PDF',
      size: '1.8 MB',
      date: '2025-04-08'
    },
    {
      id: 3,
      title: 'React Components Tutorial',
      type: 'PDF',
      size: '3.2 MB',
      date: '2025-04-06'
    }
  ];

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Materials</h2>
      <div className="space-y-4">
        {materials.map((material) => (
          <div 
            key={material.id}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">{material.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {material.type} • {material.size}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <Download size={16} />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}