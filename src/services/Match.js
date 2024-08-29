import { Logger } from './Logger.js';
import { saveResultsToFile } from './File.js';

export function generateRandomScore() {
    const score1 = Math.floor(80 + Math.random() * 20);
    const score2 = Math.floor(70 + Math.random() * 20);
    return `${score1}:${score2}`;
}

export function initializeTeamStats(team) {
    team.wins = 0;
    team.losses = 0;
    team.points = 0;
    team.scoredPoints = 0;
    team.concededPoints = 0;
    team.pointDifference = 0;
}

export function simulateMatch(team1, team2) {
    const rankDifference = team2.fiba_rank - team1.fiba_rank;
    const winProbability = 0.5 + rankDifference * 0.05;
    const randomFactor = Math.random();

    if (randomFactor < winProbability) {
        return {
            winner: team1,
            loser: team2,
            score: generateRandomScore(),
        };
    } else {
        return {
            winner: team2,
            loser: team1,
            score: generateRandomScore(),
        };
    }
}

export function updateTeamStats(team, matchResult, isWinner) {
    if (isWinner) {
        team.wins += 1;
        team.points += 2;
    } else {
        team.losses += 1;
        team.points += 1;
    }

    const [teamScore, opponentScore] = matchResult.score.split(':').map(Number);
    team.scoredPoints += teamScore;
    team.concededPoints += opponentScore;
    team.pointDifference += teamScore - opponentScore;
}

export function rankTeamsInGroup(group) {
    return group.teams.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.pointDifference !== a.pointDifference) return b.pointDifference - a.pointDifference;
        return b.scoredPoints - a.scoredPoints;
    });
}

export function simulateKnockoutMatch(team1, team2) {
    let result = simulateMatch(team1, team2);

    while (result.score.split(':')[0] === result.score.split(':')[1]) {
        result = simulateMatch(team1, team2);
    }

    return result;
}

export function simulateGroupMatches(group) {
    const results = [];

    group.teams.forEach(initializeTeamStats);

    for (let i = 0; i < group.teams.length; i++) {
        for (let j = i + 1; j < group.teams.length; j++) {
            const matchResult = simulateMatch(group.teams[i], group.teams[j]);
            results.push({ group: group.name, ...matchResult });

            updateTeamStats(matchResult.winner, matchResult, true);
            updateTeamStats(matchResult.loser, matchResult, false);
        }
    }

    saveResultsToFile(`group_${group.name}_results`, results);
    return results;
}

export function selectTeamsForKnockout(groups) {
    const knockoutTeams = [];

    groups.groups.forEach((group) => {
        const rankedTeams = rankTeamsInGroup(group);
        knockoutTeams.push(rankedTeams[0]);
        knockoutTeams.push(rankedTeams[1]);
    });

    return knockoutTeams;
}

export function simulateKnockoutStage(teams) {
    let round = 1;
    const knockoutResults = [];

    while (teams.length > 1) {
        Logger.debug(`Round ${round}:`);

        const nextRoundTeams = [];

        for (let i = 0; i < teams.length; i += 2) {
            const matchResult = simulateKnockoutMatch(teams[i], teams[i + 1]);
            Logger.info(
                `${matchResult.winner.country} defeats ${matchResult.loser.country} with a score of ${matchResult.score}`,
            );
            knockoutResults.push(matchResult);
            nextRoundTeams.push(matchResult.winner);
        }

        teams = nextRoundTeams;
        round++;
    }

    Logger.info(`The tournament winner is: ${teams[0].country}`);
    saveResultsToFile(`knockout_stage_results`, knockoutResults);
}
