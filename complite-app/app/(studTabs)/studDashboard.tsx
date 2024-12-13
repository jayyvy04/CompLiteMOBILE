import { useState, useEffect, useCallback } from "react";
import { Text, View, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Modal, TextInput } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getEnrollSection, enrollToSection } from "@/utils/database";
import EnrollSection from '../components/enrolledSectionList.js';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function studDashboard() {
  const [sections, setSections] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [secCode, setSecCode] = useState('');
    
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      enrolledSections();
    }, 2000);
  }, []);

  const enrolledSections = async () => {
    const studentid = await AsyncStorage.getItem('studentId');
    try {
      const enrolled = await getEnrollSection(studentid);
      console.log(enrolled);
      setSections(enrolled);
    } catch (error) {
      console.log(error);
    }
  }

  const enrollSection = async () => {
    try {
      const id = await AsyncStorage.getItem('studentId');
      const enroll = await enrollToSection(secCode, id);
      console.log(enroll);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    enrolledSections();
  }, [])

  return (
    <View style={styles.container}>
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Your Sections</Text>
    </View>
    
    <FlatList
      data={sections}
      renderItem={({ item }) => <EnrollSection section={ item }/>}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />

    <Modal 
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => {
          setIsModalVisible(!isModalVisible)
      }}
      >
        <View style={styles.CenterView}>
          <View style={styles.ModalView}>
            <TouchableOpacity 
              style={styles.modalCloseButton} 
              onPress={() => setIsModalVisible(!isModalVisible)}
            >
              <Ionicons name="close-circle" size={30} color="#FCD200" />
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>Enroll Section</Text>
            
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.input}
                editable 
                value={secCode} 
                onChangeText={setSecCode} 
                placeholder='Section Code'
                placeholderTextColor="#999"
              />
            </View>
            
            <TouchableOpacity 
              style={styles.enrollButton} 
              onPress={enrollSection}
            >
              <Text style={styles.enrollButtonText}>Enroll Section</Text>
            </TouchableOpacity>
          </View>
        </View>
    </Modal>

    <TouchableOpacity 
      style={styles.floatingEnrollButton} 
      onPress={() => setIsModalVisible(true)}
    >
      <Ionicons name="add" size={24} color="white" />
    </TouchableOpacity>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC', // Light background color
    paddingTop: 50, // More space at the top
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#232946', // Vibrant blue header
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    marginTop:15,
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  CenterView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
  },
  ModalView: {
    width: '85%', // More responsive width
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  enrollButton: {
    backgroundColor: '#FCD200',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
    width: '100%',
  },
  enrollButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  floatingEnrollButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#FCD200',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  enrollButtonFloatingText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalCloseButton: {
    alignSelf: 'flex-end',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#FCD200',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#F7F9FC',
  },
});