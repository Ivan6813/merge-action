const core = require('@actions/core');
const github = require('@actions/github');
// const report = require('../../cypress/report/report.json');

const main = async () => {
    try {
        const owner = core.getInput('owner', { required: true });
        const repo = core.getInput('repo', { required: true });
        const pull_number = core.getInput('pull_number', { required: true });
        const token = core.getInput('token', { required: true });
        // const url = 'https://training.cleverland.by/pull-request/merged'; // /pull-request/opened
        // const minimum_required_result = 80;
        // const tests_pass_percent = 50;
        // // const total_tests = report.stats.tests;
        // // const failures_test = report.stats.failures;
        const issue_number = 123;
        const body = `Процент пройденных: ${tests_pass_percent}.`;

        core.info(`Hello, ${owner}!!!`);
        core.info(`repo, ${repo}!!!`);
        core.info(`pull_number, ${pull_number}!!!`);
        core.info(`token, ${token}!!!`);

        const octokit = new github.getOctokit(token);

        const resp = await octokit.rest.issues.createComment({
            owner,
            repo,
            issue_number,
            body,
        });

        core.info(`resp, ${resp}!!!`);

        // const { html_url } = await octokit.rest.pulls.get({
        //     owner,
        //     repo,
        //     pull_number,
        // });

        // if (tests_pass_percent >= minimum_required_result) {
        //     await fetch(url, {
        //         method: 'POST',
        //         headers: {
        //           'Content-Type': 'application/json;charset=utf-8'
        //         },
        //         body: JSON.stringify({ link: html_url, github: owner, isTestsSuccess: true })
        //     });
        // } else {
        //     await fetch(url, {
        //         method: 'POST',
        //         headers: {
        //           'Content-Type': 'application/json;charset=utf-8'
        //         },
        //         body: JSON.stringify({ link: html_url, github: owner, isTestsSuccess: false })
        //     });
        // }

         // const { merged } = await octokit.rest.pulls.merge({
        //     owner,
        //     repo,
        //     pull_number,
        // });

        // if (merged) {
        //     await fetch(url, {
        //         method: 'POST',
        //         headers: {
        //           'Content-Type': 'application/json;charset=utf-8'
        //         },
        //         body: JSON.stringify({ github: owner })
        //     });
        // }
    } catch (error) {
        core.setFailed(error.message);
    }
}

// Call the main function to run the action
main();