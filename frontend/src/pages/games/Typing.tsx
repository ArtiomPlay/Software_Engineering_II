import React,{useState,useEffect,useRef} from "react";
import {getSession} from "../../utils/session";
import "./Typing.css";

export const Typing=() => {
    const [gameState,setGameState]=useState<'main' | 'started' | 'ended'>('main');
    const [text,setText]=useState<string>("");
    const [score,setScore]=useState(0);
    const [timeLeft,setTimeLeft]=useState(0);
    const [username,setUsername]=useState<string | null>(null);

    const startGame=async() => {
        setTimeLeft(60);
        setScore(0);
        setGameState("started");

        setTimeout(async() => {
            await getText();
        },10);
    };

    const exitGame=async() => {
        setGameState('main');
    };

    const getText=async() => {
        try{
            const response=await fetch("api/Typing/get_text");
            if(!response.ok)
                    throw new Error(`Error: ${response.statusText}`);

            const data: string=await response.text();
            setText(data);
            console.log(text);
        }catch(error){
            console.error("Error getting text: ",error);
        }
    };

    const renderMainMenu=() => (
        <>
            <div className="game_title">
                Typing
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
                    <div className="game_timer">
                        Time left: {timeLeft}s
                    </div>
                </div>
                <label className="game_text">{text}</label>
                <textarea className="game_user_input" id="user_typing"></textarea>
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
            const arrText=text.split('');
            const arrInput=(document.getElementById("user_typing") as HTMLInputElement).value.split('');
            var temp=0;
            const scoreMax=1000;
            const scoreRate=scoreMax/text.length;

            for(var i=0;i<arrText.length;i++){
                if(arrText[i]==arrInput[i]){
                    temp+=scoreRate;
                }
            }

            setScore(Math.round(temp));
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