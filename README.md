BOJ-AutoCommit
==========
[![](https://d2gd6pc034wcta.cloudfront.net/images/logo.png)](https://www.acmicpc.net)
----------
 `BOJ-AutoCommit`은 [Baekjoon Online Judge](https://www.acmicpc.net)(이하 BOJ)의 다양한 알고리즘 문제를 풀어서 제출하고 정답을 맞추면 [Github](https://github.com)와 같은 원격저장소에 Source Code를 Push합니다. 일정한 시간마다 BOJ에서 사용자의 ID를 이용하여 정답을 맞춘 문제들을 검색 및 분석하고, Local Repository에 해당 문제 파일이 존재하지 않으면 Source Code를 다운로드 받아 Local Repository에 저장함과 동시에 `Git`을 사용하여 Add, Commit 그리고 Push를 자동으로 하며, `Python3`을 기반으로 만들어졌습니다.

Installation
----------
```
$ git clone https://github.com/ISKU/BOJ-AutoCommit
```

**Dependency**
```
$ pip3 install requests
$ pip3 install bs4
```
- [Git](https://git-scm.com/)

How to use
----------
- 다음과 같이 Tool을 실행하여, 올바른 정보를 입력합니다.
```
$ python3 main.py
```

- Tool 실행시 다음과 같이 BOJ의 회원 정보와 GitHub의 회원 정보 및 Repository 이름을 입력하여야 합니다.

| **Input**            | **Description**
|:---------------------|:-------------------------------------------------
| **BOJ id**           | BOJ에서 사용하는 ID를 입력합니다.
| **BOJ password**     | 로그인을 위해 BOJ의 비밀번호를 입력합니다.
| **GitHub id**        | GitHub에서 사용하는 ID를 입력합니다.
| **GitHub password**  | 로그인을 위해 GitHub의 비밀번호를 입력합니다.
| **Repository**       | Source Code를 Push할 원격저장소의 Repository의 이름을 입력합니다.

- 이 Tool은 대기하고 있는 시간이 길기 때문에 다음과 같이 Background에서 실행을 권장합니다.
```
$ nohup python3 main.py &
```

Default
----------
- 문제번호로 Directory를 생성 한 후, 하위에 문제번호를 제목으로 Source Code 파일이 저장됩니다.
- Commit Message는 기본적으로 **"BOJ #문제번호"** 입니다.
- 약 **10분**마다 맞았던 문제를 검색하고 새롭게 맞은 문제가 있으면 원격저장에 Push합니다.
- 정답을 맞춘 가장 **최근 20개**의 문제에 대해서만 분석하며, 정답을 맞춘 **모든 문제를 다루지는 않습니다.**
- 정답을 맞춘 문제가 여러가지가 있을 경우 가장 **마지막에 제출한 Source Code**를 선택합니다.

Extension
----------
- Tool을 확장하여 자유롭게 자신의 원격저장소를 관리할 수 있습니다.
- option.json에 다음 예제와 같이 원하는 Option을 설정하세요.

``` json
{	
	"commit_message": "[NO]번 [TITLE] 문제풀이",
	"source_tree": "Algorithm/BOJ/Src",
	"dir_name": "[NO]",
	"mkdir": true,
	"private": true,
	"poll": 1800,
	"source_name": "[NO]",
	"lang": "Java"
}
```
> :bulb: 사용하지 않는 Option은 반드시 지워야 합니다.

**Key Options:**

| **Key**            | **Description**
|:-------------------|:-------------------------------------------------
| **commit_message** | Commit 내용을 지정합니다.
| **source_tree**    | 원하는 위치에 Source를 저장합니다. (시작 Directory는 Repository 이름과 일치하여야 합니다.)
| **dir_name**       | Source가 저장 되는 Directory의 이름을 지정합니다. 
| **mkdir**          | Source가 저장 될 때 Directory를 생성 할 것인지를 결정합니다.(false: dir_name은 무시됩니다.)
| **private**        | BOJ에서 Source를 비공개로 설정하면 해당 문제는 무시됩니다.
| **poll**           | BOJ의 맞은 문제를 검색하는 주기를 초 단위로 설정합니다. (최소 5분 이상이여야 합니다.)
| **source_name**    | Source 파일의 이름을 설정합니다. [NO]를 사용하여 문제번호로 저장하는 것을 추천합니다.
| **lang**           | 해당 언어로 제출한 Source만 원격저장소에 Push합니다.

> :bulb: [NO]: 내용에 [NO]가 있으면 문제의 번호로 대체됩니다. <br>
> :bulb: [TITLE]: 내용에 [TITLE]이 있으면 문제의 제목으로 대체됩니다. 

Example
----------
- https://github.com/ISKU/Algorithm
- 위 Repository는 [BOJ-AutoCommit](https://github.com/ISKU/BOJ-AutoCommit)을 사용하여 Source Code를 관리하고 있으며 사용하고 있는 Option은 다음과 같습니다.

``` json
{
	"commit_message": "BOJ #[NO]: [TITLE]",
	"source_tree": "Algorithm/BOJ",
	"private": true,
	"poll": 1800,
	"source_name": "Main",
	"lang": "Java"
}
```

License
----------
> - [MIT](LICENSE)

Author
----------
> - Minho Kim ([ISKU](https://github.com/ISKU))
> - https://www.acmicpc.net/user/isku
> - **E-mail:** minho.kim093@gmail.com
