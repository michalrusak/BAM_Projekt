import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { useNotes } from "../hooks/useNotes";
import * as SecureStore from "expo-secure-store";
import 'react-native-get-random-values';
import CryptoJS from 'crypto-js';
interface Note {
  _id?: string;
  title: string;
  content: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { createNote, getNotes, updateNote, deleteNote } = useNotes();
  const ENCRYPTION_KEY = "your-secret-key"; 

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setIsLoading(true);
      const userId = await SecureStore.getItemAsync("userId");
      if (userId) {
        const fetchedNotes = await getNotes(userId, ENCRYPTION_KEY);
        setNotes(fetchedNotes);
      }
    } catch (error) {
      Alert.alert("Error", "Could not load notes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNote = async () => {
    if (!title || !content) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      const userId = await SecureStore.getItemAsync("userId");
      
      if (!userId) {
        Alert.alert("Error", "User not authenticated");
        return;
      }

      if (editingNote?._id) {
        await updateNote(
          editingNote._id,
          { title, content },
          ENCRYPTION_KEY
        );
      } else {
        await createNote(
          { title, content, userId },
          ENCRYPTION_KEY
        );
      }

      setModalVisible(false);
      clearForm();
      loadNotes();
    } catch (error) {
      Alert.alert("Error", "Could not save note");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteNote(noteId);
      loadNotes();
    } catch (error) {
      Alert.alert("Error", "Could not delete note");
    }
  };

  const clearForm = () => {
    setTitle("");
    setContent("");
    setEditingNote(null);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Add New Note</Text>
      </TouchableOpacity>

      <FlatList
        data={notes}
        keyExtractor={(item) => item._id || Math.random().toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.noteItem}
            onPress={() => {
              setEditingNote(item);
              setTitle(item.title);
              setContent(item.content);
              setModalVisible(true);
            }}
          >
            <Text style={styles.noteTitle}>{item.title}</Text>
            <Text style={styles.noteContent} numberOfLines={2}>
              {item.content}
            </Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteNote(item._id!)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setModalVisible(false);
          clearForm();
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>
            {editingNote ? "Edit Note" : "New Note"}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={[styles.input, styles.contentInput]}
            placeholder="Content"
            value={content}
            onChangeText={setContent}
            multiline
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setModalVisible(false);
                clearForm();
              }}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSaveNote}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? "Saving..." : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  addButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  addButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  noteItem: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  noteContent: {
    fontSize: 14,
    color: "#666",
  },
  deleteButton: {
    position: "absolute",
    right: 10,
    top: 10,
    padding: 5,
  },
  deleteButtonText: {
    color: "#FF3B30",
    fontSize: 14,
  },
  modalView: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  contentInput: {
    height: 200,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    width: "45%",
  },
  saveButton: {
    backgroundColor: "#007AFF",
  },
  cancelButton: {
    backgroundColor: "#FF3B30",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});