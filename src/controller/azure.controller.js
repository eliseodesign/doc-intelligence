import { Router } from 'express';
import axios from 'axios';
import multer from 'multer';

const upload = multer({ memoryStorage: multer.memoryStorage() });

const router = Router();

router.post('/', upload.single('image'), async (req, res, next) => {
    try {
        // Verifica si se recibió un archivo en la solicitud
        // Extrae el archivo de la solicituda
        console.log("files", req.file)
        console.log("body", req.body)
        const file = req.file

        if (!file) {
            return res.status(400).json({ error: 'No se recibió un archivo' });
        }

        // Crea un flujo de datos para leer el contenido del archivo
    

        // Configura la solicitud a la API de Form Recognizer
        const endpoint = 'https://production-hazconta.cognitiveservices.azure.com/';
        const apiKey = 'd289458d75d24d8d98b65fb1347f90e6';

        const response = await axios.post(`${endpoint}/formrecognizer/documentModels/prebuilt-document:analyze?api-version=2023-07-31`, file.buffer, {
            headers: {
                'Content-Type': 'application/octet-stream',
                'Ocp-Apim-Subscription-Key': apiKey
            }
        });        

        // Extrae el ID del resultado de la operación
        const resultId = response.headers['operation-location'].split('/').pop();

        // Envía el ID del resultado como respuesta
        res.status(200).json({ resultId });
    } catch (error) {
        console.error('Error al analizar el documento:', error);
        res.status(500).json({ error: 'Ocurrió un error al analizar el documento' });
    }
});

export default router;
