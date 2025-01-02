let notes = []; // Przykładowa baza danych w pamięci dla nut zapachowych

// GET wszystkie nuty zapachowe
export const getAllNotes = (req, res) => {
    res.set("Content-Type", "application/json");
    res.status(200).json(notes);
};

// GET nuta zapachowa po ID
export const getNoteById = (req, res) => {
    const id = parseInt(req.params.id);
    const note = notes.find(n => n.id === id);
    if (note) {
        res.set("Content-Type", "application/json");
        res.status(200).json(note);
    } else {
        res.status(404).json({ message: 'Nuta zapachowa nie znaleziona' });
    }
};

// POST nowa nuta zapachowa
export const addNote = (req, res) => {
    const { typ, skladniki } = req.body;
    if (!typ || !Array.isArray(skladniki)) {
        res.status(400).json({ message: 'Brak wymaganych danych' });
    } else {
        const newNote = { id: notes.length + 1, typ, skladniki };
        notes.push(newNote);
        res.set("Content-Type", "application/json");
        res.status(201).json(newNote);
    }
};

// PUT aktualizacja nuty zapachowej
export const updateNote = (req, res) => {
    const id = parseInt(req.params.id);
    const index = notes.findIndex(n => n.id === id);
    if (index !== -1) {
        const { typ, skladniki } = req.body;
        notes[index] = { id, typ, skladniki };
        res.set("Content-Type", "application/json");
        res.status(200).json(notes[index]);
    } else {
        res.status(404).json({ message: 'Nuta zapachowa nie znaleziona' });
    }
};

// DELETE nuta zapachowa
export const deleteNoteById = (req, res) => {
    const id = parseInt(req.params.id);
    const index = notes.findIndex(n => n.id === id);
    if (index !== -1) {
        notes.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Nuta zapachowa nie znaleziona' });
    }
};

// PATCH częściowa aktualizacja nuty zapachowej
export const partialUpdateNote = (req, res) => {
    const id = parseInt(req.params.id);
    const note = notes.find(n => n.id === id);
    if (note) {
        Object.assign(note, req.body);
        res.set("Content-Type", "application/json");
        res.status(200).json(note);
    } else {
        res.status(404).json({ message: 'Nuta zapachowa nie znaleziona' });
    }
};