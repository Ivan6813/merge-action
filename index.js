const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const main = async () => {
    try {
        const owner = core.getInput('owner', { required: true });
        const repo = core.getInput('repo', { required: true });
        const pull_number = core.getInput('pull_number', { required: true });
        const token = core.getInput('token', { required: true });
        const base_url = 'https://training.cleverland.by';
        const path_to_tests_report = 'cypress/report/report.json';
        const path_to_test_file_name = 'cypress/e2e';
        const minimum_required_result = 80;
        let tests_result_message = '';

        const octokit = new github.getOctokit(token);

        fs.readFile(path_to_tests_report, 'utf8', (err, data) => {
            const { stats: { tests, failures, passPercent } } = JSON.parse(data);
        
            tests_result_message = '#  Результаты тестов' + '\n' + `Процент пройденных тестов: ${passPercent}%.` + '\n' + `Общее количество тестов: ${tests}.` + '\n' + `Количество непройденных тестов: ${failures}.` + '\n';
        });

        const test_file_name = fs.readdirSync(path_to_test_file_name)[0];
        const path_to_tests_screenshots = `cypress/report/screenshots/sprint1.cy.js`;

        console.log(test_file_name);
        console.log(path_to_tests_screenshots);

        const { data: pull_request_info } = await octokit.rest.pulls.get({
            owner,
            repo,
            pull_number,
        });

        console.log(pull_number);

        const formData = new FormData();
        formData.append('github', pull_request_info.user.login);
        
        fs.readdirSync(path_to_tests_screenshots).forEach(screenshot => {
            formData.append('files', fs.createReadStream(`${path_to_tests_screenshots}/${screenshot}`));
        });

        const screenshots_links_request_config = {
            method: 'post',
            url: `${base_url}/pull-request/save-images`,
            headers: { 
                ...formData.getHeaders()
            },
            data : formData
        };

        const { data: screenshots } = await axios(screenshots_links_request_config);
        
        const createTestsResultMessage = () => {
            screenshots.forEach(({ url }) => {
                url = url.replace(/\s+/g,"%20");
                console.log(url);
                tests_result_message += `![Скриншот автотестов](https://static.cleverland.by${url})` + '\n';
            });

            return tests_result_message;
        };
      
        const resp = await octokit.rest.issues.createComment({
            owner,
            repo,
            issue_number: pull_number,
            body: createTestsResultMessage(),
        });

        console.log(resp);

        const testTonfig = {
            method: 'post',
            url: `${base_url}/pull-request/opened`,
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            data : { 
                link: pull_request_info.html_url, 
                github: 'ValadzkoAliaksei',
                isTestsSuccess: false,
                isFirstPush: true
            },
        };

        // await axios(testTonfig);

    } catch (error) {
        core.setFailed(error.message);
    }
}

// Call the main function to run the action
main();