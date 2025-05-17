import express from 'express';
import minioClient from '../../utils/minioClient';

const router = express.Router();


router.get('/list', (req, res) => {
    res.send('Hello World');
});

router.post('/save', async (req, res) => {
    try {
        const { id, files } = req.body
        const bucketName = 'assignments'
        const objectName = `assignment-${id}.json`
        const fileContent = JSON.stringify(files)

        await minioClient.putObject(bucketName, objectName, fileContent)

        res.status(200).json({ message: 'Assignment saved successfully' })
    } catch (error) {
        console.error('Error saving assignment:', error)
        res.status(500).json({ error: 'Failed to save assignment' })
    }
});

export default router;