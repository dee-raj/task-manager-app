import React, { useState } from 'react';
import {
  View, Text, TextInput, Button,
  StyleSheet, Platform, TouchableOpacity, Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';

import { Task } from '@/types';

const AddTaskScreen = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);

  const handleAddTask = async () => {
    try {
      if (!title || !description || !dueDate) {
        alert('Please fill in all fields');
        return;
      }

      const newTask = {
        id: new Date().getTime().toString(),
        title,
        description,
        dueDate: dueDate,
      };

      // Retrieve existing tasks from AsyncStorage
      const existingTasks = await AsyncStorage.getItem('tasks');
      const tasks: Task[] = existingTasks ? JSON.parse(existingTasks) : [];

      // Add the new task to the tasks array
      tasks.push(newTask);

      // Save the updated tasks array back to AsyncStorage
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));

      console.log('Task added:', newTask);
      setTitle('');
      setDescription('');
      setDueDate(undefined);
      router.back();
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || dueDate;
    setShowDatePicker(Platform.OS === 'ios');
    setDueDate(currentDate);
  };

  const handleClearStorage = () => {
    try {
      Alert.alert(
        "AsyncStorage cleared",
        "Are you sure you want to clreare storage?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "CLEAR ALL", style: "destructive", onPress: async () => {
              await AsyncStorage.clear();
              router.push('/');
            }
          }
        ]
      );
      console.log('AsyncStorage cleared');
    } catch (error) {
      console.error('Failed to clear AsyncStorage:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <MaterialIcons name="arrow-back" size={24} color="black" />
        <Text style={styles.dateText}>Go Back</Text>
      </TouchableOpacity>
      <View style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 20 }} />
      <Text style={styles.title}>Add New Task</Text>
      <TextInput
        placeholder="Task Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        placeholderTextColor="#888"
      />

      <TextInput
        placeholder="Task Description"
        value={description}
        onChangeText={setDescription}
        style={[styles.input, styles.textarea]}
        placeholderTextColor="#888"
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity onPress={showDatepicker} style={styles.input}>
        <Text style={styles.dateText}>
          {dueDate ? dueDate.toLocaleDateString() : 'Select Due Date'}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={dueDate || new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}


      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 }}>
        <Button title="Clear" onPress={() => { setTitle(''); setDescription(''); setDueDate(undefined) }} color="#d63031" />
        <Button title="Save Task" onPress={handleAddTask} color="#6c5ce7" />
      </View>
      <Button title="Clear Storage" onPress={handleClearStorage} color="#d63031" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    paddingHorizontal: 12,
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  textarea: {
    height: 120,
    textAlignVertical: 'top',
  },
  dateText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});

export default AddTaskScreen;