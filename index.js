const core = require('@actions/core');
const github = require('@actions/github');
const { request } = require('@octokit/request');
const fs = require('fs');
const { cwd } = require('node:process');
const FormData = require('form-data');
const axios = require('axios');

const main = async () => {
    try {
        const owner = core.getInput('owner', { required: true });
        const repo = core.getInput('repo', { required: true });
        const pull_number = core.getInput('pull_number', { required: true });
        const token = core.getInput('token', { required: true });
        const url = 'https://training.cleverland.by/pull-request/opened';
        const path_to_tests_report = 'cypress/report/report.json';
        const path_to_tests_screenshots = 'cypress/report/screenshots/sprint4.cy.js';
        const minimum_required_result = 80;
        let tests_result_message = '';

        fs.readFile(path_to_tests_report, 'utf8', (err, data) => {
            const { stats } = JSON.parse(data);
            const { tests, failures, passPercent } = stats;

            tests_result_message = '#  Результаты тестов' + '\n' + `Процент пройденных тестов: ${passPercent}%.` + '\n' + `Общее количество тестов: ${tests}.` + '\n' + `Количество непройденных тестов: ${failures}.` + '\n';
            
        });


        
        // fs.readFile("cypress/report/screenshots/sprint4.cy.js/active-category-design.png", 'utf8', (err, data) => {
        //     console.log(data);
        // });

        // fs.readdir(path_to_tests_screenshots, function(err, items) {
 
        //     for (let i = 0; i < items.length; i++) {
        //         console.log(typeof items[i]);
        //     }
        
        // });

        fs.readdirSync(path_to_tests_screenshots).forEach(file => {
            console.log(file);
        });

        //   fs.readdirSync(path_to_tests_screenshots, {withFileTypes: true}).forEach(file => {
        //     console.log(file);
        //   });
            // .filter(item => !item.isDirectory())
            // .map(item => item.name)

        const octokit = new github.getOctokit(token);

        const { data: pull_request_info } = await octokit.rest.pulls.get({
            owner,
            repo,
            pull_number,
        });

      
        const formData = new FormData();
        formData.append('github', 'ValadzkoAliaksei');
        
        fs.readdirSync(path_to_tests_screenshots).forEach(file => {
            formData.append('files', fs.createReadStream(`${path_to_tests_screenshots}/${file}`));
        });

        const config = {
            method: 'post',
            url: 'https://training.cleverland.by/pull-request/save-images',
            headers: { 
                ...formData.getHeaders()
            },
            data : formData
        };

        const { data } = await axios(config);
        // .then(function (response) {
        // console.log(JSON.stringify(response.data));
        // })
        // .catch(function (error) {
        // console.log(error);
        // });
        console.log(data);
        
        // const form = new FormData();
        // form.append('github', pull_request_info.user.login);
        // form.append('files', fs.createReadStream('cypress/report/screenshots/sprint4.cy.js/active-category-design.png'));

        // console.log(form);

        // const resp = await request(`POST https://training.cleverland.by/pull-request/save-images`, {
        //     // data: {
        //     //     github: pull_request_info.user.login,
        //     //     files: [fs.createReadStream('cypress/report/screenshots/sprint4.cy.js/active-category-design.png')]
        //     // },
        //     data: form,
        //     // headers: {
        //     //     'Content-Type': 'multipart/form-data'
        //     // },
        // });

        // console.log(resp);

        // const { data: tests_report } = await octokit.rest.repos.getContent({
        //     owner,
        //     repo,
        //     path: path_to_tests_report,
        //     ref: pull_request_info.head.ref
        // });

        // const { data: tests_screenshots } = await octokit.rest.repos.getContent({
        //     owner,
        //     repo,
        //     path: path_to_tests_screenshots,
        //     ref: pull_request_info.head.ref
        // });

        // const buff = Buffer.from(tests_report.content, 'base64');
        // const { stats: tests_stats } = JSON.parse(buff.toString('utf-8'));
        // const { tests, failures, passPercent } = tests_stats;

        const createTestsResultMessage = () => {
            data.forEach(({ url }) => {
                tests_result_message += `![Скриншот автотестов](https://training.cleverland.by/media/screenshots/sprint1/ValadzkoAliaksei/active-category-design.png)` + '\n';
            });

            return tests_result_message;
        };
        // https://training.cleverland.by/media/screenshots/sprint1/ValadzkoAliaksei/active-category-design.png
        await octokit.rest.issues.createComment({
            owner,
            repo,
            issue_number: pull_number,
            body: createTestsResultMessage(),
        });

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