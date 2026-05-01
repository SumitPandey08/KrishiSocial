import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Animated, Easing, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');

export default function ScanScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (scanning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(scanAnim, {
            toValue: 0,
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scanAnim.stopAnimation();
    }
  }, [scanning]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      startScan();
    }
  };

  const takePhoto = async () => {
     let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      startScan();
    }
  };

  const startScan = () => {
    setScanning(true);
    setResult(null);
    
    // Simulate AI Scan
    setTimeout(() => {
      setScanning(false);
      setResult({
        disease: "Leaf Blight",
        confidence: "98%",
        cure: "Spray Mancozeb 2g/L water every 10 days.",
        product: "Mancozeb Fungicide",
      });
    }, 4000);
  };

  const translateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300],
  });

  return (
    <View style={styles.container}>
      {!image ? (
        <View style={styles.viewfinder}>
          <Ionicons name="camera-outline" size={80} color="#FFF" />
          <Text style={styles.hintText}>Point at a leaf or crop</Text>
          
          <View style={styles.controls}>
            <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
              <Ionicons name="images" size={28} color="#FFF" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
              <View style={styles.innerCapture} />
            </TouchableOpacity>
            
            <View style={{ width: 60 }} />
          </View>
        </View>
      ) : (
        <View style={styles.scanContainer}>
          <Image source={{ uri: image }} style={styles.previewImage} />
          
          {scanning && (
            <Animated.View style={[styles.scanLine, { transform: [{ translateY }] }]} />
          )}

          {result && (
            <View style={styles.resultOverlay}>
              <View style={styles.resultHeader}>
                <Text style={styles.diseaseName}>{result.disease}</Text>
                <View style={styles.confidenceBadge}>
                  <Text style={styles.confidenceText}>{result.confidence} Match</Text>
                </View>
              </View>
              
              <Text style={styles.label}>The Cure:</Text>
              <Text style={styles.cureText}>{result.cure}</Text>
              
              <TouchableOpacity 
                style={styles.buyButton}
                onPress={() => Alert.alert("Marketplace", `Taking you to buy ${result.product}`)}
              >
                <Text style={styles.buyButtonText}>Buy Medicine</Text>
                <Ionicons name="chevron-forward" size={18} color="#FFF" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.resetButton} onPress={() => setImage(null)}>
                <Text style={styles.resetText}>Scan Another</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {scanning && (
            <View style={styles.scanningOverlay}>
              <ActivityIndicator size="large" color="#2E7D32" />
              <Text style={styles.scanningText}>Analyzing with Krishi-Lens AI...</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  viewfinder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hintText: {
    color: '#FFF',
    fontSize: 16,
    marginTop: 20,
    fontWeight: '600',
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-evenly',
  },
  galleryButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCapture: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
  },
  scanContainer: {
    flex: 1,
  },
  previewImage: {
    width: width,
    height: 400,
    resizeMode: 'cover',
  },
  scanLine: {
    position: 'absolute',
    width: width,
    height: 4,
    backgroundColor: '#2E7D32',
    top: 0,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  scanningOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningText: {
    color: '#FFF',
    marginTop: 10,
    fontSize: 16,
    fontWeight: '700',
  },
  resultOverlay: {
    backgroundColor: '#FFF',
    flex: 1,
    marginTop: -20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 25,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  diseaseName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  confidenceBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  confidenceText: {
    color: '#2E7D32',
    fontWeight: '700',
    fontSize: 12,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    fontWeight: '600',
  },
  cureText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 25,
  },
  buyButton: {
    backgroundColor: '#2E7D32',
    flexDirection: 'row',
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  buyButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 10,
  },
  resetButton: {
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  resetText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});
