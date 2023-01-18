const core = require('@actions/core');
const github = require('@actions/github');
const { request } = require('@octokit/request');
const fs = require('fs');
const { cwd } = require('node:process');
// const FormData = require('form-data');
const axios = require('axios');

const main = async () => {
    try {
        const owner = core.getInput('owner', { required: true });
        const repo = core.getInput('repo', { required: true });
        const pull_number = core.getInput('pull_number', { required: true });
        const token = core.getInput('token', { required: true });
        const base_url = 'https://training.cleverland.by';
        const pull_opened_url = `${base_url}/pull-request/opened`;
        const save_imges_url = `${base_url}/pull-request/save-images`
        const path_to_tests_report = 'cypress/report/report.json';
        const path_to_tests_screenshots = 'cypress/report/screenshots/sprint4.cy.js';
        const minimum_required_result = 80;
        let tests_result_message = '';

        const octokit = new github.getOctokit(token);

        fs.readFile(path_to_tests_report, 'utf8', (err, data) => {
            const { stats: { tests, failures, passPercent } } = JSON.parse(data);
        
            tests_result_message = '#  Результаты тестов' + '\n' + `Процент пройденных тестов: ${passPercent}%.` + '\n' + `Общее количество тестов: ${tests}.` + '\n' + `Количество непройденных тестов: ${failures}.` + '\n';
        });

        const { data: pull_request_info } = await octokit.rest.pulls.get({
            owner,
            repo,
            pull_number,
        });

        const formData = new FormData();
        formData.append('github', pull_request_info.user.login);
        
        fs.readdirSync(path_to_tests_screenshots).forEach(screenshot => {
            formData.append('files', fs.createReadStream(`${path_to_tests_screenshots}/${screenshot}`));
        });

        const screenshots_links_request_config = {
            method: 'post',
            url: save_imges_url,
            headers: { 
                ...formData.getHeaders()
            },
            data : formData
        };

        const { data: screenshots } = await axios(screenshots_links_request_config);
        
        const createTestsResultMessage = () => {
            screenshots.forEach(({ url }) => {
                tests_result_message += `![Скриншот автотестов](https://static.cleverland.by/media/screenshots/sprint1/Ivan6813/active-category-programming.png)` + '\n';
            });

            return tests_result_message;
        };
      
        await octokit.rest.issues.createComment({
            owner,
            repo,
            issue_number: pull_number,
            body: createTestsResultMessage(),
        });

        console.log(tests_result_message);

        const testTonfig = {
            method: 'post',
            url: pull_opened_url,
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            data : { 
                link: pull_request_info.html_url, 
                github: pull_request_info.user.login,
                isTestsSuccess: false,
                isFirstPush: true
            },
        };

        await axios(testTonfig)
        .then(function (response) {
        console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
        console.log(error);
        });

        // https://training.cleverland.by/media/screenshots/sprint1/ValadzkoAliaksei/active-category-design.png

        // await request(`POST ${url}`, {
        //     data: { 
        //         link: pull_request_info.html_url, 
        //         github: owner,
        //         isTestsSuccess: passPercent >= minimum_required_result
        //     },
        //     headers: {
        //       'Content-Type': 'application/json;charset=utf-8'
        //     },
        // });

    } catch (error) {
        core.setFailed(error.message);
    }
}

// Call the main function to run the action
main();