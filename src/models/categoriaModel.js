// Model: direct SQL queries using the connection pool
const pool = require('../config/db');

const getAll = async () => {
    const [rows] = await pool.query('SELECT * FROM CATEGORIA');
    return rows;
};

const getById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM CATEGORIA WHERE IdCategoria = ?', [id]);
    return rows;
};

const create = async (data) => {
    const { Nombre, Descripcion, Imagen_Url } = data;
    const [result] = await pool.query(
        'INSERT INTO CATEGORIA (Nombre, Descripcion, Imagen_Url) VALUES (?, ?, ?)',
        [Nombre, Descripcion || null, Imagen_Url || null]
    );
    return result;
};

const update = async (id, data) => {
    const { Nombre, Descripcion, Imagen_Url } = data;
    const [result] = await pool.query(
        'UPDATE CATEGORIA SET Nombre = ?, Descripcion = ?, Imagen_Url = ? WHERE IdCategoria = ?',
        [Nombre, Descripcion || null, Imagen_Url || null, id]
    );
    return result;
};

// Count products in this category — needed for delete business logic
const countProductos = async (id) => {
    const [rows] = await pool.query(
        'SELECT COUNT(*) as count FROM PRODUCTO WHERE IdCategoria = ?', [id]
    );
    return rows[0].count;
};

const remove = async (id) => {
    const [result] = await pool.query('DELETE FROM CATEGORIA WHERE IdCategoria = ?', [id]);
    return result;
};

module.exports = { getAll, getById, create, update, countProductos, delete: remove };
