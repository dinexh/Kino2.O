export interface Rule {
    id: string;
    title: string;
    eligibility?: string[];
    submissionGuidelines?: string[];
    judgingCriteria?: string[];
    contentGuidelines?: string[];
  }

export const rules: Rule[] = [
    {
        id: "short-film-contest",
        title: "Short Film Contest Rules and Regulations",
        eligibility: [
            "Open to all aspiring filmmakers.",
            "The short film must be original and not have been submitted to any prior competitions."
        ],
        submissionGuidelines: [
            "Films must be submitted 20 days before the event via the Chitramela portal.",
            "Duration of the short film should be between 5 to 15 minutes.",
            "Films can be in any language, but non-English or non-Hindi films must include English subtitles.",
            "Plagiarism will lead to disqualification.",
            "All cast members should attend the event."
        ],
        judgingEvaluation: [
            {
                phase: "Round 1: Initial Shortlisting",
                details: ["100 short films will be selected from the total submissions by the Chitramela team."]
            },
            {
                phase: "Online Promotion",
                details: [
                    "The shortlisted films will be uploaded to the Chitramela YouTube channel.",
                    "Creators are encouraged to promote their films to gather likes and views.",
                    "50% of the final score will be based on likes and views."
                ]
            },
            {
                phase: "Jury Evaluation",
                details: [
                    "The remaining 50% will be based on jury assessment, focusing on creativity, storytelling, technical aspects, and originality."
                ]
            },
            {
                phase: "Final Round",
                details: [
                    "The jury will select 5 short films for the final screening.",
                    "The top 3 winners will be announced by the Chief Guest during the final day."
                ]
            }
        ],
        contentGuidelines: [
            "Films should not contain obscene content or offensive material.",
            "All content must adhere to appropriate standards of decency."
        ]
    },
    {
        id: "photography-contest",
        title: "Photography Contest Rules and Regulations",
        eligibility: [
            "Open to photographers of all skill levels."
        ],
        onTheSpotThemeLocation: [
            "The theme will be announced on the day of the contest.",
            "Participants will be taken to a relevant location for their photography session."
        ],
        submissionGuidelines: [
            "Participants must submit their final photo(s) within the deadline announced by the organizers on the same day.",
            "Only photos taken during the event will be eligible for submission."
        ],
        judgingCriteria: [
            "The winner will be determined solely by the jury based on:",
            "Creativity and originality.",
            "Quality and technique.",
            "Relevance to the theme."
        ],
        contentGuidelines: [
            "Any form of plagiarism or excessive editing will result in disqualification.",
            "Photos must not violate any privacy, copyright, or decency regulations."
        ]
    },
    {
        id: "reel-making-contest",
        title: "Reel Making Contest Rules and Regulations",
        eligibility: [
            "Open to all participants."
        ],
        submissionGuidelines: [
            "Participants must upload their reels to the designated Instagram page provided by the Chitramela team.",
            "Reels must not exceed 60 seconds."
        ],
        promotion: [
            "Participants can promote their reels to gather likes and shares, which will contribute to 50% of the final score."
        ],
        judgingCriteria: [
            "The remaining 50% of the score will be determined by the jury based on:",
            "Creativity and storytelling.",
            "Technical skills.",
            "Audience engagement and relevance."
        ],
        contentGuidelines: [
            "All content must be original, and participants must avoid offensive or inappropriate material."
        ]
    },
    {
        id: "movie-poster-design",
        title: "Movie Poster Design Contest Rules and Regulations",
        eligibility: [
            "Open to all graphic designers and artists."
        ],
        onTheSpotThemeTimeLimit: [
            "The theme will be provided at the start of the event.",
            "Participants will have 2 hours to create their poster."
        ],
        submissionGuidelines: [
            "Posters must be submitted through the link provided by the Chitramela team before the time limit expires."
        ],
        judgingCriteria: [
            "The winner will be selected by the jury based on:",
            "Creativity and aesthetic appeal.",
            "Originality and relevance to the theme."
        ],
        contentGuidelines: [
            "Posters must be original and not copied from existing designs.",
            "Any inappropriate or plagiarized work will lead to immediate disqualification."
        ]
    },
    {
        id: "cine-quiz",
        title: "Cine Quiz: Rules and Regulations",
        eligibility: [
            "The quiz is open to all registered participants of the Chitramela event.",
            "Each participant must have a valid registration to compete in the quiz."
        ],
        format: [
            "The quiz will be conducted online through a designated website.",
            "All participants must have access to a computer or device with internet connectivity."
        ],
        rounds: [
            "Round 1: 50 questions with a 30-second time limit per question.",
            "Round 2: 10 questions with a 30-second time limit per question.",
            "Only the top 10 participants from Round 1 will qualify for Round 2."
        ],
        scoring: [
            "Each correct answer will be awarded points.",
            "There are no negative marks for wrong answers.",
            "Scores will be automatically tallied at the end of each round."
        ],
        timeLimits: [
            "Round 1: Participants will have 30 seconds to answer each question.",
            "Round 2: Participants will have 30 seconds to answer each question.",
            "If a participant fails to answer within the given time, the question will be marked as incorrect."
        ],
        tieBreaker: [
            "In case of a tie in any round, a tie-breaker question will be provided, and the first correct answer will determine the winner."
        ],
        internetTechnicalIssues: [
            "Participants are responsible for ensuring a stable internet connection.",
            "Any technical issues faced during the quiz (such as loss of internet) will not be the responsibility of the organizing team.",
            "In case of any technical glitch on the quiz website, the organizers will communicate further instructions."
        ],
        codeOfConduct: [
            "Cheating or use of unfair means will lead to immediate disqualification.",
            "Participants must not collaborate with others during the quiz. Each participant is expected to submit answers independently."
        ],
        winnerAnnouncement: [
            "The winner of the quiz will be announced on the evening of the event after the completion of both rounds."
        ],
        juryDecision: [
            "The decision of the jury and organizing team is final and binding in case of any disputes."
        ]
    }
].map((rule, index) => ({
    ...rule,
    numericId: index + 1  
}));
