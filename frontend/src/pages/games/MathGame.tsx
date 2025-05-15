import React,{useState,useEffect,useCallback} from "react";
import {getSession} from "../../utils/session";
import styles from "./MathGame.module.css";

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
    const [loadingStats,setLoadingStats]=useState(true);
    const [loadingLeaderboard,setLoadingLeaderboard]=useState(true);
    const [gameState,setGameState]=useState<'main' | 'started' | 'ended'>('main');
    const [difficulty,setDifficulty]=useState<string>('medium');
    const [currentProblem,setCurrentProblem]=useState<Equation | null>(null);
    const [userAnswer,setUserAnswer]=useState<string>('');
    const [timeLeft,setTimeLeft]=useState(0);
    const [score,setScore]=useState(0);
    const [consecutiveCorrect,setConsecutiveCorrect]=useState<number>(0);
    const [highscore,setHighscore]=useState(0);
    const [timesPlayed,setTimesPlayed]=useState(0);
    const [leaderboard,setLeaderboard]=useState<{username: string,score: number}[]>([]);

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

    const getStats=async() => {
        try{
            const session=await getSession();
            var username=session.username;
            if(!username){
                console.error("No username found. Cannot save score");
                return;
            }

            const response=await fetch(`api/Score/math/get_account_scores?accountName=${username}`,{
                method: "GET"
            });

            if(!response.ok){
                console.error("Failed to fetch scores");
                return;
            }

            const scores: number[]=await response.json();

            setTimesPlayed(scores.length);

            if(scores.length>0){
                const maxScore=Math.max(...scores);
                setHighscore(maxScore);
            }else{
                setHighscore(0);
                setTimesPlayed(0);
            }
        }catch(error){
            console.error("Error getting stats: ",error);
        }finally{
            setLoadingStats(false);
        }
    };

    const getLeaderboard=async() => {
        try{
            const response=await fetch(`api/Score/math/get_all_scores?limit=10`,{
                method: "GET"
            });

            if(response.ok){
                const data=await response.json();
                console.log("Leaderboard data:", data);
                setLeaderboard(data);
            }else{
                console.error("Failed to get leaderboard");
            }
        }catch(error){
            console.error("Error getting leaderboard: ",error)
        }finally{
            setLoadingLeaderboard(false);
        }
    };

    const saveScore=async() => {
        try{
            const session=await getSession();
            var username=session.username;
            if(!username){
                console.error("No username found. Cannot save score");
                return;
            }

            const response=await fetch(`api/Score/math/add_score?accountName=${username}&score=${score}&difficulty=${difficulty}`,{
                method: "POST",
                headers: {"Content-Type": "application/json"}
            });

            if(response.ok){
                console.log("Score saved succesfully!");
                const result=await response.text();
                console.log(result);
            }else{
                console.error("Failed to save score")
            }
        }catch(error){
            console.error("Error saving score: ",error);
        }
    };

    const renderMainMenu=() => (
        <>
            <div className={styles.game_title}>
                Math Game
            </div>
            <div className={`${styles.main} ${styles.row}`}>
                {timesPlayed==0 ? (
                    <div className={styles.no_personal_stats}></div>
                ) : (
                    <div className={styles.personal_stats}>
                        {loadingStats ? (
                            <div className={styles.loader}></div>
                        ) : (
                            <>
                                <div className={styles.highscore}>
                                    Highscore
                                </div>
                                <hr/>
                                <div className={styles.highscore_num}>
                                    {highscore}
                                </div>
                                <div className={styles.times_played}>
                                    Times played
                                </div>
                                <hr/>
                                <div className={styles.times_played_num}>
                                    {timesPlayed}
                                </div>
                            </>
                        )}
                    </div>
                )}
                <div className={styles.col}>
                    <button onClick={startGame} className={styles.start_button}>Start</button>
                    <button onClick={changeDifficulty} className={styles.difficulty_button}>Diffuculty: {difficulty}</button>
                </div>
                <div className={styles.leaderboard}>
                    {loadingLeaderboard ? (
                        <div className={styles.loader}></div>
                    ) : (
                        <>
                            Leaderboard
                            <hr/>
                            <div className={styles.leaderboard_values}>
                                {leaderboard.map((entry,index) => (
                                    <div key={index}>
                                        {index+1}. {entry.username} - {entry.score}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
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
                <div className={styles.formula}>
                    {currentProblem?.formula}=?
                </div>
                <input className={styles.user_input}
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyDown={(e) => e.key==='Enter' && checkAnswer()}
                    placeholder="Your answer"/>
                <button onClick={checkAnswer} className={styles.check_button}>Check</button>
            </div>
        </>
    );

    const renderEndMenu=() => (
        <>
            <div className={styles.game_title}>
                Game Ended
            </div>
            <div className={`${styles.main} ${styles.row}`}>
                {timesPlayed==0 ? (
                    <div className={styles.personal_stats}>
                        <div className={styles.score}>
                            Score
                        </div>
                        <hr/>
                        <div className={styles.score_num}>
                            {score}
                        </div>
                    </div>
                ) : (
                    <div className={styles.personal_stats}>
                        <div className={styles.score}>
                            Score
                        </div>
                        <hr/>
                        <div className={styles.score_num}>
                            {score}
                        </div>
                        {loadingStats ? (
                            <div className={styles.loader}></div>
                        ) : (
                            <>
                                <div className={styles.highscore}>
                                    Highscore
                                </div>
                                <hr/>
                                <div className={styles.highscore_num}>
                                    {highscore}
                                </div>
                                <div className={styles.times_played}>
                                    Times played
                                </div>
                                <hr/>
                                <div className={styles.times_played_num}>
                                    {timesPlayed}
                                </div>
                            </>
                        )}
                    </div>
                )}
                <div className={styles.col}>
                    <button onClick={startGame} className={styles.start_button}>Restart</button>
                    <button onClick={changeDifficulty} className={styles.difficulty_button}>Diffuculty: {difficulty}</button>
                    <button onClick={exitGame} className={styles.exit_button}>Exit</button>
                </div>
                <div className={styles.leaderboard}>
                    {loadingLeaderboard ? (
                        <div className={styles.loader}></div>
                    ) : (
                        <>
                            Leaderboard
                            <hr/>
                            <div className={styles.leaderboard_values}>
                                {leaderboard.map((entry,index) => (
                                    <div key={index}>
                                        {index+1}. {entry.username} - {entry.score}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );

    useEffect(() => {
        let timer: number;
        if(gameState==='started' && timeLeft>0){
            timer=setTimeout(() => setTimeLeft((prev) => prev-1),1000);
            if(!loadingStats || !loadingLeaderboard){
                setLoadingStats(true);
                setLoadingLeaderboard(true);
            }
        }else if(gameState==='started' && timeLeft<=0){
            setGameState('ended');
        }
    },[timeLeft,gameState]);

    useEffect(() => {
        if(gameState==="main"){
            const update=async() => {
                await getStats();
                await getLeaderboard();
            };

            update();
        }else if(gameState==="ended"){
            const saveAndUpdate=async() => {
                await saveScore();
                await getStats();
                await getLeaderboard();
            };

            saveAndUpdate();
        }
    },[gameState]);

    return(
        <div className={styles.game_window}>
            {gameState=='main' && renderMainMenu()}
            {gameState=='started' && renderGame()}
            {gameState=='ended' && renderEndMenu()}
        </div>
    )
}