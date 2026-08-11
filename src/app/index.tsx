import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager';

export default function HomeScreen() {
  const [hasNfc, setHasNfc] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkNfc() {
      const supported = await NfcManager.isSupported();
      setHasNfc(supported);
      if (supported) {
        await NfcManager.start();
      }
    }
    checkNfc();
  }, []);

  async function readTag() {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      alert(`Tag found! UID: ${tag?.id}`);
    } catch (ex) {
      console.warn('Tag read failed', ex);
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  }

  async function writeTag() {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const bytes = Ndef.encodeMessage([
        Ndef.textRecord('Hello from Windows!')
      ]);
      if (bytes) {
        await NfcManager.ndefHandler.writeNdefMessage(bytes);
        alert('Successfully overwrote the hotel card!');
      }
    } catch (ex) {
      alert('Write failed. The hotel might have locked this chip.');
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  }

  if (hasNfc === false) {
    return (
      <View style={styles.container}>
        <Text>NFC is not supported on this device.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NFC Card Tool</Text>
      
      <TouchableOpacity style={styles.button} onPress={readTag}>
        <Text style={styles.buttonText}>1. Read Card</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.writeButton]} onPress={writeTag}>
        <Text style={styles.buttonText}>2. Overwrite Card</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 40 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, width: '100%', marginBottom: 15 },
  writeButton: { backgroundColor: '#FF3B30' },
  buttonText: { color: 'white', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }
});