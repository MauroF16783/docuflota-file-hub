import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Truck, Users, Tag, Plus, Trash, LogOut, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const AdminPanel = () => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - En producción estos vendrían de Supabase
  const [vehiculos, setVehiculos] = useState(['ABC123', 'XYZ789', 'DEF456', 'GHI789', 'JKL012']);
  const [conductores, setConductores] = useState(['12345678', '87654321', '11223344', '55667788', '99887766']);
  const [etiquetas, setEtiquetas] = useState([
    { id: 1, nombre: 'Inspección', tipo: 'placa' },
    { id: 2, nombre: 'Permisos', tipo: 'cedula' },
    { id: 3, nombre: 'Certificados', tipo: 'placa' }
  ]);

  const [newPlaca, setNewPlaca] = useState('');
  const [newCedula, setNewCedula] = useState('');
  const [newEtiqueta, setNewEtiqueta] = useState({ nombre: '', tipo: '' });
  
  // Estados para inserción en lotes
  const [batchPlacas, setBatchPlacas] = useState('');
  const [batchCedulas, setBatchCedulas] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simular autenticación con Supabase
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (loginForm.email === 'admin@trasnal.com' && loginForm.password === 'admin123') {
        setIsAuthenticated(true);
        toast({
          title: "Acceso autorizado",
          description: "Bienvenido al panel de administración",
        });
      } else {
        toast({
          title: "Error de autenticación",
          description: "Credenciales incorrectas",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error de conexión",
        description: "Por favor, inténtelo de nuevo",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginForm({ email: '', password: '' });
    toast({
      title: "Sesión cerrada",
      description: "Ha cerrado sesión exitosamente",
    });
  };

  const addVehiculo = () => {
    if (!newPlaca.trim()) {
      toast({
        title: "Error",
        description: "Ingrese una placa válida",
        variant: "destructive",
      });
      return;
    }
    
    if (vehiculos.includes(newPlaca.toUpperCase())) {
      toast({
        title: "Error",
        description: "Esta placa ya existe",
        variant: "destructive",
      });
      return;
    }

    setVehiculos([...vehiculos, newPlaca.toUpperCase()]);
    setNewPlaca('');
    toast({
      title: "Vehículo agregado",
      description: `Placa ${newPlaca.toUpperCase()} agregada exitosamente`,
    });
  };

  const removeVehiculo = (placa: string) => {
    if (window.confirm(`¿Está seguro de eliminar la placa ${placa}?`)) {
      setVehiculos(vehiculos.filter(v => v !== placa));
      toast({
        title: "Vehículo eliminado",
        description: `Placa ${placa} eliminada exitosamente`,
      });
    }
  };

  const addConductor = () => {
    if (!newCedula.trim()) {
      toast({
        title: "Error",
        description: "Ingrese una cédula válida",
        variant: "destructive",
      });
      return;
    }
    
    if (conductores.includes(newCedula)) {
      toast({
        title: "Error",
        description: "Esta cédula ya existe",
        variant: "destructive",
      });
      return;
    }

    setConductores([...conductores, newCedula]);
    setNewCedula('');
    toast({
      title: "Conductor agregado",
      description: `Cédula ${newCedula} agregada exitosamente`,
    });
  };

  const removeConductor = (cedula: string) => {
    if (window.confirm(`¿Está seguro de eliminar la cédula ${cedula}?`)) {
      setConductores(conductores.filter(c => c !== cedula));
      toast({
        title: "Conductor eliminado",
        description: `Cédula ${cedula} eliminada exitosamente`,
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

  // Nuevas funciones para inserción en lotes
  const addBatchPlacas = () => {
    if (!batchPlacas.trim()) {
      toast({
        title: "Error",
        description: "Ingrese las placas separadas por comas o líneas",
        variant: "destructive",
      });
      return;
    }

    const placasArray = batchPlacas
      .split(/[,\n]/)
      .map(p => p.trim().toUpperCase())
      .filter(p => p.length > 0);

    const placasNuevas = placasArray.filter(p => !vehiculos.includes(p));
    const placasDuplicadas = placasArray.filter(p => vehiculos.includes(p));

    if (placasNuevas.length > 0) {
      setVehiculos([...vehiculos, ...placasNuevas]);
      setBatchPlacas('');
      toast({
        title: "Placas agregadas",
        description: `${placasNuevas.length} placas agregadas exitosamente${placasDuplicadas.length > 0 ? ` (${placasDuplicadas.length} duplicadas omitidas)` : ''}`,
      });
    } else {
      toast({
        title: "Sin cambios",
        description: "Todas las placas ya existen en el sistema",
        variant: "destructive",
      });
    }
  };

  const addBatchCedulas = () => {
    if (!batchCedulas.trim()) {
      toast({
        title: "Error",
        description: "Ingrese las cédulas separadas por comas o líneas",
        variant: "destructive",
      });
      return;
    }

    const cedulasArray = batchCedulas
      .split(/[,\n]/)
      .map(c => c.trim())
      .filter(c => c.length > 0);

    const cedulasNuevas = cedulasArray.filter(c => !conductores.includes(c));
    const cedulasDuplicadas = cedulasArray.filter(c => conductores.includes(c));

    if (cedulasNuevas.length > 0) {
      setConductores([...conductores, ...cedulasNuevas]);
      setBatchCedulas('');
      toast({
        title: "Cédulas agregadas",
        description: `${cedulasNuevas.length} cédulas agregadas exitosamente${cedulasDuplicadas.length > 0 ? ` (${cedulasDuplicadas.length} duplicadas omitidas)` : ''}`,
      });
    } else {
      toast({
        title: "Sin cambios",
        description: "Todas las cédulas ya existen en el sistema",
        variant: "destructive",
      });
    }
  };

  // Pantalla de login
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <Card>
          <CardHeader className="text-center">
            <div className="bg-blue-600 p-3 rounded-full w-16 h-16 mx-auto mb-4">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-xl sm:text-2xl">Panel de Administración</CardTitle>
            <p className="text-gray-600 text-sm">Ingrese sus credenciales para continuar</p>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Demo:</strong> Use admin@trasnal.com / admin123
              </AlertDescription>
            </Alert>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                  placeholder="admin@trasnal.com"
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
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
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
      <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
            <div>
              <CardTitle className="text-xl sm:text-2xl flex items-center space-x-2 sm:space-x-3">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8" />
                <span>Panel de Administración</span>
              </CardTitle>
              <p className="text-blue-100 mt-2 text-sm">Gestione vehículos, conductores y etiquetas</p>
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
        <TabsList className="grid w-full grid-cols-3">
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
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Gestión de Vehículos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              {/* Agregar placa individual */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Agregar placa individual</Label>
                <div className="flex space-x-2">
                  <Input
                    value={newPlaca}
                    onChange={(e) => setNewPlaca(e.target.value)}
                    placeholder="ABC123"
                    className="flex-1"
                  />
                  <Button onClick={addVehiculo} size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar
                  </Button>
                </div>
              </div>

              {/* Agregar placas en lote */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Agregar placas en lote</Label>
                <textarea
                  value={batchPlacas}
                  onChange={(e) => setBatchPlacas(e.target.value)}
                  placeholder="ABC123, XYZ789, DEF456
O una por línea:
ABC123
XYZ789
DEF456"
                  className="w-full p-3 border rounded-md resize-none h-24 text-sm"
                />
                <Button onClick={addBatchPlacas} size="sm" className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Lote de Placas
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-sm">Placa</TableHead>
                      <TableHead className="w-16 sm:w-24 text-sm">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vehiculos.map((placa) => (
                      <TableRow key={placa}>
                        <TableCell className="font-mono text-sm">{placa}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeVehiculo(placa)}
                            className="text-red-600 hover:text-red-700 p-1"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gestión de Conductores */}
        <TabsContent value="conductores">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Gestión de Conductores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              {/* Agregar cédula individual */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Agregar cédula individual</Label>
                <div className="flex space-x-2">
                  <Input
                    value={newCedula}
                    onChange={(e) => setNewCedula(e.target.value)}
                    placeholder="12345678"
                    className="flex-1"
                  />
                  <Button onClick={addConductor} size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar
                  </Button>
                </div>
              </div>

              {/* Agregar cédulas en lote */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Agregar cédulas en lote</Label>
                <textarea
                  value={batchCedulas}
                  onChange={(e) => setBatchCedulas(e.target.value)}
                  placeholder="12345678, 87654321, 11223344
O una por línea:
12345678
87654321
11223344"
                  className="w-full p-3 border rounded-md resize-none h-24 text-sm"
                />
                <Button onClick={addBatchCedulas} size="sm" className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Lote de Cédulas
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-sm">Cédula</TableHead>
                      <TableHead className="w-16 sm:w-24 text-sm">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {conductores.map((cedula) => (
                      <TableRow key={cedula}>
                        <TableCell className="font-mono text-sm">{cedula}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeConductor(cedula)}
                            className="text-red-600 hover:text-red-700 p-1"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gestión de Etiquetas */}
        <TabsContent value="etiquetas">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Gestión de Etiquetas Personalizadas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <Input
                  value={newEtiqueta.nombre}
                  onChange={(e) => setNewEtiqueta({...newEtiqueta, nombre: e.target.value})}
                  placeholder="Nombre de la etiqueta"
                />
                <Select
                  value={newEtiqueta.tipo}
                  onValueChange={(value) => setNewEtiqueta({...newEtiqueta, tipo: value})}
                >
                  <SelectTrigger>
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
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {etiqueta.tipo === 'placa' ? 'Placa' : 'Cédula'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeEtiqueta(etiqueta.id)}
                            className="text-red-600 hover:text-red-700 p-1"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
