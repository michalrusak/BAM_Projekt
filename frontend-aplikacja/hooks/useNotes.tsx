import * as SecureStore from "expo-secure-store";
import CryptoJS from "crypto-js";

interface Note {
  id?: string;
  title: string;
  content: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const useNotes = () => {
  const API_URL = "https://localhost:3000/notes";
  
  const encryptText = (text: string, key: string): string => {
    return CryptoJS.AES.encrypt(text, key).toString();
  };

  const decryptText = (ciphertext: string, key: string): string => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const createNote = async (note: Note, encryptionKey: string) => {
    try {
      const encryptedContent = encryptText(note.content, encryptionKey);
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...note,
          content: encryptedContent,
        }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error creating note:", error);
      throw error;
    }
  };

  const getNotes = async (userId: string, encryptionKey: string) => {
    try {
      const response = await fetch(`${API_URL}/user/${userId}`);
      const notes = await response.json();
      return notes.map((note: Note) => ({
        ...note,
        content: decryptText(note.content, encryptionKey),
      }));
    } catch (error) {
      console.error("Error fetching notes:", error);
      throw error;
    }
  };

  const updateNote = async (
    noteId: string,
    updates: Partial<Note>,
    encryptionKey: string
  ) => {
    try {
      const encryptedContent = updates.content 
        ? encryptText(updates.content, encryptionKey)
        : undefined;
      
      const response = await fetch(`${API_URL}/${noteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...updates,
          content: encryptedContent,
        }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error updating note:", error);
      throw error;
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      await fetch(`${API_URL}/${noteId}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error deleting note:", error);
      throw error;
    }
  };

  return {
    createNote,
    getNotes,
    updateNote,
    deleteNote,
  };
};