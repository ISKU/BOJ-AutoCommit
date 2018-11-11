DEFAULT_COMMIT_MESSAGE = 'BOJ #[NO]'
DEFAULT_DIR_NAME = '[NO]'
DEFAULT_POLL = 600
DEFAULT_SOURCE_NAME = '[NO]'


class Option:

    def __init__(self, option):
        self.option = option

    def commit_message(self, problem):
        if not 'commit_message' in self.option:
            return self.replace_msg(DEFAULT_COMMIT_MESSAGE, problem)

        return self.replace_msg(self.option['commit_message'], problem)

    def source_tree(self, problem, repo_name):
        if not 'source_tree' in self.option:
            if self.mkdir():
                return '%s/%s' % (repo_name, self.dir_name(problem))
            return '%s' % self.repo_name

        if self.option['source_tree'][-1] == '/':
            if self.mkdir():
                return '%s%s' % (self.option['source_tree'], self.dir_name(problem))
            return '%s' % self.option['source_tree'][:-1]

        if self.mkdir():
            return '%s/%s' % (self.option['source_tree'], self.dir_name(problem))
        return '%s' % self.option['source_tree']

    def dir_name(self, problem):
        if not 'dir_name' in self.option:
            return self.replace_msg(DEFAULT_DIR_NAME, problem)

        return self.replace_msg(self.option['dir_name'], problem)

    def mkdir(self):
        if not 'mkdir' in self.option:
            return True

        return self.option['mkdir']

    def private(self):
        if not 'private' in self.option:
            return False

        return self.option['private']

    def poll(self):
        if not 'poll' in self.option:
            return DEFAULT_POLL

        return self.option['poll']

    def source_name(self, problem):
        if not 'source_name' in self.option:
            return self.replace_msg(DEFAULT_SOURCE_NAME, problem)

        return self.replace_msg(self.option['source_name'], problem)
    
    def lang(self, problem):
        if not 'lang' in self.option:
            return False, None
        if problem['language'] != self.option['lang']:
            return True, False

        return True, True

    def replace_msg(self, msg, problem):
        msg = msg.replace('[NO]', problem['problem_id'])
        msg = msg.replace('[TITLE]', problem['problem_title'])
        return msg

    def get_ext(self, language):
        extensions = {
            'C': '.c',
            'C++': '.cpp',
            'C++11': '.cpp',
            'C++14': '.cpp',
            'C++17': '.cpp',
            'Java': '.java',
            'Java (OpenJDK)': '.java',
            'C11': '.c',
            'Python 2': '.py',
            'Python 3': '.py',
            'PyPy2': '.py',
            'PyPy3': '.py',
            'Ruby2.5': '.rb',
            'Kotlin': '.kt',
            'Swift': '.swift',
            'C# 6.0': '.cs',
            'Text': '.txt',
            'node.js': 'js',
            'Go': '.go',
            'F#': '.fs',
            'PHP': '.php',
            'Pascal': '.pas',
            'Lua': '.lua',
            'Perl': '.pl',
            'Objective-C': '.m',
            'Objective-C++': '.mm',
            'C (Clang)': '.c',
            'C++11 (Clang)': '.cpp',
            'C++14 (Clang)': '.cpp',
            'C++17 (Clang)': '.cpp',
            'Golfscript': '.gs',
            'Bash': '.sh',
            'Fortran': '.f95',
            'Scheme': '.scm',
            'Ada': '.ada',
            'awk': '.awk',
            'OCaml': '.ml',
            'Brainfuck': '.bf',
            'Whitespace': '.ws',
            'Tcl': '.tcl',
            'Assembly (32bit)': '.asm',
            'Assembly (32bit)': '.asm',
            'D': '.d',
            'Clojure': '.clj',
            'Rhino': '.js',
            'Cobol': '.cob',
            'SpiderMonkey': '.js',
            'Pike': '.pike',
            'sed': '.sed',
            'Rust': '.rs',
            'Boo': '.boo',
            'Intercal': '.i',
            'bc': '.bc',
            'Nemerle': '.n',
            'Cobra': '.cobra',
            'Algol 68': '.a68',
            'Befunge': '.bf',
            'Haxe': '.hx',
            'LOLCODE': '.lol',
            'VB.NET 4.0': '.vb',
            '아희': '.aheui'
        }
        
        if not language in extensions:
            return True, 'Unknown language'
        return False, extensions[language]
