import sys
import os
import getpass
import time
import json
from boj import BOJ
from git import Git
from option import Option


ERROR_FORMAT = '\n* ERROR: [%s] [%s]\n'
PRINT_FORMAT = '* %s\n'
DEFAULT_OPTION_FILE = 'option.json'


class Main:

    def __init__(self, boj, git, option):
        self.boj = boj
        self.git = git
        self.option = option

        self.candidate_problems = []

    def run(self):
        error, result = self.git.clone()
        if error:
            sys.exit(ERROR_FORMAT % ('git_clone', result))

        error, result = self.git.pull()
        if error:
            sys.exit(ERROR_FORMAT % ('git_pull', result))

        while True:
            error = self.analyze_solved_problems()
            if error:
                self.idle()
                continue

            self.push_solved_problems()
            self.idle()

    def analyze_solved_problems(self):
        error, solved_problems = self.boj.get_solved_problems()
        if error:
            print(ERROR_FORMAT % ('get_solved_problmes', solved_problems))
            return True

        solved_set = set()
        self.candidate_problems = []

        for problem in solved_problems:
            if problem['problem_id'] in solved_set:
                continue

            solved_set.add(problem['problem_id'])
            self.candidate_problems.append(problem)

        return False

    def push_solved_problems(self):
        for problem in self.candidate_problems:
            submission_id = problem['submission_id']
            problem_id = problem['problem_id']
            problem_title = problem['problem_title']
            language = problem['language']

            commit_message = self.option.commit_message(problem)
            source_tree = self.option.source_tree(problem, self.git.get_repo_name())
            source_name = self.option.source_name(problem)
            error, ext = self.option.get_ext(language)
            if error:
                print(ERROR_FORMAT % ('get_ext', ext))
                continue
            file_path = '%s/%s%s' % (source_tree, source_name, ext)

            support, same = self.option.lang(problem)
            if support:
                if not same:
                    print(PRINT_FORMAT % ("'%s' language is not supported (submission: %s, problem: %s)" % (language, submission_id, problem_id)))
                    continue

            private = self.option.private()
            if private:
                error, source_open = self.boj.get_private(submission_id)
                if error:
                    print(ERROR_FORMAT % ('get_private', source_open))
                    continue
                if not source_open:
                    print(PRINT_FORMAT % ('The source is private (submission: %s, problem: %s)' % (submission_id, problem_id)))
                    continue

            if os.path.exists(file_path):
                print(PRINT_FORMAT % ('The source already exists (submission: %s, problem: %s)' % (submission_id, problem_id)))
                continue
       
            print(PRINT_FORMAT % ('Download the source (submission: %s, problem: %s)' % (submission_id, problem_id)))
            error, source = self.boj.download_source(submission_id)
            if error:
                print(ERROR_FORMAT % ('download_source', source))
                continue
            print(source)

            self.save_source(source_tree, file_path, source)
            print(PRINT_FORMAT % ("Successfully saved the '%s'" % (file_path)))

            file_path = file_path.replace(self.git.get_repo_name(), '.', 1)
            error, result = self.git.all(file_path, commit_message)
            if error:
                sys.exit(ERROR_FORMAT % ('git_all', result))
            print(PRINT_FORMAT % ('Successfully pushed the source (submission: %s, problem: %s)' % (submission_id, problem_id)))

    def save_source(self, source_tree, file_path, source):
        if not os.path.isdir(source_tree):
            os.makedirs(source_tree)

        f = open(file_path, 'w')
        f.write(source)
        f.close()

    def idle(self):
        poll = self.option.poll()

        print(PRINT_FORMAT % ('Wait %d seconds... \n' % (poll)))
        time.sleep(poll)
        print(PRINT_FORMAT % ('Restart work'))


def set_options():
    if not os.path.isfile(DEFAULT_OPTION_FILE):
        sys.exit(ERROR_FORMAT % ('set_options', '%s not found' % (DEFAULT_OPTION_FILE)))
    
    try:
        option_info = json.loads(open(DEFAULT_OPTION_FILE, 'r').read())
    except json.decoder.JSONDecodeError as e:
        sys.exit(ERROR_FORMAT % ('set_options', e))

    return Option(option_info)

def login_boj():
    boj = BOJ()

    for i in range(3):        
        user_id = input('* BOJ id: ')
        user_password = getpass.getpass('* BOJ password: ')

        error, result = boj.login_boj(user_id, user_password)
        if error:
            print(PRINT_FORMAT % (result))
            continue
        
        print(PRINT_FORMAT % (result))
        return boj

    sys.exit(ERROR_FORMAT % ('login_boj', 'Login failed'))

def login_github():
    git = Git()
    
    for i in range(3):
        user_id = input('* GitHub id: ')
        user_password = getpass.getpass('* GitHub password: ')

        error, result = git.login_github(user_id, user_password)
        if error:
            print(PRINT_FORMAT % (result))
            continue

        print(PRINT_FORMAT % (result))
        repo_name = input('* Repository: ')
        git.set_repository(repo_name)
        return git
    
    sys.exit(ERROR_FORMAT % ('login_github', 'Login failed'))


if __name__ == '__main__':
    option = set_options()
    boj = login_boj()
    git = login_github()

    try:
        Main(boj, git, option).run()
    except KeyboardInterrupt:
        print('\n* bye\n')
