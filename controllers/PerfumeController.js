import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const perfumesFilePath = path.join(__dirname, '../data/perfumes.json');

// Funkcja do wczytania danych z pliku JSON
export const loadData = () => {
    try {
      const data = fs.readFileSync(perfumesFilePath, 'utf-8');
      return JSON.parse(data || '{"perfumy": [], "nuty_zapachowe": [], "składniki": []}');
    } catch (error) {
      console.error('Błąd wczytywania pliku:', error);
      return { perfumy: [], nuty_zapachowe: [], składniki: [] };
    }
  };
  
  // Funkcja do zapisu danych do pliku JSON
  export const saveData = (data) => {
    fs.writeFileSync(perfumesFilePath, JSON.stringify(data, null, 2), 'utf-8');
  };
  

// Funkcja do zamiany ID na szczegóły nut zapachowych i składników
const mapPerfumesWithDetails = (perfumy, nuty_zapachowe, składniki) => {
  return perfumy.map((perfume) => {
    const fullNotes = perfume.nuty_zapachowe
      .map((noteId) => {
        const note = nuty_zapachowe.find((n) => n.id === noteId);

        if (!note) {
          console.warn(`Nie znaleziono nuty zapachowej o ID ${noteId}`);
          return null;
        }

        const fullIngredients = note.składniki.map((ingredientId) => {
          const ingredient = składniki.find((s) => s.id === ingredientId);
          return ingredient ? ingredient.nazwa_składnika : `Nieznany składnik (${ingredientId})`;
        });

        return {
          id: note.id,
          typ: note.typ,
          składniki: fullIngredients,
        };
      })
      .filter((note) => note !== null);

    return {
      ...perfume,
      nuty_zapachowe: fullNotes,
    };
  });
};

// 1. Pobierz wszystkie perfumy
export const getPerfumes = (req, res) => {
  const { perfumy, nuty_zapachowe, składniki } = loadData();
  const result = mapPerfumesWithDetails(perfumy, nuty_zapachowe, składniki);
  res.json(result);
};

// 2. Pobierz perfumy o szczególnym typie
export const getPerfumesByType = (req, res) => {
  const { perfumy, nuty_zapachowe, składniki } = loadData();
  const { typ } = req.query;

  const filteredPerfumes = perfumy.filter((item) => item.typ === typ);
  const result = mapPerfumesWithDetails(filteredPerfumes, nuty_zapachowe, składniki);
  res.json(result);
};

// 3. Pobierz szczegóły perfum po ID
export const getPerfumeById = (req, res) => {
  const { perfumy, nuty_zapachowe, składniki } = loadData();
  const { id } = req.params;

  const perfume = perfumy.find((item) => item.id === Number(id));
  if (perfume) {
    const result = mapPerfumesWithDetails([perfume], nuty_zapachowe, składniki)[0];
    res.json(result);
  } else {
    res.status(404).json({ error: `Nie znaleziono perfum o ID ${id}.` });
  }
};

// 4. Dodaj nowy perfum
export const createPerfume = (req, res) => {
  const data = loadData();
  const newPerfume = {
    id: data.perfumy.length > 0 ? data.perfumy[data.perfumy.length - 1].id + 1 : 0,
    ...req.body,
  };

  data.perfumy.push(newPerfume);
  saveData(data);

  const result = mapPerfumesWithDetails([newPerfume], data.nuty_zapachowe, data.składniki)[0];
  res.status(201).json(result);
};

// 5. Edytuj perfum po ID (PUT - pełna aktualizacja)
export const updatePerfume = (req, res) => {
  const data = loadData();
  const { id } = req.params;
  const index = data.perfumy.findIndex((item) => item.id === Number(id));

  if (index !== -1) {
    data.perfumy[index] = { id: Number(id), ...req.body };
    saveData(data);

    const result = mapPerfumesWithDetails([data.perfumy[index]], data.nuty_zapachowe, data.składniki)[0];
    res.json(result);
  } else {
    res.status(404).json({ error: `Nie znaleziono perfum o ID ${id}.` });
  }
};

// 6. Edytuj perfum po ID (PATCH - częściowa aktualizacja)
export const patchPerfume = (req, res) => {
  const data = loadData();
  const { id } = req.params;
  const perfume = data.perfumy.find((item) => item.id === Number(id));

  if (perfume) {
    Object.assign(perfume, req.body);
    saveData(data);

    const result = mapPerfumesWithDetails([perfume], data.nuty_zapachowe, data.składniki)[0];
    res.json(result);
  } else {
    res.status(404).json({ error: `Nie znaleziono perfum o ID ${id}.` });
  }
};

// 7. Usuń perfum po ID
export const deletePerfume = (req, res) => {
  const data = loadData();
  const { id } = req.params;
  const initialLength = data.perfumy.length;

  data.perfumy = data.perfumy.filter((item) => item.id !== Number(id));

  if (data.perfumy.length < initialLength) {
    saveData(data);
    res.json({ message: `Perfumy o ID ${id} zostały usunięte.` });
  } else {
    res.status(404).json({ error: `Nie znaleziono perfum o ID ${id}.` });
  }
};

export const getPerfumesByNotesAndIngredient = (req, res) => {
    try {
      const { perfumy, nuty_zapachowe, składniki } = loadData();
      const { nuta, składnik } = req.query;
  
      const ingredient = składniki.find((s) => s.nazwa_składnika.toLowerCase() === składnik.toLowerCase());
      if (!ingredient) {
        return res.status(404).json({ error: `Nie znaleziono składnika o nazwie "${składnik}".` });
      }
  
      const selectedNotes = nuty_zapachowe.filter(
        (note) => note.typ.toLowerCase() === nuta.toLowerCase() && note.składniki.includes(ingredient.id)
      );
  
      if (selectedNotes.length === 0) {
        return res.status(404).json({ error: `Nie znaleziono nut zapachowych typu "${nuta}" z składnikiem "${składnik}".` });
      }
  
      const selectedNoteIds = selectedNotes.map((note) => note.id);
  
      const filteredPerfumes = perfumy.filter((perfume) =>
        perfume.nuty_zapachowe.some((noteId) => selectedNoteIds.includes(noteId))
      );
  
      const result = mapPerfumesWithDetails(filteredPerfumes, nuty_zapachowe, składniki);
      res.json(result);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Błąd podczas filtrowania perfum.' });
    }
  };
  

// 8. Pobierz wszystkie nuty zapachowe
export const getNotes = (req, res) => {
  const { nuty_zapachowe } = loadData();
  res.json(nuty_zapachowe);
};

// 9. Pobierz wszystkie składniki
export const getIngredients = (req, res) => {
  const { składniki } = loadData();
  res.json(składniki);
};
