import express from 'express';
import {
  getPerfumes,
  getPerfumesByType,
  getPerfumeById,
  createPerfume,
  updatePerfume,
  patchPerfume,
  deletePerfume,
  getPerfumesByNotesAndIngredient,
  getNotes,
  getIngredients,
} from '../controllers/PerfumeController.js';

const router = express.Router();

router.get('/', getPerfumes); // Pobierz wszystkie perfumy
router.get('/filter', getPerfumesByType); // Pobierz perfumy według typu
router.get('/:id', getPerfumeById); // Pobierz szczegóły perfumu po ID
router.post('/', createPerfume); // Dodaj nowy perfum
router.put('/:id', updatePerfume); // Edytuj perfum (PUT)
router.patch('/:id', patchPerfume); // Edytuj perfum (PATCH)
router.delete('/:id', deletePerfume); // Usuń perfum
router.get('/notes/filter', getPerfumesByNotesAndIngredient); // Pobierz perfumy według nut zapachowych
router.get('/notes', getNotes); // Pobierz wszystkie nuty zapachowe
router.get('/ingredients', getIngredients); // Pobierz wszystkie składniki

export default router;