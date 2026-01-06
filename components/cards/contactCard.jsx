import { Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const ContactCard = ({ contact }) => {
    return (
        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 5, }}>
            <View style={{ width: 35, height: 35, borderRadius: "50%", backgroundColor: "#eee", justifyContent: "center", alignItems: "center" }}>
                <Ionicons name="person" size={20} color="#8d8d8dff" />
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5, flex: 1, justifyContent: "space-between", paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: "#eee" }}>
                <View >
                    <Text style={{ fontSize: 14, fontWeight: "bold" }}>{contact.name}</Text>
                    <View style={{ flexDirection: "row", gap: 5, flex: 1 }}>
                        {
                            contact?.phoneNumbers?.map((phone) => (
                                <Text style={{ color: "#313131ff", fontSize: 12 }} key={phone.id}>{phone.number}</Text>
                            ))
                        }
                    </View>

                </View>
                <TouchableOpacity>
                    <Text style={{ color: "#18b813ff", fontWeight: 600, fontSize: 14 }}>Invite</Text>
                </TouchableOpacity>
            </View>

        </TouchableOpacity>
    )
};

export default ContactCard;