import { useRouter } from "expo-router";
import { RoundedBtn } from "./roundedBtn";

export default function ChevronBackBtn() {
    const router = useRouter();
    return <RoundedBtn
        iconName="chevron-back"
        size={30}
        color="#8b8b8bff"
        styles={{ padding: 0 }}
        onPress={() => router.back()}
    />;
}
