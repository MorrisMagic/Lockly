import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Modal, TextInput, Button, Alert, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import * as FileSystem from 'expo-file-system';

// Path to store the backup file

const Header = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [website, setWebsite] = useState('');
    const [password, setPassword] = useState('');
    const [passwords, setPasswords] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    
    const backupFilePath = '/storage/emulated/0/password_backup.txt';
    // Function to create a backup file
const createBackup = async () => {
  try {
    const backupContent = passwords.map(p => `Website: ${p.website}, Password: ${p.password}`).join('\n');
    const fileUri = FileSystem.documentDirectory + 'password_backup.txt';  // Save in documentDirectory
    await FileSystem.writeAsStringAsync(fileUri, backupContent);
    console.log('Backup created at:', fileUri);
  } catch (error) {
    console.error('Failed to create backup:', error);
  }
};
  // Fetch passwords from storage
  const fetchPasswords = async () => {
    try {
      const existingData = await AsyncStorage.getItem('passwords');
      const parsedData = existingData ? JSON.parse(existingData) : [];
      setPasswords(parsedData);
    } catch (e) {
      Alert.alert('Error', 'Failed to load passwords');
    }
  };

  // Save a new password
  const savePassword = async () => {
    if (!website || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const updatedPasswords = [...passwords, { website, password }];
      await AsyncStorage.setItem('passwords', JSON.stringify(updatedPasswords));
      setPasswords(updatedPasswords);
          await createBackup(updatedPasswords); // Create backup

      Alert.alert('Success', 'Password saved');
      setModalVisible(false);
      setWebsite('');
      setPassword('');
    } catch (e) {
      Alert.alert('Error', 'Failed to save password');
    }
  };

  // Delete a password
  const deletePassword = async (index) => {
    try {
      const updatedPasswords = passwords.filter((_, i) => i !== index);
      await AsyncStorage.setItem('passwords', JSON.stringify(updatedPasswords));
      setPasswords(updatedPasswords);
      Alert.alert('Success', 'Password deleted');
    } catch (e) {
      Alert.alert('Error', 'Failed to delete password');
    }
  };

  // Edit a password
  const startEditPassword = (index) => {
    const passwordToEdit = passwords[index];
    setWebsite(passwordToEdit.website);
    setPassword(passwordToEdit.password);
    setEditingIndex(index);
    setEditModalVisible(true);
  };

  const saveEditedPassword = async () => {
    if (!website || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const updatedPasswords = [...passwords];
      updatedPasswords[editingIndex] = { website, password };
      await AsyncStorage.setItem('passwords', JSON.stringify(updatedPasswords));
      setPasswords(updatedPasswords);
          await createBackup(updatedPasswords); // Create backup

      Alert.alert('Success', 'Password updated');
      setEditModalVisible(false);
      setWebsite('');
      setPassword('');
      setEditingIndex(null);
    } catch (e) {
      Alert.alert('Error', 'Failed to update password');
    }
  };

  useEffect(() => {
    fetchPasswords();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lockly</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <AntDesign name="plussquareo" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Display Saved Passwords */}
    {/* Display Saved Passwords or Placeholder Text */}
{passwords.length > 0 ? (
  <FlatList
    data={passwords}
    keyExtractor={(item, index) => index.toString()}
    style={{ paddingVertical: 17 }}
    renderItem={({ item, index }) => (
      <View style={styles.passwordItem}>
        <View>
          <Text style={styles.websiteText}>🌐 {item.website}</Text>
          <Text style={styles.passwordText}>🔑 {item.password}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => startEditPassword(index)}>
            <AntDesign name="edit" size={20} color="yellow" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deletePassword(index)}>
            <AntDesign name="delete" size={20} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    )}
  />
) : (
  <View style={styles.emptyState}>
    <Text style={styles.emptyText}>Press the + button to add a password</Text>
  </View>
)}


      {/* Add Password Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Website Name"
              placeholderTextColor="#888"
              value={website}
              onChangeText={setWebsite}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#888"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <View style={{display:"flex",justifyContent:"space-between",flexDirection:"row", gap:13}}>

            <Button title="Save" onPress={savePassword} />
            <Button title="Cancel" color="red" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Password Modal */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Website Name"
              placeholderTextColor="#888"
              value={website}
              onChangeText={setWebsite}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#888"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <Button title="Update" onPress={saveEditedPassword} />
            <Button title="Cancel" color="red" onPress={() => setEditModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#121212',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontWeight: '900',
    fontSize: 18,
    letterSpacing: 1,
  },
  passwordItem: {
    backgroundColor: '#1e1e1e',
    padding: 9,
    borderRadius: 5,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  websiteText: {
    color: 'white',
    padding:2,
    fontWeight: 'bold',
  },
  passwordText: {
    color: '#ccc',
  },
  actions: {
    flexDirection: 'row',
  
    gap: 13,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#212121',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color:"white",
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 15,
    padding: 8,
    color:"white"
  },
  emptyState: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
 
},
emptyText: {
  color: '#888',
  fontSize: 16,
  fontStyle: 'italic',
},

});
