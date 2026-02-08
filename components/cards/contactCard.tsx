import { Text, TouchableOpacity, View, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";



interface ContactCardProps {
    _id?: string;
    displayName: string;
    phoneNumbers?: string;
}

const ContactCard = ({ contact }: ContactCardProps) => {

    const router = useRouter()

    const handleContact = () => {
        if (contact.isRegistered === 1) {
            router.replace(`chatWindow/${contact?._id}`)
        } else {
            return;
        }
    };


    return (
        <TouchableOpacity onPress={handleContact} style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 5, }}>
            <View style={{ width: 35, height: 35, borderRadius: 50, backgroundColor: "#eee", justifyContent: "center", alignItems: "center" }}>
                {
                    contact?.profilePicture ?
                        <Image source={{ uri: contact?.profilePicture }} width={35} height={35} style={{ borderRadius: 50 }} />
                        :
                        <Ionicons name="person" size={20} color="#8d8d8dff" />
                }
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5, flex: 1, justifyContent: "space-between", paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: "#eee" }}>
                <View >
                    <Text style={{ fontSize: 14, fontWeight: "bold" }}>{contact.displayName}</Text>
                    <Text style={{ color: "#313131ff", fontSize: 12 }}>
                        {contact?.isRegistered === 1 ? (contact?.about || '') : contact.phoneNumber}
                    </Text>

                </View>
                {
                    contact?.isRegistered === 1 ? "" :
                        <TouchableOpacity>
                            <Text style={{ color: "#18b813ff", fontWeight: "600", fontSize: 14 }}>Invite</Text>
                        </TouchableOpacity>
                }
            </View>

        </TouchableOpacity>
    )
};

export default ContactCard;
