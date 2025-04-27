import React, { useState, useEffect, useRef } from "react";
import { getSession } from "../../utils/session";
import styles from "./Sequence.module.css";

interface Coordinate {
    x: number;
    y: number;
}

export const Sequence = () => {
    const [gameState, setGameState] = useState<'main' | 'started' | 'ended'>('main');
    const [show, setShow] = useState(false);
    const initialGrid = Array.from({ length: 3 }, () => Array(3).fill(0));
    const [grid, setGrid] = useState<number[][]>(initialGrid);
    const [targetSequence, setTargetSequence] = useState<Coordinate[]>([]);
    const [activeTarget, setActiveTarget] = useState<Coordinate[]>([]);
    const [wrongClick, setWrongClick] = useState<Coordinate | null>(null);
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(0);
    const [correct, setCorrect] = useState(0);
    //const [username,setUsername]=useState<string | null>(null);

    const username = "Emil"; // For testing

    const startGame = async () => {
        const newLevel = 1;
        setLevel(newLevel);
        setScore(0);
        setCorrect(0);
        setGameState("started");
        setShow(true);
        setWrongClick(null);

        setTimeout(async () => {
            await getTarget(newLevel);
        }, 10);
    };

    const nextRound = async () => {
        const newLevel = level + 1;
        setLevel(newLevel);
        setShow(true);
        setCorrect(0);

        setTimeout(async () => {
            await getTarget(newLevel);
        }, 10);
    };

    const exitGame = async () => {
        setGameState("main");
    }

    const getTarget = async (lvl: number) => {
        try {
            const response = await fetch(`api/Sequence/get_cell?level=${lvl}`);

            if (!response.ok)
                throw new Error(`Error: ${response.statusText}`);

            const data: Coordinate[] = await response.json();
            setTargetSequence(data);
            console.log(data);

            playAnimation(data);
        } catch (error) {
            console.error("Error getting target: ", error);
        }
    }

    const playAnimation = (data: Coordinate[]) => {
        setTimeout(() => {
            data.forEach((target, index) => {
                setTimeout(() => {
                    setActiveTarget([target]);
                    setTimeout(() => setActiveTarget([]), 300);
                }, index * 600);
            });
        }, 500);
        setTimeout(() => setShow(false), targetSequence.length * 500 + 500);
    }

    const handleTargetClick = (row: number, col: number) => {
        if (show)
            return;

        if (row === targetSequence[correct].x && col === targetSequence[correct].y) {
            setCorrect(prev => prev + 1);
            setActiveTarget([{ x: row, y: col }]);
            setTimeout(() => setActiveTarget([]), 300);
            if (correct === targetSequence.length - 1) {
                setScore(prev => prev + (level * 150));
                setTimeout(() => nextRound(), 500);
            }
        } else {
            setWrongClick({ x: row, y: col });
            setCorrect(0)
            setTimeout(() => setGameState("ended"), 500);
        }
    }

    const sendScore = async (finalScore: number) => {
        try {
            const response = await fetch(`/api/score/sequence?accountName=${username}&score=${finalScore}`, {
                method: 'POST',
            });
            if (!response.ok) {
                console.error('Failed to submit score:', response.statusText);
            }
        } catch (error) {
            console.error('Error submitting score:', error);
        }
    };

    const renderMainMenu = () => (
        <>
            <div className={styles.game_title}>
                Sequence
            </div>
            <div className={`${styles.main} ${styles.row}`}>
                <div className={styles.personal_stats}>
                    <div className={styles.highscore}>
                        Highscore
                    </div>
                    <hr />
                    <div className={styles.highscore_num}>
                        154
                    </div>
                    <div className={styles.times_played}>
                        Times played
                    </div>
                    <hr />
                    <div className={styles.times_played_num}>
                        40
                    </div>
                </div>
                <button onClick={startGame} className={styles.start_button}>Start</button>
                <div className={styles.leaderboard}>
                    Leaderboard
                    <hr />
                    <div className={styles.leaderboard_values}>
                        1. Artiom
                    </div>
                </div>
            </div>
        </>
    );

    const renderGame = () => (
        <>
            <div className={styles.col}>
                <div className={styles.row}>
                    <div className={styles.game_score}>
                        Score: {score}
                    </div>
                </div>
                <div className={styles.sequence_area}>
                    {grid.map((row, rowIndex) => (
                        <div
                            key={rowIndex}
                            style={{ display: 'flex' }}
                        >
                            {row.map((tile, colIndex) => (
                                <div
                                    key={colIndex}
                                    onClick={() => handleTargetClick(rowIndex, colIndex)}
                                    className={`${styles.sequence_tile}
                                        ${activeTarget.some(target => target.x === rowIndex && target.y === colIndex) ? styles.active : ''}
                                        ${wrongClick?.x === rowIndex && wrongClick?.y === colIndex ? styles.wrong : ''}`}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );

    const renderEndMenu = () => (
        <>
            <div className={styles.game_title}>
                Game Ended
            </div>
            <div className={`${styles.main} ${styles.row}`}>
                <div className={styles.personal_stats}>
                    <div className={styles.score}>
                        Score
                    </div>
                    <hr />
                    <div className={styles.score_num}>
                        {score}
                    </div>
                    <div className={styles.highscore}>
                        Highscore
                    </div>
                    <hr />
                    <div className={styles.highscore_num}>
                        154
                    </div>
                    <div className={styles.times_played}>
                        Times played
                    </div>
                    <hr />
                    <div className={styles.times_played_num}>
                        40
                    </div>
                </div>
                <div className={styles.col}>
                    <button onClick={startGame} className={styles.start_button}>Restart</button>
                    <button onClick={exitGame} className={styles.exit_button}>Exit</button>
                </div>
                <div className={styles.leaderboard}>
                    Leaderboard
                    <hr />
                    <div className={styles.leaderboard_values}>
                        1. Artiom
                    </div>
                </div>
            </div>
        </>
    );

    useEffect(() => {
        if (gameState === "ended") {
            sendScore(score);
        }
    }, [gameState, score]);

    return (
        <div className={styles.game_window}>
            {gameState == 'main' && renderMainMenu()}
            {gameState == 'started' && renderGame()}
            {gameState == 'ended' && renderEndMenu()}
        </div>
    )
}