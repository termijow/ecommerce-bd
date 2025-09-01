// ecommerce_bd/frontend/src/app/quick-notes/page.tsx
'use client'; // Necesario para hooks de React como useState y useEffect

import { useState, useEffect, FormEvent } from 'react';

// Define la interfaz para una Nota, debe coincidir con los campos de tu API
interface Note {
  id: number;
  title: string;
  content: string;
  created_at: string; // Django REST framework devuelve fechas como strings ISO 8601
}

// URL base de tu API. Esta variable de entorno la configuraste en docker-compose.yml
// Para el frontend, esta debe ser la URL que el NAVEGADOR puede alcanzar.
// En desarrollo local, con los puertos mapeados, es http://localhost:8000
// La variable NEXT_PUBLIC_API_URL en docker-compose.yml debería ser http://backend:8000
// pero el código del cliente necesita una URL accesible desde el navegador.

// Opción 1: Asumir que el navegador accede al backend directamente en localhost:8000
// const API_BASE_URL = 'http://localhost:8000';

// Opción 2: Usar una variable de entorno que SÍ sea para el cliente.
// Si tu NEXT_PUBLIC_API_URL en docker-compose.yml es http://backend:8000,
// NO funcionará directamente en el navegador.
// Lo ideal es que el Next.js server (en desarrollo) haga proxy o que tengas una URL pública.
// Para este ejemplo, vamos a hardcodear la URL accesible desde el navegador,
// pero en un escenario más robusto, configurarías esto mejor.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';


export default function QuickNotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Para feedback de carga
  const [error, setError] = useState<string | null>(null); // Para mostrar errores

  // --- Función para obtener todas las notas ---
  const fetchNotes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // La URL completa del endpoint
      const response = await fetch(`${API_BASE_URL}/api/quicknotes/notes/`);
      if (!response.ok) {
        // Si la respuesta no es OK (ej. 404, 500), lanza un error
        throw new Error(`Failed to fetch notes. Status: ${response.status}`);
      }
      const data: Note[] = await response.json();
      setNotes(data);
    } catch (err: any) {
      console.error("Error fetching notes:", err);
      setError(err.message || "An unknown error occurred while fetching notes.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Cargar notas cuando el componente se monta por primera vez ---
  useEffect(() => {
    fetchNotes();
  }, []); // El array vacío [] significa que este efecto solo se ejecuta una vez al montar

  // --- Función para manejar el envío del formulario para crear una nueva nota ---
  const handleCreateNote = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario (recargar la página)
    setError(null);

    if (!newNoteTitle.trim() || !newNoteContent.trim()) {
      setError("Title and content cannot be empty.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/quicknotes/notes/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Si tuvieras autenticación, aquí añadirías el token:
          // 'Authorization': `Bearer ${yourAuthToken}`
        },
        body: JSON.stringify({
          title: newNoteTitle,
          content: newNoteContent,
        }),
      });

      if (!response.ok) {
        // Intenta obtener más detalles del error si el backend los envía
        const errorData = await response.json().catch(() => ({})); // Evita error si el body no es JSON
        throw new Error(errorData.detail || `Failed to create note. Status: ${response.status}`);
      }

      // Si la nota se creó exitosamente:
      setNewNoteTitle(''); // Limpiar el campo del título
      setNewNoteContent(''); // Limpiar el campo del contenido
      fetchNotes(); // Volver a cargar la lista de notas para mostrar la nueva
    } catch (err: any) {
      console.error("Error creating note:", err);
      setError(err.message || "An unknown error occurred while creating the note.");
    }
  };

  // --- Renderizado del componente ---
  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Quick Notes</h1>

      {/* Formulario para añadir nuevas notas */}
      <form onSubmit={handleCreateNote} className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="noteTitle" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="noteTitle"
            value={newNoteTitle}
            onChange={(e) => setNewNoteTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter note title"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="noteContent" className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            id="noteContent"
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            rows={4}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter note content"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Note
        </button>
      </form>

      {/* Mostrar mensaje de error si existe */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}

      {/* Sección para mostrar las notas */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Existing Notes</h2>
      {isLoading ? (
        <p className="text-gray-600">Loading notes...</p>
      ) : notes.length === 0 && !error ? (
        <p className="text-gray-600">No notes yet. Add your first one above!</p>
      ) : (
        <ul className="space-y-4">
          {notes.map((note) => (
            <li key={note.id} className="p-4 bg-white rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-800">{note.title}</h3>
              <p className="text-gray-600 mt-1 whitespace-pre-wrap">{note.content}</p>
              <p className="text-xs text-gray-400 mt-3">
                Created: {new Date(note.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}