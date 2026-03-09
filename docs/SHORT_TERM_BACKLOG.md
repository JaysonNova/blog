# Short-Term Backlog

This document captures the highest-priority short-term iterations for the blog project after the current admin MVP.

The current principle is simple:

- finish the content production loop first
- then improve admin usability
- then harden infrastructure
- finally expand content consumption features

## P0: Content Operations

### `PostEditor`

Add edit and update flow for existing posts so the admin can revise published or draft content instead of recreating it.

### `PostLifecycle`

Support draft, publish, unpublish, and delete operations with clear status transitions and admin feedback.

### `MediaManager`

Provide a media management view for uploaded images and videos, including preview, delete, and basic metadata editing.

### `AssetPicker`

Allow existing uploaded media to be selected as post cover assets instead of requiring repeated manual uploads.

## P0: Admin Usability

### `AdminFeedback`

Add clearer success, failure, and field-level validation messages for article creation, media upload, and login actions.

### `AccessControl`

Improve unauthorized and forbidden states so non-admin access is explicit and not handled only by silent redirects.

### `AccountSecurity`

Add password change and initial password replacement flow for the admin account.

### `AdminNavigation`

Improve backend navigation, current page state, and action discoverability to reduce friction in daily content work.

## P1: Upload Infrastructure

### `ObjectStorageMigration`

Replace local `public/uploads` storage with an object storage solution suitable for repository distribution and production deployment.

### `UploadValidation`

Add stricter validation for file type, size, upload failure handling, and clearer user-facing error messages.

### `ImageThumbnailing`

Generate thumbnails automatically for uploaded images to improve frontend loading and media reuse.

### `UploadNamingPolicy`

Standardize file naming, storage paths, and URL generation rules for uploaded assets.

## P1: Reading Experience

### `SiteSearch`

Add site-wide search for posts so readers can quickly locate content by keyword.

### `TagHub`

Add tag index and tag detail pages to improve topic-level browsing.

### `RelatedPosts`

Show related or adjacent posts on article pages to improve reading continuity.

### `ReadingProgress`

Improve article reading progress and table-of-contents active-state behavior.

## P2: Content Quality

### `SEOAssets`

Add richer social sharing images and better metadata generation for article and section pages.

### `EditorialChecklist`

Add pre-publish checks for title, excerpt, cover image, category, tags, and publish status completeness.

### `ContentDashboard`

Expand the admin dashboard with lightweight content statistics and publishing overview.

## Execution Note

Recommended implementation order:

1. `PostEditor`
2. `PostLifecycle`
3. `MediaManager`
4. `ObjectStorageMigration`
5. `SiteSearch`

If priorities change, update this file together with `docs/DEVELOPMENT_PLAN.md` when necessary.
