
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Shield } from 'lucide-react';
import DocumentUploadForm from '@/components/DocumentUploadForm';
import AdminPanel from '@/components/AdminPanel';

const Index = () => {
  const [currentView, setCurrentView] = useState<'upload' | 'admin'>('upload');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-white border border-gray-200">
                <img 
                  src="/lovable-uploads/bb7f33dd-a8e2-4412-a531-bfc85e91d097.png" 
                  alt="TRASNAL Logo" 
                  className="h-8 w-8 object-contain"
                />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">TRASNAL</h1>
                <p className="text-xs sm:text-sm text-gray-500">Envío de documentos</p>
              </div>
            </div>
            <nav className="flex space-x-1 sm:space-x-2">
              <Button
                variant={currentView === 'upload' ? 'default' : 'outline'}
                onClick={() => setCurrentView('upload')}
                size="sm"
                className="text-xs sm:text-sm"
                style={currentView === 'upload' ? { backgroundColor: '#DEDA00', borderColor: '#DEDA00', color: '#000' } : {}}
              >
                <FileText className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Cargar</span>
              </Button>
              <Button
                variant={currentView === 'admin' ? 'default' : 'outline'}
                onClick={() => setCurrentView('admin')}
                size="sm"
                className="text-xs sm:text-sm"
                style={currentView === 'admin' ? { backgroundColor: '#DEDA00', borderColor: '#DEDA00', color: '#000' } : {}}
              >
                <Shield className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {currentView === 'upload' ? (
          <div className="space-y-4 sm:space-y-6">
            {/* Welcome Section - Optimizado para móvil */}
            <Card className="text-black" style={{ background: 'linear-gradient(to right, #DEDA00, #C5C100)' }}>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl sm:text-2xl flex items-center space-x-2 sm:space-x-3">
                  <FileText className="h-6 w-6 sm:h-8 sm:w-8" />
                  <span>Carga de Documentos</span>
                </CardTitle>
                <CardDescription className="text-gray-800 text-sm">
                  Sube documentos de vehículos y conductores
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Upload Form - Directo sin widgets */}
            <DocumentUploadForm />
          </div>
        ) : (
          <AdminPanel />
        )}
      </main>
    </div>
  );
};

export default Index;
