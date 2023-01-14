const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');
const { request } = require("@octokit/request");
// const report = require('../../cypress/report/report.json');

const main = async () => {
    try {
        const owner = core.getInput('owner', { required: true });
        const repo = core.getInput('repo', { required: true });
        const pull_number = core.getInput('pull_number', { required: true });
        const token = core.getInput('token', { required: true });
        const url = 'http://localhost:3021/pull-request/opened';
        // const minimum_required_result = 80;
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

        core.info(`url, ${JSON.stringify(data.html_url)}!!!`);

        const options = request("POST https://jsonplaceholder.typicode.com/posts", {
            data: JSON.stringify({
                title: 'foo',
                body: 'bar',
                userId: 1,
            }),
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
        });

        // const response = await axios.get('https://jsonplaceholder.typicode.com/todos/1');

        core.info(`response, ${JSON.stringify(options)}!!!`);

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