import React, { useEffect, useRef, useState } from 'react';
import MapView, { Marker, Region } from 'react-native-maps';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Modal,
    ActivityIndicator,
    Keyboard,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';

interface Place {
    id: string;
    name: string;
    address: string;
    type: string;
    lat: number;
    lng: number;
}

// Sample places data - in production, use Google Places API
const NEARBY_PLACES: Place[] = [
    { id: '1', name: 'Coffee Shop', address: '123 Main St', type: 'cafe', lat: 0, lng: 0 },
    { id: '2', name: 'Restaurant', address: '456 Oak Ave', type: 'restaurant', lat: 0, lng: 0 },
    { id: '3', name: 'Gas Station', address: '789 Pine Rd', type: 'gas_station', lat: 0, lng: 0 },
    { id: '4', name: 'Hospital', address: '321 Health Blvd', type: 'hospital', lat: 0, lng: 0 },
    { id: '5', name: 'Shopping Mall', address: '555 Commerce St', type: 'shopping', lat: 0, lng: 0 },
];

export default function LocationScreen() {
    const router = useRouter();
    const mapRef = useRef<MapView>(null);

    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(true);
    const [searchModalVisible, setSearchModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Place[]>([]);
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

    // Default region (can be any location - using Khartoum, Sudan as default)
    const defaultRegion: Region = {
        latitude: 15.5007,
        longitude: 32.5599,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    };

    // Get user location on mount
    useEffect(() => {
        (async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied');
                    setIsLoadingLocation(false);
                    return;
                }

                let currentLocation = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                });
                setLocation(currentLocation);
                setIsLoadingLocation(false);

                // Animate map to user location
                if (mapRef.current && currentLocation) {
                    setTimeout(() => {
                        mapRef.current?.animateToRegion({
                            latitude: currentLocation.coords.latitude,
                            longitude: currentLocation.coords.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }, 1000);
                    }, 500);
                }
            } catch (error) {
                setErrorMsg('Error getting location');
                setIsLoadingLocation(false);
                console.error(error);
            }
        })();
    }, []);

    // Search places
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setSearchResults([]);
            return;
        }

        // Filter places - in production, use Google Places API
        const filtered = NEARBY_PLACES.filter(
            place =>
                place.name.toLowerCase().includes(query.toLowerCase()) ||
                place.address.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filtered);
    };

    // Select a place from search
    const selectPlace = (place: Place) => {
        setSelectedPlace(place);
        setSearchModalVisible(false);
        setSearchQuery('');
        Keyboard.dismiss();

        // If place has coordinates, animate to it
        if (place.lat && place.lng && place.lat !== 0) {
            mapRef.current?.animateToRegion({
                latitude: place.lat,
                longitude: place.lng,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            }, 1000);
        }
    };

    // Send current location
    const sendLocation = () => {
        if (location) {
            console.log('Sending location:', {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
            router.back();
        }
    };

    // Go to user's current location
    const goToMyLocation = () => {
        if (location && mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }, 500);
        }
    };

    const getPlaceIcon = (type: string): keyof typeof Ionicons.glyphMap => {
        switch (type) {
            case 'cafe': return 'cafe';
            case 'restaurant': return 'restaurant';
            case 'gas_station': return 'car';
            case 'hospital': return 'medkit';
            case 'shopping': return 'cart';
            default: return 'location';
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container} edges={['top']}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Send Location</Text>
                    <View style={{ width: 40 }} />
                </View>

                {/* Search Bar */}
                <TouchableOpacity
                    style={styles.searchBar}
                    onPress={() => setSearchModalVisible(true)}
                >
                    <Ionicons name="search" size={20} color="#888" />
                    <Text style={styles.searchPlaceholder}>Search for a place...</Text>
                </TouchableOpacity>

                {/* Map */}
                <View style={styles.mapContainer}>
                    <MapView
                        ref={mapRef}
                        style={styles.map}
                        showsUserLocation={true}
                        showsMyLocationButton={false}
                        showsCompass={true}
                        initialRegion={defaultRegion}
                    >
                        {selectedPlace && selectedPlace.lat !== 0 && (
                            <Marker
                                coordinate={{
                                    latitude: selectedPlace.lat,
                                    longitude: selectedPlace.lng,
                                }}
                                title={selectedPlace.name}
                                description={selectedPlace.address}
                            />
                        )}
                    </MapView>

                    {/* Loading overlay */}
                    {isLoadingLocation && (
                        <View style={styles.loadingOverlay}>
                            <View style={styles.loadingBox}>
                                <ActivityIndicator size="small" color="#259cd3" />
                                <Text style={styles.loadingText}>Getting your location...</Text>
                            </View>
                        </View>
                    )}

                    {/* My Location Button */}
                    <TouchableOpacity
                        style={styles.myLocationButton}
                        onPress={goToMyLocation}
                    >
                        <Ionicons name="locate" size={24} color="#259cd3" />
                    </TouchableOpacity>

                    {/* Center Pin */}
                    <View style={styles.centerPin}>
                        <Ionicons name="location" size={40} color="#259cd3" />
                    </View>
                </View>

                {/* Bottom Actions */}
                <View style={styles.bottomContainer}>
                    <TouchableOpacity style={styles.sendLocationButton} onPress={sendLocation}>
                        <Ionicons name="navigate" size={24} color="#fff" />
                        <View style={styles.sendLocationText}>
                            <Text style={styles.sendLocationTitle}>Send your current location</Text>
                            <Text style={styles.sendLocationSubtitle}>
                                {location
                                    ? `${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`
                                    : 'Fetching location...'}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.liveLocationButton}>
                        <View style={styles.liveLocationIcon}>
                            <Ionicons name="pulse" size={24} color="#259cd3" />
                        </View>
                        <View style={styles.liveLocationText}>
                            <Text style={styles.liveLocationTitle}>Share live location</Text>
                            <Text style={styles.liveLocationSubtitle}>Share for 15 min, 1 hour, or 8 hours</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#ccc" />
                    </TouchableOpacity>
                </View>

                {/* Search Modal */}
                <Modal
                    visible={searchModalVisible}
                    animationType="slide"
                    presentationStyle="pageSheet"
                    onRequestClose={() => setSearchModalVisible(false)}
                >
                    <SafeAreaView style={styles.modalContainer}>
                        {/* Modal Header */}
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={() => setSearchModalVisible(false)}>
                                <Ionicons name="close" size={28} color="#333" />
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>Search Places</Text>
                            <View style={{ width: 28 }} />
                        </View>

                        {/* Search Input */}
                        <View style={styles.modalSearchContainer}>
                            <Ionicons name="search" size={20} color="#888" />
                            <TextInput
                                style={styles.modalSearchInput}
                                placeholder="Search for places..."
                                placeholderTextColor="#999"
                                value={searchQuery}
                                onChangeText={handleSearch}
                                autoFocus
                            />
                            {searchQuery.length > 0 && (
                                <TouchableOpacity onPress={() => handleSearch('')}>
                                    <Ionicons name="close-circle" size={20} color="#888" />
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Search Results */}
                        <FlatList
                            data={searchQuery ? searchResults : NEARBY_PLACES}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.placeItem}
                                    onPress={() => selectPlace(item)}
                                >
                                    <View style={styles.placeIcon}>
                                        <Ionicons name={getPlaceIcon(item.type)} size={22} color="#259cd3" />
                                    </View>
                                    <View style={styles.placeInfo}>
                                        <Text style={styles.placeName}>{item.name}</Text>
                                        <Text style={styles.placeAddress}>{item.address}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                            ListHeaderComponent={
                                !searchQuery ? (
                                    <Text style={styles.sectionTitle}>Nearby Places</Text>
                                ) : null
                            }
                            ListEmptyComponent={
                                searchQuery ? (
                                    <View style={styles.emptyResults}>
                                        <Ionicons name="search-outline" size={50} color="#ccc" />
                                        <Text style={styles.emptyText}>No places found</Text>
                                    </View>
                                ) : null
                            }
                        />
                    </SafeAreaView>
                </Modal>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        marginHorizontal: 15,
        marginVertical: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 10,
        gap: 10,
    },
    searchPlaceholder: {
        fontSize: 16,
        color: '#888',
    },
    mapContainer: {
        flex: 1,
        position: 'relative',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    loadingOverlay: {
        position: 'absolute',
        top: 20,
        alignSelf: 'center',
        zIndex: 10,
    },
    loadingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.95)',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        gap: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    loadingText: {
        fontSize: 14,
        color: '#666',
    },
    myLocationButton: {
        position: 'absolute',
        right: 15,
        bottom: 15,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    centerPin: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -20,
        marginTop: -40,
    },
    bottomContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    sendLocationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#259cd3',
        padding: 15,
        borderRadius: 12,
        gap: 15,
        marginBottom: 12,
    },
    sendLocationText: {
        flex: 1,
    },
    sendLocationTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    sendLocationSubtitle: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 2,
    },
    liveLocationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        padding: 15,
        borderRadius: 12,
        gap: 15,
    },
    liveLocationIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#e8f4f8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    liveLocationText: {
        flex: 1,
    },
    liveLocationTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    liveLocationSubtitle: {
        fontSize: 13,
        color: '#888',
        marginTop: 2,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    modalSearchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        marginHorizontal: 15,
        marginVertical: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 10,
        gap: 10,
    },
    modalSearchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#888',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#f8f8f8',
    },
    placeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        gap: 12,
    },
    placeIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#e8f4f8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeInfo: {
        flex: 1,
    },
    placeName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    placeAddress: {
        fontSize: 14,
        color: '#888',
        marginTop: 2,
    },
    emptyResults: {
        alignItems: 'center',
        paddingVertical: 50,
        gap: 15,
    },
    emptyText: {
        fontSize: 16,
        color: '#888',
    },
});
