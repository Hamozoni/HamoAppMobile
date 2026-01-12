import { Ionicons } from "@expo/vector-icons";
import { TextInput, View } from "react-native";
import { SearchInputProps } from "../../types/components.types";

export const SearchInput = ({ value, onChangeText, placeholder = "Search" }: SearchInputProps) => {
    return (
        <View style={{
            height: 40,
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 20,
            marginBottom: 5,
            flexDirection: "row",
            paddingHorizontal: 10,
            alignItems: "center",
        }}>
            <Ionicons name="search" size={26} color="gray" />
            <TextInput
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                style={{
                    flex: 1,
                    fontSize: 18,
                    fontWeight: "medium",
                    color: "gray",
                }}

            />
        </View>
    );
};
