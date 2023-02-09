import { debug, error, getInput, info, setFailed } from "@actions/core";
import { context, getOctokit } from "@actions/github";

const main = async () => {
    const repoToken = getInput("GITHUB_TOKEN", { required: true });

    const { repo } = context;

    debug(JSON.stringify(context.payload));

    const repoData = context.payload.repository;


    const kit = getOctokit(repoToken);
    if (repoData) {
        const teams = repoData["teams_url"];
        debug(`Requesting data from '${teams}'`);
        const data = await kit.request(teams);
        debug(`Data is ${JSON.stringify(data.data)}`);
    } else {
        debug("No repo data!")
    }

    const teams = await kit.rest.repos.listTeams();
    info(`Data is ${JSON.stringify(teams.data)}`);
};


const errorHandler = (e: Error) => {
    let er = e;
    setFailed(e);
    while (er !== null) {
        debug(`Stack -> ${er.stack as string}`);
        if (er.cause != null) {
            debug("Error has a nested error. Displaying.");
            er = er.cause as Error;
            error(er);
        } else {
            break;
        }
    }
};

info("Starting action!");

main().then(() => info("done")).catch(errorHandler)
