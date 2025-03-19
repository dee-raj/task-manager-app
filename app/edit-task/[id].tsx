import React, { useState, useEffect } from 'react';
import {
    Text, TextInput, Button, StyleSheet,
    SafeAreaView, View, Pressable,
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


    const handleSave = async () => {
        const task = {
            id,
            title,
            description,
            dueDate,
        };
        await AsyncStorage.getItem('tasks').then(async (storedTasks) => {
            const tasks = storedTasks ? JSON.parse(storedTasks) : [];
            const updatedTasks = tasks.map((t: { id: string }) => t.id === id ? task : t);
            await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks)).then(() => {
                router.push('/');
            });
        });
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
            <View style={[styles.currentTaskContainer, {marginTop: 16, flexDirection: 'column' }]}>
                <>
                <Text style={styles.currentTaskTitle}>Current Due Date</Text>
                {dueDate && <Text style={styles.currentTaskText}>{new Date(dueDate).toDateString()}</Text>}
                </>
                <Pressable style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                    <MaterialIcons name="edit-calendar" size={22} color="blue" />
                    <Text style={styles.dateButtonText}>
                        Edit Due Date
                    </Text>
                </Pressable>
            </View>

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
                <Button title="Save"  onPress={handleSave} color={"#10FF09"} />
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
        backgroundColor: '#A0AB11',
        borderRadius: 8,
        marginTop: 16,
    },
    dateButtonText: {
        marginLeft: 8,
        color: 'blue',
        fontSize: 16,
    },
});

export default EditTaskScreen;
