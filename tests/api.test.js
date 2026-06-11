const request = require('supertest');
const app = require('../src/index');
const pool = require('../src/config/db');

describe('API Integration Tests', () => {

    // Al finalizar todas las pruebas, cerramos el pool de conexiones
    // para que Jest pueda salir correctamente.
    afterAll(async () => {
        await pool.end();
    });

    describe('GET / (Health Check)', () => {
        it('debería devolver un status 200 y el mensaje ok', async () => {
            const res = await request(app).get('/');
            expect(res.statusCode).toEqual(200);
            expect(res.body.status).toBe('ok');
            expect(res.body.message).toBe('BitIron API running');
        });
    });

    describe('API de Categorías', () => {
        const nombreTest = `CatTest-${Date.now()}`;
        let categoriaCreadaId;

        it('POST /api/categorias - debería crear una nueva categoría', async () => {
            const res = await request(app)
                .post('/api/categorias')
                .send({
                    Nombre: nombreTest,
                    Descripcion: 'Categoría desde tests'
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('message', 'Category created');
            expect(res.body).toHaveProperty('id');
            categoriaCreadaId = res.body.id;
        });

        it('GET /api/categorias - debería obtener la lista de categorías', async () => {
            const res = await request(app).get('/api/categorias');
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBeTruthy();
            expect(res.body.data.length).toBeGreaterThan(0);
        });
    });

    describe('API de Productos', () => {
        it('GET /api/productos - debería obtener la lista de productos', async () => {
            const res = await request(app).get('/api/productos');
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBeTruthy();
        });

        it('POST /api/productos - debería fallar si la categoría no existe', async () => {
            const res = await request(app)
                .post('/api/productos')
                .send({
                    Nombre: 'Producto Imposible',
                    Precio: 99.99,
                    IdCategoria: 999999 // ID que no existe
                });

            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('message', 'Error de negocio: La categoría indicada no existe');
        });
    });
});
