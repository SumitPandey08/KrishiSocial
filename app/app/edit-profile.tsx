import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useUser } from "./src/context/AuthContext";
import { updateProfile, updateProfilePicture } from "./src/services/userService";
import { useRouter } from "expo-router";

export default function EditProfileScreen() {
  const { user, setUser } = useUser();
  const router = useRouter();

  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [website, setWebsite] = useState(user?.website || "");
  const [village, setVillage] = useState(user?.village || "");
  const [district, setDistrict] = useState(user?.district || "");
  const [state, setState] = useState(user?.state || "");
  const [farmSize, setFarmSize] = useState(user?.farmSize?.toString() || "0");
  const [farmingType, setFarmingType] = useState(user?.farmingType || "");
  
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageLoading(true);
      try {
        const updatedUser = await updateProfilePicture(result.assets[0].uri);
        setUser({ ...user, ...updatedUser });
        Alert.alert("Success", "Profile picture updated!");
      } catch (error) {
        console.error("Error updating profile picture:", error);
        Alert.alert("Error", "Could not update profile picture");
      } finally {
        setImageLoading(false);
      }
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const updatedUser = await updateProfile({ 
        name, 
        bio, 
        website, 
        village, 
        district, 
        state, 
        farmSize: parseFloat(farmSize) || 0,
        farmingType
      });
      setUser({ ...user, ...updatedUser });
      Alert.alert("Success", "Profile updated!", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Could not update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="close" size={28} color="#262626" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Digital Resume</Text>
        <TouchableOpacity onPress={handleUpdateProfile} disabled={loading} style={styles.headerButton}>
          {loading ? (
            <ActivityIndicator size="small" color="#2E7D32" />
          ) : (
            <Text style={styles.doneButton}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={handlePickImage} disabled={imageLoading} style={styles.avatarWrapper}>
            <Image
              source={{ uri: user?.profilePicture || "https://via.placeholder.com/150" }}
              style={styles.avatar}
            />
            <View style={styles.cameraIconContainer}>
              <Ionicons name="camera" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
          {imageLoading && <ActivityIndicator size="small" color="#2E7D32" style={{ marginTop: 10 }} />}
          <Text style={styles.changePhotoText}>Change Profile Photo</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell other farmers about yourself"
              multiline
              numberOfLines={3}
            />
          </View>

          <Text style={styles.sectionTitle}>Farm Details</Text>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Farm Size (Acres)</Text>
              <TextInput
                style={styles.input}
                value={farmSize}
                onChangeText={setFarmSize}
                placeholder="5.5"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Farming Type</Text>
            <View style={styles.chipContainer}>
              {["Organic", "Traditional", "Hydroponic", "Mixed", "Other"].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.chip,
                    farmingType === type && styles.activeChip
                  ]}
                  onPress={() => setFarmingType(type)}
                >
                  <Text style={[
                    styles.chipText,
                    farmingType === type && styles.activeChipText
                  ]}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Text style={styles.sectionTitle}>Location</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Village</Text>
            <TextInput
              style={styles.input}
              value={village}
              onChangeText={setVillage}
              placeholder="Your village name"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>District</Text>
              <TextInput
                style={styles.input}
                value={district}
                onChangeText={setDistrict}
                placeholder="District"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>State</Text>
              <TextInput
                style={styles.input}
                value={state}
                onChangeText={setState}
                placeholder="State"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Website / Link</Text>
            <TextInput
              style={styles.input}
              value={website}
              onChangeText={setWebsite}
              placeholder="https://..."
              autoCapitalize="none"
            />
          </View>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerButton: {
    minWidth: 45,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  doneButton: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2E7D32",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  avatarContainer: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: '#F9FAFB',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E5E7EB",
    borderWidth: 3,
    borderColor: '#fff',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2E7D32',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2E7D32",
    marginTop: 15,
  },
  form: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 25,
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    color: "#111827",
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  row: {
    flexDirection: 'row',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 5,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeChip: {
    backgroundColor: '#E8F5E9',
    borderColor: '#2E7D32',
  },
  chipText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  activeChipText: {
    color: '#2E7D32',
  },
});
