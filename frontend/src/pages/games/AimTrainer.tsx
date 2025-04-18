import React,{useState,useEffect,useRef} from "react";
import {getSession} from "../../utils/session";
import "./AimTrainer.css";

interface Coordinate{
    x: number;
    y: number;
}

export const AimTrainer: React.FC=() => {
    const [gameState,setGameState]=useState<'main' | 'started' | 'ended'>('main');
    const [target,setTarget]=useState<Coordinate | null>(null);
    const [nextTarget,setNextTarget]=useState<Coordinate | null>(null);
    const [timeLeft,setTimeLeft]=useState(0);
    const [score,setScore]=useState(0);
    const [username,setUsername]=useState<string | null>(null);
    const gameAreaRef=useRef<HTMLDivElement>(null);

    const startGame=async() => {
        setTimeLeft(30);
        setScore(0);
        setGameState("started");

        setTimeout(async() => {
            const initialTarget=await getTarget();
            setTarget(initialTarget);

            preloadNextTarget();
        },10);
    };

    const exitGame=async() => {
        setGameState('main');
    };

    const getTarget=async(): Promise<Coordinate> => {
        if(gameAreaRef.current){
            const gameArea=gameAreaRef.current.getBoundingClientRect();
            
            try{
                console.log(gameArea.width,gameArea.height);

                const response=await fetch("/api/AimTrainer/get_target",{
                    method: "POST",
                    headers: {"Content-type": "application/json"},
                    body: JSON.stringify({
                        x: Math.round(gameArea.width),
                        y: Math.round(gameArea.height)
                    })
                });

                if(response.ok){
                    return await response.json();
                }else{
                    console.error("Failed to get target");
                }
            }catch(error){
                console.error("Error getting target: ",error);
            }
        }

        return {x: 0,y: 0};
    };

    const preloadNextTarget=async() => {
        const next=await getTarget();
        setNextTarget(next);
    };

    const handleTargetClick=async() => {
        if(gameState==='started' && nextTarget){
            setScore((prev) => prev+25);
            setTarget(nextTarget);
            preloadNextTarget();
        }
    };

    const renderMainMenu=() => (
        <>
            <div className="game_title">
                Melon Ninja
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
                <div className="aim_trainer_area" ref={gameAreaRef}>
                    {target && (
                        <div className="aim_trainer_target" onClick={handleTargetClick} style={{
                            top: target.y,
                            left: target.x
                        }}/>
                    )}
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