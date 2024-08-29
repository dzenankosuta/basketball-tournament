import { Logger } from './services/Logger.js';
import { loadGroups, saveResultsToFile } from './services/File.js';
import {
    rankTeamsInGroup,
    simulateGroupMatches,
    selectTeamsForKnockout,
    simulateKnockoutStage,
} from './services/Match.js';

function main() {
    const groups = loadGroups();
    const allResults = [];

    groups.groups.forEach((group) => {
        const groupResults = simulateGroupMatches(group);
        allResults.push(...groupResults);
        const rankedTeams = rankTeamsInGroup(group);
        Logger.info(`Final standings in Group ${group.name}:`, rankedTeams);
    });

    const knockoutTeams = selectTeamsForKnockout(groups);

    simulateKnockoutStage(knockoutTeams);

    saveResultsToFile('full_tournament_results', allResults);
}

main();
