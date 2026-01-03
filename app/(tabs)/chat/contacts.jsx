import { Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ContactsList from "../../../components/contacts/contacts";


const bottons = [
    {
        text: 'New Group',
        iconName: 'people-outline',
        id: 1
    },
    {
        text: 'New Contact',
        iconName: 'person-add-outline',
        id: 2
    },
    {
        text: 'New Community',
        iconName: 'people-outline',
        id: 3
    },
    {
        text: 'New broadcast',
        iconName: 'megaphone-outline',
        id: 4
    }
]

export default function ContactsPage() {


    const Buttons = ({ text, iconName, index }) => {
        return (
            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Ionicons name={iconName} size={24} color="#07d400ff" />
                <Text
                    style={{ borderBottomWidth: index === bottons.length - 1 ? 0 : 1, borderBottomColor: "#eee", flex: 1, paddingVertical: 16 }}>
                    {text}
                </Text>
            </TouchableOpacity>
        )
    };

    return (
        <ContactsList>
            <View
                style={{
                    backgroundColor: "#fff",
                    paddingHorizontal: 16,
                    borderRadius: 10,
                    marginVertical: 20
                }}
            >
                {
                    bottons.map(({ text, iconName, id }, index) => (
                        <Buttons key={id} text={text} iconName={iconName} index={index} />
                    ))
                }
            </View>
        </ContactsList>
    )
}