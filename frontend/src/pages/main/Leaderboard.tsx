import React,{useState,useEffect,useRef} from "react";
import {getSession} from "../../utils/session";
import "./Leaderboard.css";

export const Leaderboard=() => {
    const [loading,setLoading]=useState(true);
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
    const [recommendation,setRecommendation]=useState<string>("");
    const [isLoggedIn,setIsLoggedIn]=useState(false);

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

            if(scores.length>0){
                const maxScore=Math.max(...scores);
                const sumScore=scores.reduce((acc,num) => acc+num,0);

                setAimScore(sumScore);
                setAimHighscore(maxScore);
            }else{
                setAimHighscore(0);
                setAimTimesPlayed(0);
            }
        }catch(error){
            console.error("Error getting aim trainer stats: ",error);
        }
    };

    const getMathStats=async() => {
        try{
            const response=await fetch(`api/Score/math/get_all_scores?limit=10`,{
                method: "GET"
            });

            if(response.ok){
                const data=await response.json();
                setMathLeaderboard(data);
            }else{
                console.error("Failed to get leaderboard");
            }

            const session=await getSession();
            var username=session.username;
            if(!username){
                console.error("No username found. Cannot save score");
            }

            const responseScores=await fetch(`api/Score/math/get_account_scores?accountName=${username}`,{
                method: "GET"
            });

            if(!responseScores.ok){
                console.error("Failed to fetch scores");
            }

            const scores: number[]=await responseScores.json();

            setMathTimesPlayed(scores.length);

            if(scores.length>0){
                const maxScore=Math.max(...scores);
                const sumScore=scores.reduce((acc,num) => acc+num,0);

                setMathScore(sumScore);
                setMathHighscore(maxScore);
            }else{
                setMathHighscore(0);
                setMathTimesPlayed(0);
            }
        }catch(error){
            console.error("Error getting math game stats: ",error);
        }
    };

    const getSeekerStats=async() => {
        try{
            const response=await fetch(`api/Score/seeker/get_all_scores?limit=10`,{
                method: "GET"
            });

            if(response.ok){
                const data=await response.json();
                setSeekerLeaderboard(data);
            }else{
                console.error("Failed to get leaderboard");
            }

            const session=await getSession();
            var username=session.username;
            if(!username){
                console.error("No username found. Cannot save score");
            }

            const responseScores=await fetch(`api/Score/seeker/get_account_scores?accountName=${username}`,{
                method: "GET"
            });

            if(!responseScores.ok){
                console.error("Failed to fetch scores");
            }

            const scores: number[]=await responseScores.json();

            setSeekerTimesPlayed(scores.length);

            if(scores.length>0){
                const maxScore=Math.max(...scores);
                const sumScore=scores.reduce((acc,num) => acc+num,0);

                setSeekerScore(sumScore);
                setSeekerHighscore(maxScore);
            }else{
                setSeekerHighscore(0);
                setSeekerTimesPlayed(0);
            }
        }catch(error){
            console.error("Error getting seeker stats: ",error);
        }
    };

    const getSequenceStats=async() => {
        try{
            const response=await fetch(`api/Score/sequence/get_all_scores?limit=10`,{
                method: "GET"
            });

            if(response.ok){
                const data=await response.json();
                setSequenceLeaderboard(data);
            }else{
                console.error("Failed to get leaderboard");
            }

            const session=await getSession();
            var username=session.username;
            if(!username){
                console.error("No username found. Cannot save score");
            }

            const responseScores=await fetch(`api/Score/sequence/get_account_scores?accountName=${username}`,{
                method: "GET"
            });

            if(!responseScores.ok){
                console.error("Failed to fetch scores");
            }

            const scores: number[]=await responseScores.json();

            setSequenceTimesPlayed(scores.length);

            if(scores.length>0){
                const maxScore=Math.max(...scores);
                const sumScore=scores.reduce((acc,num) => acc+num,0);

                setSequenceScore(sumScore);
                setSequenceHighscore(maxScore);
            }else{
                setSequenceHighscore(0);
                setSequenceTimesPlayed(0);
            }
        }catch(error){
            console.error("Error getting sequence stats: ",error);
        }
    };

    const getTypingStats=async() => {
        try{
            const response=await fetch(`api/Score/typing/get_all_scores?limit=10`,{
                method: "GET"
            });

            if(response.ok){
                const data=await response.json();
                setTypingLeaderboard(data);
            }else{
                console.error("Failed to get leaderboard");
            }

            const session=await getSession();
            var username=session.username;
            if(!username){
                console.error("No username found. Cannot save score");
            }

            const responseScores=await fetch(`api/Score/typing/get_account_scores?accountName=${username}`,{
                method: "GET"
            });

            if(!responseScores.ok){
                console.error("Failed to fetch scores");
            }

            const scores: number[]=await responseScores.json();

            setTypingTimesPlayed(scores.length);

            if(scores.length>0){
                const maxScore=Math.max(...scores);
                const sumScore=scores.reduce((acc,num) => acc+num,0);

                setTypingScore(sumScore);
                setTypingHighscore(maxScore);
            }else{
                setTypingHighscore(0);
                setTypingTimesPlayed(0);
            }
        }catch(error){
            console.error("Error getting typing stats: ",error);
        }
    };

    const getRecommendation=async() => {
        try{
            const session=await getSession();
            var username=session.username;
            if(!username){
                console.error("No username found. Cannot save score");
            }

            const response=await fetch(`api/Recommendation/GetRecommendation/${username}`,{
                method: "GET"
            });

            if(response.ok){
                const data: string=await response.text();

                if(data=="aim"){
                    setRecommendation("You need to play more Aim Trainer");
                }else if(data=="math"){
                    setRecommendation("You need to play more Math Game");
                }else if(data=="seeker"){
                    setRecommendation("You need to play more Seeker");
                }else if(data=="sequence"){
                    setRecommendation("You need to play more Sequence");
                }else if(data=="typing"){
                    setRecommendation("You need to play more Typing");
                }
            }else{
                console.error("Failed to get recommendation");
            }
        }catch(error){
            console.error("Error getting recommendation: ",error);
        }
    }

    useEffect(() => {
        const update=async() => {
            await getAllStats();
            await getAimStats();
            await getMathStats();
            await getSeekerStats();
            await getSequenceStats();
            await getTypingStats();

            try{
                const session=await getSession();
                if(session && session.username){
                    setIsLoggedIn(true);
                }else{
                    setIsLoggedIn(false);
                }
            }catch(error){
                setIsLoggedIn(false);
            }finally{
                setLoading(false);
            }
        };

        update();
    },[])

    return(
        <>
            {loading ? (
                <div className="loader"></div>
            ) : (
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
                    {isLoggedIn ? (
                        <div className="row recommendation">
                            <button className="recommendation_button" onClick={getRecommendation}>Get Recommendation</button>
                            <div className="recommendation_text">
                                {recommendation}
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}
                    <div className="row">
                        {aimTimesPlayed>0 ? (
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
                        ) : (
                            <></>
                        )}
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
                    <div className="row">
                        {mathTimesPlayed>0 ? (
                            <div className="all_scores_table">
                                <div className="table_type">
                                    Math Game scores
                                    <hr/>
                                </div>
                                <div className="row">
                                    <div className="info_table">
                                        <div className="table_title">
                                            Score:
                                        </div>
                                        <hr/>
                                        <div className="table_value">
                                            {mathScore}
                                        </div>
                                    </div>
                                    <div className="info_table">
                                        <div className="table_title">
                                            Times played:
                                        </div>
                                        <hr/>
                                        <div className="table_value">
                                            {mathTimesPlayed}
                                        </div>
                                    </div>
                                    <div className="info_table">
                                        <div className="table_title">
                                            Highscore:
                                        </div>
                                        <hr/>
                                        <div className="table_value">
                                            {mathHighscore}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <></>
                        )}
                        <div className="all_scores_leaderboard_table">
                            <div className="table_type">
                                Math Game leaderboard
                                <hr/>
                            </div>
                            <div className="col leaderboard_place">
                                {mathLeaderboard.map((entry,index) => (
                                    <div key={index}>
                                        {index+1}. {entry.username} - {entry.score}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {seekerTimesPlayed>0 ? (
                            <div className="all_scores_table">
                                <div className="table_type">
                                    Seeker scores
                                    <hr/>
                                </div>
                                <div className="row">
                                    <div className="info_table">
                                        <div className="table_title">
                                            Score:
                                        </div>
                                        <hr/>
                                        <div className="table_value">
                                            {seekerScore}
                                        </div>
                                    </div>
                                    <div className="info_table">
                                        <div className="table_title">
                                            Times played:
                                        </div>
                                        <hr/>
                                        <div className="table_value">
                                            {seekerTimesPlayed}
                                        </div>
                                    </div>
                                    <div className="info_table">
                                        <div className="table_title">
                                            Highscore:
                                        </div>
                                        <hr/>
                                        <div className="table_value">
                                            {seekerHighscore}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <></>
                        )}
                        <div className="all_scores_leaderboard_table">
                            <div className="table_type">
                                Seeker leaderboard
                                <hr/>
                            </div>
                            <div className="col leaderboard_place">
                                {seekerLeaderboard.map((entry,index) => (
                                    <div key={index}>
                                        {index+1}. {entry.username} - {entry.score}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {sequenceTimesPlayed>0 ? (
                            <div className="all_scores_table">
                                <div className="table_type">
                                    Sequence scores
                                    <hr/>
                                </div>
                                <div className="row">
                                    <div className="info_table">
                                        <div className="table_title">
                                            Score:
                                        </div>
                                        <hr/>
                                        <div className="table_value">
                                            {sequenceScore}
                                        </div>
                                    </div>
                                    <div className="info_table">
                                        <div className="table_title">
                                            Times played:
                                        </div>
                                        <hr/>
                                        <div className="table_value">
                                            {sequenceTimesPlayed}
                                        </div>
                                    </div>
                                    <div className="info_table">
                                        <div className="table_title">
                                            Highscore:
                                        </div>
                                        <hr/>
                                        <div className="table_value">
                                            {sequenceHighscore}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <></>
                        )}
                        <div className="all_scores_leaderboard_table">
                            <div className="table_type">
                                Sequence leaderboard
                                <hr/>
                            </div>
                            <div className="col leaderboard_place">
                                {sequenceLeaderboard.map((entry,index) => (
                                    <div key={index}>
                                        {index+1}. {entry.username} - {entry.score}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {typingTimesPlayed>0 ? (
                            <div className="all_scores_table">
                                <div className="table_type">
                                    Typing scores
                                    <hr/>
                                </div>
                                <div className="row">
                                    <div className="info_table">
                                        <div className="table_title">
                                            Score:
                                        </div>
                                        <hr/>
                                        <div className="table_value">
                                            {typingScore}
                                        </div>
                                    </div>
                                    <div className="info_table">
                                        <div className="table_title">
                                            Times played:
                                        </div>
                                        <hr/>
                                        <div className="table_value">
                                            {typingTimesPlayed}
                                        </div>
                                    </div>
                                    <div className="info_table">
                                        <div className="table_title">
                                            Highscore:
                                        </div>
                                        <hr/>
                                        <div className="table_value">
                                            {typingHighscore}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <></>
                        )}
                        <div className="all_scores_leaderboard_table">
                            <div className="table_type">
                                Typing leaderboard
                                <hr/>
                            </div>
                            <div className="col leaderboard_place">
                                {typingLeaderboard.map((entry,index) => (
                                    <div key={index}>
                                        {index+1}. {entry.username} - {entry.score}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}