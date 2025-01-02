let ingredients = []; // Przykładowa baza danych w pamięci dla składników

// GET wszystkie składniki
export const getAllIngredients = (req, res) => {
    res.set("Content-Type", "application/json");
    res.status(200).json(ingredients);
};

// GET składnik po ID
export const getIngredientById = (req, res) => {
    const id = parseInt(req.params.id);
    const ingredient = ingredients.find(i => i.id === id);
    if (ingredient) {
        res.set("Content-Type", "application/json");
        res.status(200).json(ingredient);
    } else {
        res.status(404).json({ message: 'Składnik nie znaleziony' });
    }
};

// POST nowy składnik
export const addIngredient = (req, res) => {
    const { nazwa_składnika, grupa_zapachowa } = req.body;
    if (!nazwa_składnika || !grupa_zapachowa) {
        res.status(400).json({ message: 'Brak wymaganych danych' });
    } else {
        const newIngredient = { id: ingredients.length + 1, nazwa_składnika, grupa_zapachowa };
        ingredients.push(newIngredient);
        res.set("Content-Type", "application/json");
        res.status(201).json(newIngredient);
    }
};

// PUT aktualizacja składnika
export const updateIngredient = (req, res) => {
    const id = parseInt(req.params.id);
    const index = ingredients.findIndex(i => i.id === id);
    if (index !== -1) {
        const { nazwa_składnika, grupa_zapachowa } = req.body;
        ingredients[index] = { id, nazwa_składnika, grupa_zapachowa };
        res.set("Content-Type", "application/json");
        res.status(200).json(ingredients[index]);
    } else {
        res.status(404).json({ message: 'Składnik nie znaleziony' });
    }
};

// DELETE składnik
export const deleteIngredientById = (req, res) => {
    const id = parseInt(req.params.id);
    const index = ingredients.findIndex(i => i.id === id);
    if (index !== -1) {
        ingredients.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Składnik nie znaleziony' });
    }
};

// PATCH częściowa aktualizacja składnika
export const partialUpdateIngredient = (req, res) => {
    const id = parseInt(req.params.id);
    const ingredient = ingredients.find(i => i.id === id);
    if (ingredient) {
        Object.assign(ingredient, req.body);
        res.set("Content-Type", "application/json");
        res.status(200).json(ingredient);
    } else {
        res.status(404).json({ message: 'Składnik nie znaleziony' });
    }
};
