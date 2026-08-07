# Beginner Deployment Guide

You do not need to write code to submit this project.

## Part 1 — Check the prototype on your computer

1. Extract the ZIP file.
2. Open the folder named `taxflow-ai-prototype`.
3. Double-click `index.html`.
4. Confirm that the dashboard opens.
5. Use the small **?** guide in the bottom-right corner to test the main screens.

## Part 2 — Put the files on GitHub

1. Go to GitHub and sign in or create a free account.
2. Click **New repository**.
3. Repository name: `taxflow-ai-case-study`.
4. Choose **Public** unless the employer specifically requires a private repository.
5. Click **Create repository**.
6. On the repository page, choose **uploading an existing file**.
7. Drag all files from the extracted project folder into the upload area:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `README.md`
   - `WALKTHROUGH_SCRIPT.md`
   - `SUBMISSION_TEXT.txt`
   - `vercel.json`
   - `package.json`
8. Enter commit message: `Add TaxFlow AI case study prototype`.
9. Click **Commit changes**.

## Part 3 — Host it on Vercel

1. Go to Vercel and choose **Continue with GitHub**.
2. Select **Add New → Project**.
3. Find `taxflow-ai-case-study` and click **Import**.
4. Project Name: `taxflow-ai-case-study`.
5. Framework Preset: **Other**.
6. Build Command: leave empty.
7. Output Directory: leave empty or enter `.` only if required.
8. Click **Deploy**.
9. Wait for the confirmation screen.
10. Open the generated URL and test it.
11. Copy that URL. This is the working prototype link for your submission.

## Part 4 — Record the walkthrough

1. Open the deployed Vercel link in Chrome.
2. Use Loom, Zoom recording, OBS, or your operating system's screen recorder.
3. Close unrelated browser tabs and notifications.
4. Set browser zoom to 90% or 100%.
5. Follow `WALKTHROUGH_SCRIPT.md`.
6. Keep the video around 5–7 minutes.
7. Upload or share the video according to the recruiter's instructions.

## Part 5 — Final submission package

Submit:

- Hosted Vercel prototype URL
- Video walkthrough URL
- GitHub repository URL, when allowed
- The short note from `SUBMISSION_TEXT.txt`

## Troubleshooting

### The page is blank

Confirm `index.html`, `styles.css`, and `app.js` are in the same folder and were uploaded to the repository root.

### Vercel asks for a build command

Choose Framework Preset **Other** and leave the build command empty. This is a static site.

### A button appears not to save permanently

That is expected. The prototype uses in-memory mock state. Refreshing the page resets the demo data.

### You need to change your name

Search `app.js` for `Tejaswi Rao` and replace it with your exact name. Also replace the candidate name in the submission text.
