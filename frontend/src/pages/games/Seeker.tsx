import React,{useState,useEffect,useRef} from "react";
import {getSession} from "../../utils/session";
import "./Seeker.css";

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
            <div className="game_title">
                Seeker
            </div>
            <div className="main row">
                <div className="personal_stats">
                    <div className="highscore">
                        Highscore
                    </div>
                    <hr/>
                    <div className="highscore_num">
                        154
                    </div>
                    <div className="times_played">
                        Times played
                    </div>
                    <hr/>
                    <div className="times_played_num">
                        40
                    </div>
                </div>
                <button onClick={startGame} className="start_button">Start</button>
                <div className="leaderboard">
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
            <div className="col">
                <div className="row">
                    <div className="game_score">
                        Score: {score}
                    </div>
                    <div className="game_timer">
                        Time left: {timeLeft}s
                    </div>
                </div>
                <div className="seeker_area">
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
                                        className="seeker_tile"
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
            <div className="game_title">
                Game Ended
            </div>
            <div className="main row">
                <div className="personal_stats">
                    <div className="score">
                        Score
                    </div>
                    <hr/>
                    <div className="score_num">
                        {score}
                    </div>
                    <div className="highscore">
                        Highscore
                    </div>
                    <hr/>
                    <div className="highscore_num">
                        154
                    </div>
                    <div className="times_played">
                        Times played
                    </div>
                    <hr/>
                    <div className="times_played_num">
                        40
                    </div>
                </div>
                <div className="col">
                    <button onClick={startGame} className="start_button">Restart</button>
                    <button onClick={exitGame} className="exit_button">Exit</button>
                </div>
                <div className="leaderboard">
                    Leaderboard
                    <hr/>
                    <div className="leaderboard_values">
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
        <div className="game_window">
            {gameState=='main' && renderMainMenu()}
            {gameState=='started' && renderGame()}
            {gameState=='ended' && renderEndMenu()}
        </div>
    )
}