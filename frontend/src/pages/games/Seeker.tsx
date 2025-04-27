import React,{useState,useEffect,useRef} from "react";
import {getSession} from "../../utils/session";
import styles from "./Seeker.module.css";

interface Coordinate{
    x: number;
    y: number;
}

export const Seeker=() => {
    const [gameState,setGameState]=useState<'main' | 'started' | 'ended'>('main');
    const initialGrid=Array.from({length: 10},() => Array(10).fill(0));
    const [grid,setGrid]=useState<number[][]>(initialGrid);
    const [target,setTarget]=useState<Coordinate | null>(null);
    const [timeLeft,setTimeLeft]=useState(0);
    const [score,setScore]=useState(0);
    const [username,setUsername]=useState<string | null>(null);
    const gameAreaRef=useRef<HTMLDivElement>(null);

    const startGame=async() => {
        setTimeLeft(30);
        setScore(0);
        setGameState("started");
        getTarget();
    };

    const exitGame=async() => {
        setGameState("main");
    }

    const getTarget=async() => {
        try{
            const response=await fetch("api/Seeker/get_cell");
            if(!response.ok)
                    throw new Error(`Error: ${response.statusText}`);

            const data: Coordinate=await response.json();
            setTarget(data);
            console.log(data);

            var newGrid=initialGrid;
            newGrid[data.x][data.y]=1;
            setGrid(newGrid);
        }catch(error){
            console.error("Error getting target: ",error);
        }
    }

    const handleTargetClick=(row: number,col: number) => {
        if(target && target.x===row && target.y===col){
            setScore(prev => prev+25);
            getTarget();
        }
    };

    const renderMainMenu=() => (
        <>
            <div className={styles.game_title}>
                Seeker
            </div>
            <div className={`${styles.main} ${styles.row}`}>
                <div className={styles.personal_stats}>
                    <div className={styles.highscore}>
                        Highscore
                    </div>
                    <hr/>
                    <div className={styles.highscore_num}>
                        154
                    </div>
                    <div className={styles.times_played}>
                        Times played
                    </div>
                    <hr/>
                    <div className={styles.times_played_num}>
                        40
                    </div>
                </div>
                <button onClick={startGame} className={styles.start_button}>Start</button>
                <div className={styles.leaderboard}>
                    Leaderboard
                    <hr/>
                    <div className="leaderboard_values">
                        1. Artiom
                    </div>
                </div>
            </div>
        </>
    );

    const renderGame=() => (
        <>
            <div className={styles.col}>
                <div className={styles.row}>
                    <div className={styles.game_score}>
                        Score: {score}
                    </div>
                    <div className={styles.game_timer}>
                        Time left: {timeLeft}s
                    </div>
                </div>
                <div className={styles.seeker_area}>
                    {grid.map((row,rowIndex) => (
                        <div
                            key={rowIndex}
                            style={{display: 'flex'}}
                        >
                            {row.map((tile,colIndex) => {
                                const backgroundColor=tile===1 ? 'rgb(255, 99, 99)' : 'rgb(103, 255, 86)';

                                return (
                                    <div
                                        key={colIndex}
                                        onClick={() => handleTargetClick(rowIndex,colIndex)}
                                        className={styles.seeker_tile}
                                        style={{backgroundColor: backgroundColor}}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );

    const renderEndMenu=() => (
        <>
            <div className={styles.game_title}>
                Game Ended
            </div>
            <div className={`${styles.main} ${styles.row}`}>
                <div className={styles.personal_stats}>
                    <div className={styles.score}>
                        Score
                    </div>
                    <hr/>
                    <div className={styles.score_num}>
                        {score}
                    </div>
                    <div className={styles.highscore}>
                        Highscore
                    </div>
                    <hr/>
                    <div className={styles.highscore_num}>
                        154
                    </div>
                    <div className={styles.times_played}>
                        Times played
                    </div>
                    <hr/>
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
                    <hr/>
                    <div className={styles.leaderboard_values}>
                        1. Artiom
                    </div>
                </div>
            </div>
        </>
    );
    
    useEffect(() => {
        let timer: number;
        if(gameState==='started' && timeLeft>0){
            timer=setTimeout(() => setTimeLeft((prev) => prev-1),1000);
        }else if(gameState==='started' && timeLeft<=0){
            setGameState('ended');
        }
    },[timeLeft,gameState]);

    return(
        <div className={styles.game_window}>
            {gameState=='main' && renderMainMenu()}
            {gameState=='started' && renderGame()}
            {gameState=='ended' && renderEndMenu()}
        </div>
    )
}