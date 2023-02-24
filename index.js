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
        const result = 33.33333333333333333333333;

        const octokit = new github.getOctokit(token);

        const { data: list_review_comments } = await octokit.rest.pulls.listReviewComments({
            owner,
            repo,
            pull_number,
        });

        // const { data: reviews } = await octokit.rest.pulls.listReviews({
        //     owner,
        //     repo,
        //     pull_number,
        // });

        const statistics = list_review_comments.reduce((acc, { user }) => {
            console.log('acc', acc);
            const currentObj = acc.find(({reviewer}) => reviewer === user.login);
            console.log(currentObj);
            if (currentObj) {
                currentObj.commentsCount += 1
            } else {
                acc.concat({ reviewer: user.login, commentsCount: 1 });
            }
        }, []);

        console.log(statistics);

        // const statistic = [{ reviewer: "Ivan6813", commentsCount: 3 }];

        // fs.readFile('cypress/README.md', 'utf8', (err, data) => {
        //     // FILE = Buffer.from(data).toString('base64');
        //     console.log('readme', data);
        // });

        // fs.readFile(path_to_tests_report, 'utf8', (err, data) => {
        //     const { stats: { tests, failures, passPercent } } = JSON.parse(data);
        
        //     tests_result_message = '#  Результаты тестов' + '\n' + `Процент пройденных тестов: ${Math.trunc(passPercent)}%.` + '\n' + `Общее количество тестов: ${tests}.` + '\n' + `Количество непройденных тестов: ${failures}.` + '\n';
        // });

        // const test_file_name = fs.readdirSync(path_to_test_file_name)[0];
        // const path_to_tests_screenshots = `cypress/report/screenshots/sprint1.cy.js`;

        // const { data: pull_request_info } = await octokit.rest.pulls.get({
        //     owner,
        //     repo,
        //     pull_number,
        // });

        // const { data: list_review_comments } = await octokit.rest.pulls.listReviewComments({
        //     owner,
        //     repo,
        //     pull_number,
        // });

        // const reviewers = [...new Set(list_review_comments.map(({ user }) => user.login))];

        // const formData = new FormData();
        // formData.append('github', pull_request_info.user.login);
        
        // fs.readdirSync(path_to_tests_screenshots).forEach(screenshot => {
        //     formData.append('files', fs.createReadStream(`${path_to_tests_screenshots}/${screenshot}`));
        // });

        // const screenshots_links_request_config = {
        //     method: 'post',
        //     url: `${base_url}/pull-request/save-images`,
        //     headers: { 
        //         ...formData.getHeaders()
        //     },
        //     data : formData
        // };

        // const { data: screenshots } = await axios(screenshots_links_request_config);
        
        // const createTestsResultMessage = () => {
        //     screenshots.forEach(({ name, url }) => {
        //         url = url.replace(/\s+/g,"%20");
        //         tests_result_message += '***' + '\n' + `**${name}**` + '\n' + `![Скриншот автотестов](https://static.cleverland.by${url})` + '\n';
        //     });

        //     return tests_result_message;
        // };
      
        // const resp = await octokit.rest.issues.createComment({
        //     owner,
        //     repo,
        //     issue_number: pull_number,
        //     body: createTestsResultMessage(),
        // });

        // const testTonfig = {
        //     method: 'post',
        //     url: `${base_url}/pull-request/opened`,
        //     headers: {
        //         'Content-Type': 'application/json;charset=utf-8'
        //     },
        //     data : { 
        //         link: pull_request_info.html_url, 
        //         github: 'ValadzkoAliaksei',
        //         isTestsSuccess: false,
        //         isFirstPush: true,
        //         reviewers: isFirstPush ? null : reviewers
        //     },
        // };

        // await axios(testTonfig);

        // const { data: { sha } } = await octokit.rest.repos.getContent({
        //     owner,
        //     repo,
        //     path: 'cypress/hello.txt',
        // });

        // const FILE = 'Ly8vIDxyZWZlcmVuY2UgdHlwZXM9ImN5cHJlc3MiIC8+CgpkZXNjcmliZSgnVGVzdCB3aWR0aCAxNDQwcHgnLCAoKSA9PiB7CiAgICBiZWZvcmVFYWNoKCgpID0+IHsKICAgICAgICBjeS52aWV3cG9ydCgxNDQwLCA5MDApOwogICAgICAgIGN5LnZpc2l0KCdodHRwOi8vbG9jYWxob3N0OjMwMDAnKTsKICAgICAgICBjeS5nZXQoImZvcm0iKTsKICAgICAgICBjeS5nZXQoJ2lucHV0W25hbWU9ImlkZW50aWZpZXIiXScpLnR5cGUoImlsaW5rZXZpY2giKS5zaG91bGQoImhhdmUudmFsdWUiLCAiaWxpbmtldmljaCIpOwogICAgICAgIGN5LmdldCgnaW5wdXRbbmFtZT0icGFzc3dvcmQiXScpLnR5cGUoIktieXJ0ZGJ4MzQ3Nzk5Iikuc2hvdWxkKCJoYXZlLnZhbHVlIiwgIktieXJ0ZGJ4MzQ3Nzk5Iik7CiAgICAgICAgY3kuZ2V0KCdbZGF0YS10ZXN0LWlkPXNpZ24taW4tYnV0dG9uXScpLmNsaWNrKCkud2FpdCgxMDAwMCk7CiAgICB9KTsKCiAgICBpdCgndGVzdCBsYXlvdXQgY29udGVudCB2aWV3JywgKCkgPT4gewogICAgICAgIGN5LmdldCgnW2RhdGEtdGVzdC1pZD1idXR0b24tbWVudS12aWV3LWxpc3RdJykuc2hvdWxkKCdiZS5leGlzdCcpLmNsaWNrKCk7CiAgICAgICAgY3kuZ2V0KCdbZGF0YS10ZXN0LWlkPWFwcF0nKS5zY3JlZW5zaG90KCdjb250ZW50LWxpc3QnKTsKICAgICAgICBjeS5nZXQoJ1tkYXRhLXRlc3QtaWQ9YnV0dG9uLW1lbnUtdmlldy13aW5kb3ddJykuc2hvdWxkKCdiZS5leGlzdCcpLmNsaWNrKCk7CiAgICAgICAgY3kuZ2V0KCdbZGF0YS10ZXN0LWlkPWFwcF0nKS5zY3JlZW5zaG90KCdjb250ZW50LXdpbmRvdycpOwogICAgfSk7CgogICAgaXQoJ3Rlc3QgbGF5b3V0IGJvb2stcGFnZScsICgpID0+IHsKICAgICAgICBjeS5nZXQoJ1tkYXRhLXRlc3QtaWQ9Y2FyZF0nKS5maXJzdCgpLmNsaWNrKCkKICAgICAgICBjeS5nZXQoJ1tkYXRhLXRlc3QtaWQ9YXBwXScpLnNjcmVlbnNob3QoJ2Jvb2stcGFnZScpOwogICAgfSk7Cn0pOw==';
        // const SPRINT_NUMBER = 3;
        // const PATH_TO_TEST_FILE = 'cypress/e2e';
        // const COMMITTER = { name: 'Monalisa Octocat', email: 'octocat@github.com'};
        // const DELETE_COMMIT_MESSAGE = 'delete test file';
        // const ADD_COMMIT_MESSAGE = 'add new test file';
        // let FILE = '';

        // fs.readFile('cypress/sprint4.cy.js', 'utf8', (err, data) => {
        //     FILE = Buffer.from(data).toString('base64');
        // });

        // fs.readFileSync('https://static.cleverland.by/media/sprint1/1676728269/sprint4.cy.js', 'utf8', (err, data) => {
        //     FILE = Buffer.from(data).toString('base64');
        //     console.log('file', data);
        // });

        //     const testTonfig = {
        //     method: 'get',
        //     url: 'https://static.cleverland.by/media/sprint1/1676728269/sprint4.cy.js',
        //     headers: {
        //         'Content-Type': 'application/json;charset=utf-8'
        //     },
        // };

        // const data = await axios(testTonfig);

        // console.log('fsdfds', data);

        // const {data: test_file_info} = await octokit.rest.repos.getContent({
        //     owner,
        //     repo,
        //     path: 'README.md',
        // });


        // const { sha, path } = test_file_info;

        //   await octokit.rest.repos.deleteFile({
        //     owner,
        //     repo,
        //     path,
        //     message: DELETE_COMMIT_MESSAGE,
        //     sha,
        //   });

        //   await octokit.rest.repos.createOrUpdateFileContents({
        //     owner,
        //     repo,
        //     path: path,
        //     message: ADD_COMMIT_MESSAGE,
        //     content: FILE,
        //     committer: COMMITTER,
        //     author: COMMITTER,
        //   });

    /***** получить sha и path файла *****/

        // const get_info_file_config = {
        //     method: 'get',
        //     url: `https://api.github.com/repos/${owner}/${repo}/contents/${PATH_TO_TEST_FILE}`,
        //     headers: { 
        //         'Accept': 'application/vnd.github+json', 
        //         'Authorization': `Bearer ${token}`
        //     }
        // };
        
        // const { data: file_info } = await axios(get_info_file_config);
        // const { sha, path } = file_info[0];

        // console.log(sha, path);

    /***** удаление старого файла *****/

        // const delete_file_data = JSON.stringify({
        //     message: 'delete test file',
        //     committer: {
        //         name: COMMITTER_NAME,
        //         email: COMMITTER_EMAIL
        //     },
        //     sha
        // });

        // const delete_file_config = {
        //     method: 'delete',
        //     url: `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
        //     headers: { 
        //         'Accept': 'application/vnd.github+json', 
        //         'Authorization': `Bearer ${token}`, 
        //         'Content-Type': 'text/plain'
        //     },
        //     data : delete_file_data
        // };

        // await axios(delete_file_config);

    /***** добавление нового файла *****/

        // const create_file_data = JSON.stringify({
        //     message: 'add new test file',
        //     committer:{
        //         name: COMMITTER_NAME,
        //         email: COMMITTER_EMAIL
        //     },
        //     content: file
        // });

        // const config = {
        //     method: 'get',
        //     url: 'https://api.github.com/orgs/ClevertecTest/repos',
        // };

        // const { data } = await axios(config);

        // console.log('repos', data);

        // const create_file_config = {
        //     method: 'put',
        //     url: `https://api.github.com/repos/${owner}/${repo}/contents/${PATH_TO_TEST_FILE}/sprint${SPRINT_NUMBER}.cy.js`,
        //     headers: { 
        //         'Accept': 'application/vnd.github+json', 
        //         'Authorization': `Bearer ${token}`, 
        //         'Content-Type': 'text/plain'
        //     },
        //     data : create_file_data
        // };

        // await axios(create_file_config);

    } catch (error) {
        console.log(error.message);
        core.setFailed(error.message);
    }
}

// Call the main function to run the action
main();