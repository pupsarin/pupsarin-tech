# Deployment Guide

This document explains how the GitHub Actions workflow is set up for automatic deployment to GitHub Pages.

## 🚀 Deployment Workflow

### UAT Deployment
- **Trigger**: Push to `uat` branch
- **Workflow**: `.github/workflows/deploy-uat.yml`
- **Environment**: UAT
- **URL**: `https://[username].github.io/[repository-name]/`

## 📋 Prerequisites

### 1. GitHub Pages Setup
1. Go to your repository settings
2. Navigate to "Pages" section
3. Set source to "Deploy from a branch"
4. Select `gh-pages` branch
5. Save the configuration

### 2. Repository Permissions
Ensure the following permissions are enabled:
- **Actions**: Read and write permissions
- **Contents**: Read and write permissions
- **Metadata**: Read-only access

### 3. Environment Setup (Optional)
For better deployment tracking, create environments in your repository:
1. Go to Settings → Environments
2. Create `uat` environment
3. Configure protection rules if needed

## 🔧 Workflow Features

### Testing & Quality Assurance
- **Linting**: Runs ESLint to check code quality
- **Testing**: Executes test suite (if configured)
- **Build**: Creates production build
- **Artifacts**: Stores build files for debugging

### Deployment Process
- **Automatic**: Triggers on branch push
- **Conditional**: Only deploys on direct pushes, not pull requests
- **Tagged**: Creates version tags for tracking
- **Status Tracking**: Updates deployment status in GitHub

### Notifications
- **Success**: Shows deployment URL and build info
- **Failure**: Provides error details and debugging info

## 📁 Workflow Structure

```
.github/workflows/
└── deploy-uat.yml          # UAT deployment workflow
```

## 🔄 Deployment Flow

### UAT Branch
1. Developer pushes to `uat` branch
2. GitHub Actions triggers workflow
3. Runs tests and linting
4. Builds the application
5. Deploys to GitHub Pages
6. Creates deployment status
7. Notifies success/failure

## 🛠️ Customization

### Environment Variables
You can customize the workflow by modifying:
- `NODE_VERSION`: Node.js version (default: '18')
- `publish_branch`: GitHub Pages branch (default: 'gh-pages')
- `tag_name`: Version tag format

### Build Configuration
The workflow uses the following npm scripts:
- `npm ci`: Install dependencies
- `npm run lint`: Run linting
- `npm run test`: Run tests
- `npm run build`: Build application

### Deployment Settings
- **Branch**: `gh-pages` (GitHub Pages source)
- **Directory**: `./dist` (Vite build output)
- **Force Orphan**: Creates clean deployment history
- **User**: GitHub Actions bot for commits

## 🔍 Troubleshooting

### Common Issues

#### Build Failures
- Check if all dependencies are installed
- Verify build script exists in package.json
- Review linting errors

#### Deployment Failures
- Ensure GitHub Pages is enabled
- Check repository permissions
- Verify `gh-pages` branch exists

#### Permission Issues
- Review repository settings
- Check workflow permissions
- Verify GitHub token access

### Debugging
1. Check workflow logs in Actions tab
2. Review build artifacts
3. Verify deployment status
4. Check GitHub Pages settings

## 📊 Monitoring

### Deployment Status
- View deployments in repository's "Deployments" tab
- Check environment status
- Monitor deployment history

### Build Artifacts
- UAT builds: Retained for 1 day
- Production builds: Retained for 7 days
- Access via Actions tab

### Release Tracking
- UAT deployments create tags
- Version tags: `uat-[run_number]`

## 🔐 Security

### Best Practices
- Use `GITHUB_TOKEN` for authentication
- Limit workflow permissions
- Review third-party actions
- Monitor deployment logs

### Token Permissions
The workflows use the default `GITHUB_TOKEN` with:
- Repository access
- Deployment creation
- Release management
- Pages deployment

## 📞 Support

For issues with deployment:
1. Check workflow logs
2. Review this documentation
3. Verify GitHub Pages setup
4. Contact repository maintainers 