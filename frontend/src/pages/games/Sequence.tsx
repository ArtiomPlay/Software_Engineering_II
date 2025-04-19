import React,{useState,useEffect,useRef} from "react";
import {getSession} from "../../utils/session";
import "./Sequence.css";

interface Coordinate{
    x: number;
    y: number;
}

export const Sequence=() => {
    const [gameState,setGameState]=useState<'main' | 'started' | 'ended'>('main');
    const [show,setShow]=useState(false);
    const initialGrid=Array.from({length: 3},() => Array(3).fill(0));
    const [grid,setGrid]=useState<number[][]>(initialGrid);
    const [targetSequence,setTargetSequence]=useState<Coordinate[]>([]);
    const [activeTarget,setActiveTarget]=useState<Coordinate[]>([]);
    const [wrongClick,setWrongClick]=useState<Coordinate | null>(null);
    const [score,setScore]=useState(0);
    const [level,setLevel]=useState(0);
    const [correct,setCorrect]=useState(0);
    const [username,setUsername]=useState<string | null>(null);

    const startGame=async() => {
        const newLevel=1;
        setLevel(newLevel);
        setScore(0);
        setCorrect(0);
        setGameState("started");
        setShow(true);
        setWrongClick(null);
        
        setTimeout(async() => {
            await getTarget(newLevel);
        },10);
    };

    const nextRound=async() => {
        const newLevel=level+1;
        setLevel(newLevel);
        setShow(true);
        setCorrect(0);
        
        setTimeout(async() => {
            await getTarget(newLevel);
        },10);
    };

    const exitGame=async() => {
        setGameState("main");
    }

    const getTarget=async(lvl: number) => {
        try{
            const response=await fetch(`api/Sequence/get_cell?level=${lvl}`);

            if(!response.ok)
                throw new Error(`Error: ${response.statusText}`);

            const data: Coordinate[]=await response.json();
            setTargetSequence(data);
            console.log(data);

            playAnimation(data);
        }catch(error){
            console.error("Error getting target: ",error);
        }
    }

    const playAnimation=(data: Coordinate[]) => {
        setTimeout(() => {
            data.forEach((target,index) => {
                setTimeout(() => {
                    setActiveTarget([target]);
                    setTimeout(() => setActiveTarget([]),300);
                },index*600);
            });
        },500);
        setTimeout(() => setShow(false),targetSequence.length*500+500);
    }

    const handleTargetClick=(row: number, col: number) => {
        if(show)
            return;

        if(row===targetSequence[correct].x && col===targetSequence[correct].y){
            setCorrect(prev => prev+1);
            setActiveTarget([{x: row,y: col}]);
            setTimeout(() => setActiveTarget([]),300);
            if(correct===targetSequence.length-1){
                setScore(prev => prev+(level*150));
                setTimeout(() => nextRound(),500);
            }
        }else{
            setWrongClick({x: row,y: col});
            setCorrect(0)
            setTimeout(() => setGameState("ended"),500);
        }
    }

    const renderMainMenu=() => (
        <>
            <div className="game_title">
                Sequence
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
                </div>
                <div className="sequence_area">
                    {grid.map((row,rowIndex) => (
                        <div
                            key={rowIndex}
                            style={{display: 'flex'}}
                        >
                            {row.map((tile,colIndex) => (
                                <div
                                    key={colIndex}
                                    onClick={() => handleTargetClick(rowIndex,colIndex)}
                                    className={`sequence_tile ${activeTarget.some(target => target.x===rowIndex && target.y===colIndex) ? 'active' : ''} ${wrongClick?.x===rowIndex && wrongClick?.y===colIndex ? 'wrong' : ''}`}
                                />
                            ))}
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

    return(
        <div className="game_window">
            {gameState=='main' && renderMainMenu()}
            {gameState=='started' && renderGame()}
            {gameState=='ended' && renderEndMenu()}
        </div>
    )
}