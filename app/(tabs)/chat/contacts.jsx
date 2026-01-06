import ContactsList from "../../../components/contacts/contacts";
import ThemedViewContainer from "../../../components/themedViews/ThemedViewContainer";
import TitleForwarIconBtn from "../../../components/buttons/titleForwarIconBtn";
import Separator from "../../../components/ui/separator";


const bottons = [
    {
        Title: 'New Group',
        iconName: 'people-outline',
        id: 1,
        link: '/chat/newGroup'
    },
    {
        Title: 'New Contact',
        iconName: 'person-add-outline',
        id: 2,
        link: '/chat/newContact'
    },
    {
        Title: 'New Community',
        iconName: 'people-outline',
        id: 3,
        link: '/chat/newCommunity',
        selected: "Bring together topic-based groups"
    },
    {
        Title: 'New broadcast',
        iconName: 'megaphone-outline',
        id: 4,
        link: '/chat/newBroadcast'
    }
]

export default function ContactsPage() {

    return (
        <ContactsList>
            <ThemedViewContainer>
                {
                    bottons.map(({ Title, iconName, id, link, selected }, index) => (
                        <TitleForwarIconBtn
                            key={id}
                            title={Title}
                            iconName={iconName}
                            link={link}
                            selected={selected}
                            isLast={index === bottons.length - 1}
                        />
                    ))
                }

            </ThemedViewContainer>
            <Separator />
        </ContactsList>
    )
}