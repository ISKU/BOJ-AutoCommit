BOJ-AutoCommit
==========
[![](https://d2gd6pc034wcta.cloudfront.net/images/logo.png)](https://www.acmicpc.net)
----------
 `BOJ-AutoCommit`은 [Baekjoon Online Judge](https://www.acmicpc.net)의 다양한 알고리즘 문제를 풀어서 제출하고 정답을 맞추면 [Github](https://github.com) 또는 [Bitbucket](https://bitbucket.org)과 같은 원격저장소에 Source Code를 Push합니다. 일정한 시간마다 `CasperJS`를 사용하여 BOJ에서 ID로 정답을 맞춘 문제들을 검색 및 분석하여, Repository에 해당 문제 파일이 존재하지 않으면 Source Code를 다운로드 받아 Local Repository에 저장함과 동시에 `Git`을 사용하여 Add, Commit 그리고 Push 를 자동으로 하며, `Node.js`를 기반으로 만들어졌습니다.

Installation
----------
``` bash
$ git clone https://github.com/ISKU/BOJ-AutoCommit
```

**Dependency**
``` bash
$ sudo apt-get install phantomjs
$ npm install -g casperjs
```

> - [Node.js](http://nodejs.org)
> - [Git](https://git-scm.com/)
> - [CasperJS](http://casperjs.org/) 는 [PhantomJS](http://phantomjs.org/)를 필요로 합니다.

How to use
----------
info.json에 BOJ의 회원 정보와, 원격저장소의 회원 정보 및 URL을 입력하여야 합니다.
``` json
{
	"boj_id": "my_boj_id",
	"boj_password": "my_boj_password",
	"git_id": "my_github_id",
	"git_password": "my_github_password",
	"remoteUrl": "https://github.com/ISKU/Algorithm"
}
```

반드시 info.json에 올바른 정보를 입력하고 다음 두가지 방법으로 Tool을 실행합니다.
``` bash
$ node app.js info.json
$ ./app.js info.json
```

이 Tool은 대기하고 있는 시간이 길기 때문에 다음과 같이 Background에서 실행을 권장합니다.
``` bash
$ nohup node app.js info.json &
```

Default
----------
> - 문제번호로 Directory를 생성 한 후, 하위에 문제번호를 제목으로 Source Code 파일이 저장됩니다.
> - Commit Message는 기본적으로 "https://www.acmicpc.net/problem/문제번호" 입니다.
> - 약 10분마다 맞았던 문제를 검색하고 새롭게 맞은 문제가 있으면 원격저장소에 Push합니다.
> - 정답을 맞춘 가장 최근 20개의 문제에 대해서만 분석하며, 정답을 맞춘 모든 문제를 다루지는 않습니다.
> - 정답을 맞춘 문제가 여러가지가 있을 경우 가장 마지막에 제출한 Source Code를 선택합니다.

Extension
----------
> - Tool을 확장하여 자유롭게 자신의 원격저장소를 관리할 수 있습니다.
> - info.json에 다음 예제와 같이 원하는 Option을 설정하세요.

``` json
{
	"boj_id": "my_boj_id",
	"boj_password": "my_boj_password",
	"git_id": "my_github_id",
	"git_password": "my_github_password",
	"remoteUrl": "https://github.com/ISKU/Algorithm",
	
	"commitMessage": "[NO]번 Source Code 문제풀이",
	"sourceTree": "Algorithm/BOJ/Src",
	"dirName": "[NO]",
	"mkdir": true,
	"private": true,
	"poll": 60000,
	"sourceName": "[NO]"
}
```

**Key Options:**

| **Key**            | **Description**
|:-------------------|:-------------------------------------------------
| **commitMessage**  | Commit 내용을 지정합니다.
| **sourceTree**     | 원하는 위치에 Source를 저장합니다. (시작 Directory는 Repository 이름과 일치하여야 합니다.)
| **dirName**        | Source가 저장 되는 Directory의 이름을 지정합니다. 
| **mkdir**          | Source가 저장 될 때 Directory를 생성 할 것인지를 결정합니다. (false: dirName Option은 무시됩니다.)
| **private**        | BOJ에서 Source를 비공개로 설정하면 해당 문제는 무시됩니다.
| **poll**           | BOJ의 맞은 문제를 검색하는 주기를 Millisecond 단위로 설정합니다. (최소 5분 이상이여야 합니다.)
| **sourceName**     | Source 파일의 이름을 설정합니다. [NO]를 사용하여 문제번호로 저장하는 것을 추천합니다.

> :bulb: [NO]: Option의 내용에 [NO]가 있으면 문제번호로 Replace 됩니다.

Example
----------
> - https://github.com/ISKU/Algorithm
> - 위 Repository는 [BOJ-AutoCommit](https://github.com/ISKU/BOJ-AutoCommit)을 사용하여 Source Code를 관리하고 있으며 사용한 Option은 다음과 같습니다.

``` json
{
	"boj_id": "my_boj_id",
	"boj_password": "my_boj_password",
	"git_id": "my_github_id",
	"git_password": "my_github_password",
	"remoteUrl": "https://github.com/ISKU/Algorithm",
	
	"commitMessage": "https://www.acmicpc.net/problem/[NO]",
	"private": true,
	"poll": 30000,
	"sourceName": "Main"
}
```

License
----------
> - [MIT](LICENSE)

Author
----------
> - Minho Kim ([ISKU](https://github.com/ISKU))
> - https://www.acmicpc.net/user/isku
> - **E-mail:** minho1a@hanmail.net
