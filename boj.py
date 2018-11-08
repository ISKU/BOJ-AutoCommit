import re
import requests
import json
from bs4 import BeautifulSoup


BOJ_URL = 'https://www.acmicpc.net'
STATUS_URL = '%s/status' % (BOJ_URL)
DOWNLOAD_URL = '%s/source/download' % (BOJ_URL)
SOURCE_URL = '%s/source' % (BOJ_URL)


class BOJ:

    def __init__(self):
        self.user_id = None
        self.cookie = None

    def login_boj(self, user_id, user_password):
        url = '%s/%s' % (BOJ_URL, 'signin')
        data = {'login_user_id': user_id, 'login_password': user_password}
        res = requests.post(url=url, data=data, allow_redirects=False)

        if res.status_code != 302:
            return True, str(res.status_code)
        if not 'Set-Cookie' in res.headers:
            return True, 'Cookie not found'
        if not 'Location' in res.headers:
            return True, 'Redirecting error'
        if 'error' in res.headers['Location']:
            return True, 'Login failed for user'
       
        cookie = ''
        flag_cfduid = False
        flag_oj = False
        for element in re.split(',| ', res.headers['Set-Cookie']):
            if '__cfduid' in element:
                cookie += element + ' '
                flag_cfduid = True
            if 'OnlineJudge' in element:
                cookie += element
                flag_oj = True

        if not (flag_cfduid and flag_oj):
            return True, 'Invalid cookie'

        self.user_id = user_id
        self.cookie = cookie
        return False, 'Login succeed'

    def get_solved_problems(self):
        if self.user_id is None:
            return True, 'Login is required'

        url = STATUS_URL
        params = {'user_id': self.user_id, 'language_id': '-1', 'result_id': '4'}
        res = requests.get(url=url, params=params)

        if res.status_code != 200:
            return True, str(res.status_code)

        soup = BeautifulSoup(res.text, 'html.parser')
        selector = soup.find(id='status-table').tbody.find_all('tr')
        if selector is None:
            return True, 'Selector is none'

        solved_problems = []
        for tr in selector:
            td = tr.find_all('td')

            problem = {}
            problem['submission_id'] = td[0].text
            problem['problem_id'] = td[2].a.text
            problem['problem_title'] = td[2].a['title']
            problem['memory'] = td[4].text
            problem['time'] = td[5].text
            problem['language'] = td[6].text
            problem['length'] = td[7].text
            problem['date'] = td[8].a['title']
            solved_problems.append(problem)
        
        return False, solved_problems

    def download_source(self, submission_id):
        if self.cookie is None:
            return True, 'Login is required'

        url = '%s/%s' % (DOWNLOAD_URL, submission_id)
        headers = {'Cookie': self.cookie}
        res = requests.get(url=url, headers=headers)

        if res.status_code != 200:
            return True, str(res.status_code)
        if res.text is None:
            return True, 'Source is none'

        source = res.text
        return False, source

    def get_private(self, submission_id):
        if self.cookie is None:
            return True, 'Login is required'

        url = '%s/%s' % (SOURCE_URL, submission_id)
        headers = {'Cookie': self.cookie}
        res = requests.get(url=url, headers=headers)

        if res.status_code != 200:
            return True, str(res.status_code)

        soup = BeautifulSoup(res.text, 'html.parser')
        selector = soup.find_all('input', {'name': 'code_open'})
        if selector is None:
            return True, 'Selector is none'

        if selector[1].has_attr('checked'):
            return False, False
        return False, True

    def get_user_id(self):
        if self.user_id is None:
            return True, 'Login is required'
        return False, self.user_id
