const core = require('@actions/core');
const github = require('@actions/github');
const { request } = require("@octokit/request");
const fs = require("fs");

const main = async () => {
    try {
        const owner = core.getInput('owner', { required: true });
        const repo = core.getInput('repo', { required: true });
        const pull_number = core.getInput('pull_number', { required: true });
        const token = core.getInput('token', { required: true });
        const url = 'https://training.cleverland.by/pull-request/opened';
        const url2 = 'https://training.cleverland.by/pull-request/merged';
        const minimum_required_result = 80;
        const obj = `Процент пройденных: 30.`;

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

        const { data: report } = await octokit.rest.repos.getContent({
            owner: owner,
            repo: repo,
            path: 'cypress/report/report.json',
            ref: 'sprint-1'
        });

        const buff = Buffer.from(report.content, 'base64');

        const str = buff.toString('utf-8');

        const jsn = JSON.parse(str);

        core.info(`result, ${jsn.stats.passPercent}`);
        core.info(`data, ${data}`);

        const tests_pass_percent = jsn.stats.passPercent;
        const total_tests = jsn.stats.tests;
        const failures_test = jsn.stats.failures;

        core.info(`result, ${tests_pass_percent}`);

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

        // const { data: mrg } = await octokit.rest.pulls.merge({
        //     owner,
        //     repo,
        //     pull_number,
        // });

        // core.info(`result, ${mrg.merged}`);

        // if (mrg.merged) {
        //     const m1 = await request(`POST ${url2}`, {
        //         data: { github: owner },
        //         headers: {
        //           'Content-Type': 'application/json;charset=utf-8'
        //         },
        //     });

        //     core.info(`result, ${JSON.stringify(m1)}`);
        // }
    } catch (error) {
        core.setFailed(error.message);
    }
}

// Call the main function to run the action
main();