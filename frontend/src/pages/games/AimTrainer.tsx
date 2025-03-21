import React,{useState,useEffect,useRef} from "react"
import "./AimTrainer.css"

interface Target{
    x: number;
    y: number;
}

const AimTrainer: React.FC=() => {
    const [gameState,setGameState]=useState("main");

    const startGame=async() => {
        setGameState("started");
    }

    return(
        <div className="game_window">
            {gameState=="main" ? (
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
            ):(
                <>
                    {gameState=="started" ? (
                        <>
                            <div className="col">
                                <div className="row">
                                    <div className="game_score">
                                        Score:
                                    </div>
                                    <div className="game_timer">
                                        Time left:
                                    </div>
                                </div>
                                <div className="game_area">

                                </div>
                            </div>
                        </>
                    ):(
                        <>

                        </>
                    )}
                </>
            )}
            
        </div>
    )
}

export default AimTrainer