// Model: direct SQL queries using the connection pool
const pool = require('../config/db');

const getAll = async () => {
    const [rows] = await pool.query('SELECT * FROM PRODUCTO');
    return rows;
};

const getById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM PRODUCTO WHERE IdProducto = ?', [id]);
    return rows;
};

const create = async (data) => {
    const { Nombre, Descripcion, PrecioBase, ObjetivoRecomendado, Activo, IdCategoria } = data;
    const [result] = await pool.query(
        'INSERT INTO PRODUCTO (Nombre, Descripcion, PrecioBase, ObjetivoRecomendado, Activo, IdCategoria) VALUES (?, ?, ?, ?, ?, ?)',
        [Nombre, Descripcion || null, PrecioBase, ObjetivoRecomendado || null, Activo !== undefined ? Activo : true, IdCategoria]
    );
    return result;
};

const update = async (id, data) => {
    const { Nombre, Descripcion, PrecioBase, ObjetivoRecomendado, Activo, IdCategoria } = data;
    const [result] = await pool.query(
        'UPDATE PRODUCTO SET Nombre = ?, Descripcion = ?, PrecioBase = ?, ObjetivoRecomendado = ?, Activo = ?, IdCategoria = ? WHERE IdProducto = ?',
        [Nombre, Descripcion || null, PrecioBase, ObjetivoRecomendado || null, Activo !== undefined ? Activo : true, IdCategoria, id]
    );
    return result;
};

const remove = async (id) => {
    const [result] = await pool.query('DELETE FROM PRODUCTO WHERE IdProducto = ?', [id]);
    return result;
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};
