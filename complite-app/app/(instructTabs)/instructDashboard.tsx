import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Platform, Button, Alert, RefreshControl} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getSectionDetails, addSection } from '@/utils/database';
import Section from '../components/sectionlist.js';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

export default function instructDashboard() {
    const [sections, setSections] = useState([]);
    const [sectionName, setSectionName] = useState('');
    const [courseName, setCourseName] = useState('');
    const [activityName, setActivityName] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isPickerShow, setIsPickerShow] = useState(false);
    const [actDate, setActDate] = useState(new Date(Date.now()));
    const [mode, setMode] = useState('date');
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
            getSections();
        }, 2000);
    }, []);

    const showPicker = (currentMode) => {
        setIsPickerShow(true);
        setMode(currentMode)
    };
    
      const onChange = (event, value) => {
        setActDate(value);
        if (Platform.OS === 'android') {
          setIsPickerShow(false);
        }
    };

    const getSections = async () => {
        try {
            const instructId = await AsyncStorage.getItem('instructorId');
            const secLists = await getSectionDetails(instructId);
            console.log(secLists);
            setSections(secLists);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getSections();
    }, []);

    const createSection = async () => {
        const instructId = await AsyncStorage.getItem('instructorId');
        const code = generateRandomString(6);
        const newActDate = actDate.toISOString().split('T')[0];
        try {
            const add = await addSection(instructId, courseName, courseDescription, activityName, sectionName, code, newActDate);
            console.log(add);
            if (add.success) {
                Alert.alert('Success', add.message);
                setCourseName('');
                setActivityName('');
                setCourseDescription('');
                setSectionName('');
                setIsModalVisible(false);
                router.replace('/(instructTabs)/instructDashboard');
            } else {
                Alert.alert('Error', add.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <View style={styles.container}>
            <Text>List of Section</Text>
            <FlatList
                data={sections}
                renderItem={({ item }) => <Section section={item} />}
                keyExtractor={(item, index) => index.toString()}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />

        <Modal 
            animationType="fade"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => {
                setIsModalVisible(!isModalVisible)
            }}
        >
                <View style={styles.CenterView}>
                <View style={styles.ModalView}>
                    <TouchableOpacity onPress={() => setIsModalVisible(!isModalVisible)}>
                    <Ionicons name="close-circle" size={24} color="black" />
                    </TouchableOpacity>
                    <Text>Report Form</Text>
                    <TextInput editable value={sectionName} onChangeText={setSectionName} placeholder='Section Name' />
                    <TextInput editable value={courseName} onChangeText={setCourseName} placeholder='Course Name' />
                    <TextInput editable value={activityName} onChangeText={setActivityName} placeholder='Activity Name' />
                    <TextInput
                    editable
                    multiline
                    numberOfLines={10}
                    maxLength={250}
                    style={styles.textArea}
                    placeholder="Course Description"
                    value={courseDescription}
                    onChangeText={setCourseDescription}
                    />
                    <View >
                        <Text>{actDate.toUTCString()}</Text>
                    </View>

                    {/* The button that used to trigger the date picker */}
                    {!isPickerShow && (
                        <View >
                            <Button title="Show Date Picker" color="purple" onPress={() => showPicker('date')} />
                            <Button title="Show Time Picker" color="purple" onPress={() => showPicker('time')} />
                        </View>
                    )}

                    {/* The date picker */}
                    {isPickerShow && (
                        <DateTimePicker
                        value={actDate}
                        mode={mode}
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        is24Hour={true}
                        onChange={onChange}
                        />
                    )}
                    <TouchableOpacity onPress={() => createSection()}>
                        <Text>Add Section</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </Modal>

            <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                <Text>Add Section</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    CenterView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    ModalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        width: 350,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
    },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    textArea: {
        padding: 10,
        borderWidth: 1,
    },
});