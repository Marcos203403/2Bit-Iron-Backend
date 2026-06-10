const categoriaController = require('../../src/controllers/categoriaController');
const Categoria = require('../../src/models/categoriaModel');

// Mockeamos el modelo completamente para aislar el controlador (Test Unitario)
jest.mock('../../src/models/categoriaModel');

describe('Categoria Controller - Unit Tests', () => {
    let req, res;

    // Reseteamos los mocks y creamos req y res falsos antes de cada prueba
    beforeEach(() => {
        req = { body: {}, params: {} };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(), // Permite encadenar res.status().json()
        };
        jest.clearAllMocks();
    });

    describe('create()', () => {
        it('debería devolver 400 si falta el Nombre', async () => {
            req.body = { Descripcion: 'Falta el nombre' };
            
            await categoriaController.create(req, res);
            
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Nombre is required' });
            expect(Categoria.create).not.toHaveBeenCalled();
        });

        it('debería llamar a Categoria.create y devolver 201 si el Nombre es válido', async () => {
            req.body = { Nombre: 'Periféricos', Descripcion: 'Teclados, ratones...' };
            Categoria.create.mockResolvedValue({ insertId: 5 }); // Mockeamos la respuesta de MariaDB
            
            await categoriaController.create(req, res);
            
            expect(Categoria.create).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: 'Category created', id: 5 });
        });

        it('debería devolver 500 si el modelo lanza un error (manejo de excepciones)', async () => {
            req.body = { Nombre: 'ErrorCat' };
            Categoria.create.mockRejectedValue(new Error('Database error'));
            
            await categoriaController.create(req, res);
            
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error interno del servidor' });
        });
    });

    describe('remove() - Lógica de Negocio', () => {
        it('debería devolver 400 y NO borrar si la categoría tiene productos asignados', async () => {
            req.params.id = 1;
            // Simulamos que la categoría tiene 2 productos asignados
            Categoria.countProductos.mockResolvedValue(2);
            
            await categoriaController.delete(req, res);
            
            expect(Categoria.countProductos).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Cannot delete: category has associated products' });
            expect(Categoria.delete).not.toHaveBeenCalled(); // Aseguramos que NO se ha llamado al borrado
        });

        it('debería borrar y devolver 200 si la categoría NO tiene productos', async () => {
            req.params.id = 1;
            Categoria.countProductos.mockResolvedValue(0); // 0 productos
            Categoria.delete.mockResolvedValue({ affectedRows: 1 });
            
            await categoriaController.delete(req, res);
            
            expect(Categoria.delete).toHaveBeenCalledWith(1);
            expect(res.status).not.toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Category deleted' });
        });
    });
});
