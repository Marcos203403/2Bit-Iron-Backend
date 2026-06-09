const Producto = require('../models/productoModel');
const Categoria = require('../models/categoriaModel');

const getAll = async (req, res) => {
    try {
        const rows = await Producto.getAll();
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

const getById = async (req, res) => {
    try {
        const rows = await Producto.getById(req.params.id);
        if (rows.length === 0) return res.status(404).json({ message: 'Product not found' });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

const create = async (req, res) => {
    try {
        const { Nombre, Precio, IdCategoria } = req.body;
        
        // Validación básica
        if (!Nombre || !Precio || !IdCategoria) {
            return res.status(400).json({ message: 'Nombre, Precio e IdCategoria son obligatorios' });
        }

        // LÓGICA DE NEGOCIO OBLIGATORIA: Comprobar que la categoría existe antes de crear el producto
        const categoriaExists = await Categoria.getById(IdCategoria);
        if (categoriaExists.length === 0) {
            return res.status(404).json({ message: 'Error de negocio: La categoría indicada no existe' });
        }

        const result = await Producto.create(req.body);
        res.status(201).json({ success: true, id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

const update = async (req, res) => {
    try {
        const { Nombre, Precio, IdCategoria } = req.body;

        // Validación básica
        if (!Nombre || !Precio || !IdCategoria) {
            return res.status(400).json({ message: 'Nombre, Precio e IdCategoria son obligatorios' });
        }

        // LÓGICA DE NEGOCIO OBLIGATORIA: Comprobar que la nueva categoría existe antes de editar
        const categoriaExists = await Categoria.getById(IdCategoria);
        if (categoriaExists.length === 0) {
            return res.status(404).json({ message: 'Error de negocio: La categoría indicada no existe' });
        }

        const result = await Producto.update(req.params.id, req.body);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
        
        res.json({ success: true, message: 'Producto actualizado' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

const remove = async (req, res) => {
    try {
        const result = await Producto.remove(req.params.id);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
        
        res.json({ success: true, message: 'Producto eliminado' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};
