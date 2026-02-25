import { useEffect, useRef } from "react";
import { Animated, View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface AnimatedBorderProps {
    children: React.ReactNode;
    size?: number;
    borderWidth?: number;
    borderRadius?: number;
}

export default function AnimatedBorder({
    children,
    borderWidth = 3,
    borderRadius = 100,
}: AnimatedBorderProps) {
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(anim, {
                toValue: 1,
                duration: 3000,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const rotate = anim.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });

    return (
        <View style={[styles.wrapper, { borderRadius, padding: borderWidth }]}>
            {/* Spinning gradient sits behind */}
            <Animated.View
                style={[
                    styles.gradient,
                    {
                        borderRadius,
                        transform: [{ rotate }],
                    },
                ]}
            >
                <LinearGradient
                    colors={["#FF3B30", "#FF9F0A", "#25D366", "#007AFF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFillObject}
                />
            </Animated.View>

            {/* Content sits on top */}
            <View style={[styles.inner, { borderRadius: borderRadius - borderWidth }]}>
                {children}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        overflow: "hidden",
        backgroundColor: "transparent",
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
        // Make it bigger than the container so rotation doesn't show corners
        margin: -50,
    },
    inner: {
        backgroundColor: "#fff",
        overflow: "hidden",
    },
});