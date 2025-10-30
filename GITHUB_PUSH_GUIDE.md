# 🚀 Push to GitHub — Quick Guide

Your code is ready! Here's how to push it to GitHub.

---

## Step 1: Create a GitHub Repository

1. Go to **[github.com](https://github.com)** and sign in (or create an account)
2. Click **+** (top right) → **New repository**
3. Name it: `LearnLink`
4. Add description: *"Study Resource Sharing Platform"*
5. Choose **Public** (so others can see it) or **Private** (only you)
6. Click **Create repository**

---

## Step 2: Connect Local Repo to GitHub

After creating the repository, GitHub will show you commands. Run these in your terminal:

```bash
# From your LearnLink project directory
cd /Users/ujjwalchoraria/Desktop/LearnLink

# Set your GitHub username and email (if not already set)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Add the remote (replace <username> with your GitHub username)
git remote add origin https://github.com/<username>/LearnLink.git

# Rename main branch to match GitHub default
git branch -M main

# Push your code to GitHub
git push -u origin main
```

---

## Step 3: Verify on GitHub

1. Go to `https://github.com/<your-username>/LearnLink`
2. You should see all your files!

---

## Future Commits (from now on)

After making changes locally:

```bash
# See what changed
git status

# Add all changes
git add .

# Commit with a message
git commit -m "Describe what you changed"

# Push to GitHub
git push
```

---

## Sharing with Others

Share the repository link:
```
https://github.com/<your-username>/LearnLink
```

Others can clone it with:
```bash
git clone https://github.com/<your-username>/LearnLink.git
cd LearnLink
# Then follow RUN_ON_NEW_COMPUTER.md
```

---

## Files Tracked in Git

All important files are included:
- ✅ Frontend source code (React, TypeScript)
- ✅ Backend source code (Django, Python)
- ✅ Configuration files
- ✅ Documentation
- ❌ `node_modules/` (excluded by .gitignore)
- ❌ `backend_django/venv/` (excluded by .gitignore)
- ❌ `db.sqlite3` (excluded by .gitignore)

These excluded directories are automatically recreated when setting up on a new machine.

---

## Done! 🎉

Your LearnLink project is now on GitHub and ready to share!
