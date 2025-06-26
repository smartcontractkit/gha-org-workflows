module.exports = async ({ github, context, core }) => {
  try {
    if (process.env.PR_DRAFT_NUDGE_COMMENT_DISABLE === "true") {
      core.info("PR draft nudge comment is disabled for this repository.");
      return;
    }

    const pr = context.payload.pull_request;

    if (!pr) {
      core.info("This action is only applicable to pull requests.");
      return;
    }

    // We only want to comment on PRs that are opened ready for review with reviewers.
    const hasIndividualReviewers = pr.requested_reviewers && pr.requested_reviewers.length > 0;
    const hasTeamReviewers = pr.requested_teams && pr.requested_teams.length > 0;

    // Debug reviewer information
    core.debug(`PR requested_reviewers: ${JSON.stringify(pr.requested_reviewers || [])}`);
    core.debug(`PR requested_teams: ${JSON.stringify(pr.requested_teams || [])}`);
    core.debug(`Has individual reviewers: ${hasIndividualReviewers}`);
    core.debug(`Has team reviewers: ${hasTeamReviewers}`);
    core.debug(`PR action: ${context.payload.action}`);
    core.debug(`PR is draft: ${pr.draft}`);

    if (context.payload.action !== "opened" || pr.draft || (!hasIndividualReviewers && !hasTeamReviewers)) {
      core.info('PR is a draft, has no reviewers (individual or team), or this is not an "opened" event. Skipping.');
      return;
    }

    const prCreator = pr.user.login;
    const commentIdentifier = "<!-- pr-draft-nudge-comment -->";
    const commentBody = `:wave: @${prCreator}, thanks for creating this pull request!\n\nTo help reviewers, please consider creating future PRs as drafts first. This allows you to self-review and make any final changes before notifying the team.\n\nOnce you're ready, you can mark it as "Ready for review" to request feedback. Thanks!\n\n${commentIdentifier}`;

    // Check if a comment with the identifier already exists
    const { data: comments } = await github.rest.issues.listComments({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: pr.number,
    });

    const existingComment = comments.find((comment) => comment.body.includes(commentIdentifier));

    if (existingComment) {
      core.info("A PR draft nudge comment already exists on this PR.");
      return;
    }

    // Create the comment
    await github.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: pr.number,
      body: commentBody,
    });

    core.info("Successfully posted PR draft nudge comment.");
  } catch (error) {
    core.setFailed(`Action failed with error: ${error.message}`);
  }
};
