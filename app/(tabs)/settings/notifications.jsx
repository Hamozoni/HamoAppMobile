import { ScrollView, Text, View } from "react-native";
import ThemedSafeAreaView from "../../../components/themedViews/safeAreaView";
import SwitchedBtn from "../../../components/buttons/switchedBtn";
import TitleForwarIconBtn from "../../../components/buttons/titleForwarIconBtn";
import ThemedViewContainer from "../../../components/themedViews/ThemedViewContainer";
import Separator from "../../../components/ui/separator";
const notificationsData = [
    {
        title: "Message notifications",
        id: 1,
        data: [
            {
                id: 1,
                title: "Show notifications",
                isSwitched: false,
                onValueChange: () => { }
            },
            {
                id: 2,
                title: "Sound",
                selected: "none",
                link: "/settings/notifications/messagesound"

            },
            {
                id: 3,
                title: "Reaction notification",
                isSwitched: true,
                onValueChange: () => { }

            }
        ]

    },
    {
        title: "Group notifications",
        id: 2,
        data: [
            {
                id: 1,
                title: "Show notifications",
                isSwitched: false,
                onValueChange: () => { }
            },
            {
                id: 2,
                title: "Sound",
                selected: "none",
                link: "/settings/notifications/groupsound"

            },
            {
                id: 3,
                title: "Reaction notification",
                isSwitched: false,
                onValueChange: () => { }

            }
        ]

    },
    {
        title: "Status notifications",
        id: 3,
        data: [
            {
                id: 1,
                title: "Show notifications",
                isSwitched: true,
                onValueChange: () => { }
            },
            {
                id: 2,
                title: "Sound",
                selected: "none",
                link: "/settings/notifications/statussound"

            },
            {
                id: 3,
                title: "Reaction notification",
                selected: "none",
                link: "/settings/notifications/statusreaction"

            }
        ]

    },
];

const notificationsData2 = [
    {
        id: 1,
        title: "Reminders",
        isSwitched: false,
        onValueChange: () => { },
        description: "Get occasiional reminders about messages, calls or status updates you haven't seen.",

    },
    {
        id: 2,
        title: "Clear badge",
        subtitle: "Home screen notifications",
        isSwitched: true,
        onValueChange: () => { },
        description: "Your home screen badge clears completely after every time you open the app.",

    },
    {
        id: 3,
        title: "In-app notifications",
        selected: "Banners,Sounds,Vibration",
        link: "/settings/notifications/inappnotifications",

    },
    {
        id: 4,
        title: "Show preview",
        isSwitched: true,
        onValueChange: () => { },
        description: "Preview messages text inside new message notifications.",

    },
    {
        id: 5,
        title: "Reset notification settings",
        isSwitched: true,
        onValueChange: () => { },
        description: "Reset all notification settings, including custom notification settings. for your chats.",

    }
];

export default function SettingsNotifications() {
    return (
        <ThemedSafeAreaView>
            <ScrollView contentInsetAdjustmentBehavior="automatic" showsVerticalScrollIndicator={false}>
                {
                    notificationsData.map((item) => (
                        <View key={item.id}>
                            <Separator />
                            <Text style={{ fontSize: 16, fontWeight: 500, color: "#696868ff", paddingHorizontal: 15, marginVertical: 10 }}>{item.title}</Text>
                            <ThemedViewContainer>
                                {
                                    item.data.map((dataItem) => (

                                        dataItem.selected ? (
                                            <TitleForwarIconBtn
                                                key={dataItem.id}
                                                title={dataItem.title}
                                                link={dataItem.link}
                                            />
                                        ) : (
                                            <SwitchedBtn
                                                key={dataItem.id}
                                                title={dataItem.title}
                                                isSwitched={dataItem.isSwitched}
                                                onValueChange={dataItem.onValueChange} />
                                        )
                                    ))
                                }

                            </ThemedViewContainer>

                        </View>
                    ))
                }
                <Separator />
                {
                    notificationsData2.map((item) => (
                        <View key={item.id}>
                            {
                                item.subtitle ? (
                                    <Text style={{ fontSize: 16, fontWeight: 500, color: "#696868ff", paddingHorizontal: 15, marginVertical: 10 }}>{item.subtitle}</Text>
                                ) : null
                            }

                            <ThemedViewContainer>
                                {
                                    item.isSwitched ? (
                                        <SwitchedBtn
                                            key={item.id}
                                            title={item.title}
                                            isSwitched={item.isSwitched}
                                            onValueChange={item.onValueChange}
                                            isLast={true}
                                        />
                                    ) : (
                                        <TitleForwarIconBtn
                                            key={item.id}
                                            title={item.title}
                                            link={item.link}
                                            selectet={item.selected}
                                            isLast={true}
                                        />
                                    )

                                }

                            </ThemedViewContainer>
                            {
                                item.description ? (
                                    <Text style={{ fontSize: 14, fontWeight: 500, color: "#696868ff", paddingHorizontal: 15, marginVertical: 10 }}>{item.description}</Text>
                                ) : null
                            }
                            <Separator />

                        </View>
                    ))
                }
                <Separator />
            </ScrollView>
        </ThemedSafeAreaView>
    );
}