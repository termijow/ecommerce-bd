// ecommerce_bd/frontend/src/app/quick-notes/page.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';

interface Note {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; // Idealmente configurado
const API_BASE_URL = 'http://localhost:8000'; // Para desarrollo local directo


export default function QuickNotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/quicknotes/notes/`);
      if (!response.ok) {
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

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCreateNote = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
        },
        body: JSON.stringify({
          title: newNoteTitle,
          content: newNoteContent,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to create note. Status: ${response.status}`);
      }

      setNewNoteTitle('');
      setNewNoteContent('');
      fetchNotes();
    } catch (err: any) {
      console.error("Error creating note:", err);
      setError(err.message || "An unknown error occurred while creating the note.");
    }
  };

  return (
    // Puedes aplicar tus colores oscuros aquí si quieres un tema oscuro general para la página
    // <div className="container mx-auto p-6 max-w-2xl bg-custom-dark text-custom-foreground">
    <div className="container mx-auto p-6 max-w-2xl">
      {/* Aplicamos el color rojo custom al título principal */}
      <h1 className="text-3xl font-bold mb-6 text-center text-brand-red">
        Quick Notes
      </h1>

      {/* Formulario para añadir nuevas notas */}
      {/* Puedes aplicar aquí custom-surface, custom-input-bg, etc. */}
      {/* <form onSubmit={handleCreateNote} className="mb-8 p-6 bg-custom-surface rounded-lg shadow-md border border-custom-border"> */}
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
            // className="mt-1 block w-full px-3 py-2 bg-custom-input-bg text-custom-foreground border border-custom-border rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm placeholder-custom-placeholder"
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
            // className="mt-1 block w-full px-3 py-2 bg-custom-input-bg text-custom-foreground border border-custom-border rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm placeholder-custom-placeholder"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter note content"
          />
        </div>
        <button
          type="submit"
          // className="w-full px-4 py-2 bg-brand-blue text-white font-semibold rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 focus:ring-offset-custom-surface"
          className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Note
        </button>
      </form>

      {/* Mostrar mensaje de error si existe */}
      {error && (
        // Aplicamos el color rojo custom al texto del error
        <div className="mb-4 p-3 bg-red-100 border border-custom-red-very-red text-custom-red-very-red rounded">
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
            // <li key={note.id} className="p-4 bg-custom-surface rounded-lg shadow border border-custom-border">
            <li key={note.id} className="p-4 bg-white rounded-lg shadow">
              {/* Podríamos usar el rojo para los títulos de las notas también */}
              <h3 className="text-xl font-semibold text-custom-red-very-red">{note.title}</h3>
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