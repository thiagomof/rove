# Security Policy

## Supported Versions

Rove currently provides security fixes for supported `4.x` releases.  
Versions `3.x` and older are no longer supported with security updates.

| Version | Supported |
| ------- | --------- |
| `4.x` | :white_check_mark: |
| `main` branch snapshots / unreleased builds | :warning: Best effort only |
| `3.x` and older | :x: |

If you are unsure whether you are on a supported version, install the newest release from the [GitHub Releases page](https://github.com/thiagomof/rove/releases) before reporting the issue.

## Reporting a Vulnerability

Please do **not** open a public GitHub issue for suspected security vulnerabilities.

Use one of these private channels instead:

1. Open a private report through GitHub's **Security** tab using **Report a vulnerability**.
2. If private reporting is not available, email [contato@blueenergia.com](mailto:contato@blueenergia.com).

Please include:

- A clear description of the issue and the affected feature.
- The Rove version and operating system.
- Steps to reproduce the problem.
- Any proof-of-concept, logs, screenshots, or crash details that help confirm impact.
- Your assessment of impact, if known.

What to expect:

- We will try to acknowledge new reports within 7 days.
- We may ask for clarification or additional reproduction details.
- If the report is confirmed, we will work on a fix and may coordinate disclosure timing with you.
- If the report is out of scope or cannot be reproduced, we will explain why and close it.

## Scope

Security reports are especially helpful for issues involving:

- Remote code execution.
- Command injection or unsafe process execution.
- Path traversal or arbitrary file access.
- Credential, cookie, token, or personal data exposure.
- Update, installer, signing, or package integrity issues.

If you are not sure whether something qualifies as a security issue, report it privately first. We would rather triage a low-impact report privately than have a real vulnerability posted publicly by mistake.

General bugs, download failures, site extractor issues, and feature requests should go through the normal public issue tracker instead.
