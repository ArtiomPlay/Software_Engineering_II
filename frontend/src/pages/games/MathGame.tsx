import React,{useState,useEffect,useCallback} from "react";
import {getSession} from "../../utils/session";
import "./MathGame.css";

interface Equation{
    formula: string;
    solution: number;
};

interface ScoreConfig{
    timeLimit: number;
    points: number;
    penalty: number;
}

const SCORING: Record<string,ScoreConfig>={
    easy: {timeLimit: 30,points: 25,penalty: 5},
    medium: {timeLimit: 30,points: 50,penalty:10},
    hard: {timeLimit: 60,points: 100,penalty: 15}
};

export const MathGame=() => {
    const [gameState,setGameState]=useState<'main' | 'started' | 'ended'>('main');
    const [difficulty,setDifficulty]=useState<string>('medium');
    const [currentProblem,setCurrentProblem]=useState<Equation | null>(null);
    const [userAnswer,setUserAnswer]=useState<string>('');
    const [timeLeft,setTimeLeft]=useState(0);
    const [score,setScore]=useState(0);
    const [consecutiveCorrect,setConsecutiveCorrect]=useState<number>(0);
    const [username,setUsername]=useState<string | null>(null);

    const startGame=async() => {
        setScore(0);
        setGameState('started');

        const config=SCORING[difficulty];
        setTimeLeft(config.timeLimit);
        getEquation();
    };

    const exitGame=async() => {
        setScore(0);
        setGameState('main');
    };

    const changeDifficulty=async() => {
        if(difficulty==='easy'){
            setDifficulty('medium');
        }else if(difficulty==='medium'){
            setDifficulty('hard');
        }else if(difficulty==='hard'){
            setDifficulty('easy');
        }
    };

    const getEquation=async() => {
        try{
            const response=await fetch(`/api/MathGame/get_formula?difficulty=${difficulty}`);

            if(!response.ok)
                throw new Error("Failed to get equation");

            const data: Equation=await response.json();
            setCurrentProblem(data);
            setUserAnswer('');
        }catch(error){
            console.error("Error getting equation: ",error);
        }
    };

    const checkAnswer=() => {
        if(!currentProblem) return;

        const config=SCORING[difficulty];
        const parsedAnswer=parseInt(userAnswer);

        if(parsedAnswer===currentProblem.solution){
            setScore(prev => prev+config.points);
            setConsecutiveCorrect(prev => prev+1);

            getEquation();
        }else{
            setScore(prev => Math.max(0,prev-config.penalty));
            getEquation();
        }
    };

    const renderMainMenu=() => (
        <>
            <div className="game_title">
                Math Game
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
                <div className="col">
                    <button onClick={startGame} className="start_button">Start</button>
                    <button onClick={changeDifficulty} className="difficulty_button">Diffuculty: {difficulty}</button>
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
                <div className="formula">
                    {currentProblem?.formula}=?
                </div>
                <input className="user_input"
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyDown={(e) => e.key==='Enter' && checkAnswer()}
                    placeholder="Your answer"/>
                <button onClick={checkAnswer} className="check_button">Check</button>
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
                    <button onClick={changeDifficulty} className="difficulty_button">Diffuculty: {difficulty}</button>
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
        const loadSession=async() => {
            const session=await getSession();
            if(session){
                setUsername(session.username);
            }
        };

        loadSession();
    });

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