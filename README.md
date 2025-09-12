# gha-org-workflows

Org-wide Github Actions (GHA) workflows for [smartcontractkit](https://github.com/smartcontractkit).

## Limitations

Org-wide rulesets have limitations.

1. Can only use events: `merge_queue`, `pull_request_target`, `pull_request`.
2. They will not run automatically if event is triggered by a CI's `GITHUB_TOKEN`
   * See https://docs.github.com/en/actions/concepts/security/github_token#when-github_token-triggers-workflow-runs
3. They can interfere with merge queues

## Workflows

### Go Mod Validation

Uses [`go-mod-validator`](https://github.com/smartcontractkit/.github/tree/main/apps/go-mod-validator) action.
*  For all go.mod files within a repository, filtered by a given prefix, this action validates that each dependency is on the default branch of the upstream repository.


### GHA Workflow Validator

Uses [`gha-workflow-validator`](https://github.com/smartcontractkit/.github/tree/main/actions/gha-workflow-validator) action.
* Validates changes to Github Actions workflows. Things like:
    * Ensuring 3rd-party Github Actions are pinned to SHA refs.
    * Checking for outdated dependencies.
    * Limiting usage of high-cost runners.

### CODEOWNERS Validation

Uses [patrickhuie19/codeowners-validator](https://github.com/patrickhuie19/codeowners-validator/) action.
* Validates the contents of a CODEOWNERS file when it is modified. Enforces certain criteria to ensure healthy CODEOWNERS.

### CODEOWNERS Enforcement

Enforces that every repository has a CODEOWNERS file.

### CODEOWNERS Review Analysis

Analyzes modified files, and current reviews to

## Help

If you are experiencing a blocking error from a workflow in this repository, please reach out to us on `#team-devex`.
