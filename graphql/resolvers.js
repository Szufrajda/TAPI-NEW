import { loadData, saveData } from '../controllers/PerfumeController.js';

export const resolvers = {
  Query: {
    // 1. Pobierz wszystkie perfumy z filtrowaniem, paginacją i sortowaniem
    getPerfumes: (_, { filter, page = 1, limit = 10 }) => {
      const { perfumy, nuty_zapachowe, składniki } = loadData();

      let filteredPerfumes = [...perfumy];

      // Logika filtrowania
      if (filter) {
        const { field, stringFilter, numberFilter } = filter;

        // Filtrowanie stringów
        if (field && stringFilter) {
          const { equal, contains, notEqual, notContains } = stringFilter;
          filteredPerfumes = filteredPerfumes.filter((perfume) => {
            const value = perfume[field]?.toLowerCase() || '';
            if (equal) return value === equal.toLowerCase();
            if (contains) return value.includes(contains.toLowerCase());
            if (notEqual) return value !== notEqual.toLowerCase();
            if (notContains) return !value.includes(notContains.toLowerCase());
            return true;
          });
        }

        // Filtrowanie liczb
        if (field && numberFilter) {
          const { equal, greaterThan, lessThan, greaterOrEqual, lessOrEqual } = numberFilter;
          filteredPerfumes = filteredPerfumes.filter((perfume) => {
            const value = perfume[field];
            if (equal !== undefined) return value === equal;
            if (greaterThan !== undefined) return value > greaterThan;
            if (lessThan !== undefined) return value < lessThan;
            if (greaterOrEqual !== undefined) return value >= greaterOrEqual;
            if (lessOrEqual !== undefined) return value <= lessOrEqual;
            return true;
          });
        }
      }

      // Paginacja
      const start = (page - 1) * limit;
      const paginatedPerfumes = filteredPerfumes.slice(start, start + limit);

      // Mapowanie nut zapachowych i składników
      return paginatedPerfumes.map((perfume) => ({
        ...perfume,
        nuty_zapachowe: perfume.nuty_zapachowe.map((noteId) => {
          const note = nuty_zapachowe.find((n) => n.id === noteId);
          return {
            id: note?.id,
            typ: note?.typ,
            skladniki: note?.składniki.map((skladnikId) => {
              const skladnik = składniki.find((s) => s.id === skladnikId);
              return skladnik ? skladnik.nazwa_składnika : `Nieznany składnik (${skladnikId})`;
            }) || [],
          };
        }),
      }));
    },

    // 2. Pobierz szczegóły perfum po ID
    getPerfumeById: (_, { id }) => {
      const { perfumy, nuty_zapachowe, składniki } = loadData();
      const perfume = perfumy.find((item) => item.id === Number(id));
      if (!perfume) throw new Error(`Nie znaleziono perfum o ID ${id}`);

      return {
        ...perfume,
        nuty_zapachowe: perfume.nuty_zapachowe.map((noteId) => {
          const note = nuty_zapachowe.find((n) => n.id === noteId);
          return {
            id: note?.id,
            typ: note?.typ,
            skladniki: note?.składniki.map((skladnikId) => {
              const skladnik = składniki.find((s) => s.id === skladnikId);
              return skladnik ? skladnik.nazwa_składnika : `Nieznany składnik (${skladnikId})`;
            }) || [],
          };
        }),
      };
    },

    // 3. Pobierz wszystkie nuty zapachowe
    getNotes: () => {
      const { nuty_zapachowe, składniki } = loadData();
      return nuty_zapachowe.map((note) => ({
        ...note,
        skladniki: note.składniki.map((id) => {
          const skladnik = składniki.find((s) => s.id === id);
          return skladnik ? skladnik.nazwa_składnika : `Nieznany składnik (${id})`;
        }),
      }));
    },

    // 4. Pobierz wszystkie składniki
    getIngredients: () => {
      const { składniki } = loadData();
      return składniki;
    },
  },

  Mutation: {
    // 1. Stwórz nowy perfum
    createPerfume: (_, { nazwa, marka, nuty_zapachowe, pojemnosc, cena, typ }) => {
      const data = loadData();
      const newPerfume = {
        id: data.perfumy.length > 0 ? data.perfumy[data.perfumy.length - 1].id + 1 : 0,
        nazwa,
        marka,
        nuty_zapachowe,
        pojemnosc,
        cena,
        typ,
      };

      data.perfumy.push(newPerfume);
      saveData(data);
      return newPerfume;
    },

    // 2. Aktualizuj istniejący perfum
    updatePerfume: (_, { id, nazwa, marka, nuty_zapachowe, pojemnosc, cena, typ }) => {
      const data = loadData();
      const perfume = data.perfumy.find((item) => item.id === Number(id));
      if (!perfume) throw new Error(`Nie znaleziono perfum o ID ${id}`);

      Object.assign(perfume, { nazwa, marka, nuty_zapachowe, pojemnosc, cena, typ });
      saveData(data);
      return perfume;
    },

    // 3. Usuń perfum
    deletePerfume: (_, { id }) => {
      const data = loadData();
      const initialLength = data.perfumy.length;

      data.perfumy = data.perfumy.filter((item) => item.id !== Number(id));
      if (data.perfumy.length === initialLength) {
        throw new Error(`Nie znaleziono perfum o ID ${id}`);
      }

      saveData(data);
      return `Perfumy o ID ${id} zostały usunięte.`;
    },
  },
};

