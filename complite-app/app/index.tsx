import { Text, View, StyleSheet, SafeAreaView, TextInput, Pressable, TouchableOpacity, Alert, Image, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import { loginUser } from '../utils/database.js';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notVisible, setNotVisible] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  //useEffect hook for running the checkingLoginStatus automatically without any action
  useEffect(() => {
    checkingLoginStatus();
  }, []);

  //checking the login status of the user
  const checkingLoginStatus = async () => {
    const stat = await AsyncStorage.getItem('isLoggedIn');
    const type = await AsyncStorage.getItem('account');
    if (stat === 'true'){
      setIsLoggedIn(true);
      if (type == 'Student'){
        router.replace('/(studTabs)/studDashboard');
      } else {
        router.replace('/(instructTabs)/instructDashboard');
      }
    } else {
      setIsLoggedIn(false);
      setPassword('');
      setUsername('');
    }
  }

  //handling Login Action
  const onLogin = async () => {
    try {
      setIsLoading(!isLoading); //enabling loading on press
      const response = await loginUser(username, password); //login api
      console.log(response);
      if (response.success){
        await AsyncStorage.setItem('isLoggedIn', 'true');
        setIsLoggedIn(true);
        
        //Setting delay for 3 seconds - loading
        setTimeout(async () => {
          if (response.user.accountType == 'Student'){
            await AsyncStorage.setItem('accountId', JSON.stringify(response.user.id));
            await AsyncStorage.setItem('studentId', JSON.stringify(response.user.studentId));
            await AsyncStorage.setItem('account', JSON.stringify(response.user.accountType));
            router.replace('/(studTabs)/studDashboard');
          } else {
            await AsyncStorage.setItem('accountId', JSON.stringify(response.user.id));
            await AsyncStorage.setItem('instructorId', JSON.stringify(response.user.instructorId));
            await AsyncStorage.setItem('account', JSON.stringify(response.user.accountType));
            router.replace('/(instructTabs)/instructDashboard')
          }
        }, 1000);
      } else {
        setIsLoading(false);
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      Alert.alert('Error: ');
    }
  };

  return (
<SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>C</Text>
        </View>
      </View>
      <View style={styles.loginContainer}>
        <Text style={styles.titleText}>Login to Your Account</Text>
        <Text style={styles.subtitleText}>Welcome to COMPLITE!</Text>
        
        <View style={styles.inputWrapper}>
          <Ionicons 
            name="person-outline" 
            size={20} 
            color="#888" 
            style={styles.inputIcon} 
          />
          <TextInput 
            style={styles.input} 
            placeholder="Username" 
            placeholderTextColor="#888" 
            value={username} 
            onChangeText={setUsername} 
          />
        </View>
        
        <View style={styles.inputWrapper}>
          <Ionicons 
            name="lock-closed-outline" 
            size={20} 
            color="#888" 
            style={styles.inputIcon} 
          />
          <TextInput 
            style={styles.passwordInput} 
            placeholder="Password" 
            placeholderTextColor="#888" 
            value={password} 
            onChangeText={setPassword} 
            secureTextEntry={notVisible}
          />
          <Pressable 
            style={styles.eyeIconContainer} 
            onPress={() => setNotVisible(!notVisible)}
          >
            <Ionicons 
              name={notVisible ? 'eye-off-outline' : 'eye-outline'} 
              size={20} 
              color="#333" 
            />
          </Pressable>
        </View>
        
        <TouchableOpacity style={styles.loginButton} onPress={onLogin}>
          {isLoading && <ActivityIndicator color="white" style={styles.loadingIndicator} /> }
          <Text style={styles.loginButtonText}>{isLoading ? 'Loading' : 'Sign In'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    paddingHorizontal: 25,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
  },
  logoText: {
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#1E2432',
  },
  subtitleText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#6A7280',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIcon: {
    marginLeft: 15,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 55,
    fontSize: 16,
    color: '#1E2432',
  },
  passwordInput: {
    flex: 1,
    height: 55,
    fontSize: 16,
    color: '#1E2432',
  },
  eyeIconContainer: {
    padding: 15,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  loadingIndicator: {
    marginRight: 10,
  }
});