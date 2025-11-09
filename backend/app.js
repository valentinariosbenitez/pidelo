const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const loansRoutes = require('./routes/loansroutes'); 
 const createTables = require('./utils/createTables');
const insertData = require('./utils/insertdata');
const pool = require('./db/pool');


const app = express();

app.use(cors());
app.use(express.json());

// Rutas específicas
app.use('/auth', authRoutes);
app.use('/reviews', reviewRoutes);
app.use('/loans', loansRoutes); 

//Endpoints de utilidad
 app.get('/create-tables', createTables);
app.get('/insert-data', insertData);

app.post('/api/prestamos', async (req, res) => {
   const { nombre_libro, fecha_prestamo, fecha_devolucion } = req.body;

   try {
     await pool.query(
       `INSERT INTO prestamos (nombre_libro, fecha_prestamo, fecha_devolucion)
        VALUES ($1, $2, $3)`,
       [nombre_libro, fecha_prestamo, fecha_devolucion]
     );
     res.status(200).send('✅ Préstamo guardado correctamente');
   } catch (error) {
     console.error('❌ Error al guardar el préstamo:', error.message);
     res.status(500).send('Error al guardar el préstamo');
   }
 });
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(` Servidor corriendo en http://localhost:${PORT}`);
});