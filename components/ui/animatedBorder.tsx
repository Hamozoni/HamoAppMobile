import { useEffect, useRef } from "react";
import { Animated, View, StyleSheet } from "react-native";

export default function AnimatedBorder({ children, style }: { children: React.ReactNode, style: any }) {
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(anim, {
                toValue: 1,
                duration: 3000,
                useNativeDriver: false,
            })
        ).start();
    }, []);

    const borderColor = anim.interpolate({
        inputRange: [0, 0.33, 0.66, 1],
        outputRange: ["#25D366", "#075E54", "#128C7E", "#25D366"],
    });

    return (
        <Animated.View style={[styles.border, { borderColor }, ...style]}>
            {children}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    border: {
        borderWidth: 3,
        borderRadius: 12,
        padding: 4,
    },
});