import express from 'express'; // Framework Express.js
import cors from 'cors'; // Middleware dla CORS
import perfumeRoutes from './routes/PerfumeRoutes.js'; // Trasy REST API dla perfum
import ingredientsRoutes from './routes/IngredientsRoutes.js'; // Trasy REST API dla składników
import notesRoutes from './routes/NotesRoutes.js'; // Trasy REST API dla nut zapachowych
import { ApolloServer } from 'apollo-server-express'; // GraphQL Server
import { typeDefs } from './graphql/schema.js'; // Schema GraphQL
import { resolvers } from './graphql/resolvers.js'; // Resolvers - logika GraphQL

const app = express(); // Inicjalizacja aplikacji Express
const port = process.env.PORT || 3000; // Port, na którym działa serwer

// Middleware do przetwarzania JSON
app.use(express.json());

// Middleware CORS
const corsOptions = {
    origin: ['http://localhost:3000', 'https://studio.apollographql.com'], // Zezwól na lokalny Playground i Apollo Studio
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Dozwolone metody HTTP
    allowedHeaders: ['Content-Type', 'Authorization'], // Dozwolone nagłówki
    credentials: true, // Zezwól na ciasteczka (opcjonalne)
};
app.use(cors(corsOptions));

// Middleware ustawiający nagłówki HTTP
app.use((req, res, next) => {
    res.set("Content-Type", "application/json"); // Typ odpowiedzi
    res.set("X-Powered-By", "PerfumeAPI"); // Nagłówek informacyjny
    next();
});

// Podłączenie tras REST API
app.use('/api/perfumes', perfumeRoutes); // Trasy dla zasobu "perfumy"
app.use('/api/ingredients', ingredientsRoutes); // Trasy dla zasobu "składniki"
app.use('/api/notes', notesRoutes); // Trasy dla zasobu "nuty zapachowe"

// Konfiguracja Apollo Server dla GraphQL
const startServer = async () => {
    try {
        const server = new ApolloServer({
            typeDefs, // Twoja schema GraphQL
            resolvers, // Twoje resolvers
            introspection: true, // Umożliwia introspekcję (ważne dla Apollo Studio)
            playground: true, // Aktywuje lokalny Playground
        });

        await server.start();
        console.log('Apollo Server wystartował!');

        server.applyMiddleware({
            app,
            cors: {
                origin: ['http://localhost:3000', 'https://studio.apollographql.com'], // Zezwól na dostęp dla Studio i lokalnego Playground
                credentials: true, // Zezwól na ciasteczka (opcjonalne)
            },
        });

        // Endpoint główny aplikacji
        app.get('/', (req, res) => {
            res.send('API do zarządzania perfumami działa!');
        });

        // Obsługa braku trasy
        app.use((req, res) => {
            res.status(404).json({ error: 'Nie znaleziono zasobu.' });
        });

        // Uruchomienie serwera
        app.listen(port, () => {
            console.log(`Serwer działa na porcie ${port}`); // Informacja o działającym serwerze REST API
            console.log(`GraphQL działa na adresie http://localhost:${port}${server.graphqlPath}`); // Informacja o adresie GraphQL
        });
    } catch (error) {
        console.error('Błąd podczas uruchamiania serwera:', error.message);
        process.exit(1);
    }
};

startServer();
