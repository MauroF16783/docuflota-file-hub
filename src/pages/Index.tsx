
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, FileText, Users, Shield } from 'lucide-react';
import DocumentUploadForm from '@/components/DocumentUploadForm';
import AdminPanel from '@/components/AdminPanel';

const Index = () => {
  const [currentView, setCurrentView] = useState<'upload' | 'admin'>('upload');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Control DocuFlota</h1>
                <p className="text-sm text-gray-500">TRASNAL SA</p>
              </div>
            </div>
            <nav className="flex space-x-2">
              <Button
                variant={currentView === 'upload' ? 'default' : 'outline'}
                onClick={() => setCurrentView('upload')}
                className="flex items-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>Cargar Documentos</span>
              </Button>
              <Button
                variant={currentView === 'admin' ? 'default' : 'outline'}
                onClick={() => setCurrentView('admin')}
                className="flex items-center space-x-2"
              >
                <Shield className="h-4 w-4" />
                <span>Administración</span>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'upload' ? (
          <div className="space-y-6">
            {/* Welcome Section */}
            <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center space-x-3">
                  <FileText className="h-8 w-8" />
                  <span>Carga de Documentos de Flota</span>
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Sube documentos de vehículos y conductores de manera rápida y segura
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Features Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <Truck className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Gestión de Vehículos</h3>
                  <p className="text-gray-600 text-sm">Documentos de mantenimiento, revisión tecnomecánica y más</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Conductores</h3>
                  <p className="text-gray-600 text-sm">Seguridad social y documentación personal</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Organización</h3>
                  <p className="text-gray-600 text-sm">Etiquetas personalizadas y clasificación automática</p>
                </CardContent>
              </Card>
            </div>

            {/* Upload Form */}
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
