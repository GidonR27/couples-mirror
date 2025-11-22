import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import { Wrench, FastForward, X, RefreshCw } from 'lucide-react-native';
import { useSessionStore, Answer } from '../store/sessionStore';
import { DIMENSIONS } from '../data/content';

interface AdminMenuProps {
    onDebugAction?: (action: string) => void;
}

export const AdminMenu = ({ onDebugAction }: AdminMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showScores, setShowScores] = useState(false);
    const [showSkipButton, setShowSkipButton] = useState(false);
    const [showDimensionSelector, setShowDimensionSelector] = useState(false);
    
    const { 
        partner1Answers, 
        partner2Answers, 
        phase, 
        setPhase, 
        debug_randomizeAndSkipToDuo,
        debug_setDimensionIndex,
        currentDimensionIndex
    } = useSessionStore();

    const calculateScores = () => {
        const scores = DIMENSIONS.map(dim => {
            const calc = (answers: Record<string, Answer>) => {
                let s = 0;
                let c = 0;
                // Check guiding questions (indices 0-9 to be safe)
                for(let i=0; i<10; i++) {
                    const k = `${dim.id}-${i}`;
                    if (answers[k] && typeof answers[k].value === 'number') {
                        s += Number(answers[k].value);
                        c++;
                    }
                }
                // Round to 1 decimal
                return c === 0 ? 0 : Math.round((s / c) * 10) / 10;
            };

            const s1 = calc(partner1Answers);
            const s2 = calc(partner2Answers);
            const total = Math.round((s1 + s2) * 10) / 10;

            return {
                id: dim.id,
                title: dim.title,
                s1,
                s2,
                total
            };
        });

        // Sort by total score ascending (lowest first - priority for Duo)
        return scores.sort((a, b) => a.total - b.total);
    };

    const renderScores = () => {
        const scores = calculateScores();
        return (
            <View style={styles.scoreContainer}>
                <Text style={styles.scoreTitle}>Dimension Scores (Low = Priority)</Text>
                <View style={styles.headerRow}>
                    <Text style={[styles.col, styles.colTitle]}>Dim</Text>
                    <Text style={styles.col}>P1</Text>
                    <Text style={styles.col}>P2</Text>
                    <Text style={[styles.col, styles.colTotal]}>Tot</Text>
                </View>
                {scores.map((s, i) => (
                    <View key={s.id} style={[styles.row, i < 2 && styles.topPriority]}>
                        <Text style={[styles.col, styles.colTitle]} numberOfLines={1}>{s.title}</Text>
                        <Text style={styles.col}>{s.s1}</Text>
                        <Text style={styles.col}>{s.s2}</Text>
                        <Text style={[styles.col, styles.colTotal]}>{s.total}</Text>
                    </View>
                ))}
                <Text style={styles.note}>* Top 2 highlighted (Action Ideas)</Text>
            </View>
        );
    };

    const handleSkipToDuo = () => {
        debug_randomizeAndSkipToDuo();
        onDebugAction?.('skipToDuo');
        setIsOpen(false);
    };

    const handleTestAnimation = () => {
        setPhase('solo_p1');
        debug_setDimensionIndex(3);
        onDebugAction?.('testAnimation');
        setIsOpen(false);
    };

    const handleJumpToDimension = (index: number) => {
        if (phase === 'duo') {
            // For Duo, we might need to update the local state in Duo.tsx
            // But since Duo.tsx uses local state for sorted dimensions, this is tricky from outside.
            // Ideally, Duo.tsx should sync with the store index or we pass an action.
            // For now, we'll just set the store index, but Duo.tsx needs to listen to it or we trigger a reload.
            // The easiest way given current architecture is to let the parent (Duo.tsx) handle 'jumpToDimension' action.
            onDebugAction?.(`jumpToDimension:${index}`);
        } else {
            // Solo phases
            debug_setDimensionIndex(index);
            onDebugAction?.('jumpToDimension'); // Trigger a re-render/reset in Index.tsx
        }
        setIsOpen(false);
    };

    // Global skip overlay
    if (showSkipButton && !isOpen) {
        return (
             <TouchableOpacity 
                style={styles.skipOverlayButton} 
                onPress={() => onDebugAction?.('skipStep')}
            >
                <FastForward size={24} color="white" />
                <Text style={styles.skipText}>SKIP</Text>
                <TouchableOpacity 
                    style={styles.smallClose}
                    onPress={() => setShowSkipButton(false)}
                >
                    <X size={12} color="white" />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    }

    if (!isOpen) {
        return (
            <TouchableOpacity onPress={() => setIsOpen(true)} style={styles.adminIcon}>
                <Wrench size={24} color="rgba(255,255,255,0.3)" />
            </TouchableOpacity>
        );
    }

    return (
        <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
                <Text style={styles.menuTitle}>Admin / Debug</Text>
                <TouchableOpacity onPress={() => setIsOpen(false)}>
                    <X size={24} color="white" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.menuContent}>
                <TouchableOpacity style={styles.button} onPress={handleSkipToDuo}>
                    <Text style={styles.buttonText}>Randomize & Skip to Duo</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleTestAnimation}>
                    <Text style={styles.buttonText}>Test Animation (3 Done)</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => setShowSkipButton(true)}
                >
                    <Text style={styles.buttonText}>Show Global Skip Button</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => setShowDimensionSelector(!showDimensionSelector)}
                >
                    <Text style={styles.buttonText}>Jump to Dimension...</Text>
                </TouchableOpacity>

                {showDimensionSelector && (
                    <View style={styles.selectorContainer}>
                        {DIMENSIONS.map((dim, idx) => (
                            <TouchableOpacity 
                                key={dim.id} 
                                style={[
                                    styles.selectorButton, 
                                    (phase === 'duo' ? false : currentDimensionIndex === idx) && styles.activeSelector
                                ]}
                                onPress={() => handleJumpToDimension(idx)}
                            >
                                <Text style={styles.selectorText}>{idx + 1}. {dim.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <View style={styles.divider} />

                <TouchableOpacity 
                    style={[styles.button, styles.scoreButton]} 
                    onPress={() => setShowScores(!showScores)}
                >
                    <Text style={styles.buttonText}>{showScores ? 'Hide Scores' : 'Show Scores'}</Text>
                </TouchableOpacity>

                {showScores && renderScores()}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    adminIcon: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 9999,
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
    },
    menuContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: 320,
        backgroundColor: 'rgba(20,20,20,0.95)',
        zIndex: 10000,
        paddingTop: 60,
        paddingHorizontal: 20,
        borderLeftWidth: 1,
        borderLeftColor: '#333',
    },
    menuHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    menuTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    menuContent: {
        flex: 1,
    },
    button: {
        backgroundColor: '#333',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        alignItems: 'center',
    },
    scoreButton: {
        backgroundColor: '#2c3e50',
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    divider: {
        height: 1,
        backgroundColor: '#444',
        marginVertical: 15,
    },
    scoreContainer: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 10,
        borderRadius: 8,
        marginTop: 5,
    },
    scoreTitle: {
        color: '#aaa',
        fontSize: 12,
        marginBottom: 10,
        textAlign: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#555',
        paddingBottom: 4,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 6,
        paddingVertical: 2,
    },
    topPriority: {
        backgroundColor: 'rgba(212, 175, 55, 0.2)', // Gold tint
        borderRadius: 4,
    },
    col: {
        color: '#ddd',
        fontSize: 12,
        textAlign: 'center',
        flex: 1,
    },
    colTitle: {
        flex: 2,
        textAlign: 'left',
    },
    colTotal: {
        fontWeight: 'bold',
        color: '#fff',
    },
    note: {
        color: '#666',
        fontSize: 10,
        marginTop: 8,
        fontStyle: 'italic',
    },
    skipOverlayButton: {
        position: 'absolute',
        bottom: 40,
        right: 20,
        backgroundColor: 'rgba(200, 50, 50, 0.8)',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 9998,
        elevation: 5,
    },
    skipText: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 8,
        marginRight: 4,
    },
    smallClose: {
        marginLeft: 8,
        padding: 4,
    },
    selectorContainer: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    selectorButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    activeSelector: {
        backgroundColor: 'rgba(212, 175, 55, 0.2)',
    },
    selectorText: {
        color: '#ddd',
        fontSize: 13,
    }
});

