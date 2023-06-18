---
title: Auto-GPT Code Explanation
date: '2023-06-18'
tags: ['python', ]
draft: false
summary: Auto-GPT源码解析
---

## 什么是Auto-GPT

随着 chatGPT 的广泛应用，许多在 GitHub 上的项目也得到了关注。其中一个备受瞩目的项目是 **[Auto-GPT](https://github.com/Significant-Gravitas/Auto-GPT)**。在短短一个月内，它已经获得了 131K 的 star 和 26K 的 fork。

![Untitled](Auto-GPT%E6%98%AF%E5%92%8B%E5%86%99%E7%9A%84%EF%BC%88%E4%B8%8A%EF%BC%89%2012a0c776e30d4c4f9b944a371cdfb3df/Untitled.png)

首先，让我们来了解一下 Auto-GPT 。Auto-GPT 是一个实验性开源项目，使用 GPT-4 驱动，通过 chatGPT4 将 LLM (大规模语言模型)的各种想法串联起来，以实现你设定的任何目标。

Auto-GPT 根据以自然语言提供的目标，尝试将其分解为子任务，并使用自动化的方式通过互联网和其他工具来实现这些目标。

![Untitled](Auto-GPT%E6%98%AF%E5%92%8B%E5%86%99%E7%9A%84%EF%BC%88%E4%B8%8A%EF%BC%89%2012a0c776e30d4c4f9b944a371cdfb3df/Untitled%201.png)

# Auto-GPT的代码概览（版本：v0.2.1）

让我们来看一下 Auto-GPT 的源代码。

我们找到TA的main函数，只有50行，我们来逐行看看它都做了些什么。

首先，代码加载了一些配置，并检查 OpenAI 的密钥是否存在。然后，我们继续往下看，发现一个 prompt 的构建过程，目前我们不深入研究这个 prompt 的具体内容。随后，初始化了一些变量和一个内存对象。当前我们还不清楚这个内存对象的具体用途，暂时忽略它。接下来是 Auto-GPT 的核心逻辑：创建一个 AI agent，并开启一个循环（start loop）来处理任务。

![Untitled](Auto-GPT%E6%98%AF%E5%92%8B%E5%86%99%E7%9A%84%EF%BC%88%E4%B8%8A%EF%BC%89%2012a0c776e30d4c4f9b944a371cdfb3df/Untitled%202.png)

主要核心有三部分，prompt、memory、agent

我们来运行一下，首先指定了一些参数

```jsx
ai_name: 前端网页制作机器人
ai_role: 熟练使用js,css,html制作网站的介绍页面，擅长盲写代码，不借助任何编辑器
ai_goals:
	- 获取auto-gpt的相关数据
	- 将获取到的数据制作一个auto-gpt的介绍页面，要求为网页内容精简，层次清晰，编写过程不借助任何编辑器，并将其代码保存到本地
```

接下来，我们观察一下在运行过程中这三个核心部分发生了哪些变化。

## ****提示词（Prompt）****

我们可以看到代码生成了一个提示词，实际的 prompt 值为：

```jsx
You are 前端网页制作机器人, 熟练使用js,css,html制作网站的介绍页面，擅长盲写代码，不借助任何编辑器
Your decisions must always be made independently without seeking user assistance. Play to your strengths as an LLM and pursue simple strategies with no legal complications.

GOALS:

1. 获取auto-gpt的相关数据
2. 将获取到的数据制作一个auto-gpt的介绍页面，要求为网页内容精简，层次清晰，编写过程不借助任何编辑器，并将其代码保存到本地

Constraints:
1. ~4000 word limit for short term memory. Your short term memory is short, so immediately save important information to files.
2. If you are unsure how you previously did something or want to recall past events, thinking about similar events will help you remember.
3. No user assistance
4. Exclusively use the commands listed in double quotes e.g. "command name"

Commands:
1. Google Search: "google", args: "input": "<search>"
2. Browse Website: "browse_website", args: "url": "<url>", "question": "<what_you_want_to_find_on_website>"
3. Start GPT Agent: "start_agent", args: "name": "<name>", "task": "<short_task_desc>", "prompt": "<prompt>"
4. Message GPT Agent: "message_agent", args: "key": "<key>", "message": "<message>"
5. List GPT Agents: "list_agents", args: 
6. Delete GPT Agent: "delete_agent", args: "key": "<key>"
7. Clone Repository: "clone_repository", args: "repository_url": "<url>", "clone_path": "<directory>"
8. Write to file: "write_to_file", args: "file": "<file>", "text": "<text>"
9. Read file: "read_file", args: "file": "<file>"
10. Append to file: "append_to_file", args: "file": "<file>", "text": "<text>"
11. Delete file: "delete_file", args: "file": "<file>"
12. Search Files: "search_files", args: "directory": "<directory>"
13. Evaluate Code: "evaluate_code", args: "code": "<full_code_string>"
14. Get Improved Code: "improve_code", args: "suggestions": "<list_of_suggestions>", "code": "<full_code_string>"
15. Write Tests: "write_tests", args: "code": "<full_code_string>", "focus": "<list_of_focus_areas>"
16. Execute Python File: "execute_python_file", args: "file": "<file>"
17. Generate Image: "generate_image", args: "prompt": "<prompt>"
18. Send Tweet: "send_tweet", args: "text": "<text>"
19. Convert Audio to text: "read_audio_from_file", args: "file": "<file>"
20. Do Nothing: "do_nothing", args: 
21. Task Complete (Shutdown): "task_complete", args: "reason": "<reason>"

Resources:
1. Internet access for searches and information gathering.
2. Long Term memory management.
3. GPT-3.5 powered Agents for delegation of simple tasks.
4. File output.

Performance Evaluation:
1. Continuously review and analyze your actions to ensure you are performing to the best of your abilities.
2. Constructively self-criticize your big-picture behavior constantly.
3. Reflect on past decisions and strategies to refine your approach.
4. Every command has a cost, so be smart and efficient. Aim to complete tasks in the least number of steps.

You should only respond in JSON format as described below 
Response Format: 
{
    "thoughts": {
        "text": "thought",
        "reasoning": "reasoning",
        "plan": "- short bulleted\n- list that conveys\n- long-term plan",
        "criticism": "constructive self-criticism",
        "speak": "thoughts summary to say to user"
    },
    "command": {
        "name": "command name",
        "args": {
            "arg name": "value"
        }
    }
} 
Ensure the response can be parsed by Python json.loads
```

翻译成中文就是

```jsx
你是 前端网页制作机器人, 熟练使用js,css,html制作网站的介绍页面，擅长盲写代码，不借助任何编辑器
你的决定必须始终是独立做出的，不需要寻求用户的帮助。发挥你作为大规模语言模型的优势，追求简单的策略，没有法律上的复杂问题。

目标：

1. 获取auto-gpt的相关数据
2. 将获取到的数据制作一个auto-gpt的介绍页面，要求为网页内容精简，层次清晰，编写过程不借助任何编辑器，并将其代码保存到本地

限制条件：
1. 短期记忆的字数限制为4000字。你的短期记忆很短，所以要立即将重要信息保存到文件中。
2. 如果你不确定你以前是怎么做的，或者想回忆过去的事件，思考类似的事件会帮助你记忆。
3. 没有用户协助。
4. 只使用双引号中列出的命令，例如："命令名称"

命令：
1. 谷歌搜索： "google", args: "input"： "<搜索>"
2. 浏览网站： "browse_website", args: "url"： "<url>", "问题"： "<what_you_want_to_find_on_website>"
3. 启动GPT代理： "start_agent", args: "name"： "<名称>", "任务"： "<short_task_desc>", "提示"： "<prompt>"
4. 消息GPT代理： "message_agent", args: "key"： "<key>", "message"： "<message>"
5. 列出GPT代理： "list_agents", args： 
6. 删除GPT代理： "delete_agent", args: "key"： "<key>"
7. Clone Repository： "clone_repository", args: "repository_url"： "<url>", "clone_path"： "<directory>"
8. 写入文件： "write_to_file", args: "file"： "<文件>", "文本"： "<文本>"
9. 读取文件： "read_file", args: "file"： "<文件>"
10. 追加到文件： "append_to_file", args: "file"： "<文件>", "文本"： "<文本>"
11. 删除文件： "delete_file", args: "file"： "<文件>"
12. 搜索文件： "search_files", args: "directory"： "<目录>"
13. 评估代码： "evaluate_code", args: "code"： "<full_code_string>"
14. 获得改进的代码： "improve_code", args: "建议"： "<list_of_suggestions>", "code"： "<full_code_string>"
15. 写测试： "write_tests", args: "code"： "<full_code_string>", "focus"： "<list_of_focus_areas>"
16. 执行Python文件："execute_python_file", args: "file"： "<文件>"
17. 生成图像： "generate_image", args: "prompt"： "<prompt>"
18. 发送Twitter： "send_tweet", args: "text"： "<文本>"
19. 将音频转换为文本： "read_audio_from_file", args: "file"： "<文件>"
20. 不做任何事情："do_nothing", args： 
21. 任务完成（关闭）： "task_complete", args: "reason"： "<reason>"

资源：
1. 用于搜索和收集信息的互联网接入。
2. 长期内存管理。
3. GPT-3.5驱动的代理，用于委托简单任务。
4. 文件输出。

性能评估：
1. 不断审查和分析你的行动，以确保你的表现是最好的。
2. 不断对自己的大局观进行建设性的自我批判。
3. 对过去的决定和策略进行反思，以完善你的方法。
4. 每个命令都有成本，所以要聪明和高效。争取用最少的步骤完成任务。

你应该只以JSON格式响应，如下所述 
响应格式： 
{
    "thoughts"： {
        "text"： "想法",
        "reasoning"： "推理",
        "plan"： "简短的项目符号 - 传达长期计划的列表",
        "criticism"： "建设性的自我批评",
        "speak"： "要对用户说的总结"
    },
    "command"： {
        "name"： "命令名称",
        "args"： {
            "arg name"： "值"
        }
    }
} 
确保响应可以被Python的json.loads方法解析
```

## ****Memory（内存）****

初始化了一个存储对象，如果没有配置任何数据库设置，会使用默认选项，将本地文件作为存储。目前还不清楚它的具体用途。

## ****Agent（代理）****

初始化了一个代理对象后，开启了一个循环。接下来，我们来看一下循环内部的代码逻辑。

![Untitled](Auto-GPT%E6%98%AF%E5%92%8B%E5%86%99%E7%9A%84%EF%BC%88%E4%B8%8A%EF%BC%89%2012a0c776e30d4c4f9b944a371cdfb3df/Untitled%203.png)

主要核心也有三部分，chat、command、memory

### ****Chat（对话）****

将我们之间构建好的参数传递给 chatGPT，并获取 chatGPT 的返回值。我们可以看到 **`assistant_reply`** 的具体值为：

```jsx
{
    "thoughts": {
        "text": "I think I should start by searching for information about auto-gpt to get a better understanding of what it is and how it works.",
        "reasoning": "I need to gather information before I can start creating the introduction page.",
        "plan": "- Use the 'google' command to search for information about auto-gpt.\n- Save important information to files to avoid exceeding my short term memory limit.\n- Once I have enough information, I can start creating the introduction page.",
        "criticism": "I need to make sure I don't spend too much time on research and get started on creating the introduction page as soon as I have enough information.",
        "speak": "I will start by searching for information about auto-gpt using the 'google' command."
    },
    "command": {
        "name": "google",
        "args": {
            "input": "auto-gpt"
        }
    }
}
```

翻译成中文

```jsx
{
    "thoughts"： {
        "text"： "我想我应该从搜索有关auto-gpt的信息开始，以便更好地了解它是什么以及它是如何工作的。",
        "reasoning"： "我需要在开始创建介绍页之前收集信息。",
        "plan"： "- 使用'google'命令搜索关于auto-gpt的信息。（n- 将重要信息保存到文件中，以避免超过我的短期记忆极限。（n- 一旦我有足够的信息，我就可以开始创建介绍页。",
        "criticism"： "我需要确保不在搜索上花费太多时间，一旦我有足够的信息，就开始创建介绍页。",
        "speak"： "我将从使用'google'命令搜索关于auto-gpt的信息开始。"
    },
    "command"： {
        "name"： "google",
        "args"： {
            "input"： "auto-gpt"
        }
    }
}
```

可以看到TA在里边说明了TA是如何思考的，以及TA接下来需要执行哪些指令

TA表示想通过Google搜索一下auto-gpt的相关信息

### ****Command（命令）****

解析返回值中的命令，并调用相应的函数执行器。所有的命令都可以在 Auto-GPT 的 **`commands`** 目录下找到。

TA找到google指令对应的代码进行执行，并获取其返回值

### ****Memory（内存）****

```jsx
Assistant Reply: {
    "thoughts": {
        "text": "I think I should start by searching for information about auto-gpt to get a better understanding of what it is and how it works.",
        "reasoning": "I need to gather information before I can start creating the introduction page.",
        "plan": "- Use the 'google' command to search for information about auto-gpt.\n- Save important information to files to avoid exceeding my short term memory limit.\n- Once I have enough information, I can start creating the introduction page.",
        "criticism": "I need to make sure I don't spend too much time on research and get started on creating the introduction page as soon as I have enough information.",
        "speak": "I will start by searching for information about auto-gpt using the 'google' command."
    },
    "command": {
        "name": "google",
        "args": {
            "input": "auto-gpt"
        }
    }
} 
Result: Command google returned: b'[\n    {\n        "title": "Auto-GPT - The next evolution of data driven Chat AI",\n        "href": "https://auto-gpt.ai/",\n        "body": "Auto-GPT is a cutting-edge web service that combines the power of GPT4 with multiple data sources to provide unprecedented language generation capabilities. With Auto-GPT, you can effortlessly generate high-quality text that is both accurate and relevant to your needs."\n    },\n    {\n        "title": "Auto-GPT: An Autonomous GPT-4 Experiment - GitHub",\n        "href": "https://github.com/Significant-Gravitas/Auto-GPT",\n        "body": "Auto-GPT is an experimental open-source application showcasing the capabilities of the GPT-4 language model. This program, driven by GPT-4, chains together LLM \\"thoughts\\", to autonomously achieve whatever goal you set. As one of the first examples of GPT-4 running fully autonomously, Auto-GPT pushes the boundaries of what is possible with AI. ..."\n    },\n    {\n        "title": "Auto-GPT - Wikipedia",\n        "href": "https://en.wikipedia.org/wiki/Auto-GPT",\n        "body": "Auto-GPT is an \\"AI agent\\" that given a goal in natural language, will attempt to achieve it by breaking it into sub-tasks and using the internet and other tools in an automatic loop. It uses OpenAI \'s GPT-4 or GPT-3.5 APIs , [2] and is among the first examples of an application using GPT-4 to perform autonomous tasks."\n    },\n    {\n        "title": "Auto-GPT: An Autonomous GPT-4 Experiment - GitHub",\n        "href": "https://github.com/antony0596/Auto-GPT",\n        "body": "Auto-GPT is an experimental open-source application showcasing the capabilities of the GPT-4 language model. This program, driven by GPT-4, autonomously develops and manages businesses to increase net worth. As one of the first examples of GPT-4 running fully autonomously, Auto-GPT pushes the boundaries of what is possible with AI. ..."\n    },\n    {\n        "title": "How to Download and Install Auto-GPT Step-by-Step - MUO",\n        "href": "https://www.makeuseof.com/how-to-download-install-auto-gpt-step-by-step/",\n        "body": "The Future of Auto-GPT . There are two reasons why Auto-GPT isn\'t as powerful as it should be. The first is that it\'s still in development\xe2\x80\x94more features and tweaking must be added to make Auto-GPT function as intended. The second is that GPT-3.5 wasn\'t meant to power Auto-GPT."\n    },\n    {\n        "title": "How To Create Your Own Auto-GPT AI Agent | Tom\'s Hardware",\n        "href": "https://www.tomshardware.com/how-to/auto-gpt-ai-agent",\n        "body": "Creating an Auto-GPT AI Agent. 1. Download and install git. When prompted to select a text editor, select the most appropriate editor. I chose to use Notepad++. All other choices can be kept at ..."\n    },\n    {\n        "title": "Auto-GPT is a new AI that does the work for you - Tom\'s Guide",\n        "href": "https://www.tomsguide.com/news/auto-gpt",\n        "body": "Auto-GPT is a variant of ChatGPT developed by Significant Gravitas and it uses the ChatGPT API to work. Specifically, Auto-GPT utilizes the GPT-4 API, though it seems like it should work with the ..."\n    },\n    {\n        "title": "How to Install and Use Auto-GPT: An Autonomous AI Tool",\n        "href": "https://beebom.com/how-install-and-use-auto-gpt-ai-tool/",\n        "body": "Auto-GPT Alternative: Automate Tasks With AgentGPT (Easy Solution) If you don\'t want to set up Auto-GPT locally and want an easy-to-use solution to automate and deploy tasks, you can use AgentGPT. It\'s built on Auto-GPT, but you can access it directly in a browser. No need to fiddle with the Terminal and commands. Here is how it works. 1."\n    }\n]' 
Human Feedback: GENERATE NEXT COMMAND JSON
```

将 chatGPT 返回的响应以及执行命令后获取的返回值存储到内存中。

同时，我们也能看到命令执行的结果，即 **`Command google`** 返回的值。

经过第一轮命令执行，Auto-GPT 搜索到了与 Auto-GPT 相关的内容，下一步是开始编写代码，即开始下一轮的循环，并最终输出完整的结果。

在进入下一轮循环时，有一些不同之处。Auto-GPT 需要读取内存中存储的数据，并将其整合到下一步循环的提示词中，生成新的返回值，直到任务完成。

## 回顾

在之前的部分，我们简要地了解了 Auto-GPT 的目录结构，并对其执行流程有了大致的了解。

实际上，整个流程可以概括为以下几个步骤：构建一个特殊的提示词，将提示词传递给 GPT，获取 GPT 的返回值，并从返回值中解析出对应的执行指令，最后执行相应的命令。

然而，在这个简单的流程中，Auto-GPT 还隐藏着一些关键的技术细节。

### 提示词是如何构建的？

让我们先来看一下 Auto-GPT 的提示词。

赋予角色

```jsx
你是 前端网页制作机器人, 熟练使用js,css,html制作网站的介绍页面，擅长盲写代码，不借助任何编辑器
你的决定必须始终是独立做出的，不需要寻求用户的帮助。发挥你作为大规模语言模型的优势，追求简单的策略，没有法律上的复杂问题。
```

指定返回结果内容

```jsx
只使用双引号中列出的命令，例如："命令名称"

命令：
1. 谷歌搜索： "google", args: "input"： "<搜索>"
2. 浏览网站： "browse_website", args: "url"： "<url>", "问题"： "<what_you_want_to_find_on_website>"
3. 启动GPT代理： "start_agent", args: "name"： "<名称>", "任务"： "<short_task_desc>", "提示"： "<prompt>"
4. 消息GPT代理： "message_agent", args: "key"： "<key>", "message"： "<message>"
...
```

要求模型进行自我审查评估

```jsx
性能评估：
1. 不断审查和分析你的行动，以确保你的表现是最好的。
2. 不断对自己的大局观进行建设性的自我批判。
3. 对过去的决定和策略进行反思，以完善你的方法。
4. 每个命令都有成本，所以要聪明和高效。争取用最少的步骤完成任务。
```

要求一个结构化的输出，JSON等格式

```jsx
你应该只以JSON格式响应，如下所述 
响应格式： 
{
    "thoughts"： {
        "text"： "想法",
        "reasoning"： "推理",
        "plan"： "简短的项目符号 - 传达长期计划的列表",
        "criticism"： "建设性的自我批评",
        "speak"： "要对用户说的总结"
    },
    "command"： {
        "name"： "命令名称",
        "args"： {
            "arg name"： "值"
        }
    }
} 
确保响应可以被Python的json.loads方法解析
```

提示词参考资料：

[https://github.com/datawhalechina/prompt-engineering-for-developers](https://github.com/datawhalechina/prompt-engineering-for-developers)

[Prompt Engineering Roadmap - roadmap.sh](https://roadmap.sh/prompt-engineering)

这些资料提供了关于如何构建有效提示词的指导和技巧。Auto-GPT 的提示词构建过程经过了精心设计，以确保能够引导 GPT 生成准确和有用的回复。

### 上下文记忆是怎么获取的?

Auto-GPT 获取历史消息记录的嵌入向量（embedding），并通过对比相似度对其进行排序，以获取最相关的数据。

在这个过程中，使用的模型是 text-embedding-ada-002。这个模型可以将文本转换为向量表示，并且通过计算向量之间的相似度来判断它们的相关性。通过获取与当前任务最相关的历史消息记录，Auto-GPT 可以更好地理解上下文并生成更准确的回复。

![Untitled](Auto-GPT%E6%98%AF%E5%92%8B%E5%86%99%E7%9A%84%EF%BC%88%E4%B8%8A%EF%BC%89%2012a0c776e30d4c4f9b944a371cdfb3df/Untitled%204.png)

### Token长度是如何限制的？

在使用 GPT 进行文本生成时，需要限制输入的文本长度，以确保能够在模型的限制范围内进行处理。

Auto-GPT 通过调用相应模型的接口来获取内容所占用的 Token 长度。当输入的文本超过模型的最大 Token 长度时，Auto-GPT 会采取一些策略，例如移除最不相关的上下文，以保持在模型可处理的范围内。

通过解决这些关键问题，Auto-GPT 实现了更高效、准确和可控的文本生成能力。

![Untitled](Auto-GPT%E6%98%AF%E5%92%8B%E5%86%99%E7%9A%84%EF%BC%88%E4%B8%8A%EF%BC%89%2012a0c776e30d4c4f9b944a371cdfb3df/Untitled%205.png)