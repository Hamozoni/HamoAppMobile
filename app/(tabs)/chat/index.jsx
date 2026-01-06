
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { CHATS } from "../../../constants/chats";
import { FlatList } from "react-native-gesture-handler";
import { ChatCard } from "../../../components/cards/chatCard";
import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated";
import { Dimensions } from "react-native";
import ThemedSafeAreaView from "../../../components/themedViews/safeAreaView";

const width = Dimensions.get("window").width;


const Chats = () => {

    const router = useRouter();

    const [activeButton, setActiveButton] = useState("All");
    const [isEdit, setIsEdit] = useState(false);
    const [selectedChats, setSelectedChats] = useState([]);

    const handleEdit = () => {
        setIsEdit(prev => !prev);
        router.setParams({ isEdit });
    };
    const Button = ({ title, active, setActive }) => {
        return (
            <TouchableOpacity
                onPress={() => setActive(title)}
                disabled={isEdit}
                style={{
                    paddingHorizontal: 15,
                    borderRadius: 15,
                    backgroundColor: isEdit ? "transparent" : active === title ? "rgba(14, 218, 133, 1)" : "transparent",
                    borderColor: "#eee",
                    borderWidth: 2,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    marginRight: 5,
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                <Text style={{ color: active === title ? "#eee" : "gray", fontSize: 14, fontWeight: "600" }}>{title}</Text>
            </TouchableOpacity>
        );
    }

    useEffect(() => {
        router.setParams({ isEdit });
    }, [isEdit]);

    const animChatCard = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: isEdit ? withSpring(0) : withSpring(-30) }],
        };
    });

    const animTimeLine = useAnimatedStyle(() => {
        return {
            width: isEdit ? withSpring(width - 75) : withSpring(width - 30),
        };
    });

    const handleSelectChat = (chat) => {

        if (selectedChats.includes(chat)) {
            setSelectedChats(prev => prev.filter(item => item.id !== chat.id));
        } else {
            setSelectedChats(prev => [...prev, chat]);
        }
    };



    return (
        <ThemedSafeAreaView>
            <Stack.Screen
                options={{
                    headerLeft: () => (
                        <TouchableOpacity onPress={handleEdit} >
                            <Text style={{ fontSize: 18, color: "#1449f7ee", fontWeight: "600" }}>{isEdit ? "Done" : "Edit"}</Text>
                        </TouchableOpacity>
                    ),

                }}
            />
            <FlatList
                contentInsetAdjustmentBehavior="automatic"
                data={CHATS}
                renderItem={({ item }) => (
                    <Animated.View style={[animChatCard, { flexDirection: "row", alignItems: "center", gap: isEdit ? 5 : 0 }]}>
                        <TouchableOpacity
                            onPress={() => handleSelectChat(item)}
                            style={{
                                width: 30,
                                height: 30,
                                borderRadius: "50%",
                                justifyContent: "center",
                                alignItems: "center",
                                borderWidth: selectedChats.includes(item) ? 0 : 3,
                                borderColor: "#d4d2d2ff",
                                backgroundColor: selectedChats.includes(item) ? "#12729eff" : "transparent"
                            }}>
                            {
                                selectedChats.includes(item) && (
                                    <Ionicons name="checkmark" size={26} color="white" />
                                )
                            }
                        </TouchableOpacity>
                        <Animated.View style={animTimeLine}>
                            <ChatCard key={item.id} chat={item} />
                        </Animated.View>
                    </Animated.View>
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ gap: 10 }}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={() => (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ marginBottom: 10, marginTop: 20 }}
                        contentInsetAdjustmentBehavior="automatic">

                        {
                            ["All", "Unread", "Favorite", "Groups", "Communities"].map((item) => (
                                <Button key={item} title={item} active={activeButton} setActive={setActiveButton} />
                            ))
                        }
                    </ScrollView>
                )}
            />
            {
                isEdit && (
                    <Animated.View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            padding: 14,
                            position: "absolute",
                            zIndex: 99999999999,
                            bottom: 0,
                            left: 0,
                            height: 70,
                            width,
                            backgroundColor: "#ff464625",
                        }}
                    >
                        <TouchableOpacity >
                            <Text style={{ color: "#9e1597ff", fontSize: 16, fontWeight: "600" }}>Archive</Text>
                        </TouchableOpacity>
                        <TouchableOpacity >
                            <Text style={{ color: "#9e1597ff", fontSize: 16, fontWeight: "600" }}>Read all</Text>
                        </TouchableOpacity>
                        <TouchableOpacity >
                            <Text style={{ color: "#9e1597ff", fontSize: 16, fontWeight: "600" }}>Delete</Text>
                        </TouchableOpacity>
                    </Animated.View>)
            }
        </ThemedSafeAreaView >
    );
};

export default Chats; 