
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, FileText, Shield } from 'lucide-react';
import DocumentUploadForm from '@/components/DocumentUploadForm';
import AdminPanel from '@/components/AdminPanel';

const Index = () => {
  const [currentView, setCurrentView] = useState<'upload' | 'admin'>('upload');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">Control DocuFlota</h1>
                <p className="text-xs sm:text-sm text-gray-500">TRASNAL SA</p>
              </div>
            </div>
            <nav className="flex space-x-1 sm:space-x-2">
              <Button
                variant={currentView === 'upload' ? 'default' : 'outline'}
                onClick={() => setCurrentView('upload')}
                size="sm"
                className="text-xs sm:text-sm"
              >
                <FileText className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Cargar</span>
              </Button>
              <Button
                variant={currentView === 'admin' ? 'default' : 'outline'}
                onClick={() => setCurrentView('admin')}
                size="sm"
                className="text-xs sm:text-sm"
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
            <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl sm:text-2xl flex items-center space-x-2 sm:space-x-3">
                  <FileText className="h-6 w-6 sm:h-8 sm:w-8" />
                  <span>Carga de Documentos</span>
                </CardTitle>
                <CardDescription className="text-blue-100 text-sm">
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
