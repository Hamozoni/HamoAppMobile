import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { CHATS } from "../../../constants/chats";
import { FlatList } from "react-native-gesture-handler";
import { ChatCard } from "../../../components/cards/chatCard";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated";
import ThemedSafeAreaView from "../../../components/themedViews/safeAreaView";

const { width } = Dimensions.get("window");

interface ChatItem {
    id: string | number;
    [key: string]: any;
}

interface ButtonProps {
    title: string;
    active: string;
    setActive: (title: string) => void;
    disabled?: boolean;
}

const Button = ({ title, active, setActive, disabled }: ButtonProps) => {
    return (
        <TouchableOpacity
            onPress={() => setActive(title)}
            disabled={disabled}
            style={{
                paddingHorizontal: 15,
                borderRadius: 15,
                backgroundColor: disabled ? "transparent" : active === title ? "rgba(14, 218, 133, 1)" : "transparent",
                borderColor: "#eee",
                borderWidth: 1,
                paddingVertical: 7,
                marginRight: 5,
                justifyContent: "center",
                alignItems: "center"
            }}>
            <Text style={{ color: active === title ? "#eee" : "gray", fontSize: 14, fontWeight: "600" }}>{title}</Text>
        </TouchableOpacity>
    );
};

const Chats = () => {

    const router = useRouter();
    const [activeButton, setActiveButton] = useState("All");
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [selectedChats, setSelectedChats] = useState<ChatItem[]>([]);

    const handleEdit = () => {
        setIsEdit(prev => !prev);
    };

    useEffect(() => {
        router.setParams({ isEdit: String(isEdit) });
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

    const handleSelectChat = (chat: ChatItem) => {
        if (selectedChats.some(c => c.id === chat.id)) {
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
                            <Text style={{ fontSize: 18, color: "#1078b9ff", fontWeight: "bold" }}>{isEdit ? "Done" : "Edit"}</Text>
                        </TouchableOpacity>
                    ),
                }}
            />
            <FlatList
                contentInsetAdjustmentBehavior="automatic"
                data={CHATS as ChatItem[]}
                renderItem={({ item }) => (
                    <Animated.View style={[animChatCard, { flexDirection: "row", alignItems: "center", gap: isEdit ? 10 : 0 }]}>
                        {isEdit && (
                            <TouchableOpacity
                                onPress={() => handleSelectChat(item)}
                                style={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: 15,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderWidth: selectedChats.some(c => c.id === item.id) ? 0 : 3,
                                    borderColor: "#d4d2d2ff",
                                    backgroundColor: selectedChats.some(c => c.id === item.id) ? "#12729eff" : "transparent"
                                }}>
                                {selectedChats.some(c => c.id === item.id) && (
                                    <Ionicons name="checkmark" size={26} color="white" />
                                )}
                            </TouchableOpacity>
                        )}
                        <Animated.View style={animTimeLine}>
                            <ChatCard key={item.id} chat={item as any} />
                        </Animated.View>
                    </Animated.View>
                )}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ gap: 10 }}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={() => (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentInsetAdjustmentBehavior="automatic">
                        {
                            ["All", "Unread", "Favorite", "Groups", "Communities"].map((item) => (
                                <Button
                                    key={item}
                                    title={item}
                                    active={activeButton}
                                    setActive={setActiveButton}
                                    disabled={isEdit}
                                />
                            ))
                        }
                    </ScrollView>
                )}
            />
            {isEdit && (
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        padding: 15,
                        position: "absolute",
                        zIndex: 9999,
                        bottom: 0,
                        left: 0,
                        height: 70,
                        width,
                        backgroundColor: "#a09d9d25",
                    }}
                >
                    <TouchableOpacity >
                        <Text style={{ color: "#fa4444ff", fontSize: 16, fontWeight: "600" }}>Archive</Text>
                    </TouchableOpacity>
                    <TouchableOpacity >
                        <Text style={{ color: "#fa4444ff", fontSize: 16, fontWeight: "600" }}>Read all</Text>
                    </TouchableOpacity>
                    <TouchableOpacity >
                        <Text style={{ color: "#fa4444ff", fontSize: 16, fontWeight: "600" }}>Delete</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ThemedSafeAreaView >
    );
};

export default Chats;
