import React,{useState,useEffect,useRef} from "react";
import {getSession} from "../../utils/session";
import styles from "./AimTrainer.module.css";

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
    const [highscore,setHighscore]=useState(0);
    const [timesPlayed,setTimesPlayed]=useState(0);
    const [leaderboard,setLeaderboard]=useState<{username: string,score: number}[]>([]);
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

    const getStats=async() => {
        try{
            const session=await getSession();
            var username=session.username;
            if(!username){
                console.error("No username found. Cannot save score");
                return;
            }

            const response=await fetch(`api/Score/aim/get_account_scores?accountName=${username}`,{
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
        }
    };

    const getLeaderboard=async() => {
        try{
            const response=await fetch(`api/Score/aim/get_all_scores?limit=10`,{
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

            const response=await fetch(`api/Score/aim/add_score?accountName=${username}&score=${score}`,{
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
                Melon Ninja
            </div>
            <div className={`${styles.main} ${styles.row}`}>
                {timesPlayed==0 ? (
                    <div className={styles.no_personal_stats}></div>
                ) : (
                    <div className={styles.personal_stats}>
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
                    </div>
                )}
                <button onClick={startGame} className={styles.start_button}>Start</button>
                <div className={styles.leaderboard}>
                    Leaderboard
                    <hr/>
                    <div className={styles.leaderboard_values}>
                        {leaderboard.map((entry,index) => (
                            <div key={index}>
                                {index+1}. {entry.username} - {entry.score}
                            </div>
                        ))}
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
                <div className={styles.aim_trainer_area} ref={gameAreaRef}>
                    {target && (
                        <div className={styles.aim_trainer_target} onClick={handleTargetClick} style={{
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
                    </div>
                )}
                <div className={styles.col}>
                    <button onClick={startGame} className={styles.start_button}>Restart</button>
                    <button onClick={exitGame} className={styles.exit_button}>Exit</button>
                </div>
                <div className={styles.leaderboard}>
                    Leaderboard
                    <hr/>
                    <div className={styles.leaderboard_values}>
                        {leaderboard.map((entry,index) => (
                            <div key={index}>
                                {index+1}. {entry.username} - {entry.score}
                            </div>
                        ))}
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