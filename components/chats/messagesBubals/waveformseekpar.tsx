import React, { useMemo, useRef, useState } from "react";
import { View, StyleSheet, PanResponder, LayoutChangeEvent } from "react-native";

interface WaveformSeekBarProps {
    duration: number;          // seconds
    current: number;           // seconds
    onSeek: (seconds: number) => void;
    activeColor: string;
    inactiveColor: string;
    seed?: string;             // e.g. message._id -> same waveform every render
    peaks?: number[];          // optional real amplitudes, each 0..1
    barCount?: number;
    height?: number;
}

const BAR_WIDTH = 3;
const THUMB_SIZE = 12;

// ── deterministic pseudo-random waveform (used when no real peaks exist) ──
function hashString(str: string) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}

function mulberry32(a: number) {
    return () => {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function buildBars(count: number, seed: string, peaks?: number[]): number[] {
    if (peaks && peaks.length > 0) {
        return Array.from({ length: count }, (_, i) => {
            const v = peaks[Math.min(peaks.length - 1, Math.floor((i / count) * peaks.length))];
            return 0.15 + 0.85 * Math.min(Math.max(v, 0), 1);
        });
    }
    const rand = mulberry32(hashString(seed));
    let prev = 0.5;
    return Array.from({ length: count }, () => {
        prev = 0.6 * rand() + 0.4 * prev; // smoothing so it looks like speech
        return 0.2 + 0.8 * prev;
    });
}

export default function WaveformSeekBar({
    duration,
    current,
    onSeek,
    activeColor,
    inactiveColor,
    seed = "default",
    peaks,
    barCount = 36,
    height = 30,
}: WaveformSeekBarProps) {
    const [width, setWidth] = useState(0);
    const [scrub, setScrub] = useState<number | null>(null); // 0..1 while dragging

    const bars = useMemo(() => buildBars(barCount, seed, peaks), [barCount, seed, peaks]);

    // refs so PanResponder (created once) never reads stale values
    const widthRef = useRef(0);
    const durationRef = useRef(duration);
    const onSeekRef = useRef(onSeek);
    const startX = useRef(0);
    widthRef.current = width;
    durationRef.current = duration;
    onSeekRef.current = onSeek;

    const toProgress = (x: number) =>
        widthRef.current > 0 ? Math.min(Math.max(x / widthRef.current, 0), 1) : 0;

    const pan = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderTerminationRequest: () => false,
            onPanResponderGrant: (e) => {
                startX.current = e.nativeEvent.locationX;
                setScrub(toProgress(startX.current));
            },
            onPanResponderMove: (_, g) => setScrub(toProgress(startX.current + g.dx)),
            onPanResponderRelease: (_, g) => {
                const p = toProgress(startX.current + g.dx);
                setScrub(null);
                onSeekRef.current(p * durationRef.current);
            },
            onPanResponderTerminate: () => setScrub(null),
        })
    ).current;

    const playedProgress = duration > 0 ? Math.min(Math.max(current / duration, 0), 1) : 0;
    const progress = scrub ?? playedProgress;

    return (
        <View
            style={[styles.container, { height: height + 14 }]}
            onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}
            {...pan.panHandlers}
        >
            {/* pointerEvents none: touches target the container, so locationX is container-relative */}
            <View style={[styles.bars, { height }]} pointerEvents="none">
                {bars.map((h, i) => {
                    const active = (i + 0.5) / barCount <= progress;
                    return (
                        <View
                            key={i}
                            style={{
                                width: BAR_WIDTH,
                                height: Math.max(3, h * height),
                                borderRadius: BAR_WIDTH / 2,
                                backgroundColor: active ? activeColor : inactiveColor,
                            }}
                        />
                    );
                })}
            </View>

            {width > 0 && (
                <View
                    pointerEvents="none"
                    style={[
                        styles.thumb,
                        {
                            backgroundColor: activeColor,
                            left: Math.min(Math.max(progress * width - THUMB_SIZE / 2, 0), width - THUMB_SIZE),
                            transform: [{ scale: scrub !== null ? 1.3 : 1 }],
                        },
                    ]}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
    bars: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    thumb: {
        position: "absolute",
        width: THUMB_SIZE,
        height: THUMB_SIZE,
        borderRadius: THUMB_SIZE / 2,
    },
});