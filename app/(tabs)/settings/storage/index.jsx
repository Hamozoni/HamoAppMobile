import { ScrollView, Text, View } from "react-native";
import ThemedSafeAreaView from "../../../../components/themedViews/safeAreaView";
import ThemedViewContainer from "../../../../components/themedViews/ThemedViewContainer";
import TitleForwarIconBtn from "../../../../components/buttons/titleForwarIconBtn";
import SwitchedBtn from "../../../../components/buttons/switchedBtn";
import Separator from "../../../../components/ui/separator";
const storageData = [
    {
        id: 1,
        title: "Storage",
        data: [
            {
                id: 1,
                title: "Manage storage",
                link: "/settings/storage/manage",
            }
        ]

    },
    {
        id: 2,
        title: "Network",
        data: [
            {
                id: 1,
                title: "Network usage",
                link: "/settings/storage/networkusage",
            },
            {
                id: 2,
                title: "Use less data for calls",
                isSwitched: true,
                onValueChange: () => { },
            },
            {
                id: 3,
                title: "Proxy",
                link: "/settings/storage/proxy",
            }
        ]
    },
    {
        id: 3,
        title: "Media quality",
        data: [
            {
                id: 1,
                title: "Upload quality",
                link: "/settings/storage/uploadquality",
                selected: "Standard",
            },
            {
                id: 2,
                title: "Auto-ownload quality",
                link: "/settings/storage/downloadquality",
            }
        ]
    },
    {
        id: 4,
        title: "Media auto-download",
        data: [
            {
                id: 1,
                title: "Photos",
                link: "/settings/storage/photos",
                selected: "On",
                selected: "On",
            },
            {
                id: 2,
                title: "Videos",
                link: "/settings/storage/videos",
                selected: "On",
            },
            {
                id: 3,
                title: "Audio",
                link: "/settings/storage/audio",
                selected: "On",
            },
            {
                id: 4,
                title: "Documents",
                link: "/settings/storage/documents",
                selected: "On",
            }
        ]
    }
]
export default function SettingsStorage() {
    return (
        <ThemedSafeAreaView>
            <ScrollView contentInsetAdjustmentBehavior="automatic" showsVerticalScrollIndicator={false}>
                <Separator />
                {
                    storageData.map((item) => (
                        <View key={item.id}>
                            <Text style={{ fontSize: 16, fontWeight: 500, color: "#696868ff", paddingHorizontal: 15, marginVertical: 10 }}>{item.title}</Text>
                            <ThemedViewContainer>
                                {
                                    item.data.map((dataItem, index, arr) => (
                                        dataItem.isSwitched ? (
                                            <SwitchedBtn
                                                key={dataItem.id}
                                                title={dataItem.title}
                                                value={dataItem.value}
                                                onValueChange={dataItem.onValueChange}
                                                isLast={index === arr.length - 1}
                                            />
                                        ) : (
                                            <TitleForwarIconBtn
                                                key={dataItem.id}
                                                title={dataItem.title}
                                                link={dataItem.link}
                                                isLast={index === arr.length - 1}
                                                selected={dataItem?.selected}
                                            />
                                        )
                                    ))
                                }
                            </ThemedViewContainer>
                            <Separator />
                        </View>
                    ))
                }
                <Text style={{ fontSize: 14, fontWeight: 500, color: "#757575ff", paddingHorizontal: 15, marginVertical: 10 }}>
                    Voice messages are always automatically downloaded.
                </Text>
                <Separator />
            </ScrollView>
        </ThemedSafeAreaView>
    );
}