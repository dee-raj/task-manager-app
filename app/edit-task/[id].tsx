import React, { useState, useEffect } from 'react';
import {
    Text, TextInput, Button, StyleSheet,
    SafeAreaView, View, Alert, Pressable,
    TouchableOpacity
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

const EditTaskScreen = () => {
    const { id } = useLocalSearchParams() as { id: string };
    const router = useRouter();
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');

    useEffect(() => {
        const fetchStoredTasks = async () => {
            const storedTasks = await AsyncStorage.getItem('tasks');
            if (storedTasks) {
                const currentTaskById = JSON.parse(storedTasks).find((t: { id: string; }) => t.id === id);
                setTitle(currentTaskById.title);
                setDescription(currentTaskById.description);
                setDueDate(currentTaskById.dueDate);
            }
        };
        fetchStoredTasks();
    }, []);


    const handleSave = () => {
        console.log('handleSave');
        const task = {
            id,
            title,
            description,
            dueDate,
        };

        console.log('saved task:', task);
    };

    const handleDelete = () => {
        Alert.alert(
            "Delete Task",
            "Are you sure you want to delete this task?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete", style: "destructive", onPress: () => {
                        router.push('/');
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <MaterialIcons name="arrow-back" size={24} color="black" />
                <Text style={styles.currentTaskText}>Go Back</Text>
            </TouchableOpacity>
            <View style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 20 }} />
            <Text style={styles.title}>Edit Task</Text>

            <TextInput
                style={styles.input}
                placeholder="Task Title"
                value={title}
                onChangeText={setTitle}
            />

            <TextInput
                style={styles.input}
                placeholder="Task Description"
                value={description}
                onChangeText={setDescription}
            />
            <Pressable style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                <MaterialIcons name="date-range" size={24} color="black" />
                <Text style={styles.dateButtonText}>Select Due Date</Text>
            </Pressable>

            {showDatePicker && (
                <>
                    <DateTimePicker
                        value={new Date(dueDate)}
                        mode={'date'}
                        is24Hour={true}
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowDatePicker(false);
                            if (selectedDate) {
                                setDueDate(selectedDate.toISOString());
                            }
                        }}
                    />
                </>
            )}

            <View style={styles.buttonContainer}>
                <Button title="Save" onPress={handleSave} />
            </View>

            <View style={styles.buttonContainer}>
                <Button title="Delete" color="red" onPress={handleDelete} />
            </View>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f9fa',
        marginTop: 70,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    currentTaskContainer: {
        marginBottom: 16,
        padding: 16,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    currentTaskTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    currentTaskText: {
        fontSize: 16,
        marginBottom: 4,
    },
    input: {
        marginTop: 16,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#ffffff',
    },
    buttonContainer: {
        marginTop: 44,
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#A0ABFF',
        borderRadius: 8,
        marginTop: 16,
    },
    dateButtonText: {
        marginLeft: 8,
        color: 'white',
        fontSize: 16,
    },
});

export default EditTaskScreen;
