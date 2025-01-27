import {Client, Databases, ID, Query} from 'appwrite';

const DATABASE_ID = process.env.REACT_APP_VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = REACT_APP_VITE_APPWRITE_COLLECTION_ID;
const PROJECT_ID = REACT_APP_VITE_APPWRITE_PROJECT_ID;

const client = new Client()
.setEndpoint('https://cloud.appwrite.io/v1')
.setProject(PROJECT_ID)


const database = new Databases(client);


export const updateSearchCount = async (searchTerm, movie) => {
    // 1. Use Appwrite SDK to check if the search term already exists in the db

    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.equal('searchTerm', searchTerm),
    ])

    // 2. If it does, update the count

    if(result.documents.length > 0) {
        const doc = result.documents[0];
    

    await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: doc.count + 1,
        })
    // 3. If it doesn't, create a new document with the search term and count as 1
  
    } else {
        await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(),{
            searchTerm,
            count: 1,
            movie_id: movie.id,
            poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        })
    }


    } catch (error) {
        console.error(error);
    }
}

export const getTrendingMovies = async () => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID,[
            Query.limit(5),
            Query.orderDesc("count")
        ])
        return result.documents;
    } catch {

    }
}

// REACT_APP_VITE_TMDB_API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwOGYzZTExM2MxYjJiODdlNTRhN2YzYjAyMDBkMDAwZCIsIm5iZiI6MTczNzg5MzcxMy4yOTc5OTk5LCJzdWIiOiI2Nzk2Mjc1MTI1ZDI5ODBmYjAyM2UzZmMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.rghJOKvZOwcG7I2Z8oOMlgp3R9uA_i6qYdi6tt3bb0s';
// REACT_APP_VITE_APPWRITE_PROJECT_ID = '679677e2001077fe2afd';
//  = '6796786d003be6c29180';
//  = '679678af0039c7359f76';