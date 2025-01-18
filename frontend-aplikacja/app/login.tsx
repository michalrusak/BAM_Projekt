import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function Login() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      
      <View style={styles.frame}>
        <Text style={styles.title}>Zaloguj się:</Text>

        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Login:</Text>
          <TextInput style={styles.input} placeholder="Wpisz login" />
        </View>

      
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Hasło:</Text>
          <TextInput style={styles.input} placeholder="Wpisz hasło" secureTextEntry />
        </View>

       
        <View style={styles.buttonGroup}>
          <Button title="Zaloguj się" onPress={() => alert('Logowanie')} />
        </View>

        <Text style={styles.registerText}>Nie masz jeszcze u nas konta?</Text>

        <View style={styles.buttonGroup}>
          <TouchableOpacity onPress={() => alert('Przejdź do rejestracji')}>
            <Text style={styles.registerButton} onPress={() => router.push('/register')}>Zarejestruj się</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.push('/')}>
               <FontAwesome name="home" size={20} color="#007bff" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    marginBottom: 30,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  frame: {
    height: '60%',
    width: '65%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
  buttonGroup: {
    marginVertical: 10,
  },
  registerText: {
    textAlign: 'center',
    marginTop: 10,
    color: '#777',
  },
  registerButton: {
    textAlign: 'center',
    color: '#007bff',
    fontWeight: 'bold',
    marginTop: 10,
  },
  homeButton: {
    marginTop: 12,
    flexDirection: 'row', // Ikona i tekst w jednej linii
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  homeText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

