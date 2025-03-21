import { Link, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { View, TextInput, FlatList, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Task } from '@/types';

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem('tasks');
        if (storedTasks) {
          const parsedTasks = JSON.parse(storedTasks);
          setTasks(parsedTasks);
          setFilteredTasks(parsedTasks);
        }
      } catch (error) {
        console.error('Failed to load tasks from AsyncStorage', error);
      }
    };

    fetchTasks();
  }, []);

  // handle search 
  const handleSearch = (text: string) => {
    setSearch(text);
    const filteredTasks = tasks.filter((task) => {
      const byTitle = task.title.toLowerCase().includes(text.toLowerCase());
      const byDescription = task.description.toLowerCase().includes(text.toLowerCase());
      return byTitle || byDescription;
    });
    setFilteredTasks(filteredTasks);
  };

  // handle delete
  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete", style: "destructive", onPress: async () => {
            await AsyncStorage.getItem('tasks').then(async (storedTasks) => {
              const tasks = storedTasks ? JSON.parse(storedTasks) : [];
              const updatedTasks = tasks.filter((t: { id: string }) => t.id !== id);
              await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
            });
            router.push('/');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={24} color="black" />
        <TextInput
          style={styles.searchBar}
          placeholder="Search Tasks"
          placeholderTextColor="#999"
          value={search}
          onChangeText={text => handleSearch(text)}
        />
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card} key={item.id}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.cardTitle}>
                {item.title}
              </Text>
              <Link style={styles.cardLink}
                href={{
                  pathname: '/edit-task/[id]',
                  params: { id: item.id },
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
                  <MaterialIcons name="edit-square" size={24} color="#1e90ff" />
                  <Text style={{ color: '#1e90ff', marginLeft: 4 }}>Edit This</Text>
                </View>
              </Link>
            </View>

            <Text style={styles.cardDescription}>{item.description}</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.cardDueDate}>{new Date(item.dueDate).toDateString()}</Text>
              <MaterialIcons.Button
                name="delete"
                backgroundColor="#FE901100"
                color="#FE0011"
                size={24}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={{ color: '#FE0011', marginLeft: 4 }}>Delete</Text>
              </MaterialIcons.Button>
            </View>
          </View>
        )}
      />

      {/* FAB*/}
      <MaterialIcons
        name="add-circle"
        size={56}
        color="#1e90ff"
        style={styles.fab}
        onPress={() => router.push('/add-task')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 70,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    paddingLeft: 8,
    borderRadius: 8,
  },
  searchIcon: {
    marginLeft: 8,
  },
  taskItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  card: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  cardDueDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  cardLink: {
    fontSize: 14,
    color: '#1e90ff',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});

export default HomeScreen;