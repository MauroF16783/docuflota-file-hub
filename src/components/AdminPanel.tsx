import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Truck, Users, Tag, Plus, Trash, LogOut } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useVehiculos } from "@/hooks/useVehiculos";
import { useConductores } from "@/hooks/useConductores";
import { useAdminAuth, Administrador } from '@/hooks/useAdminAuth';
import { supabase } from '@/integrations/supabase/client';

const AdminPanel = () => {
  const { toast } = useToast();
  const { authenticateAdmin, loading: authLoading } = useAdminAuth();
  const [admin, setAdmin] = useState<Administrador | null>(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Hooks para obtener datos de Supabase
  const { vehiculos, loading: vehiculosLoading, error: vehiculosError } = useVehiculos();
  const { conductores, loading: conductoresLoading, error: conductoresError } = useConductores();

  // Estados para formularios de vehículos
  const [newVehiculo, setNewVehiculo] = useState({
    placa: '',
    marca: '',
    modelo: '',
    ano: ''
  });

  // Estados para formularios de conductores
  const [newConductor, setNewConductor] = useState({
    cedula: '',
    nombres: '',
    apellidos: '',
    telefono: '',
    email: ''
  });

  // Mock data para etiquetas (mantener funcionalidad existente)
  const [etiquetas, setEtiquetas] = useState([
    { id: 1, nombre: 'Inspección', tipo: 'placa' },
    { id: 2, nombre: 'Permisos', tipo: 'cedula' },
    { id: 3, nombre: 'Certificados', tipo: 'placa' }
  ]);

  const [newEtiqueta, setNewEtiqueta] = useState({ nombre: '', tipo: '' });
  
  // Estados para inserción en lotes - actualizados para información completa
  const [batchVehiculos, setBatchVehiculos] = useState('');
  const [batchConductores, setBatchConductores] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { admin: authenticatedAdmin, error } = await authenticateAdmin(
      loginForm.email, 
      loginForm.password
    );

    if (error) {
      toast({
        title: "Error de autenticación",
        description: error,
        variant: "destructive",
      });
      return;
    }

    if (authenticatedAdmin) {
      setAdmin(authenticatedAdmin);
      toast({
        title: "Acceso autorizado",
        description: `Bienvenido ${authenticatedAdmin.nombre || 'Administrador'}`,
      });
    }
  };

  const handleLogout = () => {
    setAdmin(null);
    setLoginForm({ email: '', password: '' });
    toast({
      title: "Sesión cerrada",
      description: "Ha cerrado sesión exitosamente",
    });
  };

  // Nueva función para agregar vehículo completo
  const addVehiculo = async () => {
    if (!newVehiculo.placa.trim()) {
      toast({
        title: "Error",
        description: "La placa es obligatoria",
        variant: "destructive",
      });
      return;
    }

    try {
      const vehiculoData = {
        placa: newVehiculo.placa.toUpperCase(),
        marca: newVehiculo.marca || null,
        modelo: newVehiculo.modelo || null,
        ano: newVehiculo.ano ? parseInt(newVehiculo.ano) : null
      };

      const { error } = await supabase
        .from('vehiculos')
        .insert([vehiculoData]);

      if (error) {
        console.error('Error inserting vehiculo:', error);
        toast({
          title: "Error",
          description: "Error al guardar el vehículo: " + error.message,
          variant: "destructive",
        });
        return;
      }

      setNewVehiculo({ placa: '', marca: '', modelo: '', ano: '' });
      toast({
        title: "Vehículo agregado",
        description: `Vehículo ${vehiculoData.placa} agregado exitosamente`,
      });
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: "Error",
        description: "Error inesperado al guardar el vehículo",
        variant: "destructive",
      });
    }
  };

  // Nueva función para agregar conductor completo
  const addConductor = async () => {
    if (!newConductor.cedula.trim() || !newConductor.nombres.trim() || !newConductor.apellidos.trim()) {
      toast({
        title: "Error",
        description: "Cédula, nombres y apellidos son obligatorios",
        variant: "destructive",
      });
      return;
    }

    try {
      const conductorData = {
        cedula: newConductor.cedula,
        nombres: newConductor.nombres,
        apellidos: newConductor.apellidos,
        telefono: newConductor.telefono || null,
        email: newConductor.email || null
      };

      const { error } = await supabase
        .from('conductores')
        .insert([conductorData]);

      if (error) {
        console.error('Error inserting conductor:', error);
        toast({
          title: "Error",
          description: "Error al guardar el conductor: " + error.message,
          variant: "destructive",
        });
        return;
      }

      setNewConductor({ cedula: '', nombres: '', apellidos: '', telefono: '', email: '' });
      toast({
        title: "Conductor agregado",
        description: `Conductor ${conductorData.nombres} ${conductorData.apellidos} agregado exitosamente`,
      });
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: "Error",
        description: "Error inesperado al guardar el conductor",
        variant: "destructive",
      });
    }
  };

  // Función para eliminar vehículo
  const removeVehiculo = async (id: string, placa: string) => {
    if (window.confirm(`¿Está seguro de eliminar la placa ${placa}?`)) {
      try {
        const { error } = await supabase
          .from('vehiculos')
          .delete()
          .eq('id', id);

        if (error) {
          toast({
            title: "Error",
            description: "Error al eliminar el vehículo: " + error.message,
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Vehículo eliminado",
          description: `Placa ${placa} eliminada exitosamente`,
        });
      } catch (err) {
        console.error('Error:', err);
        toast({
          title: "Error",
          description: "Error inesperado al eliminar el vehículo",
          variant: "destructive",
        });
      }
    }
  };

  // Función para eliminar conductor
  const removeConductor = async (id: string, nombres: string, apellidos: string) => {
    if (window.confirm(`¿Está seguro de eliminar al conductor ${nombres} ${apellidos}?`)) {
      try {
        const { error } = await supabase
          .from('conductores')
          .delete()
          .eq('id', id);

        if (error) {
          toast({
            title: "Error",
            description: "Error al eliminar el conductor: " + error.message,
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Conductor eliminado",
          description: `Conductor ${nombres} ${apellidos} eliminado exitosamente`,
        });
      } catch (err) {
        console.error('Error:', err);
        toast({
          title: "Error",
          description: "Error inesperado al eliminar el conductor",
          variant: "destructive",
        });
      }
    }
  };

  // Función actualizada para inserción en lote de vehículos completos
  const addBatchVehiculos = async () => {
    if (!batchVehiculos.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingrese los datos de los vehículos",
        variant: "destructive",
      });
      return;
    }

    try {
      const lines = batchVehiculos.trim().split('\n').filter(line => line.trim());
      const vehiculosData = [];
      const errors = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        // Formato esperado: PLACA,MARCA,MODELO,AÑO o solo PLACA
        const parts = line.split(',').map(part => part.trim());
        
        if (parts.length === 0 || !parts[0]) {
          errors.push(`Línea ${i + 1}: Placa requerida`);
          continue;
        }

        const vehiculoData = {
          placa: parts[0].toUpperCase(),
          marca: parts[1] || null,
          modelo: parts[2] || null,
          ano: parts[3] ? parseInt(parts[3]) : null
        };

        // Validar año si se proporciona
        if (parts[3] && (isNaN(vehiculoData.ano!) || vehiculoData.ano! < 1900 || vehiculoData.ano! > new Date().getFullYear() + 1)) {
          errors.push(`Línea ${i + 1}: Año inválido (${parts[3]})`);
          continue;
        }

        vehiculosData.push(vehiculoData);
      }

      if (errors.length > 0) {
        toast({
          title: "Errores encontrados",
          description: errors.join(', '),
          variant: "destructive",
        });
        return;
      }

      if (vehiculosData.length === 0) {
        toast({
          title: "Error",
          description: "No se encontraron vehículos válidos para insertar",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('vehiculos')
        .insert(vehiculosData);

      if (error) {
        console.error('Error inserting batch vehiculos:', error);
        toast({
          title: "Error",
          description: "Error al guardar los vehículos: " + error.message,
          variant: "destructive",
        });
        return;
      }

      setBatchVehiculos('');
      toast({
        title: "Vehículos agregados",
        description: `${vehiculosData.length} vehículos agregados exitosamente`,
      });
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: "Error",
        description: "Error inesperado al procesar los vehículos",
        variant: "destructive",
      });
    }
  };

  // Función actualizada para inserción en lote de conductores completos
  const addBatchConductores = async () => {
    if (!batchConductores.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingrese los datos de los conductores",
        variant: "destructive",
      });
      return;
    }

    try {
      const lines = batchConductores.trim().split('\n').filter(line => line.trim());
      const conductoresData = [];
      const errors = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        // Formato esperado: CEDULA,NOMBRES,APELLIDOS,TELEFONO,EMAIL
        const parts = line.split(',').map(part => part.trim());
        
        if (parts.length < 3 || !parts[0] || !parts[1] || !parts[2]) {
          errors.push(`Línea ${i + 1}: Cédula, nombres y apellidos son requeridos`);
          continue;
        }

        const conductorData = {
          cedula: parts[0],
          nombres: parts[1],
          apellidos: parts[2],
          telefono: parts[3] || null,
          email: parts[4] || null
        };

        // Validar email si se proporciona
        if (parts[4] && parts[4].includes('@') === false) {
          errors.push(`Línea ${i + 1}: Email inválido (${parts[4]})`);
          continue;
        }

        conductoresData.push(conductorData);
      }

      if (errors.length > 0) {
        toast({
          title: "Errores encontrados",
          description: errors.join(', '),
          variant: "destructive",
        });
        return;
      }

      if (conductoresData.length === 0) {
        toast({
          title: "Error",
          description: "No se encontraron conductores válidos para insertar",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('conductores')
        .insert(conductoresData);

      if (error) {
        console.error('Error inserting batch conductores:', error);
        toast({
          title: "Error",
          description: "Error al guardar los conductores: " + error.message,
          variant: "destructive",
        });
        return;
      }

      setBatchConductores('');
      toast({
        title: "Conductores agregados",
        description: `${conductoresData.length} conductores agregados exitosamente`,
      });
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: "Error",
        description: "Error inesperado al procesar los conductores",
        variant: "destructive",
      });
    }
  };

  const addEtiqueta = () => {
    if (!newEtiqueta.nombre.trim() || !newEtiqueta.tipo) {
      toast({
        title: "Error",
        description: "Complete todos los campos",
        variant: "destructive",
      });
      return;
    }
    
    if (etiquetas.some(e => e.nombre.toLowerCase() === newEtiqueta.nombre.toLowerCase())) {
      toast({
        title: "Error",
        description: "Esta etiqueta ya existe",
        variant: "destructive",
      });
      return;
    }

    const nuevaEtiqueta = {
      id: etiquetas.length + 1,
      nombre: newEtiqueta.nombre,
      tipo: newEtiqueta.tipo
    };
    
    setEtiquetas([...etiquetas, nuevaEtiqueta]);
    setNewEtiqueta({ nombre: '', tipo: '' });
    toast({
      title: "Etiqueta agregada",
      description: `Etiqueta "${nuevaEtiqueta.nombre}" agregada exitosamente`,
    });
  };

  const removeEtiqueta = (id: number) => {
    const etiqueta = etiquetas.find(e => e.id === id);
    if (etiqueta && window.confirm(`¿Está seguro de eliminar la etiqueta "${etiqueta.nombre}"?`)) {
      setEtiquetas(etiquetas.filter(e => e.id !== id));
      toast({
        title: "Etiqueta eliminada",
        description: `Etiqueta "${etiqueta.nombre}" eliminada exitosamente`,
      });
    }
  };

  // Pantalla de login
  if (!admin) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <Card className="border-2 border-blue-200 shadow-lg">
          <CardHeader className="text-center">
            <div className="bg-blue-600 p-3 rounded-full w-16 h-16 mx-auto mb-4">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-xl sm:text-2xl">Panel de Administración</CardTitle>
            <p className="text-gray-600 text-sm">Ingrese sus credenciales para continuar</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                  placeholder="admin@trasnal.com"
                  className="border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  placeholder="••••••••"
                  className="border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={authLoading}>
                {authLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Iniciar Sesión
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Panel de administración autenticado
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header de administración */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-2 border-blue-300 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
            <div>
              <CardTitle className="text-xl sm:text-2xl flex items-center space-x-2 sm:space-x-3">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8" />
                <span>Panel de Administración</span>
              </CardTitle>
              <p className="text-blue-100 mt-2 text-sm">
                Bienvenido {admin.nombre || admin.email} - Gestione vehículos, conductores y etiquetas
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              size="sm"
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Pestañas de gestión */}
      <Tabs defaultValue="vehiculos" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-3 border-2 border-gray-200">
          <TabsTrigger value="vehiculos" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
            <Truck className="h-4 w-4" />
            <span>Vehículos</span>
          </TabsTrigger>
          <TabsTrigger value="conductores" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
            <Users className="h-4 w-4" />
            <span>Conductores</span>
          </TabsTrigger>
          <TabsTrigger value="etiquetas" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
            <Tag className="h-4 w-4" />
            <span>Etiquetas</span>
          </TabsTrigger>
        </TabsList>

        {/* Gestión de Vehículos */}
        <TabsContent value="vehiculos">
          <Card className="border-2 border-green-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Gestión de Vehículos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              {/* Formulario completo para vehículos */}
              <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                <Label className="text-sm font-medium mb-3 block">Agregar nuevo vehículo</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="placa">Placa *</Label>
                    <Input
                      id="placa"
                      value={newVehiculo.placa}
                      onChange={(e) => setNewVehiculo({...newVehiculo, placa: e.target.value})}
                      placeholder="ABC123"
                      className="border-2 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="marca">Marca</Label>
                    <Input
                      id="marca"
                      value={newVehiculo.marca}
                      onChange={(e) => setNewVehiculo({...newVehiculo, marca: e.target.value})}
                      placeholder="Toyota"
                      className="border-2 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="modelo">Modelo</Label>
                    <Input
                      id="modelo"
                      value={newVehiculo.modelo}
                      onChange={(e) => setNewVehiculo({...newVehiculo, modelo: e.target.value})}
                      placeholder="Corolla"
                      className="border-2 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ano">Año</Label>
                    <Input
                      id="ano"
                      type="number"
                      value={newVehiculo.ano}
                      onChange={(e) => setNewVehiculo({...newVehiculo, ano: e.target.value})}
                      placeholder="2023"
                      className="border-2 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    />
                  </div>
                </div>
                <Button onClick={addVehiculo} size="sm" className="mt-4 w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Vehículo
                </Button>
              </div>

              {/* Agregar vehículos en lote - actualizado */}
              <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
                <Label className="text-sm font-medium mb-2 block">Agregar vehículos en lote</Label>
                <div className="mb-3 text-xs text-gray-600 bg-gray-50 p-2 rounded border">
                  <strong>Formato:</strong> PLACA,MARCA,MODELO,AÑO (una por línea)<br/>
                  <strong>Ejemplo:</strong><br/>
                  ABC123,Toyota,Corolla,2023<br/>
                  XYZ789,Honda,Civic,2022<br/>
                  DEF456,Chevrolet,Spark,2021<br/>
                  <em>Nota: Solo la placa es obligatoria. Los demás campos pueden omitirse.</em>
                </div>
                <Textarea
                  value={batchVehiculos}
                  onChange={(e) => setBatchVehiculos(e.target.value)}
                  placeholder="ABC123,Toyota,Corolla,2023
XYZ789,Honda,Civic,2022
DEF456,Chevrolet,Spark,2021"
                  className="w-full p-3 border-2 border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 rounded-md resize-none h-32 text-sm font-mono"
                />
                <Button onClick={addBatchVehiculos} size="sm" className="mt-2 w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Lote de Vehículos
                </Button>
              </div>
              
              {/* Tabla de vehículos */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                {vehiculosLoading ? (
                  <p>Cargando vehículos...</p>
                ) : vehiculosError ? (
                  <p className="text-red-600">Error: {vehiculosError}</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-sm">Placa</TableHead>
                          <TableHead className="text-sm">Marca</TableHead>
                          <TableHead className="text-sm">Modelo</TableHead>
                          <TableHead className="text-sm">Año</TableHead>
                          <TableHead className="w-16 sm:w-24 text-sm">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {vehiculos.map((vehiculo) => (
                          <TableRow key={vehiculo.id}>
                            <TableCell className="font-mono text-sm font-bold">{vehiculo.placa}</TableCell>
                            <TableCell className="text-sm">{vehiculo.marca || '-'}</TableCell>
                            <TableCell className="text-sm">{vehiculo.modelo || '-'}</TableCell>
                            <TableCell className="text-sm">{vehiculo.ano || '-'}</TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeVehiculo(vehiculo.id, vehiculo.placa)}
                                className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-500 p-1"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gestión de Conductores */}
        <TabsContent value="conductores">
          <Card className="border-2 border-blue-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Gestión de Conductores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              {/* Formulario completo para conductores */}
              <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                <Label className="text-sm font-medium mb-3 block">Agregar nuevo conductor</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cedula">Cédula *</Label>
                    <Input
                      id="cedula"
                      value={newConductor.cedula}
                      onChange={(e) => setNewConductor({...newConductor, cedula: e.target.value})}
                      placeholder="12345678"
                      className="border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nombres">Nombres *</Label>
                    <Input
                      id="nombres"
                      value={newConductor.nombres}
                      onChange={(e) => setNewConductor({...newConductor, nombres: e.target.value})}
                      placeholder="Juan Carlos"
                      className="border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apellidos">Apellidos *</Label>
                    <Input
                      id="apellidos"
                      value={newConductor.apellidos}
                      onChange={(e) => setNewConductor({...newConductor, apellidos: e.target.value})}
                      placeholder="Pérez García"
                      className="border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      value={newConductor.telefono}
                      onChange={(e) => setNewConductor({...newConductor, telefono: e.target.value})}
                      placeholder="3001234567"
                      className="border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newConductor.email}
                      onChange={(e) => setNewConductor({...newConductor, email: e.target.value})}
                      placeholder="juan@ejemplo.com"
                      className="border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>
                <Button onClick={addConductor} size="sm" className="mt-4 w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Conductor
                </Button>
              </div>

              {/* Agregar conductores en lote - actualizado */}
              <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
                <Label className="text-sm font-medium mb-2 block">Agregar conductores en lote</Label>
                <div className="mb-3 text-xs text-gray-600 bg-gray-50 p-2 rounded border">
                  <strong>Formato:</strong> CEDULA,NOMBRES,APELLIDOS,TELEFONO,EMAIL (una por línea)<br/>
                  <strong>Ejemplo:</strong><br/>
                  12345678,Juan Carlos,Pérez García,3001234567,juan@email.com<br/>
                  87654321,María,López Martínez,3007654321,maria@email.com<br/>
                  <em>Nota: Cédula, nombres y apellidos son obligatorios.</em>
                </div>
                <Textarea
                  value={batchConductores}
                  onChange={(e) => setBatchConductores(e.target.value)}
                  placeholder="12345678,Juan Carlos,Pérez García,3001234567,juan@email.com
87654321,María,López Martínez,3007654321,maria@email.com
11223344,Carlos,Rodríguez,3009876543,carlos@email.com"
                  className="w-full p-3 border-2 border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 rounded-md resize-none h-32 text-sm font-mono"
                />
                <Button onClick={addBatchConductores} size="sm" className="mt-2 w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Lote de Conductores
                </Button>
              </div>
              
              {/* Tabla de conductores */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                {conductoresLoading ? (
                  <p>Cargando conductores...</p>
                ) : conductoresError ? (
                  <p className="text-red-600">Error: {conductoresError}</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-sm">Cédula</TableHead>
                          <TableHead className="text-sm">Nombres</TableHead>
                          <TableHead className="text-sm">Apellidos</TableHead>
                          <TableHead className="text-sm">Teléfono</TableHead>
                          <TableHead className="text-sm">Email</TableHead>
                          <TableHead className="w-16 sm:w-24 text-sm">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {conductores.map((conductor) => (
                          <TableRow key={conductor.id}>
                            <TableCell className="font-mono text-sm font-bold">{conductor.cedula}</TableCell>
                            <TableCell className="text-sm">{conductor.nombres}</TableCell>
                            <TableCell className="text-sm">{conductor.apellidos}</TableCell>
                            <TableCell className="text-sm">{conductor.telefono || '-'}</TableCell>
                            <TableCell className="text-sm">{conductor.email || '-'}</TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeConductor(conductor.id, conductor.nombres, conductor.apellidos)}
                                className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-500 p-1"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gestión de Etiquetas */}
        <TabsContent value="etiquetas">
          <Card className="border-2 border-purple-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Gestión de Etiquetas Personalizadas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
                <div className="grid grid-cols-1 gap-4">
                  <Input
                    value={newEtiqueta.nombre}
                    onChange={(e) => setNewEtiqueta({...newEtiqueta, nombre: e.target.value})}
                    placeholder="Nombre de la etiqueta"
                    className="border-2 border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  />
                  <Select
                    value={newEtiqueta.tipo}
                    onValueChange={(value) => setNewEtiqueta({...newEtiqueta, tipo: value})}
                  >
                    <SelectTrigger className="border-2 border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200">
                      <SelectValue placeholder="Asociar a..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="placa">Placa</SelectItem>
                      <SelectItem value="cedula">Cédula</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={addEtiqueta} className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Etiqueta
                  </Button>
                </div>
              </div>
              
              <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-sm">Nombre</TableHead>
                        <TableHead className="text-sm">Asociado a</TableHead>
                        <TableHead className="w-16 sm:w-24 text-sm">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {etiquetas.map((etiqueta) => (
                        <TableRow key={etiqueta.id}>
                          <TableCell className="font-medium text-sm">{etiqueta.nombre}</TableCell>
                          <TableCell>
                            <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                              etiqueta.tipo === 'placa' 
                                ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                                : 'bg-green-100 text-green-800 border border-green-300'
                            }`}>
                              {etiqueta.tipo === 'placa' ? 'Placa' : 'Cédula'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeEtiqueta(etiqueta.id)}
                              className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-500 p-1"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
