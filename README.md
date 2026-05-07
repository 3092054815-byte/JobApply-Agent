# JobApply Agent

[![CI](https://github.com/3092054815-byte/JobApply-Agent/actions/workflows/ci.yml/badge.svg)](https://github.com/3092054815-byte/JobApply-Agent/actions/workflows/ci.yml)
[![Deploy GitHub Pages](https://github.com/3092054815-byte/JobApply-Agent/actions/workflows/pages.yml/badge.svg)](https://github.com/3092054815-byte/JobApply-Agent/actions/workflows/pages.yml)

JobApply Agent is a focused web demo for job application preparation. It turns a resume and target job description into a structured application package: match report, resume suggestions, cover letter, interview preparation, and follow-up checklist.

<details>
<summary>中文简介</summary>

JobApply Agent 是一个面向求职申请场景的 Web Demo。用户输入简历和目标岗位 JD 后，系统会生成一份结构化申请包，包括岗位匹配报告、简历优化建议、定制求职信、面试准备问题和投递跟进清单。

项目将求职申请流程拆成多个职责清晰的 Agent：JD 解析、简历分析、匹配推理、申请材料生成和面试准备。默认 mock 模式无需配置 API key，适合直接体验完整流程；可选本地 API 边界用于后续接入真实 LLM，并避免在浏览器前端暴露密钥。

更多中文项目说明见 [`docs/application-description.md`](docs/application-description.md)。

</details>

## What It Solves

Job seekers often need to read long job descriptions, identify relevant skills, adapt resume bullets, write cover letters, and prepare for interviews. JobApply Agent makes that workflow explicit and repeatable.

## Demo

Live demo: [https://3092054815-byte.github.io/JobApply-Agent/](https://3092054815-byte.github.io/JobApply-Agent/)

Run the project locally, click `Load sample`, then click `Generate package` to view the full workflow.

![JobApply Agent demo](docs/demo-screenshot.png)

## Agent Workflow

```mermaid
flowchart LR
  A["Resume + Job Description"] --> B["JD Parser Agent"]
  B --> C["Resume Analyzer Agent"]
  C --> D["Matching Agent"]
  D --> E["Material Writer Agent"]
  E --> F["Interview Coach Agent"]
  F --> G["Application Package"]
```

## Features

- Resume and job description input.
- One-click sample data for reviewers.
- Explainable match score.
- Covered skill and missing skill analysis.
- Truthful resume rewrite suggestions.
- Tailored cover letter.
- Interview questions and answer hints.
- Follow-up checklist.
- Mock mode that works without an API key.
- Optional local server boundary for real LLM mode.

## Run Locally

Use Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## Verify

```bash
npm test
npm run build
npm audit
```

## Optional Local API

```bash
cp .env.example .env
npm run server
```

The MVP keeps API keys on the local server side. The browser does not store provider keys.

## Example Files

- `examples/resume_sample.md`
- `examples/jd_sample.md`
- `examples/output_sample.json`

## Project Summary

For a Chinese project write-up, see [`docs/application-description.md`](docs/application-description.md).

## Project Structure

```text
src/
  agents/      Agent role modules
  components/  Demo interface
  lib/         Schemas, scoring, pipeline, API boundary
server/        Optional local API
examples/      Sample inputs and output
docs/          Architecture and Agent flow notes
```

## Ethical Design

The system does not fabricate experience. It helps users reframe real experience, identify gaps, and prepare honestly for applications.

## Future Work

- PDF and DOCX resume parsing.
- Export application packages to markdown or PDF.
- Interview answer practice with feedback.
- RAG over a user's portfolio and past projects.
- Job application tracking.
