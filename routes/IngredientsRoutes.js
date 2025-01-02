import express from 'express';
import {
    getAllIngredients,
    getIngredientById,
    addIngredient,
    updateIngredient,
    deleteIngredientById,
    partialUpdateIngredient
} from '../controllers/IngredientsController.js';

const router = express.Router();

router.get('/ingredients', getAllIngredients);
router.get('/ingredients/:id', getIngredientById);
router.post('/ingredients', addIngredient);
router.put('/ingredients/:id', updateIngredient);
router.patch('/ingredients/:id', partialUpdateIngredient); 
router.delete('/ingredients/:id', deleteIngredientById);

export default router;
