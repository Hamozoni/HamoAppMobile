import { View, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface DynamicSegmentsImageProps {
    imageUrl: ImageSourcePropType;
    size?: number;
    borderWidth?: number;
    totalStatus?: number;
    activeStatus?: number;
    activeColor?: string;
    gapAngle?: number;
}

const DynamicSegmentsImage = ({
    imageUrl,
    size = 70,
    borderWidth = 3,
    totalStatus = 4,
    activeStatus = 1,
    activeColor = '#25D366',
    gapAngle = 5,
}: DynamicSegmentsImageProps) => {
    const outerSize = size + borderWidth * 4;
    const radius = (size + borderWidth * 2) / 2;
    const circumference = 2 * Math.PI * radius;

    const totalAngle = 360;
    const segmentAngle = (totalAngle - (gapAngle * totalStatus)) / totalStatus;
    const segmentLength = (segmentAngle / 360) * circumference;
    const gapLength = (gapAngle / 360) * circumference;

    const dashArray = Array(totalStatus)
        .fill(0)
        .map(() => `${segmentLength} ${gapLength}`)
        .join(' ');

    const getStrokeColor = (): string => {
        if (activeStatus === 0) return 'transparent';
        if (activeStatus === totalStatus) return activeColor;
        return activeColor;
    };

    return (
        <View style={styles.container}>
            <Svg width={outerSize} height={outerSize} style={styles.svg}>
                <Circle
                    cx={outerSize / 2}
                    cy={outerSize / 2}
                    r={radius}
                    stroke={getStrokeColor()}
                    strokeWidth={borderWidth}
                    strokeDasharray={dashArray}
                    strokeDashoffset={gapLength / 2}
                    fill="none"
                    strokeLinecap="round"
                    rotation={-90}
                    origin={`${outerSize / 2}, ${outerSize / 2}`}
                />
            </Svg>

            <Image
                source={imageUrl}
                style={[
                    styles.image,
                    {
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                    }
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    svg: {
        position: 'absolute',
    },
    fullBorder: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        resizeMode: 'cover',
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#FF3B30',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default DynamicSegmentsImage;
