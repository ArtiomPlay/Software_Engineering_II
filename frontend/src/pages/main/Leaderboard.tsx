import React,{useState,useEffect,useRef} from "react";
import {getSession} from "../../utils/session";
import "./Leaderboard.css";

export const Leaderboard=() => {
    const [allScore,setAllScore]=useState(0);
    const [aimScore,setAimScore]=useState(0);
    const [mathScore,setMathScore]=useState(0);
    const [seekerScore,setSeekerScore]=useState(0);
    const [sequenceScore,setSequenceScore]=useState(0);
    const [typingScore,setTypingScore]=useState(0);
    const [allHighscore,setAllHighscore]=useState<{game: string,score: number}>();
    const [aimHighscore,setAimHighscore]=useState(0);
    const [mathHighscore,setMathHighscore]=useState(0);
    const [seekerHighscore,setSeekerHighscore]=useState(0);
    const [sequenceHighscore,setSequenceHighscore]=useState(0);
    const [typingHighscore,setTypingHighscore]=useState(0);
    const [allTimesPlayed,setAllTimesPlayed]=useState(0);
    const [aimTimesPlayed,setAimTimesPlayed]=useState(0);
    const [mathTimesPlayed,setMathTimesPlayed]=useState(0);
    const [seekerTimesPlayed,setSeekerTimesPlayed]=useState(0);
    const [sequenceTimesPlayed,setSequenceTimesPlayed]=useState(0);
    const [typingTimesPlayed,setTypingTimesPlayed]=useState(0);
    const [allLeaderboard,setAllLeaderboard]=useState<{username: string,score: number}[]>([]);
    const [aimLeaderboard,setAimLeaderboard]=useState<{username: string,score: number}[]>([]);
    const [mathLeaderboard,setMathLeaderboard]=useState<{username: string,score: number}[]>([]);
    const [seekerLeaderboard,setSeekerLeaderboard]=useState<{username: string,score: number}[]>([]);
    const [sequenceLeaderboard,setSequenceLeaderboard]=useState<{username: string,score: number}[]>([]);
    const [typingLeaderboard,setTypingLeaderboard]=useState<{username: string,score: number}[]>([]);

    const getAllStats=async() => {
        try{
            const response=await fetch("api/Score/get_all_stats");
            const data=await response.json();

            setAllScore(data.totalScore);
            setAllHighscore({game: data.highscoreGame,score: data.highscoreScore});
            setAllTimesPlayed(data.totalTimesPlayed);
            setAllLeaderboard(data.leaderboard);
        }catch(error){
            console.error("Error getting all stats: ",error);
        }
    };

    const getAimStats=async() => {
        try{
            const response=await fetch(`api/Score/aim/get_all_scores?limit=10`,{
                method: "GET"
            });

            if(response.ok){
                const data=await response.json();
                console.log("Leaderboard data:", data);
                setAimLeaderboard(data);
            }else{
                console.error("Failed to get leaderboard");
            }

            const session=await getSession();
            var username=session.username;
            if(!username){
                console.error("No username found. Cannot save score");
            }

            const responseScores=await fetch(`api/Score/aim/get_account_scores?accountName=${username}`,{
                method: "GET"
            });

            if(!responseScores.ok){
                console.error("Failed to fetch scores");
            }

            const scores: number[]=await responseScores.json();

            setAimTimesPlayed(scores.length);
        }catch(error){
            console.error("Error getting aim trainer stats: ",error);
        }
    };

    useEffect(() => {
        const update=async() => {
            await getAllStats();
            await getAimStats();
        };

        update();
    },[])

    return(
        <div className="col">
            <div className="row">
                <div className="all_scores_table">
                    <div className="table_type">
                        All scores
                        <hr/>
                    </div>
                    <div className="row">
                        <div className="info_table">
                            <div className="table_title">
                                Score:
                            </div>
                            <hr/>
                            <div className="table_value">
                                {allScore}
                            </div>
                        </div>
                        <div className="info_table">
                            <div className="table_title">
                                Times played:
                            </div>
                            <hr/>
                            <div className="table_value">
                                {allTimesPlayed}
                            </div>
                        </div>
                        <div className="info_table">
                            <div className="table_title">
                                Highscore:
                            </div>
                            <hr/>
                            <div className="table_value">
                                {allHighscore?.game}: {allHighscore?.score}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="all_scores_leaderboard_table">
                    <div className="table_type">
                        All scores leaderboard
                        <hr/>
                    </div>
                    <div className="col leaderboard_place">
                        {allLeaderboard.map((entry,index) => (
                            <div key={index}>
                                {index+1}. {entry.username} - {entry.score}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="all_scores_table">
                    <div className="table_type">
                        Aim Trainer scores
                        <hr/>
                    </div>
                    <div className="row">
                        <div className="info_table">
                            <div className="table_title">
                                Score:
                            </div>
                            <hr/>
                            <div className="table_value">
                                {aimScore}
                            </div>
                        </div>
                        <div className="info_table">
                            <div className="table_title">
                                Times played:
                            </div>
                            <hr/>
                            <div className="table_value">
                                {aimTimesPlayed}
                            </div>
                        </div>
                        <div className="info_table">
                            <div className="table_title">
                                Highscore:
                            </div>
                            <hr/>
                            <div className="table_value">
                                {aimHighscore}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="all_scores_leaderboard_table">
                    <div className="table_type">
                        Aim Trainer leaderboard
                        <hr/>
                    </div>
                    <div className="col leaderboard_place">
                        {aimLeaderboard.map((entry,index) => (
                            <div key={index}>
                                {index+1}. {entry.username} - {entry.score}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

/**
 * <div className="row">
                <div className="all_score_table">
                    <div className="table_type">
                        From all games
                    </div>
                    <hr/>
                    <div className="table_title">
                        Score:
                    </div>
                    <div className="table_value">
                        409132
                    </div>
                    <div className="table_title">
                        Times played:
                    </div>
                    <div className="table_value">
                        1240
                    </div>
                </div>
                <div className="all_score_table">
                    <div className="table_type">
                        Aim Trainer
                    </div>
                    <hr/>
                    <div className="table_title">
                        Score:
                    </div>
                    <div className="table_value">
                        124534
                    </div>
                    <div className="table_title">
                        Times played:
                    </div>
                    <div className="table_value">
                        114
                    </div>
                </div>
                <div className="all_score_table">
                    <div className="table_type">
                        Math Game
                    </div>
                    <hr/>
                    <div className="table_title">
                        Score:
                    </div>
                    <div className="table_value">
                        124534
                    </div>
                    <div className="table_title">
                        Times played:
                    </div>
                    <div className="table_value">
                        114
                    </div>
                </div>
                <div className="all_score_table">
                    <div className="table_type">
                        Seeker
                    </div>
                    <hr/>
                    <div className="table_title">
                        Score:
                    </div>
                    <div className="table_value">
                        124534
                    </div>
                    <div className="table_title">
                        Times played:
                    </div>
                    <div className="table_value">
                        114
                    </div>
                </div>
                <div className="all_score_table">
                    <div className="table_type">
                        Sequence
                    </div>
                    <hr/>
                    <div className="table_title">
                        Score:
                    </div>
                    <div className="table_value">
                        124534
                    </div>
                    <div className="table_title">
                        Times played:
                    </div>
                    <div className="table_value">
                        114
                    </div>
                </div>
                <div className="all_score_table">
                    <div className="table_type">
                        Typing
                    </div>
                    <hr/>
                    <div className="table_title">
                        Score:
                    </div>
                    <div className="table_value">
                        124534
                    </div>
                    <div className="table_title">
                        Times played:
                    </div>
                    <div className="table_value">
                        114
                    </div>
                </div>
            </div>
 */