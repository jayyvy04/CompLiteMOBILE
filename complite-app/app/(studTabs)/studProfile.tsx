import { Text, View, StyleSheet, TextInput, SafeAreaView, Image, TouchableOpacity, Alert, Pressable, Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import { getProfile, sendReport } from "@/utils/database";

export default function studProfile() {
  const [accId, setAccId] = useState();
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [middlename, setMiddlename] = useState('');
  const [sex, setSex] = useState('');
  const [email, setEmail] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [points, setPoints] = useState('');
  const [grades, setGrades] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [report, setReport] = useState('');

  const getUserProfile = async () => {
    const studId = await AsyncStorage.getItem('studentId');
    console.log(studId);
    try {
      const profile = await getProfile(studId);
      console.log(profile);
      if (profile.success){
        setAccId(profile.student.accountid);
        setFirstname(profile.student.firstname);
        setLastname(profile.student.lastname);
        setMiddlename(profile.student.middlename);
        setSex(profile.student.sex);
        setEmail(profile.student.email);
        setBirthdate(profile.student.birthdate);
        setPoints(profile.student.totalpoints);
        setGrades(profile.student.totalgrades);
        setProfilePic(profile.student.profilePhoto);
      } else {
        Alert.alert('Error', profile.message);
      }
    } catch (error) {
      console.log('Error');
    }
  }

  useEffect(() => {
    getUserProfile();
  }, []);

  const sendTheReport = async () => {
    try {
      const feedback = await sendReport(accId, report);
      if (feedback.success){
        Alert.alert('Success', feedback.message);
        setReport('');
        setIsModalVisible(false);
      } else {
        Alert.alert('Error', feedback.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleLogOut =  async () => {
    await AsyncStorage.removeItem('isLoggedIn');
    await AsyncStorage.removeItem('accountId');
    await AsyncStorage.removeItem('studentId');
    await AsyncStorage.removeItem('account');
    router.dismissTo('/');
  }

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="notifications" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={() => setIsModalVisible(true)}
        >
          <Ionicons name="reader-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileContainer}>
        <View style={styles.profileImageContainer}>
          <Image 
            style={styles.profileImage}        
            /* src={} */
          />
        </View>

        <View style={styles.profileDetails}>
          <Text style={styles.nameText}>
            {firstname} {middlename} {lastname}
          </Text>
          <View style={styles.detailRow}>
            <Ionicons name="mail-outline" size={16} color="#666" />
            <Text style={styles.detailText}>Email: {email}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="person-outline" size={16} color="#666" />
            <Text style={styles.detailText}>Sex: {sex}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.detailText}>Birthdate: {birthdate}</Text>
          </View>
        </View>

        <View style={styles.academicContainer}>
          <View style={styles.academicCard}>
            <Text style={styles.academicTitle}>Points</Text>
            <Text style={styles.academicValue}>{points}</Text>
          </View>
          <View style={styles.academicCard}>
            <Text style={styles.academicTitle}>Grades</Text>
            <Text style={styles.academicValue}>{grades}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogOut}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(!isModalVisible)
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity 
              style={styles.closeModalButton}
              onPress={() => setIsModalVisible(!isModalVisible)}
            >
              <Ionicons name="close-circle" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Report Form</Text>
            <TextInput 
              editable={false} 
              value={accId} 
              placeholder={JSON.stringify({accId})}
              style={styles.disabledInput}
            />
            <TextInput
              editable
              multiline
              numberOfLines={10}
              maxLength={250}
              style={styles.textArea}
              placeholder="Your report"
              value={report}
              onChangeText={setReport}
            />
            <TouchableOpacity 
              style={styles.sendReportButton}
              onPress={sendTheReport}
            >
              <Text style={styles.sendReportButtonText}>Send Report</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F4F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 15,
    backgroundColor: 'white',
  },
  iconButton: {
    marginLeft: 15,
  },
  profileContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  profileDetails: {
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
  },
  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  detailText: {
    marginLeft: 10,
    color: '#666',
  },
  academicContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  academicCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    margin: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  academicTitle: {
    color: '#666',
    marginBottom: 5,
  },
  academicValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#E93023',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeModalButton: {
    alignSelf: 'flex-end',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  disabledInput: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  textArea: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 15,
    height: 120,
    marginBottom: 15,
  },
  sendReportButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    padding: 12,
    alignItems: 'center',
  },
  sendReportButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});