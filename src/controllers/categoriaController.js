const Categoria = require('../models/categoriaModel');

const getAll = async (req, res) => {
    try {
        const rows = await Categoria.getAll();
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getById = async (req, res) => {
    try {
        const rows = await Categoria.getById(req.params.id);
        if (rows.length === 0) return res.status(404).json({ message: 'Category not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const create = async (req, res) => {
    try {
        const { Nombre } = req.body;
        if (!Nombre) return res.status(400).json({ message: 'Nombre is required' });
        const result = await Categoria.create(req.body);
        res.status(201).json({ message: 'Category created', id: result.insertId });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const update = async (req, res) => {
    try {
        const { Nombre } = req.body;
        if (!Nombre) return res.status(400).json({ message: 'Nombre is required' });
        const result = await Categoria.update(req.params.id, req.body);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Category not found' });
        res.json({ message: 'Category updated' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const remove = async (req, res) => {
    try {
        // Business logic: cannot delete a category that has products
        const count = await Categoria.countProductos(req.params.id);
        if (count > 0) return res.status(400).json({ message: 'Cannot delete: category has associated products' });
        const result = await Categoria.delete(req.params.id);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Category not found' });
        res.json({ message: 'Category deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getAll, getById, create, update, delete: remove };
