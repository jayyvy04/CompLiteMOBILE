import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Modal, Image, Pressable, TextInput, Alert} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getInstructorProfile, sendReport } from '@/utils/database';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function instructProfile() {
    const [accId, setAccId] = useState();
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [middlename, setMiddlename] = useState('');
    const [sex, setSex] = useState('');
    const [email, setEmail] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [profilePic, setProfilePic] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [report, setReport] = useState('');

    const instructorProfile = async () => {
        const instructId = await AsyncStorage.getItem('instructorId');
        try {
            const profile = await getInstructorProfile(instructId);
            console.log(profile);
            if (profile.success){
                setAccId(profile.instructor.accountid);
                setFirstname(profile.instructor.firstname);
                setLastname(profile.instructor.lastname);
                setMiddlename(profile.instructor.middlename);
                setSex(profile.instructor.sex);
                setEmail(profile.instructor.email);
                setBirthdate(profile.instructor.birthdate);
                setProfilePic(profile.instructor.profilePhoto);
            } else {
                Alert.alert('Error', profile.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        instructorProfile();
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
        await AsyncStorage.removeItem('instructorId');
        await AsyncStorage.removeItem('account');
        router.dismissTo('/');
    }

    return (
    <SafeAreaView style={styles.container}>
 
      <View style={styles.groupButtons}>
        <Pressable>
          <Ionicons name="notifications" size={24} color="black" />
        </Pressable>
        <Pressable onPress={() => setIsModalVisible(true)}>
          <Ionicons name="create-outline" size={24} color="black" />
        </Pressable>
      </View>
      <View >
        <Image />
      </View>

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
            <TouchableOpacity onPress={() => setIsModalVisible(!isModalVisible)}>
              <Ionicons name="close-circle" size={24} color="black" />
            </TouchableOpacity>
            <Text>Report Form</Text>
            <TextInput editable={false} value={accId} placeholder={JSON.stringify({accId})}/>
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
            <TouchableOpacity onPress={sendTheReport}>
              <Text>Send Report</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text>{firstname} {middlename} {lastname}</Text>
      <Text>Email: {email}</Text>
      <Text>Sex: {sex}</Text>
      <Text>Birthdate: {birthdate}</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogOut}>
        <Text>Logout</Text>
      </TouchableOpacity>

    </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {  
        flex: 1,
    },
    groupButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: 20,
    },
    logoutButton: {
        backgroundColor: 'red',
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
        height: 350,
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