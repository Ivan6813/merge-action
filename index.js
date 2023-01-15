const core = require('@actions/core');
const github = require('@actions/github');
const { request } = require('@octokit/request');
const fs = require('fs');

const main = async () => {
    try {
        const owner = core.getInput('owner', { required: true });
        const repo = core.getInput('repo', { required: true });
        const pull_number = core.getInput('pull_number', { required: true });
        const token = core.getInput('token', { required: true });
        const url = 'https://training.cleverland.by/pull-request/opened';
        const path_to_tests_report = 'cypress/report/report.json';
        const minimum_required_result = 80;

        const octokit = new github.getOctokit(token);

        const { data: pull_request_info } = await octokit.rest.pulls.get({
            owner,
            repo,
            pull_number,
        });

        const { data: tests_report } = await octokit.rest.repos.getContent({
            owner,
            repo,
            path: path_to_tests_report,
            ref: pull_request_info.head.ref
        });

        const buff = Buffer.from(tests_report.content, 'base64');
        const { stats: tests_stats } = JSON.parse(buff.toString('utf-8'));
        const { tests, failures, passPercent } = tests_stats;
        const tests_result_message = `
            Процент пройденных тестов: ${passPercent}%.
            Общее количество тестов: ${tests}.
            Количество непройденных тестов: ${failures}.
        `;

        await octokit.rest.issues.createComment({
            owner,
            repo,
            issue_number: pull_number,
            body: tests_result_message,
        });

        await request(`POST ${url}`, {
            data: { 
                link: pull_request_info.html_url, 
                github: owner,
                isTestsSuccess: passPercent >= minimum_required_result
            },
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
        });

        // const { data: mrg } = await octokit.rest.pulls.merge({
        //     owner,
        //     repo,
        //     pull_number,
        // });

        // core.info(`result, ${mrg.merged}`);

        // const url2 = 'https://training.cleverland.by/pull-request/merged';

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