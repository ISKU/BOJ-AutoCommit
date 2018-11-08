import sys
import os
import subprocess


REPO_URL = 'https://github.com/%s/%s'
REMOTE_URL = 'https://%s:%s@github.com/%s/%s'


class Git:

    def __init__(self):
        self.user_id = None
        self.user_password = None
        self.repo_name = None
        self.pipe = subprocess.PIPE

    def login_github(self, user_id, user_password):
        self.user_id = user_id
        self.user_password = user_password
        return False, 'Login succeed'

    def set_repository(self, repo_name):
        self.repo_name = repo_name

    def get_repo_name(self):
        return self.repo_name

    def clone(self):
        if os.path.isdir(self.repo_name):
            return False, "Repository '%s' already exists." % (self.repo_name)

        repo_url = REPO_URL % (self.user_id, self.repo_name)
        command = ['git', 'clone', repo_url]

        proc = subprocess.Popen(command, stdout=self.pipe, stderr=self.pipe)
        stdout, stderr = proc.communicate()

        if not stdout is None:
            print(stdout.decode())
        if not stderr is None:
            print(stderr.decode())
        if proc.returncode != 0:
            return True, str(proc.returncode)

        return False, 'done'

    def pull(self):
        repo_url = REPO_URL % (self.user_id, self.repo_name)
        cwd = self.repo_name
        command = ['git', 'pull', repo_url]

        proc = subprocess.Popen(command, cwd=cwd, stdout=self.pipe, stderr=self.pipe)
        stdout, stderr = proc.communicate()
        
        if not stdout is None:
            print(stdout.decode())
        if not stderr is None:
            print(stderr.decode())
        if proc.returncode != 0:
            return True, str(proc.returncode)

        return False, 'done'

    def add(self, file_path):
        cwd = self.repo_name
        command = ['git', 'add', file_path]

        proc = subprocess.Popen(command, cwd=cwd, stdout=self.pipe, stderr=self.pipe)
        stdout, stderr = proc.communicate()
        
        if not stdout is None:
            print(stdout.decode())
        if not stderr is None:
            print(stderr.decode())
        if proc.returncode != 0:
            return True, str(proc.returncode)

        return False, 'done'

    def commit(self, commit_message):
        cwd = self.repo_name
        command = ['git', 'commit', '-m', commit_message]

        proc = subprocess.Popen(command, cwd=cwd, stdout=self.pipe, stderr=self.pipe)
        stdout, stderr = proc.communicate()
        
        if not stdout is None:
            print(stdout.decode())
        if not stderr is None:
            print(stderr.decode())
        if proc.returncode != 0:
            return True, str(proc.returncode)

        return False, 'done'

    def push(self, branch):
        cwd = self.repo_name
        remote_url = REMOTE_URL % (self.user_id, self.user_password, self.user_id, self.repo_name)
        command = ['git', 'push', remote_url, branch]

        proc = subprocess.Popen(command, cwd=cwd, stdout=self.pipe, stderr=self.pipe)
        stdout, stderr = proc.communicate()

        if proc.returncode != 0:
            return True, str(proc.returncode)

        return False, 'done'

    def all(self, file_path, commit_message):
        error, result = self.add(file_path)
        if error:
            return True, '%s: %s' % ('add', result)

        error, result = self.commit(commit_message)
        if error:
            return True, '%s: %s' % ('commit', result)

        error, result = self.push('master')
        if error:
            return True, '%s: %s' % ('push', result)

        return False, 'done'
