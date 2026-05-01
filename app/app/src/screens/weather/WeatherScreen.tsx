import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, RefreshControl, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import api from '../../services/api';

export default function WeatherScreen() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchWeather();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchWeather().then(() => setRefreshing(false));
  }, []);

  const fetchWeather = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Location permission denied');
        useFallbackWeather('Pune (Permission Denied)');
        return;
      }

      const enabled = await Location.hasServicesEnabledAsync();
      if (!enabled) {
        console.warn('Location services are disabled');
        useFallbackWeather('Pune (GPS Disabled)');
        return;
      }

      let location = null;
      try {
        location = await Location.getLastKnownPositionAsync({});
        if (!location) {
          location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
            timeout: 5000,
          });
        }
      } catch (locError) {
        console.warn('Could not get precise location, using fallback:', locError);
      }

      if (location) {
        const response = await api.get('/farmer/weather', {
          params: {
            lat: location.coords.latitude,
            lon: location.coords.longitude,
          }
        });
        setWeather(response.data);
      } else {
        useFallbackWeather('Pune (Fallback)');
      }
    } catch (error) {
      console.error('Weather error:', error);
      useFallbackWeather('Pune');
    } finally {
      setLoading(false);
    }
  };

  const useFallbackWeather = (locationName: string) => {
    setWeather({
      temperature: 32,
      humidity: 45,
      description: 'Sunny',
      location: locationName,
      windSpeed: 12,
      icon: '01d',
      forecast: []
    });
    setLoading(false);
  };

  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  if (!weather) {
    return (
      <View style={styles.centerContainer}>
        <Text>Failed to load weather data.</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#2E7D32"]} />
      }
    >
      {/* Current Weather */}
      <View style={styles.currentWeather}>
        <Text style={styles.locationName}>{weather.location}</Text>
        {weather.icon ? (
          <Image source={{ uri: getWeatherIcon(weather.icon) }} style={styles.weatherIconLarge} />
        ) : (
          <Ionicons name="sunny" size={80} color="#FFD700" style={styles.weatherIcon} />
        )}
        <Text style={styles.temp}>{Math.round(weather.temperature)}°C</Text>
        <Text style={styles.desc}>{weather.description}</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="water" size={20} color="#2E7D32" />
            <Text style={styles.statVal}>{weather.humidity}%</Text>
            <Text style={styles.statLab}>Humidity</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="leaf" size={20} color="#2E7D32" />
            <Text style={styles.statVal}>{weather.windSpeed} km/h</Text>
            <Text style={styles.statLab}>Wind</Text>
          </View>
        </View>
      </View>

      {/* Alerts */}
      <View style={styles.alertCard}>
        <View style={styles.alertHeader}>
          <Ionicons name="warning" size={24} color="#FFF" />
          <Text style={styles.alertTitle}>Weather Alert</Text>
        </View>
        <Text style={styles.alertText}>
          {weather.temperature > 35 
            ? "Extreme Heat Warning: Temperatures likely to reach high levels. Avoid heavy outdoor work." 
            : "Conditions are normal. Good time for routine farm maintenance."}
        </Text>
      </View>

      {/* Spraying Timeline */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Spraying Guide</Text>
        <View style={styles.sprayCard}>
          <MaterialCommunityIcons name="spray" size={30} color="#2E7D32" />
          <View style={{ flex: 1 }}>
            <Text style={styles.sprayStatus}>
              {weather.windSpeed < 15 ? "Best time to spray: Now" : "Avoid spraying: High winds"}
            </Text>
            <Text style={styles.sprayReason}>Reason: {weather.windSpeed < 15 ? "Low wind & Clear sky" : "Wind speed is too high"}</Text>
          </View>
          <View style={[styles.goBadge, weather.windSpeed >= 15 && { backgroundColor: '#FF5252' }]}>
            <Text style={styles.goText}>{weather.windSpeed < 15 ? "GO" : "NO"}</Text>
          </View>
        </View>
      </View>

      {/* Real-time Hourly Forecast */}
      {weather.forecast && weather.forecast.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next 24 Hours</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hourlyList}>
            {weather.forecast.map((item: any, i: number) => (
              <View key={i} style={styles.hourlyItem}>
                <Text style={styles.hourText}>{item.time}</Text>
                <Image source={{ uri: `https://openweathermap.org/img/wn/${item.icon}.png` }} style={styles.hourIcon} />
                <Text style={styles.hourTemp}>{item.temp}°C</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FDF7',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentWeather: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  locationName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#666',
  },
  weatherIcon: {
    marginVertical: 15,
  },
  weatherIconLarge: {
    width: 120,
    height: 120,
  },
  temp: {
    fontSize: 64,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  desc: {
    fontSize: 20,
    color: '#2E7D32',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 30,
    width: '100%',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statVal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 5,
  },
  statLab: {
    fontSize: 12,
    color: '#888',
  },
  alertCard: {
    margin: 20,
    backgroundColor: '#FF5252',
    borderRadius: 20,
    padding: 20,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  alertTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
  },
  alertText: {
    color: '#FFF',
    lineHeight: 20,
    fontSize: 14,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 15,
  },
  sprayCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    borderWidth: 1,
    borderColor: '#E8F5E9',
  },
  sprayStatus: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  sprayReason: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  goBadge: {
    backgroundColor: '#2E7D32',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 12,
  },
  hourlyList: {
    gap: 15,
  },
  hourlyItem: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 15,
    width: 90,
    borderWidth: 1,
    borderColor: '#E8F5E9',
  },
  hourText: {
    fontSize: 11,
    color: '#666',
    marginBottom: 5,
  },
  hourIcon: {
    width: 40,
    height: 40,
  },
  hourTemp: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 5,
  },
});
