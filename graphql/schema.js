import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  # Własny scalar dla daty
  scalar Date

  # Typ inputowy do filtrowania danych
  input PerfumeFilterInput {
    field: String!
    stringFilter: StringFilterInput
    numberFilter: NumberFilterInput
  }

  input StringFilterInput {
    equal: String
    contains: String
    notEqual: String
    notContains: String
  }

  input NumberFilterInput {
    equal: Float
    greaterThan: Float
    lessThan: Float
    greaterOrEqual: Float
    lessOrEqual: Float
  }

  # Typ dla składników perfum
  type Ingredient {
    id: ID!
    nazwa_skladnika: String!
    grupa_zapachowa: String!
  }

  # Typ dla nut zapachowych
  type Note {
    id: ID!
    typ: String!
    skladniki: [String!]!
  }

  # Typ dla perfum
  type Perfume {
    id: ID!
    nazwa: String!
    marka: String!
    nuty_zapachowe: [Note!]!
    pojemnosc: Int
    cena: Float!
    typ: String!
  }

  # Definicje Query
  type Query {
    # Pobierz wszystkie perfumy z filtrowaniem
    getPerfumes(filter: PerfumeFilterInput, page: Int, limit: Int): [Perfume!]!

    # Pobierz szczegóły perfum po ID
    getPerfumeById(id: ID!): Perfume

    # Pobierz wszystkie nuty zapachowe
    getNotes: [Note!]!

    # Pobierz wszystkie składniki
    getIngredients: [Ingredient!]!
  }

  # Definicje Mutation
  type Mutation {
    # Dodaj nowy perfum
    createPerfume(
      nazwa: String!
      marka: String!
      nuty_zapachowe: [ID!]!
      pojemnosc: String!
      cena: Float!
      typ: String!
    ): Perfume!

    # Aktualizuj istniejący perfum
    updatePerfume(
      id: ID!
      nazwa: String
      marka: String
      nuty_zapachowe: [ID!]
      pojemnosc: String
      cena: Float
      typ: String
    ): Perfume!

    # Usuń perfum
    deletePerfume(id: ID!): String
  }
`;
