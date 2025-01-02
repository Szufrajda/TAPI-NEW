import express from 'express';
import {
    getAllNotes,
    getNoteById,
    addNote,
    updateNote,
    deleteNoteById,
    partialUpdateNote
} from '../controllers/NotesController.js';

const router = express.Router();

router.get('/notes', getAllNotes);
router.get('/notes/:id', getNoteById);
router.post('/notes', addNote);
router.put('/notes/:id', updateNote);
router.patch('/notes/:id', partialUpdateNote);
router.delete('/notes/:id', deleteNoteById);

export default router;