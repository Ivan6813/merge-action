const core = require('@actions/core');
const github = require('@actions/github');
const { request } = require("@octokit/request");
const fs = require('fs');
// const report = require('../../../test-sprint-marathon/main/cypress/report/report.json');

const main = async () => {
    try {
        const owner = core.getInput('owner', { required: true });
        const repo = core.getInput('repo', { required: true });
        const pull_number = core.getInput('pull_number', { required: true });
        const token = core.getInput('token', { required: true });
        const url = 'http://localhost:3021/pull-request/opened';
        const minimum_required_result = 80;
        const tests_pass_percent = 50;
        // // const total_tests = report.stats.tests;
        // // const failures_test = report.stats.failures;
        const obj = `Процент пройденных: ${tests_pass_percent}.`;

        const octokit = new github.getOctokit(token);

        await octokit.rest.issues.createComment({
            owner: owner,
            repo: repo,
            issue_number: pull_number,
            body: obj,
        });

        const { data } = await octokit.rest.pulls.get({
            owner,
            repo,
            pull_number,
        });

        const content = await octokit.rest.repos.getContent({
            owner: owner,
            repo: repo,
            path: 'cypress/report/report.json',
        });

        // let buff = new Buffer(content, 'base64');
        // const result = fs.writeFileSync('report.json', buff);

        core.info(`result, ${JSON.stringify(content)}`);

        // await request(`POST ${url}`, {
        //     data: { 
        //         link: data.html_url, 
        //         github: owner, 
        //         isTestsSuccess: tests_pass_percent >= minimum_required_result
        //     },
        //     headers: {
        //       'Content-Type': 'application/json;charset=utf-8'
        //     },
        // });

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