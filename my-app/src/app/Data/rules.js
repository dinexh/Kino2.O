export const rules = [
    {
        id: 1,
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
        ],
        rulesId: 'short-film-contest'
    },
    {
        id: 2,
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
        ],
        rulesId: 'reel-making-contest'
    },
    {
        id: 3,
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
        ],
        rulesId: 'photography-contest'
    }
];
